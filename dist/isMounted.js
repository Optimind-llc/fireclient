"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var react_1 = require("react");
var useIsMounted = function () {
    var isMounted = react_1.useRef(true);
    react_1.useEffect(function () {
        return function () {
            isMounted.current = false;
        };
    }, []);
    return isMounted;
};
exports.default = useIsMounted;
