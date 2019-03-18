const enum TomatoShape {
    Atom = 'Atom',
    Array = 'Array',
    Object = 'Object',
    Record = 'Record',
}

interface ValidationResult<T> {
    value: T;
    pass: boolean;
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

// Helpers
// Return T or ?T based on the flag
type ProcessRequired<T, R> = R extends true ? T : T | undefined;
// Get value of a single tomato
type UnwrapTomato<T> = T extends Tomato<infer I, infer R, infer S> ? ProcessRequired<I, R> : T;
// Extract shape
type UnwrapTomatoShape<T> = T extends Tomato<infer T, infer R, infer S> ? S : T;
// Extract values from a complete tomato object
type Values<T, U = UnwrapTomato<T>, S = UnwrapTomatoShape<T>> = S extends TomatoShape.Atom
    ? U
    : S extends TomatoShape.Array ? Array<UnwrapTomato<U>>
    : { [key in keyof U]: Values<U[key]> };


const { any, number, array, boolean, object, objectOf, string } = ('' as any) as Breeds;

type x = UnwrapTomato<typeof string>
const b = object({ o: string, r: string.require() });
type B = Values<typeof b>;

type A = Values<typeof string>;

const c = object({ foo: array(number) });
// const c = array(number);
type C = Values<typeof c>;

const Nest = object({
    age: number.defaultTo(18),
    user: object({
        address: object({
            street: string.validate(x => x !== ''),
            number: string.require(),
        }).validate(x => ),
        s: string.defaultTo('red'),
    }),
});
type Y = Values<typeof Nest>;

const Req = {
    data: any,
    user: {
        age: number.defaultTo(18),
        address: {
            street: string.validate(x =>),
            number: string.require(),
        },
        colors: array(string.defaultTo('red')).defaultTo([]).validate(x =>),
        ratedHobbies: objectOf(number).require().validate(x => ),
    },
};

type X = Values<typeof Req>;
