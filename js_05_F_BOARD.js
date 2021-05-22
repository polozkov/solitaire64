G.F_BOARD = function (arr_01_nx_columns_ny_rows) {
    //obgect (x,y) as board sizes
    this.sizes = new G.F_XY(arr_01_nx_columns_ny_rows);

    //cells as empty matrix [y rows, x columns]
    this.board = G.GENERATE.f_matrix(function f(y, x) { return 0; }, this.sizes.y, this.sizes.x);
};

G.F_BOARD.prototype = {
    //is cell in the game board (or out of the game board?)
    f_is_on_board: function (p01) { return ((0 <= p01[0]) && (p01[0] < this.x) && (0 <= p01[1]) && (p01[1] < this.y)); },

    //return value of cell (p1 as y, p0 as x) on the game board
    f_get_untested_xy: function (p01) { return this.board[p01[1]][p01[0]]; },

    //return value of cell (p.y, p.x) on the game board of G.OUT_OF_BOARD
    f_get_cell_xy: function (p01) { return this.f_is_on_board(p01) ? this.f_get_untested_xy(p01) : G.OUT_OF_BOARD; },

    //return cell coord as array [0..1] by integer number [0 .. this.sizes.x * this.sizes.y - 1]
    f_n_to_pxy: function (n) { var x = n % this.sizes.x; return [x, (n - x) / this.sizes.x]; },

    //set the new valueof the cell (p.y, p.x)
    f_set_cell_xy: function (p01, new_value) { this.board[p01[1]][p01[0]] = new_value; },

    //put zeros on each cell
    f_clear_board: function () {
        this.board = G.GENERATE.f_matrix(function f(y, x) { return 0; }, this.sizes.y, this.sizes.x);
    },

    //This amount of circle pieces will we put on the game board randomly. For example: 12 checkers.
    f_put_pieces_randomly: function (n_circles) {
        this.f_clear_board();

        //random permutation of all cells
        var perm = G.GENERATE.f_random_perm(this.sizes.f_get_n());
        for (var i_circle = 0; i_circle < n_circles; i_circle++) {
            //put piece on the random cell
            this.f_set_cell_xy(this.f_n_to_pxy(perm[i_circle]), 1);
        };
    },
};

//all legal moves from the cell a_xy
G.F_BOARD.prototype.f_moves_from_cell = function (a_xy) {
    if (this.f_get_untested_xy(a_xy.f_get_arr()) === 0) { return []; };
    var arr_moves = [];
    var obj_sizes = this.sizes;

    //generate legal moves from the cell a_xy (checked, that occupied) 
    function f_generate_by_cell_and_dir(m, obj_delta) {
        //next_cell_xy must be on the board
        var food_xy = a_xy.f_add(obj_delta);
        //stop, when out of board or food is occupied
        while (obj_sizes.f_is_on_this_board(food_xy) && (m[food_xy.y][food_xy.x] === 0)) {
            food_xy.f_self_add(obj_delta);
        }
        //checking, that food is ok
        if (obj_sizes.f_is_on_this_board(food_xy) && (m[food_xy.y][food_xy.x] === 1)) {
            b_xy = food_xy.f_add(obj_delta);
            //the next cell after food must be on the board and free
            if (obj_sizes.f_is_on_this_board(b_xy) && (m[b_xy.y][b_xy.x] === 0)) {
                arr_moves.push((new G.F_MOVE(a_xy, b_xy, food_xy)).f_get_move_copy());
            }
        }
    };

    for (var i_dir = 0; i_dir < 4; i_dir++) {
        //push legal moves on the legal_moves_array on Up,Right,Down,Left
        f_generate_by_cell_and_dir(this.board, G.F_XY.arr_URDL[i_dir]);
    };
    return arr_moves;
};

G.F_BOARD.prototype.f_has_move_a_b = function (a_xy, b_xy) {
    var arr_moves = this.f_moves_from_cell(a_xy);
    
    for (var i = 0; i < arr_moves.length; i++) {
        if (arr_moves[i].b.f_is_equal_to(b_xy)) {
            return arr_moves[i];
        }
    }
    return false;
};

//put n_circles from the final position, where (n_circles > 1)
G.F_BOARD.prototype.f_put_with_back_solution = function (n_circles) {
    //solution from task to the last circle piece
    var solution_as_arr_of_moves = [];
    this.f_clear_board();

    //random coordinate of the last circle piece
    var random_xy = this.f_n_to_pxy(Math.floor(Math.random() * this.sizes.f_get_n()));
    this.f_set_cell_xy(random_xy, 1);

    //add extra move to the gotten matrix position "m"
    function f_generate_legal_back_moves(m, obj_sizes) {
        //all legal moves to the current position
        var arr_moves = [];

        //owner of the cell (x,y) - occupied: 1, free: 0
        function f_value(obj_xy) {
            return m[obj_xy.y][obj_xy.x];
        }
        //free, when cell is on the board and un_occupied (free)
        function f_is_free(obj_xy) {
            return (obj_sizes.f_is_on_this_board(obj_xy) && (f_value(obj_xy) === 0));
        }

        //generate legal moves to the gotten cell (checked, that occupied) on the delta direction
        function f_generate_by_cell_and_dir(obj_cell, obj_delta) {
            //next_cell_xy must be free for the legal back move
            var food_cell_xy = obj_cell.f_add(obj_delta);
            //food's cell must be free to have opportunity add circle for capturing
            if (!f_is_free(food_cell_xy)) { return; };

            //i_cell_xy must be free for the legal back move
            for (var i_xy = food_cell_xy.f_add(obj_delta); f_is_free(i_xy); i_xy.f_self_add(obj_delta)) {
                //push legal move to the legal_moves_array
                arr_moves.push((new G.F_MOVE(i_xy, obj_cell, food_cell_xy)).f_get_move_copy());
            }
        };

        //for each cell
        for (var i_xy = new G.F_XY([0, 0]); i_xy.x < obj_sizes.x; i_xy.x++) {
            for (i_xy.y = 0; i_xy.y < obj_sizes.y; i_xy.y++) {
                //check, that it is occupied
                if (f_value(i_xy) === 1) {
                    //...and for all 4 ortogonal directions
                    for (var i_dir = 0; i_dir < 4; i_dir++) {
                        //push legal moves on the legal_moves_array on Up,Right,Down,Left
                        f_generate_by_cell_and_dir(i_xy, G.F_XY.arr_URDL[i_dir]);
                    }
                }
            }
        };
        //all legal moves for all occupied cells and for each URDL directions
        return arr_moves;
    };

    //add other n-1 circles on the game board
    for (; n_circles > 1; n_circles--) {
        var arr_moves = f_generate_legal_back_moves(this.board, this.sizes);
        var n_random = Math.floor(Math.random() * arr_moves.length);
        //random move
        var m = arr_moves[n_random];

        //add random move at the beginning of the solution
        solution_as_arr_of_moves.unshift(m.f_get_move_copy());
        //renew position by creating solution from the end_game
        m.f_undo_move(this.board);
    };

    return solution_as_arr_of_moves;
};