/**
 * DataFrame Viewer Module
 * Handles displaying a widget to select and view dataframes from notebook global state
 */

define([
    'base/js/namespace'
], function(Jupyter) {
    'use strict';

    var Constants = null;
    // jQuery is available globally in Jupyter Notebook
    var $ = window.$ || window.jQuery;

    /**
     * Insert a dataframe viewer widget cell below the current cell
     */
    function insertDataframeViewerWidget() {
        var currentIndex = Jupyter.notebook.get_selected_index();
        
        // Insert a code cell below the current cell
        var newCell = Jupyter.notebook.insert_cell_at_index('code', currentIndex + 1);
        
        // Set the IPython widget code
        newCell.set_text(Constants.PYTHON_TEMPLATES.DATAFRAME_VIEWER_WIDGET);
        
        // Hide the input area (code) but keep the output (widget) visible
        newCell.element.find('.input').hide();

        // Select the newly created cell
        Jupyter.notebook.select(currentIndex + 1);
        
        // Execute the cell to show the widget
        Jupyter.notebook.execute_cell();
        
        // Wait for execution, then hide the code and return to original cell
        setTimeout(function() {
            // Hide the input area (code) but keep the output (widget) visible
            newCell.element.find('.input').hide();
            
            // Return to original cell
            Jupyter.notebook.select(currentIndex);
        }, Constants.TIMING.CELL_HIDE_DELAY);
    }

    return {
        init: function(constants) {
            Constants = constants;
            return {
                insertDataframeViewerWidget: insertDataframeViewerWidget
            };
        }
    };
});

