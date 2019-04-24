import { inspectWithPreamble } from 'intspector';

describe('Types', () => {
    test('composite', () => {
        const res = inspectWithPreamble(
            `import { Values } from 'lib/helpers';
            import { Breeds } from 'lib/tomatos';
            const { any, number, array, boolean, object, objectOf, string } = ('' as any) as Breeds;
            const Foo = object({
                age: number.defaultTo(18),
                user: object({
                    address: object({
                        street: string.validate(x => x !== ''),
                        number: string.require(),
                    }).require(),
                    s: string.defaultTo('red'),
                }),
                address: object({
                    street: string.validate(x => x !== ''),
                    number: string.require(),
                }).require(),
            });`
        )('Values<typeof Foo>;');
        expect(res).toMatchSnapshot();
    });
});
