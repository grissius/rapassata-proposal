import { Tomato, TomatoShape } from "./tomatos";

// Helpers
// Return T or ?T based on the flag
type ProcessRequired<T, R> = R extends true ? T : T | undefined;
// Get value of a single tomato
type UnwrapTomato<T> = T extends Tomato<infer I, infer R, infer S> ? ProcessRequired<I, R> : T;
// Extract shape
type UnwrapTomatoShape<T> = T extends Tomato<infer T, infer R, infer S> ? S : T;
// Extract values from a complete tomato object
export type Values<T, U = UnwrapTomato<T>, S = UnwrapTomatoShape<T>> = S extends TomatoShape.Atom
    ? U
    : S extends TomatoShape.Array ? Array<UnwrapTomato<U>>
    : { [key in keyof U]: Values<U[key]> };

interface ValidationResult<T> {
    value: T;
    pass: boolean;
}