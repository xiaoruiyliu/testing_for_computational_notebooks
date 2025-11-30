/**
 * Constants and configuration for the Testing extension
 */

define(function() {
    'use strict';

    return {
        // Toolbar button configurations
        TOOLBAR_BUTTONS: {
            ADD_INTERACTIVE_INPUT: {
                help: 'Insert interactive test name input widget',
                icon: 'fa-pencil-square-o',
                actionName: 'add-interactive-input-cell',
                label: 'Add Test Input'
            },
            VIEW_TEST_NAMES: {
                help: 'View all instantiated test names',
                icon: 'fa-book',
                actionName: 'view-test-names',
                label: 'View Tests'
            },
            RERUN_TESTS: {
                help: 'Rerun all test cells',
                icon: 'fa-refresh',
                actionName: 'rerun-tests',
                label: 'Rerun Tests'
            }
        },

        // Widget styles
        STYLES: {
            FONT_FAMILY: 'Helvetica Neue, Helvetica, Arial, sans-serif',
            
            // Test names overlay widget
            OVERLAY_WIDGET: {
                position: 'fixed',
                top: '20px',
                right: '20px',
                backgroundColor: 'white',
                borderRadius: '2px',
                padding: '15px',
                width: '300px',
                maxHeight: '60vh',
                overflowY: 'auto',
                boxShadow: '0 2px 8px rgba(0, 0, 0, 0.15)',
                zIndex: '1000',
                border: '1px solid #ddd'
            },
            
            // Header
            HEADER: {
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: '12px',
                borderBottom: '1px solid #eee',
                paddingBottom: '8px'
            },
            
            // Heading
            HEADING: {
                margin: '0',
                fontSize: '16px',
                fontWeight: '500',
                color: '#333'
            },
            
            // Close button
            CLOSE_BUTTON: {
                background: 'none',
                border: 'none',
                fontSize: '20px',
                cursor: 'pointer',
                color: '#999',
                padding: '0',
                width: '24px',
                height: '24px',
                lineHeight: '24px'
            },
            
            // List item
            LIST_ITEM: {
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                padding: '8px 0',
                borderBottom: '1px solid #eee',
                fontSize: '13px'
            },
            
            // Delete button
            DELETE_BUTTON: {
                background: 'none',
                border: 'none',
                fontSize: '18px',
                cursor: 'pointer',
                color: '#999',
                padding: '0 5px',
                width: '24px',
                height: '24px',
                lineHeight: '24px',
                borderRadius: '2px'
            },
            
            // Empty message
            EMPTY_MESSAGE: {
                color: '#999',
                fontStyle: 'italic',
                padding: '8px',
                textAlign: 'center',
                fontSize: '13px'
            },
            
            // Test indicator boxes - styled like cell outputs
            TEST_PASSED: {
                backgroundColor: '#d4edda',
                border: '1px solid #28a745',
                borderLeft: '4px solid #28a745', // Accent border
                borderRadius: '0px', // Sharp edges
                padding: '8px 12px', // Match cell output padding
                margin: '0px', // No margin, align with cells
                color: '#155724',
                fontSize: '13px',
                width: '100%', // Match cell output width
                boxSizing: 'border-box' // Include padding/border in width
            },
            
            TEST_FAILED: {
                backgroundColor: '#f8d7da',
                border: '1px solid #dc3545',
                borderLeft: '4px solid #dc3545', // Accent border
                borderRadius: '0px', // Sharp edges
                padding: '8px 12px', // Match cell output padding
                margin: '0px', // No margin, align with cells
                color: '#721c24',
                fontSize: '13px',
                width: '100%', // Match cell output width
                boxSizing: 'border-box' // Include padding/border in width
            }
        },

        // Python code templates
        PYTHON_TEMPLATES: {
            TEST_WIDGET: `from ipywidgets import widgets
from IPython.display import display, HTML

# Initialize storage dictionary if it doesn't exist
if 'tests' not in globals():
    tests = {}

# Test name input (short, single line)
test_name_input = widgets.Text(
    placeholder='Test name (e.g., test_addition)',
    description='',
    layout=widgets.Layout(
        width='100%',
        height='32px'
    ),
    style={'description_width': '0px'}
)

# Test logic input (large, code editor style)
test_logic_input = widgets.Textarea(
    placeholder='Test logic (Python code)...',
    description='',
    layout=widgets.Layout(
        width='100%',
        height='120px',
        font_family='Monaco, Menlo, "Courier New", monospace',
        font_size='13px'
    ),
    style={'description_width': '0px'}
)

instantiate_button = widgets.Button(
    description='Instantiate',
    button_style='success',
    tooltip='Store this test',
    icon='check',
    layout=widgets.Layout(width='120px', height='32px')
)

output_area = widgets.Output()

def on_instantiate_click(b):
    with output_area:
        output_area.clear_output()
        test_name = test_name_input.value.strip()
        test_logic = test_logic_input.value.strip()
        
        if test_name and test_logic:
            tests[test_name] = test_logic
            feedback_html = f"""
<div style="font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif !important; font-size: 11px !important; color: #555; margin-top: 8px; line-height: 1.6;">
    <div style="margin-bottom: 3px; font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif !important;">
        <span style="font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif !important;">✓ Stored test: </span>
        <span style="color: #2e7d32; font-weight: 500; font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif !important;">'{test_name}'</span>
    </div>
</div>
"""
            display(HTML(feedback_html))
            test_name_input.value = ''
            test_logic_input.value = ''
        elif not test_name:
            warning_html = """
<div style="font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif !important; font-size: 11px !important; color: #d32f2f; margin-top: 8px;">
    <span style="font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif !important;">⚠ Please enter a test name</span>
</div>
"""
            display(HTML(warning_html))
        else:
            warning_html = """
<div style="font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif !important; font-size: 11px !important; color: #d32f2f; margin-top: 8px;">
    <span style="font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif !important;">⚠ Please enter test logic</span>
</div>
"""
            display(HTML(warning_html))

instantiate_button.on_click(on_instantiate_click)

bottom_row = widgets.HBox(
    [test_name_input, instantiate_button],
    layout=widgets.Layout(
        justify_content='space-between',
        align_items='center',
        margin='8px 0 0 0'
    )
)

accordion = widgets.Accordion(children=[
    widgets.VBox([
        test_logic_input,
        bottom_row,
        output_area
    ], layout=widgets.Layout(padding='5px'))
])
accordion.set_title(0, 'Test Instantiation Widget')
accordion.selected_index = 0

display(accordion)`,

            CHECK_TEST_COMPLETION: (cellCode) => `
import json
import re
import ast
import sys

results = []  # List to store all test results
cell_code = """${cellCode.replace(/"/g, '\\"').replace(/\n/g, '\\n')}"""

# Debug output helper
def debug_log(msg):
    result['debug'].append(str(msg))
    import sys
    print("DEBUG: " + str(msg), file=sys.stderr)

# Check if tests dictionary exists
if 'tests' in globals():
    tests_dict = globals()['tests']
    debug_log("Found " + str(len(tests_dict)) + " test(s) in tests dictionary")
    
    # Extract specific paths assigned or modified in the cell code
    # We track both base variables and specific paths (like data["email"])
    try:
        tree = ast.parse(cell_code)
        assigned_base_vars = set()  # Just variable names: {'data', 'x'}
        assigned_paths = set()      # Specific paths: {'data', 'data["email"]', 'x'}
        
        def get_subscript_path(node):
            """Convert a Subscript node to a string path like 'data["email"]'"""
            if isinstance(node.value, ast.Name):
                base = node.value.id
                # Handle different AST node types for slice
                if hasattr(ast, 'Constant') and isinstance(node.slice, ast.Constant):
                    key = node.slice.value
                elif hasattr(ast, 'Index') and isinstance(node.slice, ast.Index):
                    if isinstance(node.slice.value, ast.Str):
                        key = node.slice.value.s
                    elif isinstance(node.slice.value, ast.Constant):
                        key = node.slice.value.value
                    else:
                        key = None
                elif isinstance(node.slice, ast.Str):
                    key = node.slice.s
                else:
                    key = None
                
                if isinstance(key, str):
                    return base + '["' + key + '"]'
            return None
        
        def get_attribute_path(node):
            """Convert an Attribute node to a string path like 'data.email'"""
            if isinstance(node.value, ast.Name):
                return node.value.id + '.' + node.attr
            return None
        
        for node in ast.walk(tree):
            # Simple assignment: x = 5
            if isinstance(node, ast.Assign):
                for target in node.targets:
                    if isinstance(target, ast.Name):
                        assigned_base_vars.add(target.id)
                        assigned_paths.add(target.id)
                    # Subscript assignment: data["email"] = ...
                    elif isinstance(target, ast.Subscript):
                        path = get_subscript_path(target)
                        if path:
                            assigned_paths.add(path)
                        if isinstance(target.value, ast.Name):
                            assigned_base_vars.add(target.value.id)
                    # Attribute assignment: obj.attr = ...
                    elif isinstance(target, ast.Attribute):
                        path = get_attribute_path(target)
                        if path:
                            assigned_paths.add(path)
                        if isinstance(target.value, ast.Name):
                            assigned_base_vars.add(target.value.id)
            
            # Function calls that might modify: data.dropna(), data.fillna(), etc.
            elif isinstance(node, ast.Call):
                if isinstance(node.func, ast.Attribute):
                    if isinstance(node.func.value, ast.Name):
                        assigned_base_vars.add(node.func.value.id)
                        assigned_paths.add(node.func.value.id)
    except Exception as e:
        # If AST parsing fails, fall back to regex
        debug_log("AST parsing failed for cell code: " + str(e))
        assigned_base_vars = set(re.findall(r'\\b([a-zA-Z_][a-zA-Z0-9_]*)\\s*(?:=|\\[)', cell_code))
        assigned_paths = assigned_base_vars.copy()
    
    debug_log("Cell assigned_base_vars: " + str(list(assigned_base_vars)))
    debug_log("Cell assigned_paths: " + str(list(assigned_paths)))
    
    # Initialize test_enabled dictionary if it doesn't exist
    test_enabled_dict = globals().get('test_enabled', {})
    
    # Run tests only if their specific paths were assigned in this cell
    for test_name, test_logic in tests_dict.items():
        debug_log("\\nChecking test: " + str(test_name))
        debug_log("Test logic: " + str(test_logic[:100]) + "...")  # First 100 chars
        
        # Skip disabled tests
        if not test_enabled_dict.get(test_name, True):  # Default to enabled if not set
            debug_log("Test " + str(test_name) + " is disabled, skipping")
            continue
        
        # Extract specific paths referenced in test logic
        try:
            test_tree = ast.parse(test_logic)
            test_specific_paths = set()  # Only specific paths with subscripts/attributes: {'data["email"]', 'obj.attr'}
            test_base_vars = set()  # Base variables only: {'data', 'x'}
            
            def get_test_subscript_path(node):
                """Convert a Subscript node to a string path like 'data["email"]'"""
                # Handle different AST node types for slice
                def extract_key(slice_node):
                    if hasattr(ast, 'Constant') and isinstance(slice_node, ast.Constant):
                        return slice_node.value
                    elif hasattr(ast, 'Index') and isinstance(slice_node, ast.Index):
                        if isinstance(slice_node.value, ast.Str):
                            return slice_node.value.s
                        elif isinstance(slice_node.value, ast.Constant):
                            return slice_node.value.value
                    elif isinstance(slice_node, ast.Str):
                        return slice_node.s
                    return None
                
                if isinstance(node.value, ast.Name):
                    base = node.value.id
                    key = extract_key(node.slice)
                    if isinstance(key, str):
                        return base + '["' + key + '"]'
                elif isinstance(node.value, ast.Subscript):
                    # Nested: data["email"]["domain"]
                    parent_path = get_test_subscript_path(node.value)
                    if parent_path:
                        key = extract_key(node.slice)
                        if isinstance(key, str):
                            return parent_path + '["' + key + '"]'
                return None
            
            def get_test_attribute_path(node):
                """Convert an Attribute node to a string path like 'data.email'"""
                if isinstance(node.value, ast.Name):
                    return node.value.id + '.' + node.attr
                elif isinstance(node.value, ast.Attribute):
                    parent_path = get_test_attribute_path(node.value)
                    if parent_path:
                        return parent_path + '.' + node.attr
                elif isinstance(node.value, ast.Subscript):
                    parent_path = get_test_subscript_path(node.value)
                    if parent_path:
                        return parent_path + '.' + node.attr
                return None
            
            keywords = {'assert', 'True', 'False', 'None', 'and', 'or', 'not', 'in', 'is', 'all', 'any', 'len', 'print', 'range', 'str', 'int', 'float', 'list', 'dict', 'set', 'tuple', 'bool'}
            
            # First, collect all specific paths (subscripts and attributes)
            for node in ast.walk(test_tree):
                # Subscripts: data["email"] - these are specific paths
                if isinstance(node, ast.Subscript):
                    path = get_test_subscript_path(node)
                    if path:
                        test_specific_paths.add(path)
                # Attributes: data.email - these are specific paths
                elif isinstance(node, ast.Attribute):
                    path = get_test_attribute_path(node)
                    if path:
                        test_specific_paths.add(path)
            
            # Then collect all base variables - all Name nodes that aren't keywords
            for node in ast.walk(test_tree):
                if isinstance(node, ast.Name):
                    if node.id not in keywords:
                        test_base_vars.add(node.id)
        except Exception as parse_error:
            # If AST parsing fails, fall back to regex for variable names
            all_vars = set(re.findall(r'\\b([a-zA-Z_][a-zA-Z0-9_]*)\\b', test_logic))
            fallback_keywords = {'assert', 'True', 'False', 'None', 'and', 'or', 'not', 'in', 'is', 'all', 'any', 'len', 'print', 'range', 'str', 'int', 'float', 'list', 'dict', 'set', 'tuple', 'bool', 'if', 'else', 'elif', 'for', 'while', 'def', 'class', 'import', 'from', 'return', 'try', 'except', 'finally', 'with', 'as', 'pass', 'break', 'continue', 'yield', 'lambda'}
            test_base_vars = all_vars - fallback_keywords
            test_specific_paths = set()
        
        debug_log("Test " + str(test_name) + " - test_base_vars: " + str(list(test_base_vars)))
        debug_log("Test " + str(test_name) + " - test_specific_paths: " + str(list(test_specific_paths)))
        
        # Check if any specific path from the test was assigned in this cell
        # Strategy:
        # 1. If test uses specific paths (like data["email"]), only run if cell assigns those exact paths
        # 2. If test only uses base variables (like x), run if cell assigns those base variables
        test_has_specific_paths = len(test_specific_paths) > 0
        
        should_run = False
        if test_has_specific_paths:
            # Test uses specific paths - only run if those specific paths are assigned
            should_run = bool(test_specific_paths & assigned_paths)
            debug_log("Test " + str(test_name) + " - specific path match: " + str(list(test_specific_paths & assigned_paths)))
        else:
            # Test only uses base variables - run if base variables are assigned
            should_run = bool(test_base_vars & assigned_base_vars)
            debug_log("Test " + str(test_name) + " - base var match: " + str(list(test_base_vars & assigned_base_vars)))
        
        debug_log("Test " + str(test_name) + " - should_run: " + str(should_run))
        
        if should_run:
            debug_log("Test " + str(test_name) + " - EXECUTING TEST")
            
            # Check if test involves DataFrame or Series
            is_dataframe_or_series = False
            try:
                # Try to import pandas
                import pandas as pd
                
                # Get base variables from test logic
                test_vars_to_check = list(test_base_vars)
                
                # Check each variable to see if it's a DataFrame or Series
                for var_name in test_vars_to_check:
                    if var_name in globals():
                        var_value = globals()[var_name]
                        if isinstance(var_value, pd.DataFrame) or isinstance(var_value, pd.Series):
                            is_dataframe_or_series = True
                            debug_log("Test " + str(test_name) + " - Found DataFrame/Series variable: " + str(var_name))
                            break
            except ImportError:
                # pandas not available, skip check
                debug_log("pandas not available, skipping DataFrame/Series check")
            except Exception as e:
                debug_log("Error checking for DataFrame/Series: " + str(e))
            
            try:
                # Execute the test logic in the current global namespace
                exec(test_logic, globals())
                # If no exception was raised, test passed
                test_result = {
                    'passed': True,
                    'failed': False,
                    'test_name': test_name,
                    'test_code': test_logic,
                    'is_dataframe_or_series': is_dataframe_or_series
                }
                results.append(test_result)
            except AssertionError as e:
                # Assertion failed - test failed
                test_result = {
                    'passed': False,
                    'failed': True,
                    'test_name': test_name,
                    'test_code': test_logic,
                    'is_dataframe_or_series': is_dataframe_or_series
                }
                results.append(test_result)
            except Exception as e:
                # Other errors also count as failure
                test_result = {
                    'passed': False,
                    'failed': True,
                    'test_name': test_name,
                    'test_code': test_logic,
                    'is_dataframe_or_series': is_dataframe_or_series
                }
                results.append(test_result)
else:
    debug_log("No 'tests' dictionary found in globals")

print(json.dumps(results))
`,

            FETCH_TEST_NAMES: `
import json
import sys
from IPython import get_ipython

ns = get_ipython().user_ns

# Initialize test_enabled dictionary if it doesn't exist
if 'test_enabled' not in ns:
    ns['test_enabled'] = {}

try:
    if 'tests' in ns:
        # Return list of test data with names, code, and enabled status
        test_data = []
        for test_name in ns['tests'].keys():
            test_code = ns['tests'][test_name]
            enabled = ns['test_enabled'].get(test_name, True)  # Default to enabled
            test_data.append({
                'name': test_name,
                'code': test_code,
                'enabled': enabled
            })
        print(json.dumps(test_data))
    else:
        print(json.dumps([]))
    sys.stdout.flush()
except Exception as e:
    print(json.dumps([]))
    sys.stdout.flush()
`,

            FETCH_TEST_DATA: (testNameJson) => {
                var escapedName = testNameJson.replace(/\\/g, '\\\\').replace(/'/g, "\\'");
                return `
import json
import sys
from IPython import get_ipython

ns = get_ipython().user_ns

try:
    test_name = json.loads('${escapedName}')
    
    # Initialize test_enabled if it doesn't exist
    if 'test_enabled' not in ns:
        ns['test_enabled'] = {}
    
    if 'tests' in ns and test_name in ns['tests']:
        test_code = ns['tests'][test_name]
        enabled = ns['test_enabled'].get(test_name, True)
        result = {
            'name': test_name,
            'code': test_code,
            'enabled': enabled
        }
        print(json.dumps(result))
    else:
        print(json.dumps({'error': 'Test not found'}))
    sys.stdout.flush()
except Exception as e:
    print(json.dumps({'error': str(e)}))
    sys.stdout.flush()
`;
            },

            UPDATE_TEST_CODE: (testNameJson, testCodeJson) => {
                // Escape for embedding in Python string
                var escapedName = testNameJson.replace(/\\/g, '\\\\').replace(/'/g, "\\'");
                var escapedCode = testCodeJson.replace(/\\/g, '\\\\').replace(/'/g, "\\'").replace(/\n/g, '\\n').replace(/\r/g, '\\r');
                return `
import json
import sys
from IPython import get_ipython

ns = get_ipython().user_ns

try:
    test_name = json.loads('${escapedName}')
    test_code = json.loads('${escapedCode}')
    
    if 'tests' in ns:
        ns['tests'][test_name] = test_code
        print(json.dumps({'success': True}))
    else:
        print(json.dumps({'error': 'tests dictionary not found'}))
    sys.stdout.flush()
except Exception as e:
    print(json.dumps({'error': str(e)}))
    sys.stdout.flush()
`;
            },

            TOGGLE_TEST: (testNameJson, enabledJson) => {
                var escapedName = testNameJson.replace(/\\/g, '\\\\').replace(/'/g, "\\'");
                return `
import json
import sys
from IPython import get_ipython

ns = get_ipython().user_ns

try:
    test_name = json.loads('${escapedName}')
    enabled = json.loads('${enabledJson}')
    
    # Initialize test_enabled if it doesn't exist
    if 'test_enabled' not in ns:
        ns['test_enabled'] = {}
    
    ns['test_enabled'][test_name] = enabled
    print(json.dumps({'success': True, 'enabled': enabled}))
    sys.stdout.flush()
except Exception as e:
    print(json.dumps({'error': str(e)}))
    sys.stdout.flush()
`;
            },

            DELETE_TEST_NAME: (testNameJson) => {
                var escapedName = testNameJson.replace(/\\/g, '\\\\').replace(/'/g, "\\'");
                return `
import json
import sys
from IPython import get_ipython

ns = get_ipython().user_ns

try:
    test_name_to_delete = json.loads('${escapedName}')
    
    # Delete from tests dictionary
    if 'tests' in ns:
        if test_name_to_delete in ns['tests']:
            del ns['tests'][test_name_to_delete]
    
    # Delete from test_enabled dictionary
    if 'test_enabled' in ns:
        if test_name_to_delete in ns['test_enabled']:
            del ns['test_enabled'][test_name_to_delete]

    # Return updated test data
    test_data = []
    if 'tests' in ns:
        for test_name in ns['tests'].keys():
            test_code = ns['tests'][test_name]
            enabled = ns['test_enabled'].get(test_name, True) if 'test_enabled' in ns else True
            test_data.append({
                'name': test_name,
                'code': test_code,
                'enabled': enabled
            })
    
    print(json.dumps(test_data))
    sys.stdout.flush()

except Exception as e:
    # Return current test data even on error
    test_data = []
    if 'tests' in ns:
        for test_name in ns['tests'].keys():
            test_code = ns['tests'][test_name]
            enabled = ns['test_enabled'].get(test_name, True) if 'test_enabled' in ns else True
            test_data.append({
                'name': test_name,
                'code': test_code,
                'enabled': enabled
            })
    print(json.dumps(test_data))
    sys.stdout.flush()
`;
            }

        },

        // IDs and class names
        IDS: {
            TEST_NAMES_OVERLAY: 'test-names-overlay',
            TEST_NAMES_LIST: 'test-names-list'
        },

        CLASSES: {
            TEST_PASSED_INDICATOR: 'test-passed-indicator',
            TEST_FAILED_INDICATOR: 'test-failed-indicator'
        },

        // Timing
        TIMING: {
            CELL_HIDE_DELAY: 300
        },

        // Messages
        MESSAGES: {
            NO_TEST_NAMES: 'No test names instantiated yet',
            OVERLAY_HEADING: 'Instantiated Tests'
        }
    };
});

