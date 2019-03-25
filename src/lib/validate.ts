import { TomatoShape, AnyShapeTomato, ArrayTomato, ObjectTomato, AtomShapedTomato } from './tomatos';

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

const atomNode = <T>() => {
    let node: AtomShapedTomato<T> = {
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
    }
    return node;
}

export const string: AtomShapedTomato<string> = (() => {
    const node = atomNode<string>();
    return node.validate(x => typeof x === 'string', 'Not a string');
})();

export const any: AtomShapedTomato<any> = (() => {
    return atomNode<any>();
})();

export const number: AtomShapedTomato<number> = (() => {
    const node = atomNode<number>();
    return node.validate(x => typeof x === 'number', 'Not a number');
})();

export const boolean: AtomShapedTomato<boolean> = (() => {
    const node = atomNode<boolean>();
    return node.validate(x => typeof x === 'boolean', 'Not a boolean');
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

const isObject = (x: any) => typeof x == 'object' && x && x.constructor == Object

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
    return node.validate(isObject, 'Not an object');
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
        value = isObject(value) ? value : {};
        return {
            ...flowRes,
            structure: Object.keys(schema.structure).reduce((res, key) => {
                res[key] = validate(schema.structure[key], value[key]);
                return res;
            }, {} as any),
        };
    }
};
