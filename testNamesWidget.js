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
    function createTestNameListItem(test, deleteCallback, toggleCallback, editCallback) {
        var testName = test.name || test;
        var testEnabled = test.enabled !== undefined ? test.enabled : true;
        
        var listItem = $('<div>');
        applyStyles(listItem, Constants.STYLES.LIST_ITEM);
        listItem.css('font-family', Constants.STYLES.FONT_FAMILY);
        
        // Style locked_cells test in orange
        if (testName === 'locked_cells') {
            listItem.css('color', '#ff8800'); // Orange color
        }
        
        // Create name span with code font
        var nameSpan = $('<span>')
            .css({
                'flex': '1',
                'color': testEnabled ? '#333' : '#999',
                'font-family': 'Monaco, Menlo, "Courier New", monospace',
                'text-decoration': testEnabled ? 'none' : 'line-through'
            })
            .text(testName);
        
        // Create controls container
        var controlsContainer = $('<div>')
            .css({
                'display': 'flex',
                'align-items': 'center',
                'gap': '6px',
                'height': '20px'
            });
        
        // Create toggle switch (smaller to match button sizes)
        var toggleContainer = $('<label>')
            .css({
                'position': 'relative',
                'display': 'inline-block',
                'width': '36px',
                'height': '18px',
                'vertical-align': 'middle',
                'margin': '0'
            });
        
        var toggleInput = $('<input>')
            .attr('type', 'checkbox')
            .prop('checked', testEnabled)
            .css({
                'opacity': '0',
                'width': '0',
                'height': '0'
            });
        
        var toggleSlider = $('<span>')
            .css({
                'position': 'absolute',
                'cursor': 'pointer',
                'top': '0',
                'left': '0',
                'right': '0',
                'bottom': '0',
                'background-color': testEnabled ? '#28a745' : '#ccc',
                'transition': '.4s',
                'border-radius': '18px'
            })
            .html('&nbsp;');
        
        var toggleSliderBefore = $('<span>')
            .css({
                'position': 'absolute',
                'content': '""',
                'height': '14px',
                'width': '14px',
                'left': '2px',
                'bottom': '2px',
                'background-color': 'white',
                'transition': '.4s',
                'border-radius': '50%',
                'transform': testEnabled ? 'translateX(18px)' : 'translateX(0)'
            });
        
        toggleSlider.append(toggleSliderBefore);
        toggleContainer.append(toggleInput);
        toggleContainer.append(toggleSlider);
        
        toggleInput.change(function() {
            var newEnabled = $(this).is(':checked');
            var $toggle = $(this);
            var $slider = $toggle.siblings('span');
            var $sliderBefore = $slider.find('span');
            var $nameSpan = listItem.find('span').first();
            
            // Update visual state immediately for better UX
            if (newEnabled) {
                $slider.css('background-color', '#28a745');
                $sliderBefore.css('transform', 'translateX(18px)');
                $nameSpan.css({
                    'color': '#333',
                    'text-decoration': 'none'
                });
            } else {
                $slider.css('background-color', '#ccc');
                $sliderBefore.css('transform', 'translateX(0)');
                $nameSpan.css({
                    'color': '#999',
                    'text-decoration': 'line-through'
                });
            }
            
            // Update in Python
            if (toggleCallback) {
                toggleCallback(testName, newEnabled);
            }
        });
        
        // Create edit button
        var editButton = $('<button>')
            .html('✎')
            .attr('title', 'Edit test')
            .css({
                'background': 'none',
                'border': 'none',
                'font-size': '14px',
                'cursor': 'pointer',
                'color': '#007bff',
                'padding': '0',
                'width': '24px',
                'height': '20px',
                'line-height': '20px',
                'border-radius': '2px',
                'font-family': Constants.STYLES.FONT_FAMILY,
                'display': 'flex',
                'align-items': 'center',
                'justify-content': 'center'
            })
            .hover(
                function() {
                    $(this).css({
                        'color': '#0056b3',
                        'background-color': '#e7f3ff'
                    });
                },
                function() {
                    $(this).css({
                        'color': '#007bff',
                        'background-color': 'transparent'
                    });
                }
            )
            .click(function(e) {
                e.preventDefault();
                e.stopPropagation();
                if (editCallback) {
                    editCallback(testName, test.code || '');
                }
                return false;
            });
        
        // Create delete button
        var deleteButton = $('<button>')
            .html('&times;')
            .css({
                'background': 'none',
                'border': 'none',
                'font-size': '16px',
                'cursor': 'pointer',
                'color': '#999',
                'padding': '0',
                'width': '24px',
                'height': '20px',
                'line-height': '20px',
                'border-radius': '2px',
                'font-family': Constants.STYLES.FONT_FAMILY,
                'display': 'flex',
                'align-items': 'center',
                'justify-content': 'center'
            });
        
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
            if (deleteCallback) {
                deleteCallback(testName);
            }
            return false;
        });
        
        controlsContainer.append(toggleContainer);
        controlsContainer.append(editButton);
        controlsContainer.append(deleteButton);
        
        listItem.append(nameSpan);
        listItem.append(controlsContainer);
        
        return listItem;
    }

    /**
     * Display test names in the list container
     */
    function displayTestNamesList(testData) {
        var listContainer = $('#' + Constants.IDS.TEST_NAMES_LIST);
        listContainer.empty();
        
        // Handle both old format (array of strings) and new format (array of objects)
        var tests = [];
        if (testData && testData.length > 0) {
            if (typeof testData[0] === 'string') {
                // Old format - convert to new format
                testData.forEach(function(testName) {
                    tests.push({
                        name: testName,
                        code: '',
                        enabled: true
                    });
                });
            } else {
                // New format
                tests = testData;
            }
        }
        
        if (tests.length === 0) {
            listContainer.append(createEmptyMessage());
            return;
        }
        
        tests.forEach(function(test) {
            var listItem = createTestNameListItem(test, deleteTestName, toggleTest, editTest);
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
                                    var testData = JSON.parse(trimmed);
                                    console.log('Parsed test data after delete:', testData);
                                    // Update UI with the result (now in new format)
                                    displayTestNamesList(testData);
                                } else {
                                    // Empty output, refresh to get current state
                                    updateTestNamesFromPython();
                                }
                            } catch(e) {
                                console.log('Error parsing test data after delete:', e, 'Output:', outputText);
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
     * Check if the test names widget is currently open/visible
     */
    function isWidgetOpen() {
        var widget = $('#' + Constants.IDS.TEST_NAMES_OVERLAY);
        return widget.length > 0 && widget.is(':visible');
    }

    /**
     * Refresh the widget if it's open
     * This is called automatically when the tests dictionary might have changed
     */
    function refreshIfOpen() {
        if (isWidgetOpen()) {
            // Debounce rapid updates - only refresh if last update was > 300ms ago
            if (!refreshIfOpen.lastUpdate || (Date.now() - refreshIfOpen.lastUpdate) > 300) {
                refreshIfOpen.lastUpdate = Date.now();
                updateTestNamesFromPython();
            }
        }
    }

    /**
     * Toggle a test on/off
     */
    function toggleTest(testName, enabled) {
        if (!Jupyter.notebook.kernel) {
            console.log('Kernel not available');
            return;
        }
        
        var testNameJson = JSON.stringify(testName);
        var enabledJson = JSON.stringify(enabled);
        var toggleCode = Constants.PYTHON_TEMPLATES.TOGGLE_TEST(testNameJson, enabledJson);
        
        Jupyter.notebook.kernel.execute(
            toggleCode,
            {
                iopub: {
                    output: function(msg) {
                        if (msg.content && msg.content.name === 'stdout') {
                            try {
                                var result = JSON.parse(msg.content.text.trim());
                                if (result.success) {
                                    // Refresh the list to show updated status
                                    updateTestNamesFromPython();
                                }
                            } catch(e) {
                                console.log('Error parsing toggle result:', e);
                            }
                        }
                    }
                }
            },
            {silent: false, store_history: false}
        );
    }

    /**
     * Edit test code
     */
    function editTest(testName, currentCode) {
        // Fetch test code if not provided
        if (!currentCode && Jupyter.notebook.kernel) {
            var testNameJson = JSON.stringify(testName);
            var fetchCode = Constants.PYTHON_TEMPLATES.FETCH_TEST_DATA(testNameJson);
            
            Jupyter.notebook.kernel.execute(
                fetchCode,
                {
                    iopub: {
                        output: function(msg) {
                            if (msg.content && msg.content.name === 'stdout') {
                                try {
                                    var testData = JSON.parse(msg.content.text.trim());
                                    if (testData.error) {
                                        console.log('Error fetching test data:', testData.error);
                                        showEditModal(testName, '');
                                    } else {
                                        showEditModal(testName, testData.code || '');
                                    }
                                } catch(e) {
                                    console.log('Error parsing test data:', e);
                                    showEditModal(testName, currentCode || '');
                                }
                            }
                        }
                    }
                },
                {silent: false, store_history: false}
            );
            return;
        }
        
        showEditModal(testName, currentCode || '');
    }

    /**
     * Show the edit modal
     */
    function showEditModal(testName, currentCode) {
        // Remove existing edit modal if it exists
        $('#test-edit-modal').remove();
        
        // Create modal overlay
        var modal = $('<div>')
            .attr('id', 'test-edit-modal')
            .css({
                'position': 'fixed',
                'top': '0',
                'left': '0',
                'width': '100%',
                'height': '100%',
                'background-color': 'rgba(0, 0, 0, 0.5)',
                'z-index': '10001',
                'display': 'flex',
                'justify-content': 'center',
                'align-items': 'center'
            });
        
        // Prevent all keyboard events from reaching the notebook
        modal.on('keydown keyup keypress', function(e) {
            e.stopPropagation();
        });
        
        // Create modal content (standardized styling)
        var modalContent = $('<div>')
            .css({
                'background-color': 'white',
                'border-radius': '2px',
                'padding': '20px',
                'width': '600px',
                'max-width': '90%',
                'max-height': '80vh',
                'display': 'flex',
                'flex-direction': 'column',
                'font-family': Constants.STYLES.FONT_FAMILY,
                'border': '1px solid #ddd',
                'box-shadow': '0 2px 8px rgba(0, 0, 0, 0.15)'
            });
        
        // Prevent clicks inside modal from closing it
        modalContent.on('click', function(e) {
            e.stopPropagation();
        });
        
        // Header
        var header = $('<div>')
            .css({
                'display': 'flex',
                'justify-content': 'space-between',
                'align-items': 'center',
                'margin-bottom': '12px',
                'border-bottom': '1px solid #eee',
                'padding-bottom': '8px'
            });
        
        var title = $('<h3>')
            .css({
                'margin': '0',
                'font-size': '16px',
                'font-weight': '500',
                'color': '#333',
                'font-family': Constants.STYLES.FONT_FAMILY
            })
            .text('Edit Test');
        
        var closeBtn = $('<button>')
            .html('&times;')
            .css({
                'background': 'none',
                'border': 'none',
                'font-size': '24px',
                'cursor': 'pointer',
                'color': '#999',
                'padding': '0',
                'width': '30px',
                'height': '30px'
            })
            .click(function() {
                modal.remove();
            });
        
        header.append(title);
        header.append(closeBtn);
        
        // Test name input field
        var nameLabel = $('<label>')
            .text('Test Name:')
            .css({
                'display': 'block',
                'margin-bottom': '6px',
                'font-size': '13px',
                'font-weight': '500',
                'color': '#333',
                'font-family': Constants.STYLES.FONT_FAMILY
            });
        
        var nameInput = $('<input>')
            .attr('type', 'text')
            .val(testName || '')
            .css({
                'width': '100%',
                'height': '32px',
                'font-family': 'Monaco, Menlo, "Courier New", monospace',
                'font-size': '13px',
                'padding': '6px 10px',
                'border': '1px solid #ddd',
                'border-radius': '2px',
                'margin-bottom': '12px',
                'box-sizing': 'border-box'
            })
            .attr('placeholder', 'Test name (e.g., test_addition)');
        
        // Prevent notebook keyboard manager from handling events in name input
        nameInput.on('keydown keyup keypress', function(e) {
            e.stopPropagation();
            e.stopImmediatePropagation();
            return true;
        });
        
        // Textarea for code (standardized with instantiation widget)
        var codeLabel = $('<label>')
            .text('Test Code:')
            .css({
                'display': 'block',
                'margin-bottom': '6px',
                'font-size': '13px',
                'font-weight': '500',
                'color': '#333',
                'font-family': Constants.STYLES.FONT_FAMILY
            });
        
        var codeTextarea = $('<textarea>')
            .val(currentCode || '')
            .css({
                'width': '100%',
                'height': '300px',
                'font-family': 'Monaco, Menlo, "Courier New", monospace',
                'font-size': '13px',
                'padding': '10px',
                'border': '1px solid #ddd',
                'border-radius': '2px',
                'resize': 'vertical',
                'flex': '1',
                'margin': '0px',
                'box-sizing': 'border-box'
            })
            .attr('placeholder', 'Test logic (Python code)...');
        
        // Prevent notebook keyboard manager from handling events in modal
        var originalEnabled = Jupyter.keyboard_manager ? Jupyter.keyboard_manager.enabled : true;
        if (Jupyter.keyboard_manager) {
            Jupyter.keyboard_manager.disable();
        }
        
        // Additional keyboard event blocker at document level when modal is focused
        var preventNotebookKeys = function(e) {
            // Only prevent if modal is visible and event target is within modal
            var target = $(e.target);
            if (modal.is(':visible') && (modal.has(target).length > 0 || modal[0] === target[0] || modalContent[0] === target[0])) {
                e.stopPropagation();
                e.stopImmediatePropagation();
                return false;
            }
        };
        
        // Re-enable keyboard manager when modal closes
        var cleanup = function() {
            // Remove document-level event listeners
            $(document).off('keydown.modal-keyboard keyup.modal-keyboard keypress.modal-keyboard');
            
            if (Jupyter.keyboard_manager && originalEnabled) {
                Jupyter.keyboard_manager.enable();
            }
            modal.off('keydown keyup keypress');
            modal.remove();
        };
        
        // Add event listeners to prevent notebook keyboard shortcuts
        $(document).on('keydown.modal-keyboard', preventNotebookKeys);
        $(document).on('keyup.modal-keyboard', preventNotebookKeys);
        $(document).on('keypress.modal-keyboard', preventNotebookKeys);
        
        // Isolate keyboard events - prevent them from reaching notebook
        codeTextarea.on('keydown keyup keypress', function(e) {
            e.stopPropagation();
            e.stopImmediatePropagation();
            return true;
        });
        
        // Prevent Esc key from triggering notebook shortcuts
        codeTextarea.on('keydown', function(e) {
            if (e.keyCode === 27 || e.key === 'Escape') { // Esc key
                e.stopPropagation();
                e.stopImmediatePropagation();
                e.preventDefault();
                cleanup();
                return false;
            }
        });
        
        // Also capture events at modal level
        modalContent.on('keydown keyup keypress', function(e) {
            e.stopPropagation();
            e.stopImmediatePropagation();
            return true;
        });
        
        // Buttons
        var buttons = $('<div>')
            .css({
                'display': 'flex',
                'justify-content': 'flex-end',
                'gap': '10px',
                'margin-top': '15px'
            });
        
        var cancelBtn = $('<button>')
            .text('Cancel')
            .css({
                'padding': '8px 16px',
                'border': '1px solid #ddd',
                'background': 'white',
                'border-radius': '2px',
                'cursor': 'pointer',
                'font-family': Constants.STYLES.FONT_FAMILY
            });
        
        var saveBtn = $('<button>')
            .text('Save')
            .css({
                'padding': '8px 16px',
                'border': 'none',
                'background': '#007bff',
                'color': 'white',
                'border-radius': '2px',
                'cursor': 'pointer',
                'font-family': Constants.STYLES.FONT_FAMILY
            });
        
        buttons.append(cancelBtn);
        buttons.append(saveBtn);
        
        modalContent.append(header);
        modalContent.append(nameLabel);
        modalContent.append(nameInput);
        modalContent.append(codeLabel);
        modalContent.append(codeTextarea);
        modalContent.append(buttons);
        modal.append(modalContent);
        
        // Close on background click
        modal.click(function(e) {
            if ($(e.target).attr('id') === 'test-edit-modal') {
                cleanup();
            }
        });
        
        closeBtn.off('click').click(cleanup);
        cancelBtn.click(cleanup);
        saveBtn.click(function() {
            var newName = nameInput.val().trim();
            var newCode = codeTextarea.val();
            
            if (!newName) {
                alert('Please enter a test name');
                return;
            }
            
            if (!newCode) {
                alert('Please enter test code');
                return;
            }
            
            updateTestCode(testName, newName, newCode, function() {
                cleanup();
                updateTestNamesFromPython();
            });
        });
        
        $('body').append(modal);
        
        // Focus name input after a brief delay, then allow tab to code textarea
        setTimeout(function() {
            nameInput.focus();
            nameInput.select(); // Select existing text for easy editing
        }, 100);
    }

    /**
     * Update test code and optionally rename test
     */
    function updateTestCode(oldTestName, newTestName, newCode, callback) {
        if (!Jupyter.notebook.kernel) {
            console.log('Kernel not available');
            if (callback) callback();
            return;
        }
        
        var oldTestNameJson = JSON.stringify(oldTestName);
        var newTestNameJson = JSON.stringify(newTestName);
        var testCodeJson = JSON.stringify(newCode);
        var updateCode = Constants.PYTHON_TEMPLATES.UPDATE_TEST_CODE(oldTestNameJson, newTestNameJson, testCodeJson);
        
        Jupyter.notebook.kernel.execute(
            updateCode,
            {
                iopub: {
                    output: function(msg) {
                        if (msg.content && msg.content.name === 'stdout') {
                            try {
                                var result = JSON.parse(msg.content.text.trim());
                                if (result.success) {
                                    console.log('Test code updated successfully');
                                    if (callback) callback();
                                } else {
                                    console.log('Error updating test code:', result.error);
                                    if (callback) callback();
                                }
                            } catch(e) {
                                console.log('Error parsing update result:', e);
                                if (callback) callback();
                            }
                        }
                    }
                }
            },
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
                showTestNamesOverlay: showTestNamesOverlay,
                refreshIfOpen: refreshIfOpen
            };
        }
    };
});

