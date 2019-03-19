const string: StringTomato = (() => {
    const node: StringTomato = {
        shape: TomatoShape.Atom,
        flow: [],
        required: false,
        default: undefined,
        validate: (x) => ({...node, flow: [ ...node.flow, x ]}),
        require: () => ({...node, required: true }),
        defaultTo: (x) => ({...node, default: x }),
    };
    node.validate(x => typeof x === 'string');
    return node;
})()

const runFlow = (flow: any[], value: any) => {
    const res: any[] = [];
    flow.reduce((val, fn) => res.push(fn(val)), value);
    return res;
}

const validate = (schema: AnyShapeTomato, value: any) => {
    const flowRes = runFlow(schema.flow, value);
    if (schema.shape === TomatoShape.Atom) {
        return flowRes;
    };
    return flowRes;
}
