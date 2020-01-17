"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var firestoreWhereFilterOp = ["<", "<=", "==", ">=", ">", "array-contains", "in", "array-contains-any"];
var isAnyOf = function (targets) { return function (obj) { return targets.indexOf(obj) >= 0; }; };
var isString = function (obj) { return typeof obj === "string"; };
var isNumber = function (obj) { return typeof obj === "number"; };
var isBoolean = function (obj) { return typeof obj === "boolean"; };
exports.isArray = function (obj) { return obj instanceof Array; };
var isFunction = function (obj) { return obj instanceof Function; };
var containKey = function (key) { return function (obj) { return key in obj; }; };
var requiredProperty = function (key, valueassert) { return function (obj) {
    return valueassert ? containKey(key)(obj) && valueassert(obj[key]) : containKey(key)(obj);
}; };
var optionalProperty = function (key, valueassert) { return function (obj) {
    return valueassert ? !(key in obj) || valueassert(obj[key]) : !(key in obj);
}; };
exports.assert = function (isValid, errorMessage) {
    if (!isValid)
        throw Error(errorMessage);
};
/**
 * Check if `obj` satisfies `Where` type.
 * @example
 * type Where = {
 *  field: string;
 *  operator: firestore.WhereFilterOp;
 *  value: string;
 * };
 */
var assertWhere = function (obj) {
    exports.assert(requiredProperty("field", isString)(obj), 'Where should contain "field" property with string value.');
    exports.assert(requiredProperty("operator", isAnyOf(firestoreWhereFilterOp))(obj), 'Where should contain "operator" property with Firestore where filter operation.');
    exports.assert(requiredProperty("value")(obj), 'Where should contain "value" property.');
};
/**
 * Check if `obj` satisfies `Limit` type.
 * @example
 * type Limit = number
 */
var assertLimit = function (obj) {
    exports.assert(isNumber(obj), "Limit should be number.");
};
/**
 * Check if `obj` satisfies `Order` type.
 * @example
 * type Order = {
 *  by: string;
 *  direction?: OrderDirection;
 * };
 */
var assertOrder = function (obj) {
    exports.assert(requiredProperty("by", isString)(obj), 'Order should contain "by" property with string value.');
    exports.assert(optionalProperty("direction", isAnyOf(["asc", "desc"]))(obj), 'Order should contain "direction" property with any of "asc" or "desc".');
};
/**
 * Check if `obj` satisfies `Cursor` type.
 * @example
 * type Cursor = {
 *  origin: any;
 *  direction: "startAt" | "startAfter" | "endAt" | "endBefore";
 *  multipleFields?: boolean;
 * };
 */
var assertCursor = function (obj) {
    exports.assert(requiredProperty("origin")(obj), 'Cursor should contain "origin" property.');
    exports.assert(requiredProperty("direction", isAnyOf(["startAt", "startAfter", "endAt", "endBefore"]))(obj), 'Cursor should contain "direction" property with value any of "startAt", "startAfter", "endAt", "endBefore".');
    exports.assert(optionalProperty("multipleFields", isBoolean)(obj), 'Value of "multipleFields" property should be boolean.');
};
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
exports.assertQueryOption = function (obj) {
    if (obj === undefined) {
        return;
    }
    exports.assert(obj !== null, "Option is null.");
    if (containKey("where")(obj)) {
        if (exports.isArray(obj.where)) {
            obj.where.forEach(function (ele) { return assertWhere(ele); });
        }
        else {
            assertWhere(obj.where);
        }
    }
    if (containKey("limit")(obj)) {
        assertLimit(obj.limit);
    }
    if (containKey("order")(obj)) {
        if (exports.isArray(obj.order)) {
            obj.order.forEach(function (ele) { return assertOrder(ele); });
        }
        else {
            assertOrder(obj.order);
        }
    }
    if (containKey("cursor")(obj)) {
        assertCursor(obj.cursor);
    }
};
/**
 * Check if `obj` satisfies `Query` type.
 * @example
 * type Query = {
 *    location: string;
 *    connects?: boolean;
 * } & Option;
 */
