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
type ValidateResult = {
  valid: boolean;
  message: string;
};
type ValidateFunction = (obj: any, target: string) => ValidateResult;
type Rule = {
  key: string;
  fn: ValidateFunction;
  optional?: boolean;
}[];

const isNull = (obj: any): boolean => obj === undefined || obj === null;
export const isObject = (obj: any, target: string): ValidateResult => ({
  valid: obj !== null && typeof obj === "object" && obj.constructor === Object,
  message: `${target} should be object.`,
});
export const isAnyOf = (candidate: any[]) => (obj: any, target: string): ValidateResult => ({
  valid: candidate.indexOf(obj) >= 0,
  message: `${target} should be any of [${candidate}].`,
});
export const isArrayOf = (rule: ValidateFunction) => (obj: any, target: string): ValidateResult => {
  if (!Array.isArray(obj)) {
    return {
      valid: false,
      message: `${target} should be array.`,
    };
  }
  const notMatched = obj
    .map(obj => rule(obj, "Element"))
    .filter((res: ValidateResult) => !res.valid);
  return notMatched.length > 0
    ? {
        valid: false,
        message: `${target} should be array and every element should satisfy below.\n"${notMatched[0].message}"`,
      }
    : {
        valid: true,
        message: "",
      };
};
export const isString = (obj: any, target: string): ValidateResult => ({
  valid: typeof obj === "string",
  message: `${target} should be string.`,
});
export const isNumber = (obj: any, target: string): ValidateResult => ({
  valid: typeof obj === "number",
  message: `${target} should be number.`,
});
export const isBoolean = (obj: any, target: string): ValidateResult => ({
  valid: typeof obj === "boolean",
  message: `${target} should be boolean.`,
});
export const isNotNull = (obj: any, target: string): ValidateResult => ({
  valid: !isNull(obj),
  message: `${target} should not be null or undefined.`,
});
export const isFunction = (obj: any, target: string): ValidateResult => ({
  valid: obj instanceof Function,
  message: `${target} should be function.`,
});
export const condition = (
  condition: (obj: any) => boolean,
  fn1: ValidateFunction,
  fn2: ValidateFunction,
) => (obj: any, target: string): ValidateResult => {
  return condition(obj) ? fn1(obj, target) : fn2(obj, target);
};

export const concatRule = (...otherRules: Rule[]): Rule =>
  otherRules.reduce((acc, val) => acc.concat(val), []);

export const matches = (rule: Rule) => (obj: any, target: string): ValidateResult => {
  if (typeof obj !== "object") {
    return isObject(obj, target);
  }
  for (let i = 0; i < rule.length; i++) {
    const { fn, key, optional } = rule[i];
    const value = obj[key];
    if (value) {
      const matchesRule = fn(value, `"${key}"`);

      if (!matchesRule.valid) {
        return matchesRule;
      }
      // optional can be undefined
    } else if (!optional) {
      return {
        valid: false,
        message: `"${key}" should not be null or undefined.`,
      };
    }
  }
  return {
    valid: true,
    message: "",
  };
};
export const matchesArrayOf = (rule: Rule) => (obj: any, target: string): ValidateResult => {
  if (!Array.isArray(obj)) {
    return {
      valid: false,
      message: `${target} should not be null or undefined.`,
    };
  }
  for (let i = 0; i < obj.length; i++) {
    const ele = obj[i];
    const matchesRule = matches(rule)(ele, `Element of ${target}`);
    if (!matchesRule.valid) {
      return matchesRule;
    }
  }
  return {
    valid: true,
    message: "",
  };
};
export const matchesObjectOf = (rule: Rule) => (obj: any, target: string): ValidateResult => {
  if (Array.isArray(obj)) {
    return {
      valid: false,
      message: `${target} should not be array.`,
    };
  }
  if (typeof obj !== "object") {
    return isObject(obj, target);
  }
  const entries = Object.entries(obj);
  for (let i = 0; i < entries.length; i++) {
    const key = entries[i][0];
    const value = entries[i][1];
    const matchesRule = matches(rule)(value, `"${key}"`);
    if (!matchesRule.valid) {
      return matchesRule;
    }
  }
  return {
    valid: true,
    message: "",
  };
};

export const acceptOutdatedRule: Rule = [
  {
    key: "acceptOutdated",
    optional: true,
    fn: isBoolean,
  },
];
export const callbackRule: Rule = [
  {
    key: "callback",
    optional: true,
    fn: isFunction,
  },
];
export const saveToStateRule: Rule = [
  {
    key: "saveToStateRule",
    optional: true,
    fn: isBoolean,
  },
];
export const mergeRule: Rule = [
  {
    key: "merge",
    optional: true,
    fn: isBoolean,
  },
  {
    key: "mergeFields",
    optional: true,
    fn: isArrayOf(isString),
  },
];

