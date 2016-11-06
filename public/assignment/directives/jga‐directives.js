(function () {
    angular
        .module("jgaDirectives", [])
        .directive("jgaSortable", jgaSortable);

    function jgaSortable() {
        $(".jga-sortable").sortable();
        return{
        }
    }
})();