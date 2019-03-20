import { string, validate, number, array, object, boolean } from 'lib/validate';

describe('Schemas', () => {
    test('string', () => {
        expect(string).toMatchSnapshot();
    });
    test('number', () => {
        expect(number).toMatchSnapshot();
    });
    test('boolean', () => {
        expect(boolean).toMatchSnapshot();
    });
    test('array', () => {
        expect(array(string)).toMatchSnapshot();
    });
    test('object', () => {
        expect(object(string)).toMatchSnapshot();
    });
});

describe('Validation (primitives)', () => {
    describe('string', () => {
        test('validate OK', () => {
            expect(validate(string, 'foo')).toMatchSnapshot();
        });
        test('validate null', () => {
            expect(validate(string, null)).toMatchSnapshot();
        });
    });
    describe('number', () => {
        test('validate OK', () => {
            expect(validate(number, 42)).toMatchSnapshot();
        });
        test('validate null', () => {
            expect(validate(number, null)).toMatchSnapshot();
        });
    });
    describe('boolean', () => {
        test('validate OK', () => {
            expect(validate(boolean, false)).toMatchSnapshot();
        });
        test('validate null', () => {
            expect(validate(boolean, null)).toMatchSnapshot();
        });
    });
    describe('array', () => {
        test('validate OK', () => {
            expect(validate(array(string), ['bar'])).toMatchSnapshot();
        });
        test('validate null', () => {
            expect(validate(array(string), null)).toMatchSnapshot();
        });
    });
    describe('object', () => {
        test('validate OK', () => {
            expect(validate(object({ a: string }), { a: 'x' })).toMatchSnapshot();
        });
        test('validate null', () => {
            expect(validate(object({ a: string }), null)).toMatchSnapshot();
        });
    });
});

describe('Validation (composite)', () => {
    describe('Schema 1', () => {
        const schema = object({
            user: object({
                age: number.defaultTo(18),
                address: object({
                    street: string.validate(x => x !== ''),
                    number: number,
                }),
                colors: array(string.defaultTo('red')).defaultTo([]),
                // ratedHobbies: objectOf(number).require(),
            }),
        });
        test('validate OK', () => {
            const value = {
                user: {
                    age: 12,
                    address: {
                        street: 'a',
                        number: 123,
                    },
                    colors: ['red'],
                },
            };
            expect(validate(schema, value)).toMatchSnapshot();
        });
        test('undefined', () => {
            expect(validate(schema, undefined)).toMatchSnapshot();
        });
    });
});
