import { StringTomato, TomatoShape, AnyShapeTomato, NumberTomato, ArrayTomato } from './tomatos';

enum FlowType {
    Transform = 'Transform',
    Validate = 'Validate',
}

interface FlowBase {
    type: FlowType,
}

interface TransformElement<I, O> {
    type: FlowType.Transform,
    transform: (x: I) => O,
}

interface ValidationElement<T> {
    type: FlowType.Validate,
    validate: (x: T) => Promise<Boolean> | boolean,
    message: string;
}

interface ValidationError {
    message: string;
    value: any;
}

export type FlowItem<T = any, O = any> = TransformElement<T, O> | ValidationElement<T>;

export const string: StringTomato = (() => {
    let node: StringTomato = {
        shape: TomatoShape.Atom,
        flow: [],
        required: false,
        default: undefined,
        validate: (validate, message = '') => ({ ...node, flow: [...node.flow, { message, validate, type: FlowType.Validate }] }),
        require: () => ({ ...node, required: true }),
        defaultTo: x => ({ ...node, default: x }),
    };
    return node.validate(x => typeof x === 'string', 'Not a string');
})();

export const number: NumberTomato = (() => {
    let node: NumberTomato = {
        shape: TomatoShape.Atom,
        flow: [],
        required: false,
        default: undefined,
        validate: (validate, message = '') => ({ ...node, flow: [...node.flow, { message, validate, type: FlowType.Validate }] }),
        require: () => ({ ...node, required: true }),
        defaultTo: x => ({ ...node, default: x }),
    };
    return node.validate(x => typeof x === 'number', 'Not a number');
})();

export const array = <T extends AnyShapeTomato>(item: T): ArrayTomato<T> => {
    let node: ArrayTomato<T> = {
        item,
        shape: TomatoShape.Array,
        flow: [],
        required: false,
        default: undefined,
        validate: (validate, message = '') => ({ ...node, flow: [...node.flow, { message, validate, type: FlowType.Validate }] }),
        require: () => ({ ...node, required: true }),
        defaultTo: x => ({ ...node, default: x }),
    };
    return node.validate(x => Array.isArray(x), 'Not an array');
};


const runFlow = (flow: FlowItem[], value: any) => {
    const errors: ValidationError[] = [];
    flow.reduce((value, flowItem) => {
        if (flowItem.type === FlowType.Validate && !flowItem.validate(value)) {
            errors.push({ value, message: flowItem.message });
        }
        return value;
    }, value);
    return {
        errors,
        value
    };
};

export const validate = (schema: AnyShapeTomato, value: any): any => {
    const flowRes = runFlow(schema.flow, value);
    if (schema.shape === TomatoShape.Atom) {
        return flowRes;
    }
    if (schema.shape === TomatoShape.Array) {
        return {
            ...flowRes,
            children: (Array.isArray(value) ? value : [])
                .map(v => validate(schema.item, v))
        };
    }
    return flowRes;
};
