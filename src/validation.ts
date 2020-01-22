const firestoreWhereFilterOp = [
  "<",
  "<=",
  "==",
  ">=",
  ">",
  "array-contains",
  "in",
  "array-contains-any",
];

const isAnyOf = (targets: any[]) => (obj: any) => targets.indexOf(obj) >= 0;
const isString = (obj: any) => typeof obj === "string";
const isNumber = (obj: any) => typeof obj === "number";
const isBoolean = (obj: any) => typeof obj === "boolean";
export const isArray = (obj: any) => obj instanceof Array;
const isFunction = (obj: any) => obj instanceof Function;

const containsKey = (key: string) => (obj: any) => obj[key] !== undefined;
const requiredProperty = (key: string, valueassert?: (value: any) => boolean) => (obj: any) =>
  containsKey(key)(obj) && (valueassert ? valueassert(obj[key]) : true);
const optionalProperty = (key: string, valueassert?: (value: any) => boolean) => (obj: any) => {
  return !containsKey(key)(obj) || (valueassert ? valueassert(obj[key]) : true);
};

export const assert = (isValid: boolean, errorMessage: string) => {
  if (!isValid) throw Error(errorMessage);
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
const assertWhere = (obj: any) => {
  assert(
    requiredProperty("field", isString)(obj),
    'Where should contain "field" property with string value.',
  );
  assert(
    requiredProperty("operator", isAnyOf(firestoreWhereFilterOp))(obj),
    'Where should contain "operator" property with Firestore where filter operation.',
  );
  assert(requiredProperty("value")(obj), 'Where should contain "value" property.');
};
/**
 * Check if `obj` satisfies `Limit` type.
 * @example
 * type Limit = number
 */
const assertLimit = (obj: any) => {
  assert(isNumber(obj), "Limit should be number.");
};
/**
 * Check if `obj` satisfies `Order` type.
 * @example
 * type Order = {
 *  by: string;
 *  direction?: OrderDirection;
 * };
 */
const assertOrder = (obj: any) => {
  assert(
    requiredProperty("by", isString)(obj),
    'Order should contain "by" property with string value.',
  );
  assert(
    optionalProperty("direction", isAnyOf(["asc", "desc"]))(obj),
    'Order should contain "direction" property with any of "asc" or "desc".',
  );
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
const assertCursor = (obj: any) => {
  assert(requiredProperty("origin")(obj), 'Cursor should contain "origin" property.');
  assert(
    requiredProperty("direction", isAnyOf(["startAt", "startAfter", "endAt", "endBefore"]))(obj),
    'Cursor should contain "direction" property with value any of "startAt", "startAfter", "endAt", "endBefore".',
  );
  assert(
    optionalProperty("multipleFields", isBoolean)(obj),
    'Value of "multipleFields" property should be boolean.',
  );
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
export const assertQueryOption = (obj: any) => {
  if (obj === undefined) {
    return;
  }
  assert(obj !== null, "Option is null.");
  if (containsKey("where")(obj)) {
    if (isArray(obj.where)) {
      obj.where.forEach((ele: any) => assertWhere(ele));
    } else {
      assertWhere(obj.where);
    }
  }
  if (containsKey("limit")(obj)) {
    assertLimit(obj.limit);
  }
  if (containsKey("order")(obj)) {
    if (isArray(obj.order)) {
      obj.order.forEach((ele: any) => assertOrder(ele));
    } else {
      assertOrder(obj.order);
    }
  }
  if (containsKey("cursor")(obj)) {
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
const assertQuery = (obj: any) => {
  assert(
    requiredProperty("location", isString)(obj),
    'Query should contain "location" property with string value.',
  );
  assert(
    optionalProperty("connects", isBoolean)(obj),
    'Value of "connects" property should be boolean.',
  );
  assertQueryOption(obj);
};
export const assertAcceptOutdatedOption = (obj: any) => {
  if (obj === undefined) {
    return;
  }
  assert(typeof obj === "object", "Option should be object.");
  assert(
    optionalProperty("acceptOutdated", isBoolean)(obj),
    '"acceptOutdated" property should be boolean.',
  );
};
export const assertCallbackOption = (obj: any) => {
  if (obj === undefined) {
    return;
  }
  assert(typeof obj === "object", "Option should be object.");
  assert(optionalProperty("callback", isFunction)(obj), '"callback" property should be function.');
};
/**
 * Check if `obj` satisfies `ArrayQuerySchema` type.
 * @example
 * type ArrayQuerySchema = {
 *    connects?: boolean;
 *    queries: Query[];
 * };
 */
export const assertArrayQuerySchema = (obj: any) => {
  assert(obj !== undefined, "Query schema is undefined.");
  assert(obj !== null, "Query schema is null.");
  assert(typeof obj === "object", "Option should be object.");
  assert(
    optionalProperty("connects", isBoolean)(obj),
    'Value of "connects" property should be boolean.',
  );
  assert(requiredProperty("queries")(obj), 'Schema should contain "queries" property.');
  assert(isArray(obj.queries), 'Schema should contain "queries" with Array');
  obj.queries.forEach((query: any) => assertQuery(query));
  assertAcceptOutdatedOption(obj);
  assertCallbackOption(obj);
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
export const assertQuerySchema = (obj: any) => {
  assert(obj !== undefined, "Query schema is undefined.");
  assert(obj !== null, "Query schema is null.");
  assert(typeof obj === "object", "Option should be object.");
  assert(
    optionalProperty("connects", isBoolean)(obj),
    'Value of "connects" property should be boolean.',
  );
  assert(requiredProperty("queries")(obj), 'Schema should contain "queries" property.');
  assert(obj.queries instanceof Object, 'Schema should contain "queries" with Object');
  Object.values(obj.queries).forEach((query: any) => assertQuery(query));
  assertAcceptOutdatedOption(obj);
  assertCallbackOption(obj);
};
/**
 * Check if `obj` satisfies `string` type.
 */
export const assertPath = (obj: any) => assert(isString(obj), "Path should be string.");
/**
 * Check if `obj` satisfies option of `usePaginateCollection`.
 */
export const assertPaginateOption = (obj: any) => {
  assert(obj !== undefined, "Option is undefined.");
  assert(typeof obj === "object", "Option should be object.");
  assert(obj !== null, "Option is null.");

  if (containsKey("where")(obj)) {
    if (isArray(obj.where)) {
      obj.where.forEach((ele: any) => assertWhere(ele));
    } else {
      assertWhere(obj.where);
    }
  }
  // only in paginate
  assert(
    containsKey("limit")(obj),
    'Option in usePaginateCollection should contain "limit" property.',
  );
  assertLimit(obj.limit);
  assert(
    containsKey("order")(obj),
    'Option in usePaginateCollection should contain "order" property.',
  );
  assert(!isArray(obj.order), '"order" property in usePaginateCollection should not be array.');
  assertOrder(obj.order);
};
/**
 * Check if `obj` satisfies option of `useGetSubCollection`.
 */
export const assertSubCollectionOption = (obj: any) => {
  assert(obj !== undefined, "Option is undefined.");
  assert(typeof obj === "object", "Option should be object.");
  assert(obj !== null, "Option is null.");

  assert(
    containsKey("field")(obj),
    'Option in useGetSubCollection should contain "field" property.',
  );
  assert(
    containsKey("collectionPath")(obj),
    'Option in useGetSubCollection should contain "collectionPath" property.',
  );
};
