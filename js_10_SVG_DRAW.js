G.SVG.DRAW = {
    //rect_id, round_corners_xy_string are optional
    f_round_rect: function (ab, obj_style, optional_rect_id, optional_round_corners_xy_string) {
        var round_corners_xy_string = optional_round_corners_xy_string || G.F_XY.f00();
        var RECT_id = (optional_rect_id ? ('ID="' + optional_rect_id + '"') : "");

        //top left corner of the cell
        var p = ab.a.f_get_xy_string();
        var RECT_xy = 'x="' + p.x + '" y="' + p.y + '"';

        var wh = ab.f_get_wh().f_get_xy_string();
        var RECT_wh = 'width="' + wh.x + '" height="' + wh.y + '"';

        var RECT_r = 'rx="' + round_corners_xy_string.x + '" ry="' + round_corners_xy_string.y + '"';

        var RECT = RECT_id + ' ' + RECT_xy + ' ' + RECT_r + ' ' + RECT_wh;

        //if obj_style defined, add style
        //RECT += ((optional_obj_style) ? (' ' + G.SVG.f_style_to_string(optional_obj_style)) : '');

        return '<rect ' + RECT + ' ' + obj_style + '/>';
    },

    //draw round_rect cell xy
    f_cell: function (xy, optional_obj_style) {
        var ab = G.SVG.f_cell_ab(xy);
        var rect_id = G.CONVERT.f_xy_to_cell_id(xy.f_get_arr());
        var round_corners_xy_string = G.SVG.CELL_00.corners_string_xy;
        var obj_style = G.SVG.f_style_to_string(optional_obj_style);

        return G.SVG.DRAW.f_round_rect(ab, obj_style, rect_id, round_corners_xy_string);
    },

    f_circle: function (xy, optional_obj_style, optional_obj_dx_dy) {
        var CIRCLE_id = 'id="' + G.CONVERT.f_xy_to_circle_id(xy) + '"';

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

    //for animation calculate de_dy of moving circle
    f_dx_dy_for_circle: function (move_now, time_process_0_1) {
        //when move is not in the process, delta is zero-zero
        if ((!move_now.a) || (!move_now.b)) { return G.F_XY.f00(); };

        //delta between 2 cells = a - b (because we show circle move_now.b)
        var delta_nxy = move_now.a.f_subtract(move_now.b);
        //absolute delta depends of time_process and cell sizes
        return (delta_nxy.f_scale(time_process_0_1).f_mult(G.SVG.CELL_00.wh_sizes));
    },

    f_text: function (ab_rect, text_string, rect_text_style, button_name) {
        var rect_style = G.SVG.f_style_to_string(rect_text_style.rect, ab_rect.f_get_wh().f_get_min());
        var rect_svg = G.SVG.DRAW.f_round_rect(ab_rect, rect_style);
    
        var xy = ab_rect.a.f_get_xy_string();
        var attr_id = 'id="' + G.CONVERT.f_name_to_id(button_name, "TEXT") + '"';
        var attr_xy = 'x="' + xy.x + '" y="' + xy.y + '"';
        var attr_style = G.SVG.f_style_to_string(rect_text_style.text, ab_rect.f_get_wh().f_get_min());
    
        var text_begin = '<text ' + attr_id + ' ' + attr_xy + ' ' + attr_style + '>';
        var text_end = '</text>';
        var text_svx = text_begin + text_string + text_end;
    
        return (rect_svg + text_svx);
    },

    f_one_button_by_name: function (button_name) {
        var my_rect_ab = G.SVG.AREAS.BUTTON[button_name];
        var my_string = G.LANG.BUTTONS[button_name][G.LANG.en_ru];
        var my_style = G.SETS.button_active;
        var my_svg = G.SVG.DRAW.f_text(my_rect_ab, my_string, my_style, button_name);

        return my_svg;
    },

    f_inscribe_text_in_button: function (button_name) {
        var ab_rect = G.SVG.AREAS.BUTTON[button_name];
        var id_text = G.CONVERT.f_name_to_id(button_name, "TEXT");
        var id_el = document.getElementById(id_text);

        var bbox = id_el.getBBox(true);
        var ab_text = G.F_AB.f_by_bbox(bbox);
        
        var m = ab_rect.f_transform_to_inscribe_in_this(ab_text);
        id_el.setAttribute("transform", m);
    }
};

G.SVG.DRAW.f_board = function (obj_board, move_now) {
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

    var final_SVG = "";
    var i = {}, i_style, i_button;

    //draw cells
    for (i = G.F_XY.f00(); i.x < obj_board.sizes.x; i.x++) {
        for (i.y = 0; i.y < obj_board.sizes.y; i.y++) {
            i_style = arr_cell_styles[f_cell_style(i)];
            final_SVG += G.SVG.DRAW.f_cell(i, i_style);
        }
    };

    //draw circles
    for (i = G.F_XY.f00(); i.x < obj_board.sizes.x; i.x++) {
        for (i.y = 0; i.y < obj_board.sizes.y; i.y++) {
            i_style = arr_circle_styles[f_circle_style(i)];
            final_SVG += G.SVG.DRAW.f_circle(i, i_style, G.F_XY.f00());
        }
    };

    for (i_button = 0; i_button < G.LANG.BUTTONS.arr_names.length; i_button++) {
        final_SVG += G.SVG.DRAW.f_one_button_by_name(G.LANG.BUTTONS.arr_names[i_button]);
    };

    return final_SVG;
};
