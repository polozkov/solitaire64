G.F_MOVE = function (obj_from, obj_to, obj_food) {
    //start cell of the move
    this.a = obj_from;

    //final cell of the move
    this.b = obj_to;

    //deleted (captured) circle checker piece
    this.food = obj_food;
};

G.F_MOVE.prototype = {
    //renew matrix by doing move on it
    f_do_move: function (m) {
        m[this.a.y][this.a.x] = 0;
        m[this.food.y][this.food.x] = 0;
        m[this.b.y][this.b.x] = 1;
    },

    //renew matrix by undoing move on it
    f_undo_move: function (m) {
        m[this.a.y][this.a.x] = 1;
        m[this.food.y][this.food.x] = 1;
        m[this.b.y][this.b.x] = 0;
    },

    //deep copy of the move
    f_get_move_copy: function () {
        return new G.F_MOVE(this.a.f_get_xy_copy(), this.b.f_get_xy_copy(), this.food.f_get_xy_copy());
    },
};