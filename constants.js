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
    style={
        'description_width': '0px',
        'font_family': 'Monaco, Menlo, "Courier New", monospace',
        'font_size': '13px'
    }
)

# Test logic input (large, code editor style)
test_logic_input = widgets.Textarea(
    placeholder='Test logic (Python code)...',
    description='',
    layout=widgets.Layout(
        width='100%',
        height='120px'
    ),
    style={
        'description_width': '0px',
        'font_family': 'Monaco, Menlo, "Courier New", monospace',
        'font_size': '13px'
    }
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

# Inject custom CSS to style the text inputs with monospace font
from IPython.display import HTML, display as ipython_display
css_style = """
<style>
.jupyter-widgets.widget-text input[type="text"],
.jupyter-widgets input[type="text"].widget-text-input {
    font-family: Monaco, Menlo, "Courier New", monospace !important;
    font-size: 13px !important;
}
.jupyter-widgets.widget-textarea textarea,
.jupyter-widgets textarea.widget-textarea-text {
    font-family: Monaco, Menlo, "Courier New", monospace !important;
    font-size: 13px !important;
}
</style>
"""
ipython_display(HTML(css_style))

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
                    'is_dataframe_or_series': is_dataframe_or_series,
                    'dataflow_analysis': None
                }
                
                # If this is a DataFrame/Series test, try to analyze dataflow
                if is_dataframe_or_series:
                    try:
                        # Import the analysis function (it's in a separate template)
                        # We'll call it via kernel execution from JavaScript side
                        # For now, just mark that analysis should be done
                        test_result['needs_dataflow_analysis'] = True
                        test_result['test_base_vars'] = list(test_base_vars)
                        test_result['test_specific_paths'] = list(test_specific_paths)
                    except Exception as analysis_error:
                        debug_log("Error preparing dataflow analysis: " + str(analysis_error))
                        test_result['needs_dataflow_analysis'] = False
                
                results.append(test_result)
            except Exception as e:
                # Other errors also count as failure
                test_result = {
                    'passed': False,
                    'failed': True,
                    'test_name': test_name,
                    'test_code': test_logic,
                    'is_dataframe_or_series': is_dataframe_or_series,
                    'dataflow_analysis': None
                }
                
                # If this is a DataFrame/Series test, try to analyze dataflow
                if is_dataframe_or_series:
                    try:
                        test_result['needs_dataflow_analysis'] = True
                        test_result['test_base_vars'] = list(test_base_vars)
                        test_result['test_specific_paths'] = list(test_specific_paths)
                    except Exception as analysis_error:
                        debug_log("Error preparing dataflow analysis: " + str(analysis_error))
                        test_result['needs_dataflow_analysis'] = False
                
                results.append(test_result)
else:
    debug_log("No 'tests' dictionary found in globals")

