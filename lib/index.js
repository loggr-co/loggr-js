"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
Object.defineProperty(exports, "__esModule", { value: true });
var isomorphic_unfetch_1 = require("isomorphic-unfetch");
var Loggr = /** @class */ (function () {
    function Loggr(options) {
        var _this = this;
        this.log = function (level, line) {
            var meta = {
                at: Date.now(),
                app: _this.app,
                level: level || 'INFO'
            };
            isomorphic_unfetch_1.default(_this.host + "/api/log", {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(__assign({ meta: meta }, line))
            })
                .then()
                .catch(function (error) { return console.log('Loggr: Failed to log', error); });
        };
        this.info = function (line) {
            _this.log('INFO', line);
        };
        this.warn = function (line) {
            _this.log('WARN', line);
        };
        this.debug = function (line) {
            _this.log('DEBUG', line);
        };
        this.error = function (line) {
            _this.log('ERROR', line);
        };
        this.success = function (line) {
            _this.log('SUCCESS', line);
        };
        this.critical = function (line) {
            _this.log('CRITICAL', line);
        };
        this.host = options.host;
        this.apiKey = options.apiKey;
        this.app = options.app;
    }
    return Loggr;
}());
exports.default = Loggr;
//# sourceMappingURL=index.js.map