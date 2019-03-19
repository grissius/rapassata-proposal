import { string, validate } from 'lib/validate';

describe('Math', () => {
    test('sum', () => {
        console.log(string);
        console.log(validate(string, '123'));
        console.log(validate(string, 123));
    });
});
