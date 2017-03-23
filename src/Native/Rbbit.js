var _rbbit_org$rbbit_elm$Native_Rbbit$Native_Rbbit = function(lib) {

    

    function foldl(fn, acc, vec) {}
    function foldr(fn, acc, vec) {}


    function map(fn, vec) 
    {
        return (lib
                .iterator(0, vec.length, vec)
                .reduce(function(list, value) {
                    return lib.appendǃ(fn(value), list);
                }, lib.empty()));
    }

    function filter(fn, vec) 
    {
        return (lib
                .iterator(0, vec.length, vec)
                .reduce(function(list, value) {
                    if (fn(value)) 
                        lib.appendǃ(value, list);

                    return list;
                }, list.empty()))
    }

    function nth(notFound, i, vec) 
    {
        return rrbit.nth(i, vec, notFound);
    }

    function initialize(fn, size) 
    {
        var i = 0;
        var vec = lib.empty();
        while (size > i) 
        {
            lib.appendǃ(fn(i++), vec);
        }
        return vec;
    }

    

    

    return {
        initialize: F2(initialize),
        append: F2(lib.append),
        foldl: F3(foldl),
        foldr: F3(foldr),
        nth: F3(nth),
        map: F2(map),
        iterator: F3(rrbit.iterator),
        take: F2(lib.take),
        drop: F2(lib.drop),
        'of': of,
        length: function (vec) {
            return vec.length;
        }
    }
}(function(librrbit) {
    var lib = {};

    if (typeof window.Symbol == 'undefined') {
        var Symbol = {
            iterator: '@@iterator'
        };
    }

    // while most elm data structure prefer to be plain objects,
    // there a significant performance gain if we new up a constructor 
    // instead of using anonymous objects
    function Vector(len) {
        this.ctor = "Vector"; // 
        this.length = len;
        this.focus = 0;
		this.focusEnd = 0;
		this.focusStart = 0;
		this.focusDepth = 1;
		this.focusRelax = 0;
		this.display0 = [];
		this.display1 = null;
		this.display2 = null;
		this.display3 = null;
		this.display4 = null;
		this.display5 = null;
		this.transient = false;
		this.depth = 1;
    }

    lib.empty = function empty() {
        return new Vector(0);
    }

    lib.of = function of(value) {
        var vec = new Vector(0);
        vec.focusEnd = 1;
        vec.length = 1;
        vec.display0 = [value];
        return vec;
    }

    function fromArray(arr) {}

    function fromIterable(iter) {}

    
    function from(src) {
        if (src instanceof Vector)
            return src;

        if (Array.isArray) 
            return fromArray(arr);

        if (src[Symbol.iterable])
            return fromIterable(src[Symbol.iterable]());
    }
    // ideally, we won't ever serialize this over a port
    // just the the guys in JS land use it directly
    Vector.prototype.from = lib.from = from;

    Vector.prototype[Symbol.iterator] = function() {
        return librrbit.iterator(0, this.length, this);
    }

    return lib;
}(function() {
    // ${setup rbbit here}
}()));