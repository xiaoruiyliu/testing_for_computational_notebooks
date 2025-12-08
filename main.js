/**
 * Main extension module for Jupyter Notebook Testing extension
 * Provides interactive test name management and test completion tracking
 */

define([
    'base/js/namespace',
    'base/js/events',
    './constants',
    './testWidget',
    './testChecker',
    './testNamesWidget',
    './dataframeViewer',
    './toolbar',
    './lockedCellsTest'
], function(Jupyter, events, ConstantsModule, TestWidgetModule, TestCheckerModule, TestNamesWidgetModule, DataFrameViewerModule, ToolbarModule, LockedCellsTestModule) {
    'use strict';

    // Initialize all modules with constants
    var Constants = ConstantsModule;
    var TestWidget = TestWidgetModule.init(Constants);
    var TestChecker = TestCheckerModule.init(Constants);
    var TestNamesWidget = TestNamesWidgetModule.init(Constants);
    var DataFrameViewer = DataFrameViewerModule.init(Constants);
    var Toolbar = ToolbarModule.init(Constants);
    var LockedCellsTest = LockedCellsTestModule.init(Constants);

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
        
        // Listen for cell execution completion (after cell finishes executing)
        events.on('finished_execute.CodeCell', function(evt, data) {
            // Add a small delay to ensure Python execution has fully completed
            setTimeout(function() {
                TestChecker.checkForTestCompletion(evt, data);
            }, 100);
        });
        
        // Listen for cell execution completion and refresh test names widget if open
        // This ensures the widget automatically updates when the tests dictionary changes
        events.on('finished_execute.CodeCell', function(evt, data) {
            var cell = data.cell;
            if (cell && cell.cell_type === 'code') {
                var cellCode = cell.get_text() || '';
                
                // Check if the cell code might have modified the tests dictionary
                // Look for patterns like: tests[...], tests =, tests[...] =, tests.update(), etc.
                var testsPattern = /\btests\s*[\[=\[]|\btests\s*\.(update|pop|clear|setdefault)|tests\[|tests\s*=/;
                
                // Also check for common widget code patterns that modify tests
                var widgetPattern = /tests\[.*?\]\s*=|Test Instantiation Widget/;
                
                if (testsPattern.test(cellCode) || widgetPattern.test(cellCode)) {
                    // Cell might have modified tests dictionary, refresh widget if open
                    // Use a small delay to ensure Python execution has completed
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