export const whereRule: Rule = [
  {
    key: "field",
    fn: isString,
  },
  {
    key: "operator",
    fn: isAnyOf(firestoreWhereFilterOp),
  },
  {
    key: "value",
    fn: isNotNull,
  },
];
export const orderRule: Rule = [
  {
    key: "by",
    fn: isString,
  },
  {
    key: "direction",
    optional: true,
    fn: isAnyOf(["asc", "desc"]),
  },
];
export const cursorRule: Rule = [
  {
    key: "origin",
    fn: isNotNull,
  },
  {
    key: "direction",
    fn: isAnyOf(["startAt", "startAfter", "endAt", "endBefore"]),
  },
  {
    key: "multipleFields",
    optional: true,
    fn: isBoolean,
  },
];

export const queryOptionRule: Rule = [
  {
    key: "where",
    optional: true,
    fn: condition((obj: any) => !Array.isArray(obj), matches(whereRule), matchesArrayOf(whereRule)),
  },
  {
    key: "limit",
    optional: true,
    fn: isNumber,
  },
  {
    key: "order",
    optional: true,
    fn: condition((obj: any) => !Array.isArray(obj), matches(orderRule), matchesArrayOf(orderRule)),
  },
  {
    key: "cursor",
    optional: true,
    fn: matches(cursorRule),
  },
];

export const queryRule: Rule = concatRule(
  [
    {
      key: "location",
      fn: isString,
    },
    {
      key: "connects",
      optional: true,
      fn: isBoolean,
    },
  ],
  queryOptionRule,
  acceptOutdatedRule,
  callbackRule,
);
export const arrayGetFqlRule: Rule = concatRule(
  [
    {
      key: "connects",
      fn: isBoolean,
      optional: true,
    },
    {
      key: "queries",
      fn: matchesArrayOf(queryRule),
    },
  ],
  acceptOutdatedRule,
  callbackRule,
);

export const getFqlRule: Rule = concatRule(
  [
    {
      key: "connects",
      fn: isBoolean,
      optional: true,
    },
    {
      key: "queries",
      fn: matchesObjectOf(queryRule),
    },
  ],
  acceptOutdatedRule,
  callbackRule,
);
export const subCollectionOptionRule = concatRule(acceptOutdatedRule, callbackRule);
export const paginateOptionRule = concatRule(
  [
    {
      key: "limit",
      fn: isNumber,
    },
    {
      key: "order",
      fn: condition(
        (obj: any) => !Array.isArray(obj),
        matches(orderRule),
        matchesArrayOf(orderRule),
      ),
    },
  ],
  queryOptionRule,
  callbackRule,
  acceptOutdatedRule,
);

export const assert = (isValid: boolean, errorMessage: string): void => {
  if (!isValid) throw Error(errorMessage);
};
export const assertObject = (obj: any, target: string): void => {
  assert(obj !== undefined, `${target} is undefined.`);
  assert(obj !== null, `${target} is null.`);
  assert(typeof obj === "object", `${target} should be object.`);
};
export const assertArray = (obj: any, target: string): void => {
  assert(obj !== undefined, `${target} is undefined.`);
  assert(obj !== null, `${target} is null.`);
  assert(Array.isArray(obj), `${target} should be array.`);
};
export const assertRule = (rule: Rule) => (obj: any, target: string): void => {
  const matchesRule = matches(rule)(obj, target);
  assert(matchesRule.valid, matchesRule.message);
};

export const assertStaticSetFql = (obj: any, target = "SetFql"): void => {
  assertObject(obj, target);
  assertRule([
    {
      key: "id",
      optional: true,
      fn: isString,
    },
    {
      key: "fields",
      optional: true,
      fn: isObject,
    },
  ])(obj, "Set doc query");
  if (obj.subCollection) {
    assertSubCollectionQuery(obj.subCollection, '"subCollection"');
  }
};
export const assertSetFql = (obj: any, target = "SetFql"): void => {
  if (!(obj instanceof Function)) {
    assertStaticSetFql(obj, target);
  }
};
export const assertStaticSetCollectionFql = (obj: any, target: string): void => {
  assertArray(obj, target);
  (obj as any).forEach((ele: any) => assertSetFql(ele));
};
export const assertSetCollectionFql = (obj: any, target = "SetCollectionFql"): void => {
  assert(Array.isArray(obj), `${target} should be array."`);
  obj.forEach((ele: any) => assertSetFql(ele));
};

const assertSubCollectionQuery = (obj: any, target = "SubCollectionQuery"): void => {
  assertObject(obj, target);
  const values = Object.values(obj);
  values.forEach(value => {
    assert(Array.isArray(value), `Value of ${target} should be array.`);
    (value as any).forEach((ele: any) => assertStaticSetFql(ele, "Element"));
  });
};
export const assertSetDocsFql = (obj: any, target = "SetFql"): void => {
  assertObject(obj, target);
  const entries = Object.entries(obj);
  entries.forEach(([key, value]) => assertSetFql(value, `"${key}"`));
};
