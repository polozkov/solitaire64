//constructor for rectangle by points (a,b)
G.F_AB = function (gotten_a, gotten_b) {
    this.a = gotten_a.f_get_xy_copy();
    this.b = gotten_b.f_get_xy_copy();
    //if (gotten_b.x + gotten_b.y) {debugger;}
};

G.F_AB.f_by_a_and_wh = function (a, wh) { return new G.F_AB(a, a.f_add(wh)); };

G.F_AB.prototype = {
    f_get_wh: function () { return this.b.f_subtract(this.a); },
    f_cut_wh: function (wh) { return new G.F_AB(this.a.f_add(wh), this.b.f_subtract(wh)); },
    f_get_center: function () { return this.a.f_add(this.b).f_half(); },

    f_get_cell_area: function (nxy, arr_sizes) {
        var obj_sizes = new G.F_XY(arr_sizes);
        var cell_wh = this.f_get_wh().f_div(obj_sizes);
        var cell_a = this.a.f_add(cell_wh.f_mult(nxy));
        return G.F_AB.f_by_a_and_wh(cell_a, cell_wh);
    }
};