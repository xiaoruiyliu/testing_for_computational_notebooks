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
    './toolbar'
], function(Jupyter, events, ConstantsModule, TestWidgetModule, TestCheckerModule, TestNamesWidgetModule, ToolbarModule) {
    'use strict';

    // Initialize all modules with constants
    var Constants = ConstantsModule;
    var TestWidget = TestWidgetModule.init(Constants);
    var TestChecker = TestCheckerModule.init(Constants);
    var TestNamesWidget = TestNamesWidgetModule.init(Constants);
    var Toolbar = ToolbarModule.init(Constants);

    /**
     * Initialize the extension
     */
    function load_ipython_extension() {
        // Initialize toolbar buttons
        Toolbar.initializeToolbar({
            insertInteractiveTestWidget: TestWidget.insertInteractiveTestWidget,
            showTestNamesOverlay: TestNamesWidget.showTestNamesOverlay,
            rerunTests: null  // To be implemented
        });
        
        // Listen for cell execution completion
        events.on('execute.CodeCell', TestChecker.checkForTestCompletion);
    }

    return {
        load_ipython_extension: load_ipython_extension
    };
});
