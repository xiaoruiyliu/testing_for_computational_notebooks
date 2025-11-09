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
            },
            HELLO_WORLD: {
                help: 'Hello World',
                icon: 'fa-smile-o',
                actionName: 'hello-world',
                label: 'Hello World'
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
            
            // Test indicator boxes
            TEST_PASSED: {
                backgroundColor: '#d4edda',
                border: '1px solid #28a745',
                borderRadius: '4px',
                padding: '10px',
                margin: '10px 0',
                color: '#155724',
                fontSize: '13px'
            },
            
            TEST_FAILED: {
                backgroundColor: '#f8d7da',
                border: '1px solid #dc3545',
                borderRadius: '4px',
                padding: '10px',
                margin: '10px 0',
                color: '#721c24',
                fontSize: '13px'
            }
        },

        // Python code templates
        PYTHON_TEMPLATES: {
            TEST_WIDGET: `from ipywidgets import widgets
from IPython.display import display, HTML

# Initialize storage list if it doesn't exist
if 'test_names' not in globals():
    test_names = []

text_input = widgets.Text(
    placeholder='Enter text here...',
    description='Input:',
    style={'description_width': 'initial'}
)

instantiate_button = widgets.Button(
    description='Instantiate',
    button_style='success',
    tooltip='Store this input',
    icon='check'
)

output_area = widgets.Output()

def on_instantiate_click(b):
    with output_area:
        output_area.clear_output()
        if text_input.value:
            test_names.append(text_input.value)
            feedback_html = f"""
            <div style="font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif !important; font-size: 11px !important; color: #555; margin-top: 8px; line-height: 1.6;">
                <div style="margin-bottom: 3px; font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif !important;">
                    <span style="font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif !important;">✓ Stored: </span>
                    <span style="color: #2e7d32; font-weight: 500; font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif !important;">'{text_input.value}'</span>
                </div>
            </div>
            """
            display(HTML(feedback_html))
            text_input.value = ''  # Clear the input
        else:
            warning_html = """
            <div style="font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif !important; font-size: 11px !important; color: #d32f2f; margin-top: 8px;">
                <span style="font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif !important;">⚠ Please enter some text first</span>
            </div>
            """
            display(HTML(warning_html))

instantiate_button.on_click(on_instantiate_click)

accordion = widgets.Accordion(children=[
    widgets.VBox([
        widgets.HBox([text_input, instantiate_button]),
        output_area
    ])
])
accordion.set_title(0, 'Test Instantiation Widget')
accordion.selected_index = 0  # Start expanded

display(accordion)`,

            CHECK_TEST_COMPLETION: (cellCode) => `
import json
import re
result = {'passed': False, 'failed': False}
cell_code = """${cellCode.replace(/"/g, '\\"').replace(/\n/g, '\\n')}"""

if 'test_names' in globals():
    for name in test_names:
        # Check if this test name is assigned in the cell code
        pattern = r'\\b' + re.escape(name) + r'\\s*='
        if re.search(pattern, cell_code):
            # Check the current value
            if name in globals():
                if globals()[name] == True:
                    result['passed'] = True
                    break  # Only need one pass to show passed box
                elif globals()[name] == False:
                    result['failed'] = True
                    # Don't break - keep checking in case another test passed

print(json.dumps(result))
`,

            FETCH_TEST_NAMES: `
import json
if 'test_names' in globals():
    print(json.dumps(test_names))
else:
    print(json.dumps([]))
`,

        DELETE_TEST_NAME: (testNameJson) => `
import json
import sys
from IPython import get_ipython

ns = get_ipython().user_ns

try:
    test_name_to_delete = json.loads('${testNameJson}')
    if 'test_names' in ns:
        if test_name_to_delete in ns['test_names']:
            ns['test_names'].remove(test_name_to_delete)

    print(json.dumps(ns.get('test_names', [])))
    sys.stdout.flush()

except Exception as e:
    print(json.dumps(ns.get('test_names', [])))
    sys.stdout.flush()
`

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
            OVERLAY_HEADING: 'Instantiated Test Names'
        }
    };
});

