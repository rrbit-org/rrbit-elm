module Main exposing (main)

import Benchmark.Runner exposing (BenchmarkProgram, program)
import Benchmark exposing (Benchmark, describe, benchmark1, benchmark2, benchmark3)
import Array.Vector as Vector
import Array


main : BenchmarkProgram
main =
    program <| suite 10000


suite : Int -> Benchmark
suite n =
    let
        sampleVector =
            Vector.initialize n identity

        sampleArray =
            Array.initialize n identity

        sampleList =
            List.range 1 n

        countFn acc _ =
            acc + 1

        isEven n =
            n % 2 == 0
    in
        describe ("Array (" ++ toString n ++ " elements)")
            [
            Benchmark.compare "initialize"
                (benchmark2 "Array" Array.initialize n identity)
                (benchmark2 "Vector" Vector.initialize n identity)
            , Benchmark.compare "get"
                (benchmark2 "Array" Array.get 5 sampleArray)
                (benchmark2 "Vector" Vector.get 5 sampleVector)
            , Benchmark.compare "update"
                (benchmark3 "Array" Array.set 7 5 sampleArray)
                (benchmark3 "Vector" Vector.update 7 5 sampleVector)
            , Benchmark.compare "push"
                (benchmark2 "Array" Array.push 5 sampleArray)
                (benchmark2 "Vector" Vector.push 5 sampleVector)
            , Benchmark.compare "appendAll"
                (benchmark2 "Array" Array.append sampleArray sampleArray)
                (benchmark2 "Vector" Vector.appendAll sampleVector sampleVector)
            , Benchmark.compare "appendAll (small)"
                (benchmark2 "Array" Array.append sampleArray (Array.initialize 31 identity))
                (benchmark2 "Vector" Vector.appendAll sampleVector (Vector.initialize 31 identity))
--            , Benchmark.compare "slice (beginning, small)"
--                (benchmark3 "Array" Array.slice 3 n sampleArray)
--                (benchmark3 "Vector" Vector.slice 3 n sampleVector)
--            , Benchmark.compare "slice (beginning, big)"
--                (benchmark3 "Array" Array.slice (n // 2) n sampleArray)
--                (benchmark3 "Vector" Vector.slice (n // 2) n sampleVector)
--            , Benchmark.compare "slice (end, small)"
--                (benchmark3 "Array" Array.slice 0 -3 sampleArray)
--                (benchmark3 "Vector" Vector.slice 0 -3 sampleVector)
--            , Benchmark.compare "slice (end, big)"
--                (benchmark3 "Array" Array.slice 0 (n // 2) sampleArray)
--                (benchmark3 "Vector" Vector.slice 0 (n // 2) sampleVector)
--            , Benchmark.compare "slice (both, small)"
--                (benchmark3 "Array" Array.slice 3 -3 sampleArray)
--                (benchmark3 "Vector" Vector.slice 3 -3 sampleVector)
--            , Benchmark.compare "slice (both, big)"
--                (benchmark3 "Array" Array.slice ((n // 2) - 10) (n // 2) sampleArray)
--                (benchmark3 "Vector" Vector.slice ((n // 2) - 10) (n // 2) sampleVector)
            , Benchmark.compare "foldl"
                (benchmark3 "Array" Array.foldl countFn 0 sampleArray)
                (benchmark3 "Vector" Vector.foldl countFn 0 sampleVector)
            , Benchmark.compare "foldr"
                (benchmark3 "Array" Array.foldr countFn 0 sampleArray)
                (benchmark3 "Vector" Vector.foldr countFn 0 sampleVector)
            , Benchmark.compare "filter"
                (benchmark2 "Array" Array.filter isEven sampleArray)
                (benchmark2 "Vector" Vector.filter isEven sampleVector)
            , Benchmark.compare "map"
                (benchmark2 "Array" Array.map identity sampleArray)
                (benchmark2 "Vector" Vector.map identity sampleVector)
            , Benchmark.compare "toList"
                (benchmark1 "Array" Array.toList sampleArray)
                (benchmark1 "Vector" Vector.toList sampleVector)
            , Benchmark.compare "fromList"
                (benchmark1 "Array" Array.fromList sampleList)
                (benchmark1 "Vector" Vector.fromList sampleList)
            , Benchmark.compare "toString"
                (benchmark1 "Array" toString sampleArray)
                (benchmark1 "Vector" Vector.toString sampleVector)
            , Benchmark.compare "= (equal, best case)"
                (benchmark2 "Array" (==) sampleArray (Array.set 5 5 sampleArray))
                (benchmark2 "Vector" (==) sampleVector (Vector.update 5 5 sampleVector))
            , Benchmark.compare "= (equal, worst case)"
                (benchmark2 "Array" (==) sampleArray (Array.map identity sampleArray))
                (benchmark2 "Vector" (==) sampleVector (Vector.map identity sampleVector))
            , Benchmark.compare "= (not equal)"
                (benchmark2 "Array" (==) sampleArray (Array.set 5 7 sampleArray))
                (benchmark2 "Vector" (==) sampleVector (Vector.update 5 7 sampleVector))
--            , Benchmark.compare "indexedMap"
--                (benchmark2 "Array" Array.indexedMap (,) sampleArray)
--                (benchmark2 "Vector" Vector.indexedMap (,) sampleVector)
--            , Benchmark.compare "indexedList"
--                (benchmark1 "Array" Array.toIndexedList sampleArray)
--                (benchmark1 "Vector" Vector.toIndexedList sampleVector)
            ]