G.SVG.DRAW = {
    //draw round_rect cell xy
    f_cell: function (xy, optional_obj_style) {
        var RECT_id = 'ID="' + G.CONVERT.f_xy_to_cell_id(xy) + '"';

        //top left corner of the cell
        var p = G.SVG.f_cell_ab(xy).a.f_get_xy_string();
        var RECT_xy = 'x="' + p.x + '" y="' + p.y + '"';
        var RECT_wh = 'width="' + G.SVG.CELL_00.wh_string.x + '" height="' + G.SVG.CELL_00.wh_string.y + '"';
        var RECT_r = 'rx="' + G.SVG.CELL_00.corners_string_xy.x + '" ry="' + G.SVG.CELL_00.corners_string_xy.y + '"';

        var RECT = RECT_id + ' ' + RECT_xy + ' ' + RECT_r + ' ' + RECT_wh;

        //if obj_style defined, add style
        RECT += ((optional_obj_style) ? (' ' + G.SVG.f_style_to_string(optional_obj_style)) : '');
        return '<rect ' + RECT + '/>';
    },

    f_circle: function (xy, optional_obj_style, optional_obj_dx_dy) {
        var CIRCLE_id = 'ID="' + G.CONVERT.f_xy_to_circle_id(xy) + '"';

        //top left corner of the cell
        var c = G.SVG.f_cell_center(xy);
        if (optional_obj_dx_dy) { c.f_self_add(optional_obj_dx_dy); };
        c = c.f_get_xy_string();
        var CIRCLE_cx_cy = 'cx="' + c.x + '" cy="' + c.y + '"';
        var CIRCLE_r = 'rx="' + G.SVG.CELL_00.wh_ellipse_rx_ry.x + '"' + ' ry="' + G.SVG.CELL_00.wh_ellipse_rx_ry.y + '"';

        var CIRCLE = CIRCLE_id + ' ' + CIRCLE_cx_cy + ' ' + CIRCLE_r;

        //if obj_style defined, add style
        CIRCLE += ((optional_obj_style) ? (' ' + G.SVG.f_style_to_string(optional_obj_style)) : '');

        return '<ellipse ' + CIRCLE + '/>';
    },

    f_board: function (obj_board, move_now, time_process_0_1) {
        //all styles for cells and circles are in G.SETS.CELL and in G.SETS.CIRCLE
        var arr_cell_styles = [G.SETS.CELL.empty, G.SETS.CELL.hint, G.SETS.CELL.selected];
        var arr_circle_styles = [G.SETS.CIRCLE.invisible, G.SETS.CIRCLE.standart, G.SETS.CIRCLE.moving];

        //index of cell style
        function f_cell_style(i_xy) {
            //if no move starts, show hint only for cells with legal moves
            if (!move_now.a) { return ((obj_board.f_moves_from_cell(i).length > 0) ? 1 : 0); };

            //if move in process, select only one active cell, that finishes curren move
            if (move_now.b) { return (move_now.b.f_is_equal_to(i_xy) ? 2 : 0); }

            //when move has just started, select start cell
            if (move_now.a.f_is_equal_to(i_xy)) { return 2; }

            //when move has just started, add hints for cells, that finishes move
            if (obj_board.f_has_move_a_b(move_now.a, i)) { return 1; }

            return 0; //other cells are empty, not selected and without hints
        };

        function f_circle_style(i_xy) {
            //if cell i_xy is free, owner = 0;  if is occupied, owner = 1
            var owner = ((obj_board.f_get_untested_xy([i_xy.x, i_xy.y]) === 0) ? 0 : 1);

            //when move is in process, select only final position of circle 
            if (move_now.a && move_now.b) { return (move_now.b.f_is_equal_to(i_xy) ? 2 : owner); };

            //when move has just started, select active circle
            if (move_now.a && move_now.a.f_is_equal_to(i_xy)) { return 2; };

            return owner; //in other case, show only owners (when cell is occupied)
        };

        //for animation, show active circle in process
        function f_circle_dxy(i_xy) {
            //when move is not in the process, delta is zero-zero
            if ((!move_now.a) || (!move_now.b)) { return G.F_XY.f00(); };
            //when it is not active circle, delta is zero-zero
            if (!move_now.b.f_is_equal_to(i_xy)) { return G.F_XY.f00(); };

            //delta between 2 cells = a - b (because we show circle move_now.b)
            var delta_nxy = move_now.a.f_subtract(move_now.b);
            //absolute delta depends of time_process and cell sizes
            return (delta_nxy.f_scale(time_process_0_1).f_mult(G.SVG.wh_cell));
        };

        var final_SVG = "";
        var i = {}, i_style;

        for (i = G.F_XY.f00(); i.x < obj_board.sizes.x; i.x++) {
            for (i.y = 0; i.y < obj_board.sizes.y; i.y++) {
                i_style = arr_cell_styles[f_cell_style(i)];
                final_SVG += G.SVG.DRAW.f_cell(i, i_style);
            }
        }

        for (i = G.F_XY.f00(); i.x < obj_board.sizes.x; i.x++) {
            for (i.y = 0; i.y < obj_board.sizes.y; i.y++) {
                i_style = arr_circle_styles[f_circle_style(i)];
                final_SVG += G.SVG.DRAW.f_circle(i, i_style, f_circle_dxy(i));
            }
        }
        return final_SVG;
    }
};