var assertQuery = function (obj) {
    exports.assert(requiredProperty("location", isString)(obj), 'Query should contain "location" property with string value.');
    exports.assert(optionalProperty("connects", isBoolean)(obj), 'Value of "connects" property should be boolean.');
    exports.assertQueryOption(obj);
};
exports.assertAcceptOutdatedOption = function (obj) {
    if (obj === undefined) {
        return;
    }
    exports.assert(typeof obj === "object", "Option should be object.");
    exports.assert(optionalProperty("acceptOutdated", isBoolean)(obj), '"acceptOutdated" property should be boolean.');
};
exports.assertCallbackOption = function (obj) {
    if (obj === undefined) {
        return;
    }
    exports.assert(typeof obj === "object", "Option should be object.");
    exports.assert(optionalProperty("callback", isFunction)(obj), '"callback" property should be function.');
};
/**
 * Check if `obj` satisfies `ArrayQuerySchema` type.
 * @example
 * type ArrayQuerySchema = {
 *    connects?: boolean;
 *    queries: Query[];
 * };
 */
exports.assertArrayQuerySchema = function (obj) {
    exports.assert(obj !== undefined, "Query schema is undefined.");
    exports.assert(obj !== null, "Query schema is null.");
    exports.assert(typeof obj === "object", "Option should be object.");
    exports.assert(optionalProperty("connects", isBoolean)(obj), 'Value of "connects" property should be boolean.');
    exports.assert(requiredProperty("queries")(obj), 'Schema should contain "queries" property.');
    exports.assert(exports.isArray(obj.queries), 'Schema should contain "queries" with Array');
    obj.queries.forEach(function (query) { return assertQuery(query); });
    exports.assertAcceptOutdatedOption(obj);
    exports.assertCallbackOption(obj);
};
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
exports.assertQuerySchema = function (obj) {
    exports.assert(obj !== undefined, "Query schema is undefined.");
    exports.assert(obj !== null, "Query schema is null.");
    exports.assert(typeof obj === "object", "Option should be object.");
    exports.assert(optionalProperty("connects", isBoolean)(obj), 'Value of "connects" property should be boolean.');
    exports.assert(requiredProperty("queries")(obj), 'Schema should contain "queries" property.');
    exports.assert(obj.queries instanceof Object, 'Schema should contain "queries" with Object');
    Object.values(obj.queries).forEach(function (query) { return assertQuery(query); });
    exports.assertAcceptOutdatedOption(obj);
    exports.assertCallbackOption(obj);
};
/**
 * Check if `obj` satisfies `string` type.
 */
exports.assertPath = function (obj) { return exports.assert(isString(obj), "Path should be string."); };
/**
 * Check if `obj` satisfies option of `usePaginateCollection`.
 */
exports.assertPaginateOption = function (obj) {
    exports.assert(obj !== undefined, "Option is undefined.");
    exports.assert(typeof obj === "object", "Option should be object.");
    exports.assert(obj !== null, "Option is null.");
    if (containKey("where")(obj)) {
        if (exports.isArray(obj.where)) {
            obj.where.forEach(function (ele) { return assertWhere(ele); });
        }
        else {
            assertWhere(obj.where);
        }
    }
    // only in paginate
    exports.assert(containKey("limit")(obj), 'Option in usePaginateCollection should contain "limit" property.');
    assertLimit(obj.limit);
    exports.assert(containKey("order")(obj), 'Option in usePaginateCollection should contain "order" property.');
    exports.assert(!exports.isArray(obj.order), '"order" property in usePaginateCollection should not be array.');
    assertOrder(obj.order);
};
/**
 * Check if `obj` satisfies option of `useGetSubCollection`.
 */
exports.assertSubCollectionOption = function (obj) {
    exports.assert(obj !== undefined, "Option is undefined.");
    exports.assert(typeof obj === "object", "Option should be object.");
    exports.assert(obj !== null, "Option is null.");
    exports.assert(containKey("field")(obj), 'Option in useGetSubCollection should contain "field" property.');
    exports.assert(containKey("collectionPath")(obj), 'Option in useGetSubCollection should contain "collectionPath" property.');
};
