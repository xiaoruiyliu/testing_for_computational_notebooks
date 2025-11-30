/**
 * Test Completion Checker Module
 * Monitors cell execution and displays test pass/fail indicators
 */

define([
    'base/js/namespace'
], function(Jupyter) {
    'use strict';

    var Constants = null;
    // jQuery is available globally in Jupyter Notebook
    var $ = window.$ || window.jQuery;

    /**
    * Create a test result indicator element
    */
    function createTestIndicator(passed, testName) {
        var styles = passed ? Constants.STYLES.TEST_PASSED : Constants.STYLES.TEST_FAILED;
        var text = passed ? '✓ Passed: ' + testName : '✗ Failed: ' + testName;
        var className = passed ? Constants.CLASSES.TEST_PASSED_INDICATOR : Constants.CLASSES.TEST_FAILED_INDICATOR;
    
        var indicator = $('<div>')
            .css(styles)
            .css('font-family', Constants.STYLES.FONT_FAMILY)
            .html(text);
    
        indicator.addClass(className);
        return indicator;
    }



    /**
     * Remove existing test indicators for a cell
     */
    function removeExistingIndicators(cell) {
        cell.element.nextAll('.' + Constants.CLASSES.TEST_PASSED_INDICATOR).first().remove();
        cell.element.nextAll('.' + Constants.CLASSES.TEST_FAILED_INDICATOR).first().remove();
    }

    /**
     * Handle test completion check callback
     */
    function handleTestCheckCallback(cell) {
        return {
            iopub: {
                output: function(msg) {
                    if (msg.content.name === 'stdout') {
                        try {
                            var testResults = JSON.parse(msg.content.text.trim());
                            
                            // Remove existing test indicators
                            removeExistingIndicators(cell);
                            
                            // Display appropriate indicator (passed takes precedence)
                            if (testResults.passed) {
                                var passedIndicator = createTestIndicator(true, testResults.test_name);
                                cell.element.after(passedIndicator);
                            } else if (testResults.failed) {
                                var failedIndicator = createTestIndicator(false, testResults.test_name);
                                cell.element.after(failedIndicator);
                            }
                        } catch(e) {
                            console.log('Error parsing test results:', e);
                        }
                    }
                }
            }
        };
    }

    /**
     * Check for test completion in an executed cell
     */
    function checkForTestCompletion(evt, data) {
        var cell = data.cell;
        var cellCode = cell.get_text();
        
        // Generate Python code to check test results
        var checkCode = Constants.PYTHON_TEMPLATES.CHECK_TEST_COMPLETION(cellCode);
        
        // Create callbacks
        var callbacks = handleTestCheckCallback(cell);
        
        // Execute the check code
        Jupyter.notebook.kernel.execute(
            checkCode, 
            callbacks, 
            {silent: false, store_history: false}
        );
    }

    return {
        init: function(constants) {
            Constants = constants;
            return {
                checkForTestCompletion: checkForTestCompletion
            };
        }
    };
});

