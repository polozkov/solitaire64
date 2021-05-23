//Global Game object
var G = {
    //constant that show, that cell is out of borders
    OUT_OF_BOARD: 42,

    //style object for SVG element, relative_stroke_width is the ratio to the main cell's border
    f_style: function (RGB_fill, RGB_stroke, relative_stroke_width) {
        return { fill: RGB_fill, stroke: RGB_stroke, stroke_width: relative_stroke_width };
    }
};

//start sets of the GAME_BOARD and view (colors and ratio)
G.SETS = {
    GAME_BOARD: {
        //nx * ny cells
        sizes: [8, 8],
        //how many pieces do we put on the start position
        n_pieces: 12,
    },

    //when 0.5, circle piece is inscribed in the cell
    ratio_radius_to_cell: 0.41,

    //line_width divide to the cell size
    ratio_cell_border_to_cell: 0.04,

    //cells are rounded squares, 0.5 is circle, 0.0 is the square
    ratio_round_corners: 0.2,

    //styles for each type of cell
    CELL: {
        empty: G.f_style("#FE9", "#000", 1),
        hint: G.f_style("#8F5", "#000", 1),
        selected: G.f_style("#0A0", "#000", 1)
    },

    //styles for each type of circles
    CIRCLE: {
        invisible: G.f_style("RGBA(0,0,0,0)", "RGBA(0,0,0,0)", 2),
        standart: G.f_style("#000", "#FFF", 2),
        moving: G.f_style("#050", "#FFF", 2)
    }
};