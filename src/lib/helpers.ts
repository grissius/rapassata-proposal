import {
    AnyShapeTomato,
    ArrayShapedTomato,
    AtomShapedTomato,
    ObjectShapedTomato,
    RecordShapedTomato,
    Tomato,
    TomatoShape,
} from './tomatos';

// T => T | ?T
export type ProcessRequired<T, R> = R extends true ? T : T | undefined;

// Tomato<I, R, S> => I OR ?I based on R
type UnwrapTomato<T> = T extends Tomato<infer I, infer R, infer S> ? ProcessRequired<I, R> : T;

// Tomato<I, R, S> => S
type UnwrapTomatoShape<T> = T extends Tomato<infer T, infer R, infer S> ? S : T;

// Tomato<I, R, S> => Value (recursive)
export type TomatoToValues<T, U = UnwrapTomato<T>, S = UnwrapTomatoShape<T>> = S extends TomatoShape.Atom
    ? U
    : S extends TomatoShape.Array
    ? Array<UnwrapTomato<UnbakeTomato<U>>>
    : { [key in keyof U]: TomatoToValues<UnbakeTomato<U[key]>> };

// (AtomShapedTomato<...X> | ArrayShapedTomato<...X> | ...) => Tomato<...X, S>
export type UnbakeTomato<T> = T extends AtomShapedTomato<infer U, infer R>
    ? Tomato<U, R, TomatoShape.Atom>
    : T extends ArrayShapedTomato<infer U, infer R>
    ? Tomato<U, R, TomatoShape.Array>
    : T extends ObjectShapedTomato<infer U, infer R>
    ? Tomato<U, R, TomatoShape.Object>
    : T extends RecordShapedTomato<infer U, infer R>
    ? Tomato<U, R, TomatoShape.Record>
    : T;

// (AtomShapedTomato<...X> | ArrayShapedTomato<...X> | ...) => Value (recursive)
export type Values<T> = TomatoToValues<UnbakeTomato<T>>;

export type Values2<T, U, S> = TomatoToValues<UnbakeTomato<T>, U, S>;
