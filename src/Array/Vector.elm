module Array.Vector 
    exposing 
        (Vector
        , length
        , empty
        , isEmpty
        , initialize
        , fromList
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

type Vector itemType = Vector itemType

length : Vector itemType -> Int
length vec = 
    Native.Rbbit.length vec

empty : Vector itemType
empty = 
    Native.Rbbit.empty

isEmpty : Vector itemType -> Bool
isEmpty vec = 
    length vec == 0


initialize : (Int -> itemType) -> Int -> Vector itemType
initialize fn size = 
    Native.Rbbit.initialize fn size


fromList : List itemType -> Vector itemType
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

filter : (a -> Bool) -> Vector a -> Vector a
filter fn rrb =
    Native.Vector.filter fn rrb

nth : Int -> Vector itemType -> Maybe itemType
nth i vec =
    let
        res = Native.Rbbit.nth i vec Nothing
    in
        case res of
            Nothing ->
                Nothing
            _ ->
                Maybe.Just res


get : Int -> Vector itemType -> Maybe itemType
get i rrb =
    nth i rrb

set : Int -> itemType -> Vector itemType -> Vector itemType
set i value rrb =
    Native.Rbbit.update i value rrb

take : Int -> Vector itemType -> Vector itemType
take n rrb =
    Native.Rbbit.take n rrb

drop : Int -> Vector itemType -> Vector itemType
drop n rrb =
    Native.Rbbit.drop n rrb

append : itemType -> Vector itemType -> Vector itemType
append t vec = 
    Native.Rbbit.append t vec

appendAll : Vector itemType -> Vector itemType | List itemType -> Vector itemType
appendAll vec tail = 
    case tail of 
        List ->
            appendAllDirect vec (fromList tail)
        Vector ->
            appendAllDirect vec tail


appendAllDirect : Vector itemType -> Vector itemType -> Vector itemType
appendAllDirect left right =
    Native.Rbbit.appendAll left right

-- range : Int -> Int -> Vector itemType
-- range from to =
-- times : Int -> (Int -> itemType) -> Vector itemType
times end populate =
	let
		help i end fn list =
			if i < end then
				help (i + 1) end (append (fn i) list)
			else
				list
	in
		help 0 end populate empty

-- every
-- any
-- sort
-- intersperse
-- unique : Vector itemType - > Vector itemType
-- difference : Vector itemType - > Vector itemType
-- flatten : Vector itemType - > Vector itemType
-- flattenDeep : Vector itemType - > Vector itemType
-- findIndexOf : itemType -> Vector itemType -> Maybe Bool
-- mapAndFlatten : (T -> List itemType | Vector itemType) -> Vector itemType -> Vector
-- mapAndFlatten fn vec =
    -- Native.Rrbit.reduce (mapAndFlatten fn) empty

-- _mapAndFlatten : (T -> List itemType | Vector itemType) -> Vector itemType -> itemType -> Vector itemType
-- _mapAndFlatten fn acc value =
    -- case value of 
        -- List ->

