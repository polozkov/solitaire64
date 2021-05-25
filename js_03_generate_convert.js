G.GENERATE = {
    //return array with defined length by function-generator
    f_array: function (f_element_i, length_of_array) {
        var arr_result = [];
        for (var i = 0; i < length_of_array; i++) {
            arr_result.push(f_element_i(i));
        };
        return arr_result;
    },

    //random permutation by Fisher–Yates shuffle 
    f_random_perm: function (n) {
        var a = G.GENERATE.f_array(function (element_index) {return element_index}, n);
        var temp, i, j;
        for (i = n - 1; i > 0; i--) {
            //j <- random number 0 <= j <= i
            j = Math.floor(Math.random() * (i + 1));
            //swap a[i] and a[j]
            temp = a[i]; a[i] = a[j]; a[j] = temp;
        };
        return a;
    },

    //return 2-dimentional array by function-generator
    f_matrix: function (f_element_i_main_j_inner, get_size_main, get_size_inner) {
        var matrix_result = [], i;
        //function will be used as parametr in G.f_generate_array
        function f_element_by_index(n_inner) { return f_element_i_main_j_inner(i, n_inner); };

        for (i = 0; i < get_size_main; i++) {
            matrix_result.push(G.GENERATE.f_array(f_element_by_index, get_size_inner));
        };
        return matrix_result;
    },
};

G.CONVERT = {
    //delete zeros at the end of decimal number, that will be writtens as string
    f_n_to_string: function (r, n_digits) {
        //special case is when real nubmer is integer
        if (r == r.toFixed(0)) { return (r + '') };

        //if n_digits is UNDEFINED default value = 2;
        n_digits = (n_digits !== undefined) ? n_digits : 2;

        //s is the string (maybe with fanal zeros)
        var s = r.toFixed(n_digits) + '';

        //delete final zeros of non-integer decimal fraction
        while (s.slice(-1) === '0') { s = s.slice(0, -1) };

        //check, that it is no final dot
        if (s.slice(-1) === '.') { s = s.slice(0, -1) };

        //final result will be string without unUsed final zeros (3.250000 -> 3.25)
        return s;
    },

    //convert (this.x,this.y) in one string with "," separator
    f_xy_to_string: function (arr_coord, accuracy_to_n_decimal_signs) {
        var str_x = G.CONVERT.f_n_to_string(arr_coord[0], accuracy_to_n_decimal_signs);
        var str_y = G.CONVERT.f_n_to_string(arr_coord[1], accuracy_to_n_decimal_signs);
        return (str_x + ',' + str_y);
    },

    //ID for cell (x,y) on the game board
    f_xy_to_cell_id: function (arr_x0_y1) {
        return ("ID_CELL_" + arr_x0_y1[0] + "_" + arr_x0_y1[1]);
    },

    //ID for the circle "n" on the game board
    f_xy_to_circle_id: function (arr_x0_y1) {
        return ("ID_CIRCLE_" + arr_x0_y1[0] + "_" + arr_x0_y1[1]);
    },

    //button name for text or rect
    f_name_to_id: function (gotten_button_name, rect_or_text) {
        return ("ID_" + rect_or_text + "_" + gotten_button_name);
    }
};

