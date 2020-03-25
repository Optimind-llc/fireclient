"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var react_1 = require("react");
var useIsMounted = function () {
    var isMounted = react_1.useRef(false);
    react_1.useEffect(function () {
        isMounted.current = true;
        return function () {
            isMounted.current = false;
        };
    }, []);
    return isMounted;
};
exports.default = useIsMounted;
