G.PROCESS = {
    //object of main game board
    main_board: {},

    //how to solve current task from the beginning
    arr_solution: [],
    //all moves, that we made
    arr_moves: [],

    //which cells do we press?
    move_now: new G.F_MOVE(null, null, null),
    //will be used for animation
    move_animation_timing: 0,

    f_renew_inner_svg: function () {
        var n_game_over = G.PROCESS.main_board.f_is_game_over();
        G.EL.DIV_INFO.innerHTML = G.LANG.f_n_to_info(n_game_over);

        G.SVG.f_maximize_game_area();
        G.SVG.MAIN.innerHTML = G.SVG.DRAW.f_board(G.PROCESS.main_board, G.PROCESS.move_now);
        for (var i_button = 0; i_button < G.LANG.BUTTONS.arr_names.length; i_button++) {
            G.SVG.DRAW.f_inscribe_text_in_button(G.LANG.BUTTONS.arr_names[i_button]);
        }
    },

    //new task for solving
    f_start_new_game: function () {
        G.PROCESS.main_board = new G.F_BOARD(G.SETS.GAME_BOARD.sizes);
        G.PROCESS.arr_moves = [];
        G.PROCESS.move_now = new G.F_MOVE(null, null, null);

        G.PROCESS.arr_solution = G.PROCESS.main_board.f_put_with_back_solution(G.SETS.GAME_BOARD.n_pieces);
        G.PROCESS.f_renew_inner_svg();
    },

    //start doing new move by selecting cell with legal moves
    f_play_move_new: function (xy) {
        if (G.PROCESS.main_board.f_moves_from_cell(xy).length == 0) { return; }
        //in the move process select start cell "a"
        G.PROCESS.move_now = new G.F_MOVE(xy, null, null);
        G.PROCESS.f_renew_inner_svg();
    },

    f_play_move_continue: function (xy) {
        //when you want to do another circle move and circle has legal moves
        if (G.PROCESS.main_board.f_moves_from_cell(xy).length > 0) { G.PROCESS.f_play_move_new(xy); return; };
        //move from a to b is legal; else it will be null
        var move_now = G.PROCESS.main_board.f_has_move_a_b(G.PROCESS.move_now.a, xy);

        if (move_now) {
            move_now.f_do_move(G.PROCESS.main_board.board);
            G.PROCESS.arr_moves.push(move_now.f_get_move_copy());

            //can you do next move with current (active) circle?
            var can_continue = (G.PROCESS.main_board.f_moves_from_cell(xy).length > 0);
            G.PROCESS.move_now = new G.F_MOVE((can_continue ? xy : null), null, null);

            G.PROCESS.f_renew_inner_svg();
        }
    },

    f_play_move_in_process: function (xy) {},

    //xy is the integer indexes of the pressed cell
    f_play_cell_xy: function (xy) {
        if (G.PROCESS.move_now.a && G.PROCESS.move_now.b) { G.PROCESS.f_play_move_in_process(xy); return; }
        if (G.PROCESS.move_now.a) { G.PROCESS.f_play_move_continue(xy); return; }
        G.PROCESS.f_play_move_new(xy);
    }
};


G.PROCESS.PRESS_BUTTON = {
    f_game_new: function () {G.PROCESS.f_start_new_game(); },
    f_game_restart: function () {
        for (var i = G.PROCESS.arr_moves.length-1; i >= 0; i--) {
            G.PROCESS.arr_moves[i].f_undo_move(G.PROCESS.main_board.board);
        };
        G.PROCESS.arr_moves = [];
        G.PROCESS.move_now = new G.F_MOVE(null, null, null);
        G.PROCESS.f_renew_inner_svg();
    },
    f_move_back: function () {
        if (G.PROCESS.arr_moves.length === 0) {return; }
        var last_move = G.PROCESS.arr_moves.pop();
        last_move.f_undo_move(G.PROCESS.main_board.board);
        G.PROCESS.move_now = new G.F_MOVE(last_move.a, null, null);
        G.PROCESS.f_renew_inner_svg();
    },
    f_move_forward: function () {}
};

G.EVENT = {
    f_click_on_svg: function (clicked_event) {
        //svg (left,top) does not change by scrolling
        var page_coord_of_svg_static = G.EL.f_corner_coordinates_visible(G.SVG.MAIN);
        var page_scroll = G.EL.f_window_scroll();
        //when top of the svg-element is out of window, y-coordinate is negative
        var window_coord_svg = page_coord_of_svg_static.f_subtract(page_scroll);

        //clientX, clientY on the visible window
        var click_on_window = new G.F_XY([clicked_event.clientX, clicked_event.clientY]);
        //pressed pixel from the left top corner of SVG
        var click_svg_local = click_on_window.f_subtract(window_coord_svg);

        //detect, what cell is pressed
        var cell_nx_ny = G.SVG.f_cell_by_pxy(click_svg_local);
        //pressed not cell, but outside board's border, that does not belong to any cell 
        if (cell_nx_ny) {G.PROCESS.f_play_cell_xy(cell_nx_ny); return; }
        
        var button_name_pressed = G.SVG.f_button_by_pxy(click_svg_local);
        //if not null, button is detected
        if (button_name_pressed) {G.PROCESS.PRESS_BUTTON["f_" + button_name_pressed](); return; };
    },

    f_resize_window: function () {
        G.PROCESS.f_renew_inner_svg();
    }
};

G.SVG.MAIN.addEventListener("mousedown", G.EVENT.f_click_on_svg, false);

window.onresize = G.EVENT.f_resize_window;
window.onorientationchange = G.EVENT.f_resize_window;

G.PROCESS.f_start_new_game();
