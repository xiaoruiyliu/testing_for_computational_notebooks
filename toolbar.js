/**
 * Toolbar Module
 * Handles registration of toolbar buttons
 */

define([
    'base/js/namespace'
], function(Jupyter) {
    'use strict';

    var Constants = null;

    /**
     * Register a toolbar button
     */
    function registerToolbarButton(config, handler) {
        return Jupyter.keyboard_manager.actions.register({
            help: config.help,
            icon: config.icon,
            handler: handler || function() {}
        }, config.actionName, config.label);
    }

    /**
     * Initialize toolbar buttons
     */
    function initializeToolbar(handlers) {
        var buttons = [];

        // Add Interactive Input button
        buttons.push(
            registerToolbarButton(
                Constants.TOOLBAR_BUTTONS.ADD_INTERACTIVE_INPUT,
                handlers.insertInteractiveTestWidget
            )
        );
        
        // Add View Test Names button
        buttons.push(
            registerToolbarButton(
                Constants.TOOLBAR_BUTTONS.VIEW_TEST_NAMES,
                handlers.showTestNamesOverlay
            )
        );
        
        // Add Rerun Tests button
        buttons.push(
            registerToolbarButton(
                Constants.TOOLBAR_BUTTONS.RERUN_TESTS,
                handlers.rerunTests || function() {}
            )
        );
        
        // Add buttons group to toolbar
        Jupyter.toolbar.add_buttons_group(buttons);
    }

    return {
        init: function(constants) {
            Constants = constants;
            return {
                initializeToolbar: initializeToolbar
            };
        }
    };
});

