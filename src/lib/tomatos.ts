import { Values, Values2 } from './helpers';
import { FlowItem } from './validate';

export const enum TomatoShape {
    Atom = 'Atom',
    Array = 'Array',
    Object = 'Object',
    Record = 'Record',
}

export interface Tomato<
T,
R extends boolean = false,
S extends TomatoShape = TomatoShape.Atom,
BakedTomato = S extends TomatoShape.Atom ? AtomShapedTomato<T, R>
: S extends TomatoShape.Array ? ArrayShapedTomato<T, R>
: S extends TomatoShape.Object ? ObjectShapedTomato<T, R>
: S extends TomatoShape.Record ? RecordShapedTomato<T, R>
: T,
TrueBakedTomato = S extends TomatoShape.Atom ? AtomShapedTomato<T, true>
: S extends TomatoShape.Array ? ArrayShapedTomato<T, true>
: S extends TomatoShape.Object ? ObjectShapedTomato<T, true>
: S extends TomatoShape.Record ? RecordShapedTomato<T, true>
: T,
> {
    shape: TomatoShape;
    required: boolean;
    default?: Values2<T, T, S>;
    flow: Array<FlowItem>;

    // modeling methods
    require: () => TrueBakedTomato;
    defaultTo: (defVal: Values2<T, T, S>) => TrueBakedTomato;
    validate: (fn: (val: Values2<T, T, S>) => boolean | Promise<boolean>, message?: string) => BakedTomato;
}


// Tomato variances
export interface AtomShapedTomato<T, R extends boolean = false> extends Tomato<T, R, TomatoShape.Atom> {
    shape: TomatoShape.Atom;
}

export interface ArrayShapedTomato<T, R extends boolean = false> extends Tomato<T, R, TomatoShape.Array> {
    shape: TomatoShape.Array;
    item: AnyShapeTomato;
}

export interface ObjectShapedTomato<T, R extends boolean = false> extends Tomato<T, R, TomatoShape.Object> {
    shape: TomatoShape.Object;
    structure: T;
}

export interface RecordShapedTomato<T, R extends boolean = false> extends Tomato<T, R, TomatoShape.Record> {
    shape: TomatoShape.Record;
    structure: Record<any, T>;
}

export type AnyShapeTomato<T = any, R extends boolean = any> =
    | AtomShapedTomato<T, R>
    | ArrayShapedTomato<T, R>
    | ObjectShapedTomato<T, R>
    | RecordShapedTomato<T, R>;

type BakeShape<T> = T extends Tomato<infer U, infer R, TomatoShape.Atom> ? AtomShapedTomato<U, R>
: T extends Tomato<infer U, infer R, TomatoShape.Array> ? ArrayShapedTomato<U, R>
: T extends Tomato<infer U, infer R, TomatoShape.Object> ? ObjectShapedTomato<U, R>
: T extends Tomato<infer U, infer R, TomatoShape.Record> ? RecordShapedTomato<U, R>
: T

export type StringTomato<T = string> = AtomShapedTomato<T>;
export type NumberTomato<T = number> = AtomShapedTomato<T>;
export type BooleanTomato<T = boolean> = AtomShapedTomato<T>;
export type AnyTomato<T = any> = AtomShapedTomato<T>;
export type ArrayTomato<T extends AnyShapeTomato = any> = ArrayShapedTomato<T, false>;
export type ObjectTomato<T = any> = ObjectShapedTomato<T, false>;
export type RecordTomato<T extends Record<any, any>> = RecordShapedTomato<T, false>;

// Builders
export interface Breeds {
    string: StringTomato;
    number: NumberTomato;
    boolean: BooleanTomato;
    array: <T extends AnyShapeTomato>(x: T) => ArrayTomato<T>;
    objectOf: <V>(val: V) => RecordTomato<Record<any, V>>;
    object: <V>(val: V) => ObjectTomato<V>;
    any: AnyTomato;
}
