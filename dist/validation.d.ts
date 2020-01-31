declare type ValidateResult = {
    valid: boolean;
    message: string;
};
declare type ValidateFunction = (obj: any, target: string) => ValidateResult;
declare type Rule = {
    key: string;
    fn: ValidateFunction;
    optional?: boolean;
}[];
export declare const isObject: (obj: any, target: string) => {
    valid: boolean;
    message: string;
};
export declare const isAnyOf: (candidate: any[]) => (obj: any, target: string) => {
    valid: boolean;
    message: string;
};
export declare const isArrayOf: (rule: ValidateFunction) => (obj: any, target: string) => {
    valid: boolean;
    message: string;
};
export declare const isString: (obj: any, target: string) => {
    valid: boolean;
    message: string;
};
export declare const isNumber: (obj: any, target: string) => {
    valid: boolean;
    message: string;
};
export declare const isBoolean: (obj: any, target: string) => {
    valid: boolean;
    message: string;
};
export declare const isNotNull: (obj: any, target: string) => {
    valid: boolean;
    message: string;
};
export declare const isFunction: (obj: any, target: string) => {
    valid: boolean;
    message: string;
};
export declare const condition: (condition: (obj: any) => boolean, fn1: ValidateFunction, fn2: ValidateFunction) => (obj: any, target: string) => ValidateResult;
export declare const matches: (rule: Rule) => (obj: any, target: string) => ValidateResult;
export declare const matchesArrayOf: (rule: Rule) => (obj: any, target: string) => ValidateResult;
export declare const matchesObjectOf: (rule: Rule) => (obj: any, target: string) => ValidateResult;
export declare const queryOptionRule: Rule;
export declare const queryRule: Rule;
export declare const acceptOutdatedRule: Rule;
export declare const callbackRule: Rule;
export declare const mergeRule: Rule;
export declare const arrayGetFqlRule: Rule;
export declare const getFqlRule: Rule;
export declare const subCollectionOptionRule: {
    key: string;
    fn: (obj: any, target: string) => {
        valid: boolean;
        message: string;
    };
}[];
export declare const paginateOptionRule: {
    key: string;
    fn: (obj: any, target: string) => {
        valid: boolean;
        message: string;
    };
}[];
export declare const assert: (isValid: boolean, errorMessage: string) => void;
export declare const assertObject: (obj: any, target: string) => void;
export declare const assertArray: (obj: any, target: string) => void;
export declare const assertRule: (rule: Rule) => (obj: any, target: string) => void;
export declare const assertStaticSetFql: (obj: any, target?: string) => void;
export declare const assertSetFql: (obj: any, target?: string) => void;
export declare const assertSetCollectionFql: (obj: any, target?: string) => void;
export declare const assertSubCollectionQuery: (obj: any, target?: string) => void;
export declare const assertSetDocsQuery: (obj: any, target?: string) => void;
export {};
