const enum TomatoShape {
    Atom = 'Atom',
    Array = 'Array',
    Object = 'Object',
    Record = 'Record',
}

type Result<T, O> = O extends true ? T : T | undefined;
interface Tomato<T, O extends boolean = false, S = TomatoShape.Atom> {
    type: string; // what type?
    required: boolean; // is required?
    default: T; // default value?

    // modeling methods
    require: () => Tomato<T, true>; // make required
    defaultTo: (defVal: T) => Tomato<T, true>; // set default value
    validate: (fn: (val: T) => boolean | Promise<boolean>) => Tomato<T, O>; // add validation function
    $: Result<T, O>; // finish construction of the attribute, type-cast it to wrong type to ensure correct types
}

type StringTomato<T = string> = Tomato<T>;
type NumberTomato<T = number> = Tomato<T>;
type BooleanTomato<T = boolean> = Tomato<T>;
type AnyTomato<T = any> = Tomato<T>;
type ArrayTomato<T extends AnyTomato = AnyTomato> = Tomato<T, false, TomatoShape.Array>;
type ObjectTomato<T = any> = Tomato<T, false, TomatoShape.Object>;
type RecordTomato<T extends AnyTomato = AnyTomato> = Tomato<T, false, TomatoShape.Record>;

type UnwrapTomato<T> = T extends Tomato<infer I, true> ? I : T extends Tomato<infer I, false> ? I | undefined : T;
type UnwrapTomatoShape<T> = T extends Tomato<infer T, infer O, infer S> ? S : T;

interface Breeds {
    string: Tomato<string>;
    number: Tomato<number>;
    boolean: Tomato<boolean>;
    arrayOf: <T>(x: T) => Tomato<Array<T>>;
    objectOf: <V>(val: V) => Tomato<{ [key: string]: V }>;
    object: <V>(val: V) => Tomato<V>;
    any: Tomato<any>;
}

const { any, number, arrayOf, boolean, object, objectOf, string } = ('' as any) as Breeds;


type Values<T, U = UnwrapTomato<T>, S = UnwrapTomatoShape<T>> = S extends TomatoShape.Atom
    ? U
    : S extends TomatoShape.Array
    ? Array<UnwrapTomato<U>> // values?
    : { [key in keyof NonNullable<U>]: Values<NonNullable<U>[key]> };

type test = UnwrapTomato<StringTomato>;

type A = Values<typeof string>;

const b = object({ foo: string });
type B = Values<typeof b>;

const c = object({ foo: arrayOf(number) });
// const c = arrayOf(number);
type C = Values<typeof c>;

const Nest = object({
    age: number.defaultTo(18),
    user: object({
        address: object({
            street: string.validate(x => x !== ''),
            number: string.require(),
        }),
        s: string.defaultTo('red'),
    }),
});
type Y = Values<typeof Nest>;

const Req = {
    data: any,
    user: {
        age: number.defaultTo(18),
        address: {
            street: string.validate(x => x !== ''),
            number: string.require(),
        },
        colors: arrayOf(string.defaultTo('red')).defaultTo([]),
        ratedHobbies: objectOf(number).require(),
    },
};

type X = Values<typeof Req>;
