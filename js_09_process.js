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

    //new task for solving
    f_start_new_game: function () {
        G.PROCESS.main_board = new G.F_BOARD(G.SETS.GAME_BOARD.sizes);
        G.PROCESS.arr_solution = G.PROCESS.main_board.f_put_with_back_solution(G.SETS.GAME_BOARD.n_pieces);

        G.SVG.f_maximize_game_area();
        G.SVG.MAIN.innerHTML = G.SVG.DRAW.f_board(G.PROCESS.main_board, G.PROCESS.move_now, 0);
    },

    //start doing new move by selecting cell with legal moves
    f_play_move_new: function (xy) {
        if (G.PROCESS.main_board.f_moves_from_cell(xy).length == 0) { return; }
        //in the move process select start cell "a"
        G.PROCESS.move_now = new G.F_MOVE(xy, null, null);
        G.SVG.MAIN.innerHTML = G.SVG.DRAW.f_board(G.PROCESS.main_board, G.PROCESS.move_now, 0);
    },

    f_play_move_continue: function (xy) {
        //when you want to do another circle move and circle has legal moves
        if (G.PROCESS.main_board.f_moves_from_cell(xy).length > 0) { G.PROCESS.f_play_move_new(xy); return; };
        var move_now = G.PROCESS.main_board.f_has_move_a_b(G.PROCESS.move_now.a, xy);
        if (move_now) {
            move_now.f_do_move(G.PROCESS.main_board.board);

            var can_continue = (G.PROCESS.main_board.f_moves_from_cell(xy).length > 0);
            G.PROCESS.move_now = new G.F_MOVE((can_continue ? xy : null), null, null);
            G.SVG.MAIN.innerHTML = G.SVG.DRAW.f_board(G.PROCESS.main_board, G.PROCESS.move_now, 0);
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
        //pressed not cell, but board's border, that does not belong to any cell 
        if (!cell_nx_ny) { return; }

        G.PROCESS.f_play_cell_xy(cell_nx_ny);
    },

    f_resize_window: function () {
        G.SVG.f_maximize_game_area();
        G.SVG.MAIN.innerHTML = G.SVG.DRAW.f_board(G.PROCESS.main_board, G.PROCESS.move_now, 0);
    }
};

G.SVG.MAIN.addEventListener("mousedown", G.EVENT.f_click_on_svg, false);

window.onresize = G.EVENT.f_resize_window;
window.onorientationchange = G.EVENT.f_resize_window;

G.PROCESS.f_start_new_game();
