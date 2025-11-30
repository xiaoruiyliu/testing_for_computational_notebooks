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
    * Create a test result indicator element with close button
    * Styled to match Jupyter cell outputs exactly
    */
    function createTestIndicator(passed, testName, cellId, testCode, isDataframeOrSeries) {
        var styles = passed ? Constants.STYLES.TEST_PASSED : Constants.STYLES.TEST_FAILED;
        var className = passed ? Constants.CLASSES.TEST_PASSED_INDICATOR : Constants.CLASSES.TEST_FAILED_INDICATOR;
        
        // Build the text content with styled test name and optional test code
        var textContent;
        if (passed) {
            textContent = '✓ Test Passed: ';
        } else {
            textContent = '✗ Test Failed: ';
        }
    
        // Create structure matching Jupyter's output format:
        // .output_wrapper > .output > .output_subarea
        var outputWrapper = $('<div>')
            .addClass('output_wrapper')
            .css({
                'margin': '0px',
                'margin-top': '8px', // Add space between code cell and indicator
                'margin-left': '57px', // Extend to left edge for wider box
                'padding': '0px',
                'padding-left': '57px', // Match cell's left padding
                'width': '100%', // Span full width
                'box-sizing': 'border-box'
            });
        
        var output = $('<div>')
            .addClass('output')
            .css({
                'margin': '0px',
                'padding': '0px',
                'width': '100%', // Span full width
                'box-sizing': 'border-box'
            });
        
        // Create the actual indicator styled like output_subarea
        var indicator = $('<div>')
            .addClass('output_subarea')
            .css(styles)
            .css('font-family', Constants.STYLES.FONT_FAMILY)
            .css('display', 'flex')
            .css('justify-content', 'space-between')
            .css('align-items', 'flex-start') // Align items to top so X button stays at top right
            .css('width', '100%') // Ensure full width
            .css('box-sizing', 'border-box') // Include padding/border in width
            .attr('data-cell-id', cellId)
            .attr('data-test-name', testName)
            .addClass(className);
    
        // Create text content container
        var textContainer = $('<div>')
            .css('flex', '1')
            .css('display', 'flex')
            .css('flex-direction', 'column')
            .css('gap', '4px');
        
        // Create first line: status + test name (same line, different fonts)
        var firstLine = $('<div>')
            .css('display', 'flex')
            .css('align-items', 'center')
            .css('gap', '4px');
        
        var statusText = $('<span>').text(textContent);
        var testNameSpan = $('<span>')
            .text(testName)
            .css('font-family', 'Monaco, Menlo, "Courier New", monospace')
            .css('font-size', '13px')
            .css('font-weight', '500');
        
        firstLine.append(statusText);
        firstLine.append(testNameSpan);
        textContainer.append(firstLine);
        
        // Add test body for both passing and failing tests
        if (testCode) {
            var testBodyLabel = passed ? 'TestAssertionPassed: ' : 'TestAssertionFailed: ';
            var testBodyLabelSpan = $('<div>')
                .text(testBodyLabel)
                .css('font-family', 'Monaco, Menlo, "Courier New", monospace')
                .css('font-size', '12px')
                .css('margin-top', '4px');
            
            var testBodyCode = $('<pre>')
                .text(testCode)
                .css('font-family', 'Monaco, Menlo, "Courier New", monospace')
                .css('font-size', '12px')
                .css('margin', '0')
                .css('padding', '6px 8px')
                .css('white-space', 'pre-wrap')
                .css('word-wrap', 'break-word')
                .css('overflow-x', 'auto');
            
            textContainer.append(testBodyLabelSpan);
            textContainer.append(testBodyCode);
        }
        
        // Add DataFrame/Series detection message if applicable
        if (isDataframeOrSeries) {
            var dfSeriesLine = $('<div>')
                .text('This test tests a dataframe or series.')
                .css('font-size', '12px')
                .css('font-style', 'italic')
                .css('color', 'rgba(0,0,0,0.7)')
                .css('margin-top', '4px');
            textContainer.append(dfSeriesLine);
        }
    
        // Create close button (positioned at top right)
        var closeButton = $('<button>')
            .html('&times;')
            .css({
                'background': 'none',
                'border': 'none',
                'font-size': '18px',
                'cursor': 'pointer',
                'color': '#999',
                'padding': '0',
                'width': '24px',
                'height': '20px', // Standardized height
                'line-height': '20px',
                'border-radius': '0px', // Sharp edges to match
                'font-family': Constants.STYLES.FONT_FAMILY,
                'flex-shrink': '0',
                'align-self': 'flex-start', // Keep at top right
                'margin-left': '10px'
            })
            .hover(
                function() {
                    $(this).css({
                        'color': '#dc3545',
                        'background-color': passed ? '#c3e6cb' : '#f5c6cb'
                    });
                },
                function() {
                    $(this).css({
                        'color': '#999',
                        'background-color': 'transparent'
                    });
                }
            )
            .click(function(e) {
                e.preventDefault();
                e.stopPropagation();
                // Remove the entire output_wrapper
                outputWrapper.remove();
                return false;
            });
    
        indicator.append(textContainer);
        indicator.append(closeButton);
        
        // Assemble the structure
        output.append(indicator);
        outputWrapper.append(output);
        
        return outputWrapper;
    }



    /**
     * Get or create a unique cell identifier that persists
     */
    function getCellId(cell) {
        // Try to get existing persistent ID from element
        var existingId = cell.element.attr('data-test-cell-id');
        if (existingId) {
            return existingId;
        }
        
        // Try to get cell_id from cell object
        if (cell.cell_id) {
            cell.element.attr('data-test-cell-id', cell.cell_id);
            return cell.cell_id;
        }
        
        // Try to get ID from element
        var elementId = cell.element.attr('id');
        if (elementId) {
            cell.element.attr('data-test-cell-id', elementId);
            return elementId;
        }
        
        // Generate a unique ID based on cell index (persistent across executions)
        var cellIndex = Jupyter.notebook.get_cells().indexOf(cell);
        var uniqueId = 'test-cell-' + cellIndex;
        cell.element.attr('data-test-cell-id', uniqueId);
        return uniqueId;
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
                            var testResultsArray = JSON.parse(msg.content.text.trim());
                            
                            // Ensure testResultsArray is an array
                            if (!Array.isArray(testResultsArray)) {
                                testResultsArray = [testResultsArray];
                            }
                            
                            // Get cell ID for tracking
                            var cellId = getCellId(cell);
                            
                            // Get the cell's output area (where outputs are displayed)
                            var cellOutputArea = cell.element.find('.output_wrapper').first();
                            if (cellOutputArea.length === 0) {
                                // If no output_wrapper exists, create one
                                cellOutputArea = $('<div>').addClass('output_wrapper');
                                // Append to the cell's inner structure (after input area)
                                cell.element.append(cellOutputArea);
                            }
                            
                            // Process all test results
                            for (var i = 0; i < testResultsArray.length; i++) {
                                var testResults = testResultsArray[i];
                                
                                // Remove existing test indicators for this specific test and cell
                                // Only remove if it's the same test name (allow multiple different tests)
                                var existingIndicator = cellOutputArea.find('.output_subarea[data-cell-id="' + cellId + '"][data-test-name="' + testResults.test_name + '"]').first();
                                if (existingIndicator.length > 0) {
                                    // Remove the entire output_wrapper containing this indicator
                                    existingIndicator.closest('.output_wrapper').remove();
                                }
                                
                                // Re-get the output area after potential removal
                                cellOutputArea = cell.element.find('.output_wrapper').first();
                                if (cellOutputArea.length === 0) {
                                    cellOutputArea = $('<div>').addClass('output_wrapper');
                                    cell.element.append(cellOutputArea);
                                }
                                
                                // Display appropriate indicator for each test
                                if (testResults.passed) {
                                    var passedIndicator = createTestIndicator(true, testResults.test_name, cellId, testResults.test_code || null, testResults.is_dataframe_or_series || false);
                                    cellOutputArea.append(passedIndicator);
                                } else if (testResults.failed) {
                                    var failedIndicator = createTestIndicator(false, testResults.test_name, cellId, testResults.test_code || null, testResults.is_dataframe_or_series || false);
                                    cellOutputArea.append(failedIndicator);
                                }
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

