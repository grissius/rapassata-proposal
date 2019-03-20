import { StringTomato, TomatoShape, AnyShapeTomato, NumberTomato, ArrayTomato, ObjectTomato } from './tomatos';

enum FlowType {
    Transform = 'Transform',
    Validate = 'Validate',
}

interface TransformElement<I, O> {
    type: FlowType.Transform;
    transform: (x: I) => O;
}

interface ValidationElement<T> {
    type: FlowType.Validate;
    validate: (x: T) => Promise<Boolean> | boolean;
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
        validate: (validate, message = '') => ({
            ...node,
            flow: [...node.flow, { message, validate, type: FlowType.Validate }],
        }),
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
        validate: (validate, message = '') => ({
            ...node,
            flow: [...node.flow, { message, validate, type: FlowType.Validate }],
        }),
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
        validate: (validate, message = '') => ({
            ...node,
            flow: [...node.flow, { message, validate, type: FlowType.Validate }],
        }),
        require: () => ({ ...node, required: true }),
        defaultTo: x => ({ ...node, default: x }),
    };
    return node.validate(x => Array.isArray(x), 'Not an array');
};

export const object = <T>(structure: T): ObjectTomato<T> => {
    let node: ObjectTomato<T> = {
        structure,
        shape: TomatoShape.Object,
        flow: [],
        required: false,
        default: undefined,
        validate: (validate, message = '') => ({
            ...node,
            flow: [...node.flow, { message, validate, type: FlowType.Validate }],
        }),
        require: () => ({ ...node, required: true }),
        defaultTo: x => ({ ...node, default: x }),
    };
    return node.validate(x => typeof x == 'object' && x.constructor == Object, 'Not an object');
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
        value,
    };
};

const mapObject = (obj: any, fn: (key: keyof any, value: any) => any) =>
    Object.keys(obj).reduce((res, key) => ({...res, [key]: fn(key, obj[key])}), {} as any);

export const validate = (schema: AnyShapeTomato, value: any): any => {
    const flowRes = runFlow(schema.flow, value);
    if (schema.shape === TomatoShape.Atom) {
        return flowRes;
    } else if (schema.shape === TomatoShape.Array) {
        return {
            ...flowRes,
            children: (Array.isArray(value) ? value : []).map(v => validate(schema.item, v)),
        };
    } else {
        return {
            ...flowRes,
            // TODO: fix non object
            structure: Object.keys(schema.structure).reduce((res, key) => {
                res[key] = validate(schema.structure[key], value[key]);
                return res;
            }, {} as any),
        };
    }
};
