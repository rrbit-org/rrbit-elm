module Array.Vector 
    exposing 
        (Vector
        , length
        , empty
        , isEmpty
        , initialize
        , fromList
        , toList
        , foldl
        , foldr
        , map
        , filter
        , get
        , nth
        , update
        , take
        , drop
        , slice
        , push
        , append
        , appendAll
        , prepend
        , range
        , times
        , repeat
        , all
        , any
        , insertAt
        , removeAt
        , remove
        , sort
        , member
        , toString
        )

import Native.Rrbit

type Vector itemType = Vec itemType
--Vector : Vector itemType

--type Collection itemType = Vector itemType | List itemType

length : Vector itemType -> Int
length vec = 
    Native.Rrbit.length vec

empty : Vector itemType
empty = 
    Native.Rrbit.empty

isEmpty : Vector itemType -> Bool
isEmpty vec = 
    length vec == 0


initialize : Int -> (Int -> itemType) -> Vector itemType
initialize size fn =
    Native.Rrbit.initialize size fn

--fromListHelp value vec

fromList : List itemType -> Vector itemType
fromList list =
    List.foldl append empty list

toList : Vector itemType -> List itemType
toList vec =
    foldr (::) [] vec

foldl : (a -> b -> b) -> b -> Vector a -> b
foldl fn rrb = 
    Native.Rrbit.foldl fn rrb

foldr : (a -> b -> b) -> b -> Vector a -> b
foldr fn rrb = 
    Native.Rrbit.foldr fn rrb

map : (a -> b) -> Vector a -> Vector b
map fn rrb =
    Native.Rrbit.map fn rrb

filter : (a -> Bool) -> Vector a -> Vector a
filter fn rrb =
    Native.Vector.filter fn rrb

nth : Int -> Vector itemType -> Maybe itemType
nth i vec =
    let
        res = Native.Rrbit.nth i vec Nothing
    in
        case res of
            Nothing ->
                Nothing
            _ ->
                Maybe.Just res


get : Int -> Vector itemType -> Maybe itemType
get i rrb =
    nth i rrb

update : Int -> itemType -> Vector itemType -> Vector itemType
update i value vec =
    Native.Rrbit.update i value vec

take : Int -> Vector itemType -> Vector itemType
take n vec =
    Native.Rrbit.take n vec

drop : Int -> Vector itemType -> Vector itemType
drop n vec =
    Native.Rrbit.drop n vec

slice : Int -> Int -> Vector a -> Vector a
slice from to vec =
    drop from (take (to - 1) vec)

prepend : itemType -> Vector itemType -> Vector itemType
prepend t vec =
    Native.Rrbit.prepend t vec

append : itemType -> Vector itemType -> Vector itemType
append t vec = 
    Native.Rrbit.append t vec

push : itemType -> Vector itemType -> Vector itemType

push = append

appendAll : Vector itemType -> Vector itemType -> Vector itemType
appendAll left right =
    Native.Rrbit.appendAll left right

range : Int -> Int -> Vector itemType
range from to =
    Native.Rrbit.range from to

times : Int -> (Int -> itemType) -> Vector itemType
times end populate =
    timesHelp populate 0 end empty

repeat : Int -> itemType -> Vector itemType
repeat end item =
    timesHelp (\_ -> item) 0 end empty

timesHelp : (Int -> itemType) -> Int -> Int -> Vector itemType -> Vector itemType
timesHelp fn i end list =
    if i >= end then
        list
    else
        let
            value = fn i
            list_ = append value list
        in
            timesHelp fn (i + 1) end list_


all : (itemType -> Bool) -> Vector itemType -> Bool
all fn vec =
    Native.Rrbit.every fn vec

any : (itemType -> Bool) -> Vector itemType -> Bool
any fn vec =
    Native.Rrbit.some fn vec

removeAt : Int -> Vector itemType -> Vector itemType
removeAt i vec =
    Native.Rrbit.removeAt i vec

remove : itemType -> Vector itemType -> Vector itemType
remove value vec =
    Native.Rrbit.remove value vec

insertAt : Int -> Vector itemType -> Vector itemType
insertAt i vec =
    Native.Rrbit.insertAt i vec
    
sort : Vector itemType -> Vector itemType
sort vec =
    Native.Rrbit.sort vec

member : itemType -> Vector itemType -> Bool
member value vec =
    Native.Rrbit.includes value vec

toString : Vector itemType -> String
toString vec =
    "not supported" ++ "...yet"

-- intersperse
-- unique : Vector itemType - > Vector itemType
-- difference : Vector itemType - > Vector itemType
-- flatten : Vector itemType - > Vector itemType
-- flattenDeep : Vector itemType - > Vector itemType


