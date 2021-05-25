//Global Game object
var G = {};

G.OUT_OF_BOARD = 42;

G.f_rect_style = function (RGB_fill, RGB_stroke, relative_stroke_width) {
    var result_style = { fill: RGB_fill, stroke: RGB_stroke, stroke_width: relative_stroke_width };
    return result_style;
};

G.f_rect_and_text_style = function (fill_stroke_width_rect, fill_stroke_width_text) {
    var style_rect = G.f_rect_style(fill_stroke_width_rect[0], fill_stroke_width_rect[1], fill_stroke_width_rect[2]);
    var style_text = G.f_rect_style(fill_stroke_width_text[0], fill_stroke_width_text[1], fill_stroke_width_text[2]);
    return {rect: style_rect, text: style_text};
};

//start sets of the GAME_BOARD and view (colors and ratio)
G.SETS = {
    GAME_BOARD: {
        //nx * ny cells
        sizes: [8, 8],
        //how many pieces do we put on the start position
        n_pieces: 12,
    },

    RATIO: {
        //when 0.5, circle piece is inscribed in the cell
        radius_to_cell: 0.41,

        //line_width divide to the cell size
        cell_border_to_cell: 0.04,

        //cells are rounded squares, 0.5 is circle, 0.0 is the square
        round_corners: 0.2,

        //when board on x is less, than press_board_on_x press_board
        press_board_on_x: 2 / 3,
        press_board_on_y: 2 / 3,

        //do not press button's names more then press_text_max
        press_text_max: 1.5,
    },

    //styles for each type of cell
    CELL: {
        empty: G.f_rect_style("#FE9", "#000", 1),
        hint: G.f_rect_style("#8F5", "#000", 1),
        selected: G.f_rect_style("#0A0", "#000", 1)
    },

    //styles for each type of circles
    CIRCLE: {
        invisible: G.f_rect_style("RGBA(0,0,0,0)", "RGBA(0,0,0,0)", 2),
        standart: G.f_rect_style("#000", "#FFF", 2),
        moving: G.f_rect_style("#050", "#FFF", 2)
    },

    //cut each button on this ratio (to the short side)
    button_cut: 0.016,
    button_active: G.f_rect_and_text_style(["#FF7", "#000", 0.016], ["#373", "#000", 0.005])
};