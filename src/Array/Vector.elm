module Array.Vector 
    exposing 
        (Vector
        , empty
        , initialize
        , foldl
        , foldr
        , map
        , filter
        , get
        , set
        , take
        , drop
        )

import Native.Rbbit

type Vector T = Vector T

length : Vector T -> Int
length vec = 
    Native.Rbbit.length vec

empty : Vector T
empty = 
    Native.Rbbit.empty

isEmpty : Vector T -> Bool
isEmpty vec = 
    length vec == 0


initialize : (Int -> T) -> Int -> Vector T
initialize fn size = 
    Native.Rbbit.initialize fn size


fromList : List T -> Vector T
fromList list =
    empty


foldl : (a -> b -> b) -> b -> Vector a -> b
foldl fn rrb = 
    Native.Rbbit.foldl fn rrb

foldr : (a -> b -> b) -> b -> Vector a -> b
foldr fn rrb = 
    Native.Rbbit.foldr fn rrb

map : (a -> b) -> Vector a -> Vector b
map fn rrb =
    Native.Rrbit.map fn rrb

filter : (a -> Bool) -> Vector a -> Vector b
filter fn rrb =
    Native.Vector.filter fn rrb

_nth : Int -> Vector T -> Maybe T
_nth = Native.Rbbit.nth Nothing

get : Int -> Rbbit T -> Maybe T
get i rrb =
    _nth i rrb

set : Int -> T -> Vector T -> Vector T
set i value rrb =
    Native.Rbbit.update i value rrb

take : Int -> Vector T -> Vector T
take n rrb =
    Native.Rbbit.take n rrb

drop : Int -> Vector T -> Vector T
drop n rrb =
    Native.Rbbit.drop n rrb

append : T -> Vector T -> Vector T
append t vec = 
    Native.Rbbit.append t vec

appendAll : Vector T -> Vector T | List T -> Vector T
appendAll vec tail = 
    case tail of 
        List ->
            _appendAll vec (fromList tail)
        Vector ->
            _appendAll vec tail


_appendAll : Vector T -> Vector T -> Vector T
_appendAll left right = 
    Native.Rbbit.appendAll left right