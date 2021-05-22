G.EL = {
    //element above SVG board with puzzle_name
    DIV_INFO: document.getElementById("idDivTextPuzzleName"),

    f_min_or_max_in_array: function (a, name_min_or_max_default_min) {
        //if name_min_or_max_default_min is undefined, work with "min"
        var name_min_or_max = name_min_or_max_default_min || "min";
        var n = (name_min_or_max === "max") ? -Infinity : Infinity;

        for (var i = 0; i < a.length; i++) {
            //only for defined and non-zero and non-null
            if (a[i]) {
                n = Math[name_min_or_max](n, a[i]);
            }
        };
        return n;
    },

    //object (x,y) as width and heigth of the BODY
    f_body_wh: function () {
        var arr_h = [
            document.body.scrollHeight, document.documentElement.scrollHeight,
            document.body.offsetHeight, document.documentElement.offsetHeight,
            document.body.clientHeight, document.documentElement.clientHeight];
        var arr_w = [
            document.body.scrollWidth, document.documentElement.scrollWidth,
            document.body.offsetWidth, document.documentElement.offsetWidth,
            document.body.clientWidth, document.documentElement.clientWidth];
        var wh = [G.EL.f_min_or_max_in_array(arr_w), G.EL.f_min_or_max_in_array(arr_h)];
        return (new G.F_XY(wh));
    },
/*
    //if has no property .PageX, pageY, generate this property
    f_fix_page_xy: function (e) {
        if (e.pageX == null && e.clientX != null) { //if has no pageX..
            var html = document.documentElement;
            var body = document.body;

            e.pageX = e.clientX + (html.scrollLeft || body && body.scrollLeft || 0);
            e.pageX -= html.clientLeft || 0;

            e.pageY = e.clientY + (html.scrollTop || body && body.scrollTop || 0);
            e.pageY -= html.clientTop || 0;
        }
    },*/

    f_window_scroll: function () {
        var x = document.body.scrollLeft || document.documentElement.scrollLeft || 0;
        var y = document.body.scrollTop || document.documentElement.scrollTop || 0;
        return (new G.F_XY([x,y]));
    },

    //folifill for calculating LEFT-TOP corner's coordinate (x,y) of the element on the VISIBLE window
    f_corner_coordinates_visible: function (elem) {
        //calculate (left, top) corner for outdated browsers
        function getOffsetSum(elem) {
            var top = 0, left = 0;
            while (elem) {
                top = top + parseInt(elem.offsetTop)
                left = left + parseInt(elem.offsetLeft)
                elem = elem.offsetParent
            }

            return new G.F_XY([left, top]);
        };

        //calculate (left, top) corner for not-outdated (other) browsers by elem.getBoundingClientRect();
        function getOffsetRect(elem) {
            var box = elem.getBoundingClientRect();
            var body = document.body;
            var docElem = document.documentElement;

            var scrollTop = window.pageYOffset || docElem.scrollTop || body.scrollTop;
            var scrollLeft = window.pageXOffset || docElem.scrollLeft || body.scrollLeft;

            var clientTop = docElem.clientTop || body.clientTop || 0;
            var clientLeft = docElem.clientLeft || body.clientLeft || 0;

            var top = box.top + scrollTop - clientTop;
            var left = box.left + scrollLeft - clientLeft;

            return new G.F_XY([Math.round(left), Math.round(top)]);
        };

        return ((elem.getBoundingClientRect) ? getOffsetRect(elem) : getOffsetSum(elem));
    }
};