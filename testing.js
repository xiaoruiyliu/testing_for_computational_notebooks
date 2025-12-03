/**
 * Entry point for Testing extension
 * This file is loaded by Jupyter when the extension directory name is used
 * It simply re-exports the main module
 */

define([
    'base/js/namespace',
    'base/js/events',
    './constants',
    './testWidget',
    './testChecker',
    './testNamesWidget',
    './dataframeViewer',
    './toolbar'
], function(Jupyter, events, ConstantsModule, TestWidgetModule, TestCheckerModule, TestNamesWidgetModule, DataFrameViewerModule, ToolbarModule) {
    'use strict';
    
    // Initialize all modules with constants
    var Constants = ConstantsModule;
    var TestWidget = TestWidgetModule.init(Constants);
    var TestChecker = TestCheckerModule.init(Constants);
    var TestNamesWidget = TestNamesWidgetModule.init(Constants);
    var DataFrameViewer = DataFrameViewerModule.init(Constants);
    var Toolbar = ToolbarModule.init(Constants);

    /**
     * Initialize the extension
     */
    function load_ipython_extension() {
        // Initialize toolbar buttons
        Toolbar.initializeToolbar({
            insertInteractiveTestWidget: TestWidget.insertInteractiveTestWidget,
            showTestNamesOverlay: TestNamesWidget.showTestNamesOverlay,
            insertDataframeViewerWidget: DataFrameViewer.insertDataframeViewerWidget
        });
        
        // Listen for cell execution completion
        events.on('execute.CodeCell', TestChecker.checkForTestCompletion);
        
        // Listen for cell execution completion and refresh test names widget if open
        events.on('finished_execute.CodeCell', function(evt, data) {
            var cell = data.cell;
            if (cell && cell.cell_type === 'code') {
                var cellCode = cell.get_text() || '';
                
                // Check if the cell code might have modified the tests dictionary
                var testsPattern = /\btests\s*[\[=\[]|\btests\s*\.(update|pop|clear|setdefault)|tests\[|tests\s*=/;
                var widgetPattern = /tests\[.*?\]\s*=|Test Instantiation Widget/;
                
                if (testsPattern.test(cellCode) || widgetPattern.test(cellCode)) {
                    setTimeout(function() {
                        TestNamesWidget.refreshIfOpen();
                    }, 300);
                }
            }
        });
    }
    
    return {
        load_ipython_extension: load_ipython_extension
    };
});

