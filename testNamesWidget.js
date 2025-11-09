/**
 * Test Names Widget Module
 * Displays and manages the test names overlay widget
 */

define([
    'base/js/namespace'
], function(Jupyter) {
    'use strict';

    var Constants = null;
    // jQuery is available globally in Jupyter Notebook
    var $ = window.$ || window.jQuery;

    /**
     * Apply styles to a jQuery element
     * jQuery's css() method accepts camelCase property names
     */
    function applyStyles($element, styles) {
        $element.css(styles);
    }

    /**
     * Create the overlay widget container
     */
    function createOverlayWidget() {
        var widget = $('<div>')
            .attr('id', Constants.IDS.TEST_NAMES_OVERLAY);
        
        applyStyles(widget, Constants.STYLES.OVERLAY_WIDGET);
        widget.css('font-family', Constants.STYLES.FONT_FAMILY);
        
        return widget;
    }

    /**
     * Create the header with title and close button
     */
    function createHeader(closeCallback) {
        var header = $('<div>');
        applyStyles(header, Constants.STYLES.HEADER);
        
        // Create heading
        var heading = $('<h3>')
            .text(Constants.MESSAGES.OVERLAY_HEADING);
        applyStyles(heading, Constants.STYLES.HEADING);
        heading.css('font-family', Constants.STYLES.FONT_FAMILY);
        
        // Create close button
        var closeButton = $('<button>')
            .html('&times;');
        applyStyles(closeButton, Constants.STYLES.CLOSE_BUTTON);
        closeButton.css('font-family', Constants.STYLES.FONT_FAMILY);
        
        closeButton.hover(
            function() { $(this).css('color', '#333'); },
            function() { $(this).css('color', '#999'); }
        ).click(closeCallback);
        
        header.append(heading);
        header.append(closeButton);
        
        return header;
    }

    /**
     * Create list container
     */
    function createListContainer() {
        var listContainer = $('<div>')
            .attr('id', Constants.IDS.TEST_NAMES_LIST)
            .css('font-family', Constants.STYLES.FONT_FAMILY);
        
        return listContainer;
    }

    /**
     * Create empty state message
     */
    function createEmptyMessage() {
        var emptyMessage = $('<div>')
            .text(Constants.MESSAGES.NO_TEST_NAMES);
        
        applyStyles(emptyMessage, Constants.STYLES.EMPTY_MESSAGE);
        emptyMessage.css('font-family', Constants.STYLES.FONT_FAMILY);
        
        return emptyMessage;
    }

    /**
     * Create a list item for a test name
     */
    function createTestNameListItem(testName, deleteCallback) {
        var listItem = $('<div>');
        applyStyles(listItem, Constants.STYLES.LIST_ITEM);
        listItem.css('font-family', Constants.STYLES.FONT_FAMILY);
        
        // Create name span
        var nameSpan = $('<span>')
            .css({
                'flex': '1',
                'color': '#333',
                'font-family': Constants.STYLES.FONT_FAMILY
            })
            .text(testName);
        
        // Create delete button
        var deleteButton = $('<button>')
            .html('&times;');
        applyStyles(deleteButton, Constants.STYLES.DELETE_BUTTON);
        deleteButton.css('font-family', Constants.STYLES.FONT_FAMILY);
        
        deleteButton.hover(
            function() {
                $(this).css({
                    'color': '#dc3545',
                    'background-color': '#f8d7da'
                });
            },
            function() {
                $(this).css({
                    'color': '#999',
                    'background-color': 'transparent'
                });
            }
        ).click(function(e) {
            e.preventDefault();
            e.stopPropagation();
            console.log('Delete button clicked for:', testName);
            if (deleteCallback) {
                deleteCallback(testName);
            }
            return false;
        });
        
        listItem.append(nameSpan);
        listItem.append(deleteButton);
        
        return listItem;
    }

    /**
     * Display test names in the list container
     */
    function displayTestNamesList(testNames) {
        var listContainer = $('#' + Constants.IDS.TEST_NAMES_LIST);
        listContainer.empty();
        
        if (testNames.length === 0) {
            listContainer.append(createEmptyMessage());
            return;
        }
        
        testNames.forEach(function(testName) {
            var listItem = createTestNameListItem(testName, deleteTestName);
            listContainer.append(listItem);
        });
    }

    /**
     * Fetch test names from Python kernel
     */
    function fetchTestNames() {
        updateTestNamesFromPython();
    }

    /**
     * Delete a test name from Python test_names list
     */
    function deleteTestName(testName) {
        console.log('deleteTestName called with:', testName);
        
        // Check if kernel is available
        if (!Jupyter.notebook.kernel) {
            console.log('Kernel not available');
            displayTestNamesList([]);
            return;
        }
        
        // Update Python test_names list first
        var testNameJson = JSON.stringify(testName);
        var deleteCode = Constants.PYTHON_TEMPLATES.DELETE_TEST_NAME(testNameJson);
        
        console.log('Executing delete code for test name:', testName);
        console.log('Delete code:', deleteCode);
        
        // Track if we received output
        var deleteState = {
            outputReceived: false,
            timeoutId: null
        };
        
        // Set a timeout as fallback - if no response after 1 second, refresh
        deleteState.timeoutId = setTimeout(function() {
            if (!deleteState.outputReceived) {
                console.log('Delete timeout - refreshing from Python');
                updateTestNamesFromPython();
            }
        }, 1000);
        
        // Execute the delete code in Python
        Jupyter.notebook.kernel.execute(
            deleteCode,
            {
                iopub: {
                    output: function(msg) {
                        console.log('Delete output message:', msg);
                        var outputText = '';
                        
                        // Handle stdout stream
                        if (msg.content && msg.content.name === 'stdout') {
                            outputText = msg.content.text || '';
                        }
                        // Handle execute_result (sometimes output comes this way)
                        else if (msg.content && msg.content.data) {
                            if (msg.content.data['text/plain']) {
                                outputText = msg.content.data['text/plain'];
                            }
                        }
                        
                        if (outputText) {
                            deleteState.outputReceived = true;
                            if (deleteState.timeoutId) {
                                clearTimeout(deleteState.timeoutId);
                            }
                            try {
                                var trimmed = outputText.trim();
                                console.log('Delete output text:', trimmed);
                                if (trimmed) {
                                    var testNames = JSON.parse(trimmed);
                                    console.log('Parsed test names after delete:', testNames);
                                    // Update UI with the result
                                    displayTestNamesList(testNames);
                                } else {
                                    // Empty output, refresh to get current state
                                    updateTestNamesFromPython();
                                }
                            } catch(e) {
                                console.log('Error parsing test names after delete:', e, 'Output:', outputText);
                                // Refresh from Python if parsing fails
                                updateTestNamesFromPython();
                            }
                        }
                    },
                    error: function(msg) {
                        console.log('IOPub error during delete:', msg);
                        if (deleteState.timeoutId) {
                            clearTimeout(deleteState.timeoutId);
                        }
                        updateTestNamesFromPython();
                    }
                },
                shell: {
                    reply: function(msg) {
                        console.log('Shell reply during delete:', msg);
                        if (msg.content && msg.content.status === 'error') {
                            console.log('Shell error during delete:', msg);
                            if (deleteState.timeoutId) {
                                clearTimeout(deleteState.timeoutId);
                            }
                            updateTestNamesFromPython();
                        }
                    }
                }
            },
            {silent: false, store_history: false}
        );
    }

    /**
     * Update test names list from Python (refresh)
     */
    function updateTestNamesFromPython() {
        // Check if kernel is available
        if (!Jupyter.notebook.kernel) {
            console.log('Kernel not available for fetching test names');
            displayTestNamesList([]);
            return;
        }
        
        var callbacks = {
            iopub: {
                output: function(msg) {
                    if (msg.content.name === 'stdout') {
                        try {
                            var testNames = JSON.parse(msg.content.text.trim());
                            displayTestNamesList(testNames);
                        } catch(e) {
                            console.log('Error parsing test names:', e, 'Output:', msg.content.text);
                            displayTestNamesList([]);
                        }
                    }
                }
            }
        };
        
        Jupyter.notebook.kernel.execute(
            Constants.PYTHON_TEMPLATES.FETCH_TEST_NAMES,
            callbacks,
            {silent: false, store_history: false}
        );
    }

    /**
     * Show the test names overlay widget
     */
    function showTestNamesOverlay() {
        // Remove existing widget if it exists
        $('#' + Constants.IDS.TEST_NAMES_OVERLAY).remove();
        
        // Create widget
        var widget = createOverlayWidget();
        var header = createHeader(function() {
            widget.remove();
        });
        var listContainer = createListContainer();
        
        widget.append(header);
        widget.append(listContainer);
        
        // Append widget to body
        $('body').append(widget);
        
        // Fetch and display test names
        fetchTestNames();
    }

    return {
        init: function(constants) {
            Constants = constants;
            return {
                showTestNamesOverlay: showTestNamesOverlay
            };
        }
    };
});