print(json.dumps(results))
sys.stdout.flush()
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

            UPDATE_TEST_CODE: (oldTestNameJson, newTestNameJson, testCodeJson) => {
                // Escape for embedding in Python string
                var escapedOldName = oldTestNameJson.replace(/\\/g, '\\\\').replace(/'/g, "\\'");
                var escapedNewName = newTestNameJson.replace(/\\/g, '\\\\').replace(/'/g, "\\'");
                var escapedCode = testCodeJson.replace(/\\/g, '\\\\').replace(/'/g, "\\'").replace(/\n/g, '\\n').replace(/\r/g, '\\r');
                return `
import json
import sys
from IPython import get_ipython

ns = get_ipython().user_ns

try:
    old_test_name = json.loads('${escapedOldName}')
    new_test_name = json.loads('${escapedNewName}')
    test_code = json.loads('${escapedCode}')
    
    if 'tests' not in ns:
        print(json.dumps({'error': 'tests dictionary not found'}))
        sys.stdout.flush()
    else:
        # Initialize test_enabled if it doesn't exist
        if 'test_enabled' not in ns:
            ns['test_enabled'] = {}
        
        # Get the enabled status of the old test (default to True if not set)
        enabled_status = ns['test_enabled'].get(old_test_name, True)
        
        # If renaming (old name != new name)
        if old_test_name != new_test_name:
            # Delete the old test if it exists
            if old_test_name in ns['tests']:
                del ns['tests'][old_test_name]
            if old_test_name in ns['test_enabled']:
                del ns['test_enabled'][old_test_name]
        
        # Create/update the test with new name and code
        ns['tests'][new_test_name] = test_code
        ns['test_enabled'][new_test_name] = enabled_status
        
        print(json.dumps({'success': True, 'renamed': old_test_name != new_test_name}))
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
            },

            ANALYZE_DATAFLOW: (testNameJson, testCodeJson, cellCodeJson, testBaseVarsJson, testSpecificPathsJson) => {
                var escapedTestName = testNameJson.replace(/\\/g, '\\\\').replace(/'/g, "\\'");
                var escapedTestCode = testCodeJson.replace(/\\/g, '\\\\').replace(/'/g, "\\'").replace(/\n/g, '\\n').replace(/\r/g, '\\r');
                var escapedCellCode = cellCodeJson.replace(/\\/g, '\\\\').replace(/'/g, "\\'").replace(/\n/g, '\\n').replace(/\r/g, '\\r');
                var escapedTestBaseVars = testBaseVarsJson.replace(/\\/g, '\\\\').replace(/'/g, "\\'");
                var escapedTestSpecificPaths = testSpecificPathsJson.replace(/\\/g, '\\\\').replace(/'/g, "\\'");
                
                return `
import json
import sys
import ast
import re
import traceback
from IPython import get_ipython

def debug_log(msg):
    print("DEBUG: " + str(msg), file=sys.stderr)

try:
    test_name = json.loads('${escapedTestName}')
    test_code = json.loads('${escapedTestCode}')
    cell_code = json.loads('${escapedCellCode}')
    test_base_vars = json.loads('${escapedTestBaseVars}')
    test_specific_paths = json.loads('${escapedTestSpecificPaths}')
    
    ns = get_ipython().user_ns
    globals_dict = globals()
    
    # Merge namespace into globals for analysis
    for key, value in ns.items():
        if key not in globals_dict or globals_dict[key] is not value:
            globals_dict[key] = value
    
    result = {
        'success': False,
        'dataflow': None,
        'error': None
    }
    
    try:
        import pandas as pd
        
        # Find the dataframe/series variable from test
        df_var = None
        df_value = None
        test_column = None
        
        # Extract column name from test if it's a specific path like df["column"]
        for path in test_specific_paths:
            if '["' in path and '"]' in path:
                parts = path.split('["')
                if len(parts) == 2:
                    var_name = parts[0]
                    col_name = parts[1].rstrip('"]')
                    if var_name in globals_dict:
                        var_val = globals_dict[var_name]
                        if isinstance(var_val, pd.DataFrame) or isinstance(var_val, pd.Series):
                            df_var = var_name
                            df_value = var_val
                            test_column = col_name
                            break
        
        # If no specific path, check base variables
        if df_var is None:
            for var_name in test_base_vars:
                if var_name in globals_dict:
                    var_val = globals_dict[var_name]
                    if isinstance(var_val, pd.DataFrame) or isinstance(var_val, pd.Series):
                        df_var = var_name
                        df_value = var_val
                        break
        
        if df_var is None or df_value is None:
            result['error'] = 'No DataFrame/Series variable found in test'
            print(json.dumps(result))
            sys.stdout.flush()
            sys.exit(0)
        
        debug_log("Found DataFrame/Series: " + str(df_var) + ", column: " + str(test_column))
        
        # Try to identify failing rows by re-executing test logic partially
        failing_indices = []
        failing_values = []
        
        try:
            # For DataFrame column tests, check which rows fail
            if isinstance(df_value, pd.DataFrame) and test_column:
                if test_column in df_value.columns:
                    # Try to understand what the test is checking
                    # Common patterns: .notna(), .all(), comparisons, etc.
                    test_series = df_value[test_column]
                    
                    # Try to evaluate the test condition on the series
                    # This is a simplified check - we'll use LLM for more complex analysis
                    try:
                        # Check for common patterns in test code
                        if '.notna()' in test_code or '.isna()' in test_code:
                            if '.notna()' in test_code:
                                failing_mask = test_series.isna()
                            else:
                                failing_mask = test_series.notna()
                            failing_indices = test_series[failing_mask].index.tolist()[:10]  # Limit to 10
                            failing_values = test_series[failing_mask].tolist()[:10]
                        elif '>' in test_code or '<' in test_code or '>=' in test_code or '<=' in test_code:
                            # Try to extract comparison value
                            # This is simplified - LLM will do better
                            failing_indices = test_series.index.tolist()[:5]
                            failing_values = test_series.tolist()[:5]
                        else:
                            # Generic: get some sample values
                            failing_indices = test_series.index.tolist()[:5]
                            failing_values = test_series.tolist()[:5]
                    except Exception as e:
                        debug_log("Error identifying failing rows: " + str(e))
                        failing_indices = test_series.index.tolist()[:5]
                        failing_values = test_series.tolist()[:5]
        except Exception as e:
            debug_log("Error processing DataFrame: " + str(e))
        
        # Now trace dependencies using AST analysis of cell_code
        dependencies = []
        dataflow_chain = []
        
        try:
            # Parse cell code to find assignments
            cell_tree = ast.parse(cell_code)
            
            # Find all assignments in the cell
            assignments = {}
            for node in ast.walk(cell_tree):
                if isinstance(node, ast.Assign):
                    for target in node.targets:
                        if isinstance(target, ast.Subscript):
                            # df["column"] = ...
                            if isinstance(target.value, ast.Name):
                                base_var = target.value.id
                                if hasattr(ast, 'Constant') and isinstance(target.slice, ast.Constant):
                                    col = target.slice.value
                                elif hasattr(ast, 'Index') and isinstance(target.slice, ast.Index):
                                    if isinstance(target.slice.value, ast.Str):
                                        col = target.slice.value.s
                                    elif isinstance(target.slice.value, ast.Constant):
                                        col = target.slice.value.value
                                    else:
                                        col = None
                                elif isinstance(target.slice, ast.Str):
                                    col = target.slice.s
                                else:
                                    col = None
                                
                                if col and isinstance(col, str):
                                    key = base_var + '["' + col + '"]'
                                    # Get the right-hand side expression as string
                                    try:
                                        # Try ast.unparse (Python 3.9+)
                                        if hasattr(ast, 'unparse'):
                                            try:
                                                rhs_code = ast.unparse(node.value)
                                            except:
                                                rhs_code = None
                                        else:
                                            rhs_code = None
                                        
                                        # Fallback: extract from source code if available
                                        if rhs_code is None:
                                            # Try to get source code directly
                                            try:
                                                import inspect
                                                # This won't work for exec'd code, so use a simple representation
                                                rhs_code = "expression"
                                            except:
                                                rhs_code = "expression"
                                        
                                        assignments[key] = {
                                            'rhs': rhs_code,
                                            'node': node
                                        }
                                    except Exception as assign_error:
                                        debug_log("Error processing assignment: " + str(assign_error))
                                        assignments[key] = {'rhs': 'expression', 'node': node}
            
            # Build dependency chain for test_column
            if test_column and df_var:
                current_path = df_var + '["' + test_column + '"]'
                visited = set()
                
                def trace_dependency(path, depth=0):
                    if depth > 10 or path in visited:  # Prevent infinite loops
                        return []
                    visited.add(path)
                    
                    if path in assignments:
                        rhs = assignments[path]['rhs']
                        # Extract variable references from RHS
                        rhs_tree = ast.parse(rhs) if rhs != 'expression' else None
                        deps = []
                        if rhs_tree:
                            for node in ast.walk(rhs_tree):
                                if isinstance(node, ast.Subscript):
                                    if isinstance(node.value, ast.Name):
                                        base = node.value.id
                                        if hasattr(ast, 'Constant') and isinstance(node.slice, ast.Constant):
                                            col = node.slice.value
                                        elif hasattr(ast, 'Index') and isinstance(node.slice, ast.Index):
                                            if isinstance(node.slice.value, ast.Str):
                                                col = node.slice.value.s
                                            elif isinstance(node.slice.value, ast.Constant):
                                                col = node.slice.value.value
                                            else:
                                                col = None
                                        elif isinstance(node.slice, ast.Str):
                                            col = node.slice.s
                                        else:
                                            col = None
                                        
                                        if col and isinstance(col, str):
                                            dep_path = base + '["' + col + '"]'
                                            deps.append(dep_path)
                                            # Recursively trace
                                            sub_deps = trace_dependency(dep_path, depth + 1)
                                            deps.extend(sub_deps)
                        
                        return deps
                    return []
                
                dependencies = trace_dependency(current_path)
                # Reverse to get forward flow: source -> ... -> target
                dependencies.reverse()
                dependencies.append(current_path)
                
                # Get sample values for each step in the chain
                for i, dep_path in enumerate(dependencies):
                    parts = dep_path.split('["')
                    if len(parts) == 2:
                        var_name = parts[0]
                        col_name = parts[1].rstrip('"]')
                        if var_name in globals_dict:
                            var_val = globals_dict[var_name]
                            if isinstance(var_val, pd.DataFrame) and col_name in var_val.columns:
                                # Get values at failing indices if available
                                if failing_indices:
                                    sample_values = var_val.loc[failing_indices[:3], col_name].tolist()
                                else:
                                    sample_values = var_val[col_name].head(3).tolist()
                                
                                dataflow_chain.append({
                                    'path': dep_path,
                                    'values': [str(v) for v in sample_values]
                                })
        except Exception as e:
            debug_log("Error tracing dependencies: " + str(e))
            debug_log(traceback.format_exc())
        
        # Prepare data for LLM analysis
        llm_prompt_data = {
            'test_code': test_code,
            'cell_code': cell_code,
            'dataflow_chain': dataflow_chain,
            'failing_values': [str(v) for v in failing_values[:5]],
            'test_column': test_column,
            'df_var': df_var
        }
        
        # Call LLM API (with fallback if API fails)
        llm_result = None
        try:
            import urllib.request
            import urllib.parse
            
            # Use OpenAI-compatible API (configurable)
            # Default to a local endpoint or OpenAI
            api_url = ns.get('TEST_LLM_API_URL', 'https://api.openai.com/v1/chat/completions')
            api_key = ns.get('TEST_LLM_API_KEY', '')
            
            # Only try LLM if API key is provided or it's a local endpoint
            # Otherwise, skip directly to fallback
            if api_key or 'localhost' in api_url or '127.0.0.1' in api_url:
                prompt = f"""Analyze this failing test and dataflow:

Test code: {test_code}
Cell code: {cell_code}
Dataflow chain: {json.dumps(dataflow_chain)}
Failing values: {failing_values[:5]}
Test column: {test_column}

Provide a concise analysis showing the data transformation chain that leads to the failure.
Format as: source_value --> intermediate_value --> ... --> final_value --> False
Show 3-5 example failing cases in this format."""

                data = {
                    'model': ns.get('TEST_LLM_MODEL', 'gpt-3.5-turbo'),
                    'messages': [
                        {'role': 'system', 'content': 'You are a data analysis assistant. Analyze dataflow and show failing cases concisely.'},
                        {'role': 'user', 'content': prompt}
                    ],
                    'max_tokens': 500,
                    'temperature': 0.3
                }
                
                try:
                    req = urllib.request.Request(
                        api_url,
                        data=json.dumps(data).encode('utf-8'),
                        headers={
                            'Content-Type': 'application/json',
                            'Authorization': f'Bearer {api_key}' if api_key else ''
                        }
                    )
                    
                    with urllib.request.urlopen(req, timeout=10) as response:
                        response_data = json.loads(response.read().decode('utf-8'))
                        if 'choices' in response_data and len(response_data['choices']) > 0:
                            llm_result = response_data['choices'][0]['message']['content']
                            debug_log("LLM analysis successful")
                except urllib.error.URLError as url_error:
                    debug_log("LLM API URL error: " + str(url_error))
                    llm_result = None
                except urllib.error.HTTPError as http_error:
                    debug_log("LLM API HTTP error: " + str(http_error))
                    llm_result = None
                except Exception as api_error:
                    debug_log("LLM API call failed: " + str(api_error))
                    llm_result = None
            else:
                debug_log("No LLM API key configured, skipping LLM analysis")
        except ImportError:
            debug_log("urllib not available for LLM calls")
            llm_result = None
        except Exception as e:
            debug_log("Error calling LLM: " + str(e))
            llm_result = None
        
        # Fallback: Generate dataflow display programmatically
        if llm_result is None:
            # Build dataflow string from chain in format: path1 --> path2 --> ... --> False
            if dataflow_chain and len(dataflow_chain) > 0:
                # Extract just the column names for cleaner display
                path_names = []
                for step in dataflow_chain:
                    path = step.get('path', '')
                    # Extract column name from path like df["column"]
                    if '["' in path and '"]' in path:
                        col_name = path.split('["')[1].rstrip('"]')
                        path_names.append(col_name)
                    else:
                        path_names.append(path)
                
                if path_names:
                    # Show example values for each step
                    example_lines = []
                    num_examples = min(3, len(failing_values) if failing_values else 1)
                    
                    for i in range(num_examples):
                        example_parts = []
                        for j, step in enumerate(dataflow_chain):
                            if step.get('values') and len(step['values']) > i:
                                val = step['values'][i]
                                # Extract column name for display
                                path = step.get('path', '')
                                if '["' in path and '"]' in path:
                                    col_name = path.split('["')[1].rstrip('"]')
                                    example_parts.append(f"{col_name}: {val}")
                                else:
                                    example_parts.append(f"{path}: {val}")
                        
                        if example_parts:
                            example_line = ' --> '.join(example_parts)
                            if failing_values and i < len(failing_values):
                                example_line += f' --> False (value: {failing_values[i]})'
                            else:
                                example_line += ' --> False'
                            example_lines.append(example_line)
                    
                    if example_lines:
                        llm_result = '\\n'.join(example_lines)
                    else:
                        # Fallback: just show the path chain
                        llm_result = ' --> '.join(path_names) + ' --> False'
                else:
                    llm_result = 'Dataflow analysis unavailable'
            else:
                # If no chain but we have failing values, show them
                if failing_values:
                    llm_result = f'Failing values: {", ".join([str(v) for v in failing_values[:5]])}'
                else:
                    llm_result = 'Dataflow analysis unavailable'
        
        result['success'] = True
        result['dataflow'] = {
            'chain': dataflow_chain,
            'failing_values': [str(v) for v in failing_values[:5]],
            'analysis': llm_result,
            'test_column': test_column,
            'df_var': df_var
        }
        
    except ImportError:
        result['error'] = 'pandas not available'
    except Exception as e:
        result['error'] = str(e)
        debug_log("Dataflow analysis error: " + str(e))
        debug_log(traceback.format_exc())
    
    print(json.dumps(result))
    sys.stdout.flush()
    
except Exception as e:
    result = {
        'success': False,
        'dataflow': None,
        'error': str(e)
    }
    print(json.dumps(result))
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

