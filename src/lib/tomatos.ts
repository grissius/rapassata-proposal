const enum TomatoShape {
    Atom = 'Atom',
    Array = 'Array',
    Object = 'Object',
    Record = 'Record',
}

interface Tomato<T, R extends boolean = false, S extends TomatoShape = TomatoShape.Atom> {
    shape: TomatoShape;
    required: boolean;
    default?: Values<T, T, S>;
    flow: Array<any>;

    // modeling methods
    require: () => Tomato<T, true, S>; // make required
    defaultTo: (defVal: Values<T, T, S>) => Tomato<T, true, S>; // set default value
    validate: (fn: (val: Values<T, T, S>) => boolean | Promise<boolean>) => Tomato<T, R, S>; // add validation function
}

// Tomato variances
interface AtomShapedTomato<T, R extends boolean = false> extends Tomato<T, R, TomatoShape.Atom> {
    shape: TomatoShape.Atom;
}

interface ArrayShapedTomato<T, R extends boolean = false> extends Tomato<T, R, TomatoShape.Array> {
    shape: TomatoShape.Array;
    item: AnyTomato;
}

interface ObjectShapedTomato<T, R extends boolean = false> extends Tomato<T, R, TomatoShape.Object> {
    shape: TomatoShape.Object;
    structure: T;
}

interface RecordShapedTomato<T, R extends boolean = false> extends Tomato<T, R, TomatoShape.Record> {
    shape: TomatoShape.Record;
    structure: Record<any, T>;
}

type AnyShapeTomato<T = any, R extends boolean = any> = AtomShapedTomato<T, R> | ArrayShapedTomato<T, R> | ObjectShapedTomato<T, R> | RecordShapedTomato<T, R>;
type StringTomato<T = string> = AtomShapedTomato<T>;
type NumberTomato<T = number> = AtomShapedTomato<T>;
type BooleanTomato<T = boolean> = AtomShapedTomato<T>;
type AnyTomato<T = any> = AtomShapedTomato<T>;
type ArrayTomato<T extends AnyShapeTomato = any> = ArrayShapedTomato<T, false>;
type ObjectTomato<T = any> = ObjectShapedTomato<T, false>;
type RecordTomato<T extends Record<any, any>> = RecordShapedTomato<T, false>;

// Builders
interface Breeds {
    string: StringTomato;
    number: NumberTomato;
    boolean: Tomato<boolean>;
    array: <T extends AnyShapeTomato>(x: T) => ArrayTomato<T>;
    objectOf: <V>(val: V) => RecordTomato<Record<any, V>>;
    object: <V>(val: V) => ObjectTomato<V>;
    any: AnyTomato;
}