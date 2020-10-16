"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.assertSetDocsFql = exports.assertSetCollectionFql = exports.assertStaticSetCollectionFql = exports.assertSetFql = exports.assertStaticSetFql = exports.assertRule = exports.assertArray = exports.assertObject = exports.assert = exports.paginateOptionRule = exports.subCollectionOptionRule = exports.getFqlRule = exports.arrayGetFqlRule = exports.queryRule = exports.queryOptionRule = exports.cursorRule = exports.orderRule = exports.whereRule = exports.mergeRule = exports.saveToStateRule = exports.callbackRule = exports.acceptOutdatedRule = exports.matchesObjectOf = exports.matchesArrayOf = exports.matches = exports.concatRule = exports.condition = exports.isFunction = exports.isNotNull = exports.isBoolean = exports.isNumber = exports.isString = exports.isArrayOf = exports.isAnyOf = exports.isObject = void 0;
var firestoreWhereFilterOp = [
    "<",
    "<=",
    "==",
    ">=",
    ">",
    "array-contains",
    "in",
    "array-contains-any",
];
var isNull = function (obj) { return obj === undefined || obj === null; };
exports.isObject = function (obj, target) { return ({
    valid: obj !== null && typeof obj === "object" && obj.constructor === Object,
    message: target + " should be object.",
}); };
exports.isAnyOf = function (candidate) { return function (obj, target) { return ({
    valid: candidate.indexOf(obj) >= 0,
    message: target + " should be any of [" + candidate + "].",
}); }; };
exports.isArrayOf = function (rule) { return function (obj, target) {
    if (!Array.isArray(obj)) {
        return {
            valid: false,
            message: target + " should be array.",
        };
    }
    var notMatched = obj
        .map(function (obj) { return rule(obj, "Element"); })
        .filter(function (res) { return !res.valid; });
    return notMatched.length > 0
        ? {
            valid: false,
            message: target + " should be array and every element should satisfy below.\n\"" + notMatched[0].message + "\"",
        }
        : {
            valid: true,
            message: "",
        };
}; };
exports.isString = function (obj, target) { return ({
    valid: typeof obj === "string",
    message: target + " should be string.",
}); };
exports.isNumber = function (obj, target) { return ({
    valid: typeof obj === "number",
    message: target + " should be number.",
}); };
exports.isBoolean = function (obj, target) { return ({
    valid: typeof obj === "boolean",
    message: target + " should be boolean.",
}); };
exports.isNotNull = function (obj, target) { return ({
    valid: !isNull(obj),
    message: target + " should not be null or undefined.",
}); };
exports.isFunction = function (obj, target) { return ({
    valid: obj instanceof Function,
    message: target + " should be function.",
}); };
exports.condition = function (condition, fn1, fn2) { return function (obj, target) {
    return condition(obj) ? fn1(obj, target) : fn2(obj, target);
}; };
exports.concatRule = function () {
    var otherRules = [];
    for (var _i = 0; _i < arguments.length; _i++) {
        otherRules[_i] = arguments[_i];
    }
    return otherRules.reduce(function (acc, val) { return acc.concat(val); }, []);
};
exports.matches = function (rule) { return function (obj, target) {
    if (typeof obj !== "object") {
        return exports.isObject(obj, target);
    }
    for (var i = 0; i < rule.length; i++) {
        var _a = rule[i], fn = _a.fn, key = _a.key, optional = _a.optional;
        var value = obj[key];
        if (value) {
            var matchesRule = fn(value, "\"" + key + "\"");
            if (!matchesRule.valid) {
                return matchesRule;
            }
            // optional can be undefined
        }
        else if (!optional) {
            return {
                valid: false,
                message: "\"" + key + "\" should not be null or undefined.",
            };
        }
    }
    return {
        valid: true,
        message: "",
    };
}; };
exports.matchesArrayOf = function (rule) { return function (obj, target) {
    if (!Array.isArray(obj)) {
        return {
            valid: false,
            message: target + " should not be null or undefined.",
        };
    }
    for (var i = 0; i < obj.length; i++) {
        var ele = obj[i];
        var matchesRule = exports.matches(rule)(ele, "Element of " + target);
        if (!matchesRule.valid) {
            return matchesRule;
        }
    }
    return {
        valid: true,
        message: "",
    };
}; };
exports.matchesObjectOf = function (rule) { return function (obj, target) {
    if (Array.isArray(obj)) {
        return {
            valid: false,
            message: target + " should not be array.",
        };
    }
    if (typeof obj !== "object") {
        return exports.isObject(obj, target);
    }
    var entries = Object.entries(obj);
    for (var i = 0; i < entries.length; i++) {
        var key = entries[i][0];
        var value = entries[i][1];
        var matchesRule = exports.matches(rule)(value, "\"" + key + "\"");
        if (!matchesRule.valid) {
            return matchesRule;
        }
    }
    return {
        valid: true,
        message: "",
    };
}; };
exports.acceptOutdatedRule = [
    {
        key: "acceptOutdated",
        optional: true,
        fn: exports.isBoolean,
    },
];
exports.callbackRule = [
    {
        key: "callback",
        optional: true,
        fn: exports.isFunction,
    },
];
exports.saveToStateRule = [
    {
        key: "saveToStateRule",
        optional: true,
        fn: exports.isBoolean,
    },
];
exports.mergeRule = [
    {
        key: "merge",
        optional: true,
        fn: exports.isBoolean,
    },
    {
        key: "mergeFields",
        optional: true,
        fn: exports.isArrayOf(exports.isString),
    },
];
exports.whereRule = [
    {
        key: "field",
        fn: exports.isString,
    },
    {
        key: "operator",
        fn: exports.isAnyOf(firestoreWhereFilterOp),
    },
    {
        key: "value",
        fn: exports.isNotNull,
    },
];
exports.orderRule = [
    {
        key: "by",
        fn: exports.isString,
    },
    {
        key: "direction",
        optional: true,
        fn: exports.isAnyOf(["asc", "desc"]),
    },
];
exports.cursorRule = [
    {
        key: "origin",
        fn: exports.isNotNull,
    },
    {
        key: "direction",
        fn: exports.isAnyOf(["startAt", "startAfter", "endAt", "endBefore"]),
    },
    {
        key: "multipleFields",
        optional: true,
        fn: exports.isBoolean,
    },
];
exports.queryOptionRule = [
    {
        key: "where",
        optional: true,
        fn: exports.condition(function (obj) { return !Array.isArray(obj); }, exports.matches(exports.whereRule), exports.matchesArrayOf(exports.whereRule)),
    },
    {
        key: "limit",
        optional: true,
        fn: exports.isNumber,
    },
    {
        key: "order",
        optional: true,
        fn: exports.condition(function (obj) { return !Array.isArray(obj); }, exports.matches(exports.orderRule), exports.matchesArrayOf(exports.orderRule)),
    },
    {
        key: "cursor",
        optional: true,
        fn: exports.matches(exports.cursorRule),
    },
];
exports.queryRule = exports.concatRule([
    {
        key: "location",
        fn: exports.isString,
    },
    {
        key: "connects",
        optional: true,
        fn: exports.isBoolean,
    },
], exports.queryOptionRule, exports.acceptOutdatedRule, exports.callbackRule);
exports.arrayGetFqlRule = exports.concatRule([
    {
        key: "connects",
        fn: exports.isBoolean,
        optional: true,
    },
    {
        key: "queries",
        fn: exports.matchesArrayOf(exports.queryRule),
    },
], exports.acceptOutdatedRule, exports.callbackRule);
exports.getFqlRule = exports.concatRule([
    {
        key: "connects",
        fn: exports.isBoolean,
        optional: true,
    },
    {
        key: "queries",
        fn: exports.matchesObjectOf(exports.queryRule),
    },
], exports.acceptOutdatedRule, exports.callbackRule);
exports.subCollectionOptionRule = exports.concatRule(exports.acceptOutdatedRule, exports.callbackRule);
exports.paginateOptionRule = exports.concatRule([
    {
        key: "limit",
        fn: exports.isNumber,
    },
    {
        key: "order",
        fn: exports.condition(function (obj) { return !Array.isArray(obj); }, exports.matches(exports.orderRule), exports.matchesArrayOf(exports.orderRule)),
    },
], exports.queryOptionRule, exports.callbackRule, exports.acceptOutdatedRule);
exports.assert = function (isValid, errorMessage) {
    if (!isValid)
        throw Error(errorMessage);
};
exports.assertObject = function (obj, target) {
    exports.assert(obj !== undefined, target + " is undefined.");
    exports.assert(obj !== null, target + " is null.");
    exports.assert(typeof obj === "object", target + " should be object.");
};
exports.assertArray = function (obj, target) {
    exports.assert(obj !== undefined, target + " is undefined.");
    exports.assert(obj !== null, target + " is null.");
    exports.assert(Array.isArray(obj), target + " should be array.");
};
exports.assertRule = function (rule) { return function (obj, target) {
    var matchesRule = exports.matches(rule)(obj, target);
    exports.assert(matchesRule.valid, matchesRule.message);
}; };
exports.assertStaticSetFql = function (obj, target) {
    if (target === void 0) { target = "SetFql"; }
    exports.assertObject(obj, target);
    exports.assertRule([
        {
            key: "id",
            optional: true,
            fn: exports.isString,
        },
        {
            key: "fields",
            optional: true,
            fn: exports.isObject,
        },
    ])(obj, "Set doc query");
    if (obj.subCollection) {
        assertSubCollectionQuery(obj.subCollection, '"subCollection"');
    }
};
exports.assertSetFql = function (obj, target) {
    if (target === void 0) { target = "SetFql"; }
    if (!(obj instanceof Function)) {
        exports.assertStaticSetFql(obj, target);
    }
};
exports.assertStaticSetCollectionFql = function (obj, target) {
    exports.assertArray(obj, target);
    obj.forEach(function (ele) { return exports.assertSetFql(ele); });
};
exports.assertSetCollectionFql = function (obj, target) {
    if (target === void 0) { target = "SetCollectionFql"; }
    exports.assert(Array.isArray(obj), target + " should be array.\"");
    obj.forEach(function (ele) { return exports.assertSetFql(ele); });
};
var assertSubCollectionQuery = function (obj, target) {
    if (target === void 0) { target = "SubCollectionQuery"; }
    exports.assertObject(obj, target);
    var values = Object.values(obj);
    values.forEach(function (value) {
        exports.assert(Array.isArray(value), "Value of " + target + " should be array.");
        value.forEach(function (ele) { return exports.assertStaticSetFql(ele, "Element"); });
    });
};
exports.assertSetDocsFql = function (obj, target) {
    if (target === void 0) { target = "SetFql"; }
    exports.assertObject(obj, target);
    var entries = Object.entries(obj);
    entries.forEach(function (_a) {
        var key = _a[0], value = _a[1];
        return exports.assertSetFql(value, "\"" + key + "\"");
    });
};
