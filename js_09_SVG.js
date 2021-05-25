G.SVG = {
    //main SVG-element: game_board
    MAIN: document.getElementById("idShowMainGame"),

    //areas are rectangles by two points (a,b)
    AREAS: {
        //total SVG area from (0,0) to (w,h)
        total_svg: G.F_AB.f_00_00(),
        //board with border (with line_width)
        board_all: G.F_AB.f_00_00(),
        //board area without lines  (to draw grid with stroke-width)
        board_cut: G.F_AB.f_00_00(),
        //area for game buttons
        all_buttons: G.F_AB.f_00_00(),

        BUTTON: {
            frame: G.F_AB.f_00_00(),

            game_new: G.F_AB.f_00_00(),
            game_restart: G.F_AB.f_00_00(),
            move_back: G.F_AB.f_00_00(),
            move_forward: G.F_AB.f_00_00(),

            f_set_frame: function () {
                var my_frame = G.SVG.AREAS.BUTTON.frame, i_button, i;
                for (i_button = 0; i_button < G.LANG.BUTTONS.arr_names.length; i_button++) {
                    i = G.LANG.BUTTONS.arr_names[i_button];
                    G.SVG.AREAS.BUTTON[i] = my_frame.f_get_cell_area(new G.F_XY([0, i_button]), [1, 4]);
                    G.SVG.AREAS.BUTTON[i] = G.SVG.AREAS.BUTTON[i].f_cut_short_side_ratio(G.SETS.button_cut);
                }
            }
        },

        f_set_areas() {
            //free visible client size of body
            var body_xy = G.EL.f_body_wh();
            //info string of my game
            var info_h = G.EL.DIV_INFO.offsetHeight;
            //empty body area for SVG
            var total_svg_wh = new G.F_XY([body_xy.x, body_xy.y - info_h]);

            //board sizes by cell and line_width
            var x_size = G.SETS.GAME_BOARD.sizes[0] + G.SETS.RATIO.cell_border_to_cell;
            var y_size = G.SETS.GAME_BOARD.sizes[1] + G.SETS.RATIO.cell_border_to_cell;
            var xy_sizes = new G.F_XY([x_size, y_size]);

            //board Width and Height with border for line_width
            var board_wh_all = total_svg_wh.f_maximize_to_ratio(x_size / y_size);
            //board grid sizes (without line_width) = WH_ALL / SIZES_WITH_LINE_WIDTH * SIZES_NX_NY_CELLS
            var board_wh_cut = board_wh_all.f_div(xy_sizes).f_mult(new G.F_XY(G.SETS.GAME_BOARD.sizes));
            //how many cut from each side = 0.5 delta sizes or 0.5 line_width
            var cut_wh = board_wh_all.f_subtract(board_wh_cut).f_half();

            //tatal SVG from (0,0) to total sizes
            G.SVG.AREAS.total_svg = new G.F_AB(G.F_XY.f00(), total_svg_wh);

            if (board_wh_all.x_was_big) {
                board_wh_all.x = Math.min(board_wh_all.x, total_svg_wh.x * G.SETS.RATIO.press_board_on_x);
                G.SVG.AREAS.all_buttons = new G.F_AB(new G.F_XY([board_wh_all.x, 0]), G.SVG.AREAS.total_svg.b);
                G.SVG.AREAS.BUTTON.frame = G.SVG.AREAS.all_buttons.f_get_cell_area(G.F_XY.f00(), [1, 2]);
            } else {
                board_wh_all.y = Math.min(board_wh_all.y, total_svg_wh.y * G.SETS.RATIO.press_board_on_y);
                G.SVG.AREAS.all_buttons = new G.F_AB(new G.F_XY([0, board_wh_all.y]), G.SVG.AREAS.total_svg.b);
                G.SVG.AREAS.BUTTON.frame = G.SVG.AREAS.all_buttons.f_get_cell_area(G.F_XY.f00(), [2, 1]);
            }
            G.SVG.AREAS.BUTTON.f_set_frame();

            //board is in left top corner
            G.SVG.AREAS.board_all = G.F_AB.f_by_a_and_wh(G.SVG.AREAS.total_svg.a, board_wh_all);
            //cut is board_all - cut for_each side
            G.SVG.AREAS.board_cut = G.SVG.AREAS.board_all.f_cut_wh(cut_wh);
        }
    },

    //return coordinates of the left_top corner of the cell_xy by gotten object xy
    f_cell_ab: function (xy) { return G.SVG.AREAS.board_cut.f_get_cell_area(xy, G.SETS.GAME_BOARD.sizes); },

    //return coordinates of the center of the cell_xy by gotten object xy
    f_cell_center: function (xy) { return G.SVG.f_cell_ab(xy).f_get_center(); },

    //sets for cell_00, that will be used for drawing
    CELL_00: {
        //grid_sizes of any cell
        wh_sizes: G.F_XY.f00(),
        //grid_sizes of any cell as string (only 2 decimal digits)
        wh_string: G.F_XY.f00(),

        //round corners for_each round rect cell
        corners_string_xy: G.F_XY.f00(),
        //line-width for cell
        width_of_border: 1,
        //radiuses of ellipse of peg
        wh_ellipse_rx_ry: G.F_XY.f00(),

        f_set_cell_00() {
            //sizes of cell in grid
            var wh = G.SVG.f_cell_ab(G.F_XY.f00()).f_get_wh();
            G.SVG.CELL_00.wh_sizes = wh.f_get_xy_copy();
            G.SVG.CELL_00.wh_string = wh.f_get_xy_string();

            //rounrect's corners is wh, scaled by G.SETS and converted to string
            G.SVG.CELL_00.corners_string_xy = wh.f_scale(G.SETS.RATIO.round_corners).f_get_xy_string();
            //border is wh.min, scaled by G.SETS
            G.SVG.CELL_00.width_of_border = wh.f_get_min() * G.SETS.RATIO.cell_border_to_cell;
            //ellipses is G.SETS.RATIO.radius_to_cell of wh and converted to string
            G.SVG.CELL_00.wh_ellipse_rx_ry = wh.f_scale(G.SETS.RATIO.radius_to_cell).f_get_xy_string();
        }
    },

    //which cell is belong to pressed pixel
    f_cell_by_pxy: function (pxy) {
        //cell (x,y) with fractional part, that must be: f_get_int() by Math.floor()
        var n_xy = pxy.f_subtract(G.SVG.AREAS.board_cut.a).f_div(G.SVG.CELL_00.wh_sizes).f_get_int();
        //if integer n_xy is on board, return cell_xy
        return ((new G.F_XY(G.SETS.GAME_BOARD.sizes)).f_is_on_this_board(n_xy) ? n_xy : null);
    },

    f_button_by_pxy: function (pxy) {
        var i_button, i_ab;
        for (i_button = 0; i_button < G.LANG.BUTTONS.arr_names.length; i_button++) {
            i_ab = G.SVG.AREAS.BUTTON[G.LANG.BUTTONS.arr_names[i_button]];
            if (i_ab.f_is_on_area(pxy)) {
                return G.LANG.BUTTONS.arr_names[i_button];
            }
        }
        return null;
    },

    //return style string by object_style
    f_style_to_string: function (obj_style, optional_ratio) {
        if (optional_ratio === undefined) { optional_ratio = G.SVG.CELL_00.width_of_border; };
        var fill = 'fill:' + obj_style.fill + ';';
        var stroke = 'stroke:' + obj_style.stroke + ';';

        //.stroke_width is the ratio to the width_of_cell_border
        var w = obj_style.stroke_width * optional_ratio;
        var width = 'stroke-width:' + G.CONVERT.f_n_to_string(w) + ';';
        return 'style="' + fill + ' ' + stroke + ' ' + width + '"';
    },

    f_maximize_game_area: function () {
        for (var i_repeat_twice = 0; i_repeat_twice < 2; i_repeat_twice++) {
            G.SVG.AREAS.f_set_areas();
            G.SVG.CELL_00.f_set_cell_00();
            //set pixel width and hidth for the main game_board SVG
            G.SVG.AREAS.total_svg.f_get_wh().f_set_element_style(G.SVG.MAIN);
        }
    }
};