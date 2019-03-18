const enum TomatoShape {
    Atom = 'Atom',
    Array = 'Array',
    Object = 'Object',
    Record = 'Record',
}

interface Tomato<T, R extends boolean = false, S extends TomatoShape = TomatoShape.Atom> {
    type: string; // what type?
    required: boolean; // is required?
    default: T; // default value?

    // modeling methods
    require: () => Tomato<T, true, S>; // make required
    defaultTo: (defVal: Values<T, T, S>) => Tomato<T, true, S>; // set default value
    validate: (fn: (val: Values<T, T, S>) => boolean | Promise<boolean>) => Tomato<T, R, S>; // add validation function
}

// Tomato variances
type AllTomatos<T = any, R extends boolean = any, S extends TomatoShape = any> = Tomato<T, R, S>;

type StringTomato<T = string> = Tomato<T>;
type NumberTomato<T = number> = Tomato<T>;
type BooleanTomato<T = boolean> = Tomato<T>;
type AnyTomato<T = any> = Tomato<T>;
type ArrayTomato<T extends AllTomatos = AnyTomato> = Tomato<T, false, TomatoShape.Array>;
type ObjectTomato<T = any> = Tomato<T, false, TomatoShape.Object>;
type RecordTomato<T extends Record<any, any>> = Tomato<T, false, TomatoShape.Record>;

// Builders
interface Breeds {
    string: StringTomato;
    number: NumberTomato;
    boolean: Tomato<boolean>;
    array: <T extends AllTomatos>(x: T) => ArrayTomato<T>;
    objectOf: <V>(val: V) => RecordTomato<Record<any, V>>;
    object: <V>(val: V) => ObjectTomato<V>;
    any: AnyTomato;
}