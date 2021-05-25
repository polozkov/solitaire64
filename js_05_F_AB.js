//constructor for rectangle by points (a,b)
G.F_AB = function (gotten_a, gotten_b) {
    this.a = gotten_a.f_get_xy_copy();
    this.b = gotten_b.f_get_xy_copy();
    //if (gotten_b.x + gotten_b.y) {debugger;}
};

G.F_AB.f_00_00 = function () {return (new G.F_AB(G.F_XY.f00(), G.F_XY.f00())); };

G.F_AB.f_by_a_and_wh = function (a, wh) { return new G.F_AB(a, a.f_add(wh)); };

G.F_AB.f_by_bbox = function (bbox) {
    var a = new G.F_XY([bbox.x, bbox.y]);
    var b = new G.F_XY([bbox.width, bbox.height]);
    return G.F_AB.f_by_a_and_wh(a, b);
};

G.F_AB.prototype = {
    f_get_wh: function () { return this.b.f_subtract(this.a); },
    f_cut_wh: function (wh) { return new G.F_AB(this.a.f_add(wh), this.b.f_subtract(wh)); },

    f_cut_short_side_ratio: function (n_ratio) {
        var n_cut = this.f_get_wh().f_get_min() * n_ratio;
        var wh = new G.F_XY([n_cut, n_cut]);
        return this.f_cut_wh(wh);
    },
    f_get_center: function () { return this.a.f_add(this.b).f_half(); },

    f_get_cell_area: function (nxy, arr_sizes) {
        var obj_sizes = new G.F_XY(arr_sizes);
        var cell_wh = this.f_get_wh().f_div(obj_sizes);
        var cell_a = this.a.f_add(cell_wh.f_mult(nxy));
        return G.F_AB.f_by_a_and_wh(cell_a, cell_wh);
    },

    f_transform_to_inscribe_in_this: function (ab_text) {
        var rect_xy = this.f_cut_wh(new G.F_XY([this.f_get_wh().x * G.SETS.button_cut / 2, 0]));
        var mult_xy = rect_xy.f_get_wh().f_div(ab_text.f_get_wh()).f_get_press_not_more(G.SETS.RATIO.press_text_max);

        var dxy = rect_xy.f_get_center().f_subtract(ab_text.f_get_center().f_mult(mult_xy)).f_get_xy_string();
        var mxy = mult_xy.f_get_xy_string();

        var m = "matrix(" + mxy.x + ",0,0," + mxy.y + "," + dxy.x + ',' + dxy.y + ")";
        return m;
    },

    //is pressed pixel on board area
    f_is_on_area: function (pxy) {
        var this_wh = this.f_get_wh();
        var obj_p = pxy.f_subtract(this.a);
        return ((0 <= obj_p.x) && (obj_p.x < this_wh.x) && (0 <= obj_p.y) && (obj_p.y < this_wh.y));
    }
};