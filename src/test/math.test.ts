import { string, validate, number, array } from 'lib/validate';

describe('Math', () => {
    test('sum', () => {
        console.log(string);
        console.log(validate(string, '123'));
        console.log(validate(string, 123));
        console.log(validate(number, '123'));
        console.log(validate(number, 123));
        console.log(validate(array(number), [123, 'sd']));
    });
});
