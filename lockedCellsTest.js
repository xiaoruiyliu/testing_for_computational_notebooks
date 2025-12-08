/**
 * Locked Cells Test Module
 * Creates and maintains a "locked_cells" test based on committed locked cells
 */

define([
    'base/js/namespace',
    'base/js/events'
], function(Jupyter, events) {
    'use strict';

    var $ = window.$ || window.jQuery;

    /**
     * Update the locked_cells test based on current locked_cells_data
     */
    function updateLockedCellsTest() {
        if (!Jupyter.notebook || !Jupyter.notebook.kernel) {
            console.log('Kernel not available for updating locked_cells test');
            return;
        }

        var pythonCode = `
import json
import sys
from IPython import get_ipython

ns = get_ipython().user_ns

try:
    # Build test assertions from all locked cells across all DataFrames
    test_assertions = []
    
    if "locked_cells_data" in ns:
        for df_name_key, locked_cells_list in ns["locked_cells_data"].items():
            # Verify the DataFrame exists in namespace
            if df_name_key in ns:
                df = ns[df_name_key]
                # Check if it's a DataFrame-like object (has .loc attribute)
                if hasattr(df, 'loc'):
                    for locked in locked_cells_list:
                        row_idx = locked.get("row_index")
                        col_name = str(locked.get("column_name", ""))
                        value_str = str(locked.get("value", ""))
                        
                        # Try to convert row_index to appropriate type
                        try:
                            if isinstance(row_idx, str):
                                try:
                                    row_idx = int(row_idx)
                                except ValueError:
                                    try:
                                        row_idx = float(row_idx)
                                    except ValueError:
                                        pass  # Keep as string
                        except (ValueError, TypeError):
                            pass  # Keep original type
                        
                        # Try to convert value to appropriate type for assertion
                        try:
                            # Try numeric (int or float)
                            if "." in value_str:
                                expected_value = float(value_str)
                            else:
                                expected_value = int(value_str)
                            # Format as number (no quotes)
                            value_repr = str(expected_value)
                        except (ValueError, TypeError):
                            # Keep as string, escape quotes
                            value_repr = repr(value_str)
                        
                        # Format row_index for assertion
                        if isinstance(row_idx, str):
                            row_idx_repr = repr(row_idx)
                        else:
                            row_idx_repr = str(row_idx)
                        
                        # Create assertion: assert dataframe_name.loc[row_index, col_name] == value
                        assertion = f"assert {df_name_key}.loc[{row_idx_repr}, {repr(col_name)}] == {value_repr}"
                        test_assertions.append(assertion)
    
    # Store test in tests dictionary
    if "tests" not in ns:
        ns["tests"] = {}
    
    if test_assertions:
        # Combine all assertions with newlines (separate assert statements)
        test_code = "\\n".join(test_assertions)
        ns["tests"]["locked_cells"] = test_code
        print(json.dumps({"success": True, "test_name": "locked_cells", "assertion_count": len(test_assertions)}))
    else:
        # No locked cells, remove test if it exists
        if "locked_cells" in ns.get("tests", {}):
            del ns["tests"]["locked_cells"]
        print(json.dumps({"success": True, "test_name": "locked_cells", "assertion_count": 0, "removed": True}))
    
    sys.stdout.flush()

except Exception as e:
    print(json.dumps({"success": False, "error": str(e)}))
    sys.stdout.flush()
`;

        // Execute the Python code to update the test
        Jupyter.notebook.kernel.execute(pythonCode, {
            iopub: {
                output: function(msg) {
                    if (msg.content && msg.content.name === 'stdout') {
                        try {
                            var outputText = msg.content.text.trim();
                            if (outputText) {
                                var result = JSON.parse(outputText);
                                if (result.success) {
                                    if (result.removed) {
                                        console.log('Locked cells test removed (no locked cells)');
                                    } else {
                                        console.log('Locked cells test updated with', result.assertion_count, 'assertions');
                                    }
                                } else {
                                    console.error('Error updating locked cells test:', result.error);
                                }
                            }
                        } catch (e) {
                            // Ignore parse errors for non-JSON output
                        }
                    }
                }
            },
            silent: false
        });
    }

    /**
     * Initialize the locked cells test manager
     */
    function init(Constants) {
        // Make updateLockedCellsTest available globally so it can be called from other modules
        window.lockedCellsTestManager = {
            updateLockedCellsTest: updateLockedCellsTest
        };

        // Update the test whenever a cell finishes executing
        // This allows the test to be updated after cells are committed
        if (events) {
            events.on('finished_execute.CodeCell', function(evt, data) {
                // Add a small delay to ensure any commit operations have completed
                setTimeout(function() {
                    updateLockedCellsTest();
                }, 200);
            });
        }

        // Also update immediately on initialization
        setTimeout(function() {
            updateLockedCellsTest();
        }, 1000);

        return {
            updateLockedCellsTest: updateLockedCellsTest
        };
    }

    return {
        init: init
    };
});

