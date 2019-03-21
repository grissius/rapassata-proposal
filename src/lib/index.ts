import { Values } from './helpers';
import { Breeds } from './tomatos';

const { any, number, array, boolean, object, objectOf, string } = ('' as any) as Breeds;

// const foo: AtomShapedTomato<string, false> = string;

// type x = UnwrapTomato<typeof string>
const b = object({ o: string, r: string.require() });
type B = Values<typeof b>;

type A = Values<typeof string>;

// const c = object({ foo: array(number) });
const c = array(number);
type C = Values<typeof c>;

const Nest = object({
    age: number.defaultTo(18),
    user: object({
        address: object({
            street: string.validate(x => x !== ''),
            number: string.require(),
        }),
        s: string.defaultTo('red'),
    }).validate(x =>),
});
type Y = Values<typeof Nest>;

const Req = {
    data: any,
    user: {
        age: number.defaultTo(18),
        address: {
            street: string,
            number: string.require(),
        },
        colors: array(string.defaultTo('red')).defaultTo(''),
        ratedHobbies: objectOf(number).require(),
    },
};

type X = Values<typeof Req>;
