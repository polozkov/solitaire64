G.SVG = {
    //main SVG-element: game_board
    MAIN: document.getElementById("idShowMainGame"),

    //width and heigth of the SVG element
    wh_total_board: new G.F_XY([0, 0]),
    //sizes of the one cell (on the board grid)
    wh_cell: new G.F_XY([0, 0]),

    //sizes of cell rounded to the 2 decimal digits ond transform to the (string_x,string_y)
    wh_cell_string: new G.F_XY([0, 0]),
    //rounded_rect corners as (string_x,string_y)
    wh_corners_string: new G.F_XY([0, 0]),

    //object: coordinates of the left-top corner of the zero-zero cell
    wh_cut_board: new G.F_XY([0, 0]),
    //linewidth of the cell on the game_board
    width_of_cell_border: 1,

    //radius of the circle piece on the game board
    radius_as_string: 1,

    //return coordinates of the left_top corner of the cell_xy by gotten object xy
    f_cell_corner: function (xy) { return G.SVG.wh_cut_board.f_add(xy.f_mult(G.SVG.wh_cell)); },

    //return coordinates of the center of the cell_xy by gotten object xy
    f_cell_center: function (xy) { return G.SVG.wh_cell.f_half().f_add(G.SVG.f_cell_corner(xy)); },

    //which cell is belong to pressed pixel
    f_cell_by_pxy: function (pxy) {
        //cell (x,y) with fractional part, that must be: f_get_int() by Math.floor()
        var n_xy = pxy.f_subtract(G.SVG.wh_cut_board).f_div(G.SVG.wh_cell).f_get_int();
        return ((new G.F_XY(G.SETS.GAME_BOARD.sizes)).f_is_on_this_board(n_xy) ? n_xy : null);
    },

    //return style string by object_style
    f_style_to_string: function (obj_style) {
        var fill = 'fill:' + obj_style.fill + ';';
        var stroke = 'stroke:' + obj_style.stroke + ';';

        //.stroke_width is the ratio to the width_of_cell_border
        var w = obj_style.stroke_width * G.SVG.width_of_cell_border;
        var width = 'stroke-width:' + G.CONVERT.f_n_to_string(w) + ';';
        return 'style="' + fill + ' ' + stroke + ' ' + width + '"';
    },

    f_maximize_game_area: function () {
        var body_xy = G.EL.f_body_wh();
        var info_h = G.EL.DIV_INFO.offsetHeight;
        //area for the game board before cutting (without correct ratio)
        var body_without_info_h = new G.F_XY([body_xy.x, body_xy.y - info_h]);

        var x_size = G.SETS.GAME_BOARD.sizes[0] + G.SETS.ratio_cell_border_to_cell;
        var y_size = G.SETS.GAME_BOARD.sizes[1] + G.SETS.ratio_cell_border_to_cell;
        var xy_sizes = new G.F_XY([x_size, y_size]);

        //correct ratio of the game board
        G.SVG.wh_total_board = body_without_info_h.f_maximize_to_ratio(x_size / y_size);

        //all cells has the same size on the grid of the game_board
        G.SVG.wh_cell = G.SVG.wh_total_board.f_div(xy_sizes);
        //string with 2 decimal signs
        G.SVG.wh_cell_string = G.SVG.wh_cell.f_get_xy_string();
        //rx and ry for the round_rect cell
        G.SVG.wh_corners_string = G.SVG.wh_cell.f_scale(G.SETS.ratio_round_corners).f_get_xy_string();

        //line_width depends from cell_width and ratio (border / cell)
        G.SVG.width_of_cell_border = G.SVG.wh_cell.x * G.SETS.ratio_cell_border_to_cell;
        G.SVG.radius_as_string = G.CONVERT.f_n_to_string(G.SVG.wh_cell.x * G.SETS.ratio_radius_to_cell);
        G.SVG.wh_cut_board = G.SVG.wh_cell.f_scale(G.SETS.ratio_cell_border_to_cell / 2);

        //set pixel width and hidth for the main game_board SVG
        G.SVG.wh_total_board.f_set_element_style(G.SVG.MAIN);
    }
};