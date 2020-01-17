export declare const isArray: (obj: any) => boolean;
export declare const assert: (isValid: boolean, errorMessage: string) => void;
/**
 * Check if `obj` satisfies `QueryOption` type.
 * @example
 * type Option = {
 *    where?: Where | [Where];
 *    limit?: Limit;
 *    order?: Order | [Order];
 *    cursor?: Cursor;
 * }
 * ```
 */
export declare const assertQueryOption: (obj: any) => void;
export declare const assertAcceptOutdatedOption: (obj: any) => void;
export declare const assertCallbackOption: (obj: any) => void;
/**
 * Check if `obj` satisfies `ArrayQuerySchema` type.
 * @example
 * type ArrayQuerySchema = {
 *    connects?: boolean;
 *    queries: Query[];
 * };
 */
export declare const assertArrayQuerySchema: (obj: any) => void;
/**
 * Check if `obj` satisfies `QuerySchema` type.
 * @example
 * type QuerySchema = {
 *    connects?: boolean;
 *    queries: {
 *      [field: string]: Query;
 *    };
 * };
 */
export declare const assertQuerySchema: (obj: any) => void;
/**
 * Check if `obj` satisfies `string` type.
 */
export declare const assertPath: (obj: any) => void;
/**
 * Check if `obj` satisfies option of `usePaginateCollection`.
 */
export declare const assertPaginateOption: (obj: any) => void;
/**
 * Check if `obj` satisfies option of `useGetSubCollection`.
 */
export declare const assertSubCollectionOption: (obj: any) => void;
