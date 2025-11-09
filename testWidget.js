/**
 * Test Widget Insertion Module
 * Handles insertion of interactive test name input widgets into notebook cells
 */

define([
    'base/js/namespace'
], function(Jupyter) {
    'use strict';

    var Constants = null;

    /**
     * Insert an interactive test input widget cell below the current cell
     */
    function insertInteractiveTestWidget() {
        var currentIndex = Jupyter.notebook.get_selected_index();
        
        // Insert a code cell below the current cell
        var newCell = Jupyter.notebook.insert_cell_at_index('code', currentIndex + 1);
        
        // Set the IPython widget code
        newCell.set_text(Constants.PYTHON_TEMPLATES.TEST_WIDGET);
        
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
                insertInteractiveTestWidget: insertInteractiveTestWidget
            };
        }
    };
});

