import { resolveTypes, setOptions } from 'resolve-types';

setOptions({
    baseUrl: './src',
    rootDir: './src',
    strict: true,
});

const types = <T extends Record<string, string>>(imports: string, defs: T) => {
    const res = resolveTypes([imports].concat(Object.entries(defs).map(([k, d]) => `type ${k} = ${d}`)).join(' '));
    return Object.keys(defs).reduce((acc, i) => Object.assign(acc, { [i]: res.types[i] }), {}) as T;
};

const type = (imports: string, def: string) => {
    return types(imports, { t1: def }).t1;
};

describe('Types', () => {
    test('composite', () => {
        const res = type(
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
            });`,
            'Values<typeof Foo>;'
        );
        expect(res).toMatchInlineSnapshot(
            '"{ age: number; user: { address: { street: string | undefined; number: string; }; s: string; } | undefined; address: { street: string | undefined; number: string; }; } | undefined"'
        );
    });
});
