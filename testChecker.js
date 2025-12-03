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
    * Trigger dataflow analysis for a failing test
    */
    function triggerDataflowAnalysis(cell, testName, testCode, cellCode, testBaseVars, testSpecificPaths, dataflowContainer) {
        if (!Jupyter.notebook.kernel) {
            console.log('Kernel not available for dataflow analysis');
            return;
        }
        
        try {
            // Generate Python code to analyze dataflow
            var analysisCode = Constants.PYTHON_TEMPLATES.ANALYZE_DATAFLOW(
                JSON.stringify(testName),
                JSON.stringify(testCode),
                JSON.stringify(cellCode),
                JSON.stringify(testBaseVars),
                JSON.stringify(testSpecificPaths)
            );
            
            console.log('Triggering dataflow analysis for test:', testName);
            
            // Create callback to handle analysis results
            var analysisCallbacks = {
                iopub: {
                    output: function(msg) {
                        if (msg.content.name === 'stdout') {
                            try {
                                var outputText = msg.content.text.trim();
                                if (!outputText) {
                                    return;
                                }
                                
                                var analysisResult = JSON.parse(outputText);
                                console.log('Dataflow analysis result:', analysisResult);
                                
                                if (analysisResult.success && analysisResult.dataflow) {
                                    displayDataflowAnalysis(dataflowContainer, analysisResult.dataflow);
                                } else {
                                    console.log('Dataflow analysis failed:', analysisResult.error);
                                    // Don't show error to user - just silently fail
                                }
                            } catch(e) {
                                console.log('Error parsing dataflow analysis result:', e);
                                // Don't show error to user - just silently fail
                            }
                        }
                    }
                }
            };
            
            // Execute the analysis code
            Jupyter.notebook.kernel.execute(
                analysisCode,
                analysisCallbacks,
                {silent: false, store_history: false}
            );
        } catch(e) {
            console.log('Error triggering dataflow analysis:', e);
            // Don't show error to user - test indicator already displayed
        }
    }

    /**
    * Display dataflow analysis results in the test indicator
    */
    function displayDataflowAnalysis(dataflowContainer, dataflowData) {
        try {
            if (!dataflowData || !dataflowData.analysis) {
                return;
            }
            
            var separator = $('<div>')
                .text('-------------------------')
                .css('font-family', 'Monaco, Menlo, "Courier New", monospace')
                .css('font-size', '12px')
                .css('margin-top', '8px')
                .css('color', 'rgba(0,0,0,0.7)');
            
            var exampleHeader = $('<div>')
                .text('Dataflow analysis:')
                .css('font-family', 'Monaco, Menlo, "Courier New", monospace')
                .css('font-size', '12px')
                .css('margin-top', '4px')
                .css('font-weight', '500');
            
            dataflowContainer.append(separator);
            dataflowContainer.append(exampleHeader);
            
            // Parse and display the analysis
            var analysisText = dataflowData.analysis;
            
            // Split by lines if it's multi-line
            var lines = analysisText.split('\n').filter(function(line) {
                return line.trim().length > 0;
            });
            
            // Display each line
            for (var i = 0; i < Math.min(lines.length, 10); i++) {
                var line = lines[i].trim();
                if (line.length > 0) {
                    var exampleLine = $('<div>')
                        .text(line)
                        .css('font-family', 'Monaco, Menlo, "Courier New", monospace')
                        .css('font-size', '12px')
                        .css('margin-top', '4px')
                        .css('color', 'rgba(0,0,0,0.7)')
                        .css('white-space', 'pre-wrap')
                        .css('word-wrap', 'break-word');
                    dataflowContainer.append(exampleLine);
                }
            }
            
            dataflowContainer.css('display', 'block');
        } catch (e) {
            console.log('Error displaying dataflow analysis:', e);
        }
    }

    /**
    * Create a test result indicator element with close button
    * Styled to match Jupyter cell outputs exactly
    */
    function createTestIndicator(passed, testName, cellId, testCode, isDataframeOrSeries, dataflowAnalysis) {
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
                'margin-top': '8px', // Add space between code cell and indicator
                'margin-left': '57px', // Extend to left edge for wider box
                'padding': '0px',
                'padding-left': '57px', // Match cell's left padding
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
        
        // Note: isDataframeOrSeries is still tracked internally but not displayed to users
        
        // Add dataflow analysis display for failing DataFrame/Series tests
        // This will be populated asynchronously if dataflow analysis is available
        var dataflowContainer = $('<div>')
            .css('margin-top', '8px')
            .css('display', 'none'); // Hidden by default, shown when dataflow is available
        textContainer.append(dataflowContainer);
    
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
                // Remove the entire output element (which contains this indicator)
                output.remove();
                return false;
            });
    
        indicator.append(textContainer);
        indicator.append(closeButton);
        
        // Assemble the structure
        output.append(indicator);
        outputWrapper.append(output);
        
        // Display dataflow analysis if available
        if (dataflowAnalysis && dataflowAnalysis.success && dataflowAnalysis.dataflow) {
            try {
                displayDataflowAnalysis(dataflowContainer, dataflowAnalysis.dataflow);
            } catch(e) {
                console.log('Error displaying initial dataflow analysis:', e);
                // Continue - test indicator still shows
            }
        }
        
        // Store dataflow container reference on the output element for later updates
        output.data('dataflow-container', dataflowContainer);
        
        // Return the output element (backward compatible)
        // This matches Jupyter's structure: .output_wrapper > .output > .output_subarea
        return output;
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
                            var outputText = msg.content.text.trim();
                            if (!outputText) {
                                console.log('Empty stdout output');
                                return;
                            }
                            
                            console.log('Received test results:', outputText);
                            var testResultsArray = JSON.parse(outputText);
                            
                            // Ensure testResultsArray is an array
                            if (!Array.isArray(testResultsArray)) {
                                testResultsArray = [testResultsArray];
                            }
                            
                            console.log('Parsed test results array:', testResultsArray);
                            
                            // Skip if no results
                            if (testResultsArray.length === 0) {
                                console.log('No test results to display');
                                return;
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
                            
                            // First, remove all existing test indicators for this cell to avoid duplicates
                            // Find all .output elements that contain test indicators for this cell
                            cellOutputArea.find('.output_subarea[data-cell-id="' + cellId + '"]').each(function() {
                                // Find the parent .output element that contains this indicator
                                var outputElement = $(this).closest('.output');
                                if (outputElement.length > 0) {
                                    outputElement.remove();
                                }
                            });
                            
                            // Re-get the output area after removal
                            cellOutputArea = cell.element.find('.output_wrapper').first();
                            if (cellOutputArea.length === 0) {
                                cellOutputArea = $('<div>').addClass('output_wrapper');
                                cell.element.append(cellOutputArea);
                            }
                            
                            // Process all test results and display each one
                            for (var i = 0; i < testResultsArray.length; i++) {
                                var testResults = testResultsArray[i];
                                
                                // Skip if testResults is invalid
                                if (!testResults || (!testResults.passed && !testResults.failed)) {
                                    console.log('Skipping invalid test result:', testResults);
                                    continue;
                                }
                                
                                // Display appropriate indicator for each test
                                if (testResults.passed) {
                                    try {
                                        var indicatorOutput = createTestIndicator(
                                            true, 
                                            testResults.test_name || 'Unknown', 
                                            cellId, 
                                            testResults.test_code || null, 
                                            testResults.is_dataframe_or_series || false,
                                            null // No dataflow analysis for passed tests
                                        );
                                        cellOutputArea.append(indicatorOutput);
                                        console.log('Displayed passed indicator for:', testResults.test_name);
                                    } catch(e) {
                                        console.log('Error creating passed indicator:', e);
                                        // Continue processing other tests
                                    }
                                } else if (testResults.failed) {
                                    try {
                                        // Create indicator first (will show even if analysis fails)
                                        var indicatorOutput = createTestIndicator(
                                            false, 
                                            testResults.test_name || 'Unknown', 
                                            cellId, 
                                            testResults.test_code || null, 
                                            testResults.is_dataframe_or_series || false,
                                            testResults.dataflow_analysis || null
                                        );
                                        
                                        cellOutputArea.append(indicatorOutput);
                                        console.log('Displayed failed indicator for:', testResults.test_name);
                                        
                                        // If this test needs dataflow analysis and we haven't done it yet, trigger it
                                        if (testResults.needs_dataflow_analysis && !testResults.dataflow_analysis) {
                                            // Get dataflow container from the output element
                                            var dataflowContainer = indicatorOutput.data('dataflow-container');
                                            if (dataflowContainer && dataflowContainer.length > 0) {
                                                triggerDataflowAnalysis(
                                                    cell,
                                                    testResults.test_name,
                                                    testResults.test_code,
                                                    cell.get_text(),
                                                    testResults.test_base_vars || [],
                                                    testResults.test_specific_paths || [],
                                                    dataflowContainer
                                                );
                                            }
                                        }
                                    } catch(e) {
                                        console.log('Error creating failed indicator:', e);
                                        // Continue processing other tests - at least show basic failure
                                    }
                                }
                            }
                        } catch(e) {
                            console.log('Error parsing test results:', e);
                            console.log('Raw output:', msg.content.text);
                        }
                    } else if (msg.content.name === 'stderr') {
                        console.log('Stderr output:', msg.content.text);
                    }
                }
            }
        };
    }

    /**
     * Check for test completion in an executed cell
     */
    function checkForTestCompletion(evt, data) {
        console.log('checkForTestCompletion called');
        var cell = data.cell;
        if (!cell) {
            console.log('No cell in data');
            return;
        }
        var cellCode = cell.get_text();
        if (!cellCode) {
            console.log('No cell code');
            return;
        }
        
        console.log('Checking test completion for cell with code:', cellCode.substring(0, 100));
        
        // Check if kernel is available
        if (!Jupyter.notebook.kernel) {
            console.log('Kernel not available');
            return;
        }
        
        // Generate Python code to check test results
        var checkCode = Constants.PYTHON_TEMPLATES.CHECK_TEST_COMPLETION(cellCode);
        
        console.log('Executing check code (first 200 chars):', checkCode.substring(0, 200));
        
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

