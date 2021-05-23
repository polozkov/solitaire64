//constructor for 2d point x,y
G.F_XY = function (arr_01_with_both_coordinates) {
    this.x = arr_01_with_both_coordinates[0];
    this.y = arr_01_with_both_coordinates[1];
};

G.F_XY.f00 = function () { return new G.F_XY([0, 0]); };

G.F_XY.prototype = {
    //return both coordinates [x,y] as array[0..1]
    f_get_arr: function () { return [this.x, this.y]; },

    f_get_xy_copy: function () { return new G.F_XY([this.x, this.y]); },

    //how many cells has board x*y
    f_get_n: function () { return (this.x * this.y); },

    f_get_int: function () {
        return new G.F_XY([Math.floor(this.x), Math.floor(this.y)]);
    },

    f_get_xy_string: function (n_digits) {
        var round_x_as_string = G.CONVERT.f_n_to_string(this.x, n_digits);
        var round_y_as_string = G.CONVERT.f_n_to_string(this.y, n_digits);
        return new G.F_XY([round_x_as_string, round_y_as_string]);
    },

    //return minimal coordinate of the point
    f_get_min: function () { return Math.min(this.x, this.y); },

    //operation "+": sum of 2 points
    f_add: function (p) { return new G.F_XY([this.x + p.x, this.y + p.y]); },

    //operation "+": sum of 2 points for current point
    f_self_add: function (p) { this.x += p.x; this.y += p.y; },

    //operation "-": subtraction of 2 points
    f_subtract: function (p) { return new G.F_XY([this.x - p.x, this.y - p.y]); },

    //operation "*": miltiplication of coordinates of 2 points
    f_mult: function (p) { return new G.F_XY([this.x * p.x, this.y * p.y]); },

    //operation "/": division of coordinates of 2 points
    f_div: function (p) { return new G.F_XY([this.x / p.x, this.y / p.y]); },

    //operation "*n": multiplication of both coordinates on the same nubmer
    f_scale: function (n) { return new G.F_XY([this.x * n, this.y * n]); },

    f_half: function () { return new G.F_XY([this.x * 0.5, this.y * 0.5]); },

    //is cell p on this game board?
    f_is_on_this_board: function (obj_p) {
        return ((0 <= obj_p.x) && (obj_p.x < this.x) && (0 <= obj_p.y) && (obj_p.y < this.y));
    },

    //are coordinates of points (this and obj_p) equal?
    f_is_equal_to: function (obj_p) {
        return ((this.x == obj_p.x) && (this.y == obj_p.y));
    },

    //cut one side to make gotten ratio
    f_maximize_to_ratio: function (x_div_y) {
        var cut_x = [this.y * x_div_y, this.y];
        var cut_y = [this.x, this.x / x_div_y];
        var is_x_big = (this.x > (x_div_y * this.y));
        var result_xy = new G.F_XY(is_x_big ? cut_x : cut_y);
        result_xy.x_was_big = is_x_big;
        return result_xy;
    },

    //set width and height of the gotten HTML-element
    f_set_element_style: function (gotten_html_element) {
        gotten_html_element.style.width = Math.floor(this.x) + "px";
        gotten_html_element.style.height = Math.floor(this.y) + "px";
    }
};

//4 ortogonal directions Up, Right, Down, Left: URDL
G.F_XY.arr_URDL = [new G.F_XY([0, -1]), new G.F_XY([1, 0]), new G.F_XY([0, 1]), new G.F_XY([-1, 0])];