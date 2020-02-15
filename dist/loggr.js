(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory();
	else if(typeof define === 'function' && define.amd)
		define("Loggr", [], factory);
	else if(typeof exports === 'object')
		exports["Loggr"] = factory();
	else
		root["Loggr"] = factory();
})(this, function() {
return /******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, { enumerable: true, get: getter });
/******/ 		}
/******/ 	};
/******/
/******/ 	// define __esModule on exports
/******/ 	__webpack_require__.r = function(exports) {
/******/ 		if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 			Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 		}
/******/ 		Object.defineProperty(exports, '__esModule', { value: true });
/******/ 	};
/******/
/******/ 	// create a fake namespace object
/******/ 	// mode & 1: value is a module id, require it
/******/ 	// mode & 2: merge all properties of value into the ns
/******/ 	// mode & 4: return value when already ns object
/******/ 	// mode & 8|1: behave like require
/******/ 	__webpack_require__.t = function(value, mode) {
/******/ 		if(mode & 1) value = __webpack_require__(value);
/******/ 		if(mode & 8) return value;
/******/ 		if((mode & 4) && typeof value === 'object' && value && value.__esModule) return value;
/******/ 		var ns = Object.create(null);
/******/ 		__webpack_require__.r(ns);
/******/ 		Object.defineProperty(ns, 'default', { enumerable: true, value: value });
/******/ 		if(mode & 2 && typeof value != 'string') for(var key in value) __webpack_require__.d(ns, key, function(key) { return value[key]; }.bind(null, key));
/******/ 		return ns;
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = "./index.ts");
/******/ })
/************************************************************************/
/******/ ({

/***/ "../node_modules/@brillout/assert/assert.js":
/*!**************************************************!*\
  !*** ../node_modules/@brillout/assert/assert.js ***!
  \**************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

var logify_input = __webpack_require__(/*! ./log */ "../node_modules/@brillout/assert/log.js").logify_input;
var titleFormat = __webpack_require__(/*! @brillout/format-text */ "../node_modules/@brillout/format-text/index.js").titleFormat;
var isNodejs = __webpack_require__(/*! ./utils/isNodejs */ "../node_modules/@brillout/assert/utils/isNodejs.js");

var option_keys = {
    is_warning: 'is_warning',
    is_usage: 'is_usage',
    is_internal: 'is_internal',
    details: 'details',
};

module.exports = assert;

function assert(condition) {
    if( condition ) {
        return condition;
    }

    // parse arguments
    var parsed = parseArguments([].slice.call(arguments, 1));
    var msgs = parsed.msgs;
    var opts = parsed.opts;

    var callStack = getCallStack();

    // build error message
    var {errorMessagesWithStackAndTitles, errorMessages} = getErrorMessage(condition, msgs, opts, callStack);

    // throw logic
    throwError(errorMessagesWithStackAndTitles, errorMessages, opts, callStack);

    // convenience to write code like `if( ! require('assert/soft')(condition) ) return;`
    return condition;
}

function parseArguments(args) {
    var msgs = [];
    var opts = {};
    for(var i in args) {
        var arg = args[i];
        var is_option_arg = arg && arg.IS_REASSERT_OPTS;
        if( is_option_arg ) {
            for(var j in arg) {
                if( !option_keys[j] && j!=='IS_REASSERT_OPTS' ) {
                    var msg = 'Unkonwn option `'+j+'`';
                    throw new Error('@brillout/assert: [Internal Error]: '+msg);
                }
                opts[j] = arg[j];
            }
        } else {
            msgs.push(arg);
        }
    }

    return {msgs: msgs, opts: opts};
}

function getErrorMessage(condition, msgs, opts, callStack) {
    var errorMessagesWithStackAndTitles = [];

    errorMessagesWithStackAndTitles = errorMessagesWithStackAndTitles.concat(getErrorDetailsMessage(opts));

    if( ! is_browser() ) {
        errorMessagesWithStackAndTitles = errorMessagesWithStackAndTitles.concat(getStackMessage(opts, msgs, callStack));
        errorMessagesWithStackAndTitles.push('\n');
    }

    var {errorMessages, errorMessagesWithTitle} = getErrorSummaryMessage(condition, msgs, opts);

    errorMessagesWithStackAndTitles = errorMessagesWithStackAndTitles.concat(errorMessagesWithTitle);

    return {errorMessages, errorMessagesWithStackAndTitles};
}
function getErrorSummaryMessage(condition, msgs, opts) {
    var errorMessagesWithTitle = [];
    var errorMessages = [];

    var title = (
        opts[option_keys.is_warning] && 'Warning' ||
        opts[option_keys.is_usage] && 'Wrong Usage' ||
        opts[option_keys.is_internal] && 'Internal Error' ||
        'Assertion Fail'
    );
    errorMessagesWithTitle.push(titleFormat(title));

    if( msgs.length===0 ) {
        const msg = 'Failed assertion condition: `'+condition+' != true`';
        errorMessagesWithTitle.push(msg);
        errorMessages.push(msg);
    }

    for(var i in msgs) {
        var msg = msgs[i];
        var str = logify_input(msg);

        errorMessagesWithTitle.push(str);
        errorMessages.push(str);
    }

    if( opts.details ) {
        errorMessagesWithTitle.push('');
        errorMessagesWithTitle.push('See "Error Details" above for more information.');
    }

    return {errorMessagesWithTitle, errorMessages};
}
function getStackMessage(opts, msgs, callStack) {
    if( opts[option_keys.is_warning] && msgs.length>0 ) {
        return [];
    }

    /*
    // Without this Node.js adds a `[` and a `]` to the error string
    var niceFormattingPrefix = 'Error\n    at:';
    */

    return [
     // niceFormattingPrefix,
        titleFormat('Stack Trace'),
        callStack.join('\n')
    ];
}
function getErrorDetailsMessage(opts) {
    if( ! opts.details ) {
        return [];
    }

    var message = [
        titleFormat('Error Details')
    ];

    for(var i in opts.details) {
        message.push(logify_input(opts.details[i]));
    }

    message.push('\n');

    return message;
}

function throwError(errorMessagesWithStackAndTitles, errorMessages, opts, callStack) {
    var interupt_execution = !opts[option_keys.is_warning];

    if( isNodejs() ) {
        if( interupt_execution ) {
            var err = new Error(errorMessages.join('\n'));
            err.stack = errorMessagesWithStackAndTitles.join('\n');
            throw err;
        } else {
            for(var i in errorMessagesWithStackAndTitles) console.error(errorMessagesWithStackAndTitles[i]);
        }
    }

    if( is_browser() ) {
        if( interupt_execution ) {
            throw__browser(errorMessagesWithStackAndTitles);
        } else {
            setTimeout(function() {
                throw__browser(errorMessagesWithStackAndTitles);
            }, 0);
        }
    }
}

function throw__browser(errorMessagesWithStackAndTitles) {
    for(var i in errorMessagesWithStackAndTitles) console.error(errorMessagesWithStackAndTitles[i]);
    Error.stackTraceLimit = Infinity;
    throw new Error();
}

function getCallStack() {
    var stackTraceLimit__original = Error.stackTraceLimit;
    Error.stackTraceLimit = Infinity;
    var callStackString = new Error().stack;
    Error.stackTraceLimit = stackTraceLimit__original;

    var lines = callStackString.split('\n');

    var lines__filtered = [];
    for(var i in lines) {
        var line = lines[i];
        if( line === 'Error' ) {
            continue;
        }
        if( line.indexOf('/node_modules/@brillout/assert/') !== -1 ) {
            continue;
        }
        if( line.indexOf(' (internal/') !== -1 ) {
            continue;
        }
     // line = line.replace(/^ */, '');
     // line = line.replace(/^at */, '  ');
        lines__filtered.push(line);
    }

    var callStack = lines__filtered;
    return callStack;
}

/* TODO - reimplement soft errors

    // determine whether we are in production
    var prod = is_prod();

    var message = 'Assertion-Error'+(prod?'[prod]':'[dev]')+': '+condition+'!=true';
    var interupt_execution = (!prod || opts[option_keys.is_hard]) && !opts[option_keys.is_soft];

function is_prod() {
    var prod_browser = is_browser() && window.location.hostname !== 'localhost';
    var prod_nodejs = isNodejs() && process.env['NODE_ENV'] === 'production';
    return prod_browser || prod_nodejs;
}
*/

function is_browser() {
    return typeof window !== "undefined";
}


/***/ }),

/***/ "../node_modules/@brillout/assert/index.js":
/*!*************************************************!*\
  !*** ../node_modules/@brillout/assert/index.js ***!
  \*************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

const assert = __webpack_require__(/*! ./assert */ "../node_modules/@brillout/assert/assert.js");
const assert_internal = __webpack_require__(/*! ./internal */ "../node_modules/@brillout/assert/internal.js");
const assert_usage = __webpack_require__(/*! ./usage */ "../node_modules/@brillout/assert/usage.js");
const assert_warning = __webpack_require__(/*! ./warning */ "../node_modules/@brillout/assert/warning.js");
const log = __webpack_require__(/*! ./log */ "../node_modules/@brillout/assert/log.js");

module.exports = assert;
module.exports.internal = assert_internal;
module.exports.usage = assert_usage;
module.exports.warning = assert_warning;
module.exports.log = log;


/***/ }),

/***/ "../node_modules/@brillout/assert/internal.js":
/*!****************************************************!*\
  !*** ../node_modules/@brillout/assert/internal.js ***!
  \****************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

var assert = __webpack_require__(/*! ./assert */ "../node_modules/@brillout/assert/assert.js");

module.exports = function() {
    var args = [].slice.call(arguments);
    args.push({
        IS_REASSERT_OPTS: true,
        is_internal: true,
    });
    return assert.apply(this, args);
};


/***/ }),

/***/ "../node_modules/@brillout/assert/log.js":
/*!***********************************************!*\
  !*** ../node_modules/@brillout/assert/log.js ***!
  \***********************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

var isNodejs = __webpack_require__(/*! ./utils/isNodejs */ "../node_modules/@brillout/assert/utils/isNodejs.js");

log.logify_input = logify_input;

module.exports = log;

var project_name = 'Reassert';
var stringification_name = '(Reassert-stringification)';

function log() {
    for(var i in arguments) {
        var input = arguments[i];
        var str = logify_input(input);
        console.log(str);
    }
}

function logify_input(input) {
    var str = get_str(input);

    // We cap huge strings to make scrolling not impossible
    var LIMIT = 10000;
    if( str && str.length > LIMIT ) {
      return str.slice(0, LIMIT)+'[CROPPED-BY-REASSERT]';
    }

    return str;
}

function get_str(input) {
    if( ! input ) {
        return input;
    }

    if( input.constructor === Array ) {
        return stringify_object(input);
    }

    var PREFIX_UGLY = '[object ';
    var input_str = toStr(input);
    if( input_str.slice(0, PREFIX_UGLY.length) === PREFIX_UGLY ) {
        return stringify_object(input);
    }
    return input_str;
}

function stringify_object(obj) {
    var obj_copy = get_prettier_copy(obj);
    try {
        return JSON.stringify(obj_copy, null, 2);
    } catch(e) {
        if( isNodejs() ) {
            var util = __webpack_require__(/*! util */ "../node_modules/util/util.js");
            return util.inspect(obj);
        }
        return toStr(obj_copy)+'['+e+'][Error]'+stringification_name;
    }
}

function get_prettier_copy(el, parent_objects=[]) {
    if( ! (el instanceof Object) ) {
        return el;
    }

    if( el instanceof RegExp ) {
        if( ! el.toJSON ) {
            el.toJSON = function() {
                var str = '[RegExp: '+toStr(el)+']';
                return str;
            };
        }
        return el;
    }
    if( el instanceof Function ) {
        if( ! el.toJSON ) {
            el.toJSON = function() {
                var str = (
                    ! el.name ? (
                        '[Function]'
                    ) : (
                        '[Function: '+el.name+']'
                    )
                );
                return str;
            };
        }
        return el;
    }

    if( el.constructor !== Object && el.constructor !== Array ) {
        return el;
    }

    if( parent_objects.includes(el) ) {
        return '[ALREADY_PRINTED_COPY]';
    }
    parent_objects = [el, ...parent_objects];

    var el_copy = new (el.constructor);
    for(var key in el) {
        el_copy[key] = get_prettier_copy(el[key], parent_objects);
    }
    return el_copy;
}

function toStr(thing) {
    if( typeof thing === "object" && !thing.toString ) {
      return '[object Object]';
    }
    return (''+thing);
}


/***/ }),

/***/ "../node_modules/@brillout/assert/usage.js":
/*!*************************************************!*\
  !*** ../node_modules/@brillout/assert/usage.js ***!
  \*************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

var assert = __webpack_require__(/*! ./assert */ "../node_modules/@brillout/assert/assert.js");

module.exports = function() {
    var args = [].slice.call(arguments);
    args.push({
        IS_REASSERT_OPTS: true,
        is_usage: true,
    });
    return assert.apply(this, args);
};


/***/ }),

/***/ "../node_modules/@brillout/assert/utils/isNodejs.js":
/*!**********************************************************!*\
  !*** ../node_modules/@brillout/assert/utils/isNodejs.js ***!
  \**********************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

/* WEBPACK VAR INJECTION */(function(process) {module.exports = isNodejs;

function isNodejs() {
  return  true && process && process.versions && process.versions.node;
}

/* WEBPACK VAR INJECTION */}.call(this, __webpack_require__(/*! ./../../../process/browser.js */ "../node_modules/process/browser.js")))

/***/ }),

/***/ "../node_modules/@brillout/assert/warning.js":
/*!***************************************************!*\
  !*** ../node_modules/@brillout/assert/warning.js ***!
  \***************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

var assert = __webpack_require__(/*! ./assert */ "../node_modules/@brillout/assert/assert.js");

module.exports = function() {
    var args = [].slice.call(arguments);
    args.push({
        IS_REASSERT_OPTS: true,
        is_warning: true,
    });
    return assert.apply(this, args);
};


/***/ }),

/***/ "../node_modules/@brillout/fetch/index.js":
/*!************************************************!*\
  !*** ../node_modules/@brillout/fetch/index.js ***!
  \************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var assert = __webpack_require__(/*! @brillout/assert */ "../node_modules/@brillout/assert/index.js");

var fetch;

if( isBrowser() ) {
  assert.usage(
    window.fetch!==undefined,
    [
      "This browser doesn't support `fetch` (`window.fetch===undefined`).",
      "Is this running in Internet Explorer?",
      "Note that the `@brillout/fetch` library doesn't support IE. If you want to support IE then use another fetch library."
    ].join('\n')
  );
  fetch = window.fetch.bind(window);
} else {
  // We use `eval('require')` instead of `require` to
  // make sure that webpack doesn't bundle `node-fetch`.
  fetch = eval('require')('node-fetch');
}

module.exports = fetch;

function isBrowser() {
  return typeof window !== "undefined";
}


/***/ }),

/***/ "../node_modules/@brillout/format-text/index.js":
/*!******************************************************!*\
  !*** ../node_modules/@brillout/format-text/index.js ***!
  \******************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

/* WEBPACK VAR INJECTION */(function(process) {module.exports = {tableFormat, titleFormat};

function tableFormat(rows, {padding=2, indent='  '}={}) {
    const columnWidths = [];

    rows.forEach(cells => {
        cells.forEach((cell, columnNumber) => {
            columnWidths[columnNumber] = (
                Math.max(
                    getStringWidth(cell),
                    columnWidths[columnNumber]||0
                )
            );
        });
    });

    const lines = [];

    rows.forEach(cells => {
        let line = indent;
        cells.forEach((cell, columnNumber) => {
            const colWidth = columnWidths[columnNumber];
            const isLastColumn = columnNumber===cells.length-1;
            const paddingRight = (
                 isLastColumn ? (
                    ''
                 ) : (
                     getBar(colWidth+padding, ' ').slice(getStringWidth(cell))
                 )
            );
            line += cell + paddingRight;
        });
        lines.push(line);
    });

    return lines.join('\n');
}

function titleFormat(title, {padding=3}={}) {
    // resolve cyclic dependency reassert => @brillout/format-text => reassert
    const assert_warning = __webpack_require__(/*! reassert/warning */ "../node_modules/reassert/warning.js");

    const min_bar_length = 40;
    title = ' '+title+' ';
    const titleWidth = getStringWidth(title);
    const barWidth = Math.max(min_bar_length, titleWidth+padding*2);
    const stringWidth = __webpack_require__(/*! string-width */ "../node_modules/string-width/index.js");
    const leftWidth = Math.floor((barWidth - titleWidth) / 2);
    const bar = getBar(barWidth);
    const title_bar = getBar(leftWidth) + title + getBar(barWidth - leftWidth - titleWidth);
    assert_warning(getStringWidth(bar)===getStringWidth(title_bar));
    return (
        [
            bar,
            title_bar,
            bar,
        ].join('\n')
    );
}
function getStringWidth(str) {
    if( ! isNodejs() ) {
        return str.length;
    }
    const stringWidth = eval('require')('string-width');
    return stringWidth(str);
}
function isNodejs() {
    return typeof process !== "undefined" && typeof window === "undefined";
}

function getBar(barWidth, filler='*') {
    return new Array(barWidth).fill(filler).join('');
}

/* WEBPACK VAR INJECTION */}.call(this, __webpack_require__(/*! ./../../process/browser.js */ "../node_modules/process/browser.js")))

/***/ }),

/***/ "../node_modules/ansi-regex/index.js":
/*!*******************************************!*\
  !*** ../node_modules/ansi-regex/index.js ***!
  \*******************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


module.exports = options => {
	options = Object.assign({
		onlyFirst: false
	}, options);

	const pattern = [
		'[\\u001B\\u009B][[\\]()#;?]*(?:(?:(?:[a-zA-Z\\d]*(?:;[-a-zA-Z\\d\\/#&.:=?%@~_]*)*)?\\u0007)',
		'(?:(?:\\d{1,4}(?:;\\d{0,4})*)?[\\dA-PR-TZcf-ntqry=><~]))'
	].join('|');

	return new RegExp(pattern, options.onlyFirst ? undefined : 'g');
};


/***/ }),

/***/ "../node_modules/emoji-regex/index.js":
/*!********************************************!*\
  !*** ../node_modules/emoji-regex/index.js ***!
  \********************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


module.exports = function () {
  // https://mths.be/emoji
  return /\uD83C\uDFF4(?:\uDB40\uDC67\uDB40\uDC62(?:\uDB40\uDC65\uDB40\uDC6E\uDB40\uDC67|\uDB40\uDC77\uDB40\uDC6C\uDB40\uDC73|\uDB40\uDC73\uDB40\uDC63\uDB40\uDC74)\uDB40\uDC7F|\u200D\u2620\uFE0F)|\uD83D\uDC69\u200D\uD83D\uDC69\u200D(?:\uD83D\uDC66\u200D\uD83D\uDC66|\uD83D\uDC67\u200D(?:\uD83D[\uDC66\uDC67]))|\uD83D\uDC68(?:\u200D(?:\u2764\uFE0F\u200D(?:\uD83D\uDC8B\u200D)?\uD83D\uDC68|(?:\uD83D[\uDC68\uDC69])\u200D(?:\uD83D\uDC66\u200D\uD83D\uDC66|\uD83D\uDC67\u200D(?:\uD83D[\uDC66\uDC67]))|\uD83D\uDC66\u200D\uD83D\uDC66|\uD83D\uDC67\u200D(?:\uD83D[\uDC66\uDC67])|\uD83C[\uDF3E\uDF73\uDF93\uDFA4\uDFA8\uDFEB\uDFED]|\uD83D[\uDCBB\uDCBC\uDD27\uDD2C\uDE80\uDE92]|\uD83E[\uDDB0-\uDDB3])|(?:\uD83C[\uDFFB-\uDFFF])\u200D(?:\uD83C[\uDF3E\uDF73\uDF93\uDFA4\uDFA8\uDFEB\uDFED]|\uD83D[\uDCBB\uDCBC\uDD27\uDD2C\uDE80\uDE92]|\uD83E[\uDDB0-\uDDB3]))|\uD83D\uDC69\u200D(?:\u2764\uFE0F\u200D(?:\uD83D\uDC8B\u200D(?:\uD83D[\uDC68\uDC69])|\uD83D[\uDC68\uDC69])|\uD83C[\uDF3E\uDF73\uDF93\uDFA4\uDFA8\uDFEB\uDFED]|\uD83D[\uDCBB\uDCBC\uDD27\uDD2C\uDE80\uDE92]|\uD83E[\uDDB0-\uDDB3])|\uD83D\uDC69\u200D\uD83D\uDC66\u200D\uD83D\uDC66|(?:\uD83D\uDC41\uFE0F\u200D\uD83D\uDDE8|\uD83D\uDC69(?:\uD83C[\uDFFB-\uDFFF])\u200D[\u2695\u2696\u2708]|\uD83D\uDC68(?:(?:\uD83C[\uDFFB-\uDFFF])\u200D[\u2695\u2696\u2708]|\u200D[\u2695\u2696\u2708])|(?:(?:\u26F9|\uD83C[\uDFCB\uDFCC]|\uD83D\uDD75)\uFE0F|\uD83D\uDC6F|\uD83E[\uDD3C\uDDDE\uDDDF])\u200D[\u2640\u2642]|(?:\u26F9|\uD83C[\uDFCB\uDFCC]|\uD83D\uDD75)(?:\uD83C[\uDFFB-\uDFFF])\u200D[\u2640\u2642]|(?:\uD83C[\uDFC3\uDFC4\uDFCA]|\uD83D[\uDC6E\uDC71\uDC73\uDC77\uDC81\uDC82\uDC86\uDC87\uDE45-\uDE47\uDE4B\uDE4D\uDE4E\uDEA3\uDEB4-\uDEB6]|\uD83E[\uDD26\uDD37-\uDD39\uDD3D\uDD3E\uDDB8\uDDB9\uDDD6-\uDDDD])(?:(?:\uD83C[\uDFFB-\uDFFF])\u200D[\u2640\u2642]|\u200D[\u2640\u2642])|\uD83D\uDC69\u200D[\u2695\u2696\u2708])\uFE0F|\uD83D\uDC69\u200D\uD83D\uDC67\u200D(?:\uD83D[\uDC66\uDC67])|\uD83D\uDC69\u200D\uD83D\uDC69\u200D(?:\uD83D[\uDC66\uDC67])|\uD83D\uDC68(?:\u200D(?:(?:\uD83D[\uDC68\uDC69])\u200D(?:\uD83D[\uDC66\uDC67])|\uD83D[\uDC66\uDC67])|\uD83C[\uDFFB-\uDFFF])|\uD83C\uDFF3\uFE0F\u200D\uD83C\uDF08|\uD83D\uDC69\u200D\uD83D\uDC67|\uD83D\uDC69(?:\uD83C[\uDFFB-\uDFFF])\u200D(?:\uD83C[\uDF3E\uDF73\uDF93\uDFA4\uDFA8\uDFEB\uDFED]|\uD83D[\uDCBB\uDCBC\uDD27\uDD2C\uDE80\uDE92]|\uD83E[\uDDB0-\uDDB3])|\uD83D\uDC69\u200D\uD83D\uDC66|\uD83C\uDDF6\uD83C\uDDE6|\uD83C\uDDFD\uD83C\uDDF0|\uD83C\uDDF4\uD83C\uDDF2|\uD83D\uDC69(?:\uD83C[\uDFFB-\uDFFF])|\uD83C\uDDED(?:\uD83C[\uDDF0\uDDF2\uDDF3\uDDF7\uDDF9\uDDFA])|\uD83C\uDDEC(?:\uD83C[\uDDE6\uDDE7\uDDE9-\uDDEE\uDDF1-\uDDF3\uDDF5-\uDDFA\uDDFC\uDDFE])|\uD83C\uDDEA(?:\uD83C[\uDDE6\uDDE8\uDDEA\uDDEC\uDDED\uDDF7-\uDDFA])|\uD83C\uDDE8(?:\uD83C[\uDDE6\uDDE8\uDDE9\uDDEB-\uDDEE\uDDF0-\uDDF5\uDDF7\uDDFA-\uDDFF])|\uD83C\uDDF2(?:\uD83C[\uDDE6\uDDE8-\uDDED\uDDF0-\uDDFF])|\uD83C\uDDF3(?:\uD83C[\uDDE6\uDDE8\uDDEA-\uDDEC\uDDEE\uDDF1\uDDF4\uDDF5\uDDF7\uDDFA\uDDFF])|\uD83C\uDDFC(?:\uD83C[\uDDEB\uDDF8])|\uD83C\uDDFA(?:\uD83C[\uDDE6\uDDEC\uDDF2\uDDF3\uDDF8\uDDFE\uDDFF])|\uD83C\uDDF0(?:\uD83C[\uDDEA\uDDEC-\uDDEE\uDDF2\uDDF3\uDDF5\uDDF7\uDDFC\uDDFE\uDDFF])|\uD83C\uDDEF(?:\uD83C[\uDDEA\uDDF2\uDDF4\uDDF5])|\uD83C\uDDF8(?:\uD83C[\uDDE6-\uDDEA\uDDEC-\uDDF4\uDDF7-\uDDF9\uDDFB\uDDFD-\uDDFF])|\uD83C\uDDEE(?:\uD83C[\uDDE8-\uDDEA\uDDF1-\uDDF4\uDDF6-\uDDF9])|\uD83C\uDDFF(?:\uD83C[\uDDE6\uDDF2\uDDFC])|\uD83C\uDDEB(?:\uD83C[\uDDEE-\uDDF0\uDDF2\uDDF4\uDDF7])|\uD83C\uDDF5(?:\uD83C[\uDDE6\uDDEA-\uDDED\uDDF0-\uDDF3\uDDF7-\uDDF9\uDDFC\uDDFE])|\uD83C\uDDE9(?:\uD83C[\uDDEA\uDDEC\uDDEF\uDDF0\uDDF2\uDDF4\uDDFF])|\uD83C\uDDF9(?:\uD83C[\uDDE6\uDDE8\uDDE9\uDDEB-\uDDED\uDDEF-\uDDF4\uDDF7\uDDF9\uDDFB\uDDFC\uDDFF])|\uD83C\uDDE7(?:\uD83C[\uDDE6\uDDE7\uDDE9-\uDDEF\uDDF1-\uDDF4\uDDF6-\uDDF9\uDDFB\uDDFC\uDDFE\uDDFF])|[#\*0-9]\uFE0F\u20E3|\uD83C\uDDF1(?:\uD83C[\uDDE6-\uDDE8\uDDEE\uDDF0\uDDF7-\uDDFB\uDDFE])|\uD83C\uDDE6(?:\uD83C[\uDDE8-\uDDEC\uDDEE\uDDF1\uDDF2\uDDF4\uDDF6-\uDDFA\uDDFC\uDDFD\uDDFF])|\uD83C\uDDF7(?:\uD83C[\uDDEA\uDDF4\uDDF8\uDDFA\uDDFC])|\uD83C\uDDFB(?:\uD83C[\uDDE6\uDDE8\uDDEA\uDDEC\uDDEE\uDDF3\uDDFA])|\uD83C\uDDFE(?:\uD83C[\uDDEA\uDDF9])|(?:\uD83C[\uDFC3\uDFC4\uDFCA]|\uD83D[\uDC6E\uDC71\uDC73\uDC77\uDC81\uDC82\uDC86\uDC87\uDE45-\uDE47\uDE4B\uDE4D\uDE4E\uDEA3\uDEB4-\uDEB6]|\uD83E[\uDD26\uDD37-\uDD39\uDD3D\uDD3E\uDDB8\uDDB9\uDDD6-\uDDDD])(?:\uD83C[\uDFFB-\uDFFF])|(?:\u26F9|\uD83C[\uDFCB\uDFCC]|\uD83D\uDD75)(?:\uD83C[\uDFFB-\uDFFF])|(?:[\u261D\u270A-\u270D]|\uD83C[\uDF85\uDFC2\uDFC7]|\uD83D[\uDC42\uDC43\uDC46-\uDC50\uDC66\uDC67\uDC70\uDC72\uDC74-\uDC76\uDC78\uDC7C\uDC83\uDC85\uDCAA\uDD74\uDD7A\uDD90\uDD95\uDD96\uDE4C\uDE4F\uDEC0\uDECC]|\uD83E[\uDD18-\uDD1C\uDD1E\uDD1F\uDD30-\uDD36\uDDB5\uDDB6\uDDD1-\uDDD5])(?:\uD83C[\uDFFB-\uDFFF])|(?:[\u231A\u231B\u23E9-\u23EC\u23F0\u23F3\u25FD\u25FE\u2614\u2615\u2648-\u2653\u267F\u2693\u26A1\u26AA\u26AB\u26BD\u26BE\u26C4\u26C5\u26CE\u26D4\u26EA\u26F2\u26F3\u26F5\u26FA\u26FD\u2705\u270A\u270B\u2728\u274C\u274E\u2753-\u2755\u2757\u2795-\u2797\u27B0\u27BF\u2B1B\u2B1C\u2B50\u2B55]|\uD83C[\uDC04\uDCCF\uDD8E\uDD91-\uDD9A\uDDE6-\uDDFF\uDE01\uDE1A\uDE2F\uDE32-\uDE36\uDE38-\uDE3A\uDE50\uDE51\uDF00-\uDF20\uDF2D-\uDF35\uDF37-\uDF7C\uDF7E-\uDF93\uDFA0-\uDFCA\uDFCF-\uDFD3\uDFE0-\uDFF0\uDFF4\uDFF8-\uDFFF]|\uD83D[\uDC00-\uDC3E\uDC40\uDC42-\uDCFC\uDCFF-\uDD3D\uDD4B-\uDD4E\uDD50-\uDD67\uDD7A\uDD95\uDD96\uDDA4\uDDFB-\uDE4F\uDE80-\uDEC5\uDECC\uDED0-\uDED2\uDEEB\uDEEC\uDEF4-\uDEF9]|\uD83E[\uDD10-\uDD3A\uDD3C-\uDD3E\uDD40-\uDD45\uDD47-\uDD70\uDD73-\uDD76\uDD7A\uDD7C-\uDDA2\uDDB0-\uDDB9\uDDC0-\uDDC2\uDDD0-\uDDFF])|(?:[#\*0-9\xA9\xAE\u203C\u2049\u2122\u2139\u2194-\u2199\u21A9\u21AA\u231A\u231B\u2328\u23CF\u23E9-\u23F3\u23F8-\u23FA\u24C2\u25AA\u25AB\u25B6\u25C0\u25FB-\u25FE\u2600-\u2604\u260E\u2611\u2614\u2615\u2618\u261D\u2620\u2622\u2623\u2626\u262A\u262E\u262F\u2638-\u263A\u2640\u2642\u2648-\u2653\u265F\u2660\u2663\u2665\u2666\u2668\u267B\u267E\u267F\u2692-\u2697\u2699\u269B\u269C\u26A0\u26A1\u26AA\u26AB\u26B0\u26B1\u26BD\u26BE\u26C4\u26C5\u26C8\u26CE\u26CF\u26D1\u26D3\u26D4\u26E9\u26EA\u26F0-\u26F5\u26F7-\u26FA\u26FD\u2702\u2705\u2708-\u270D\u270F\u2712\u2714\u2716\u271D\u2721\u2728\u2733\u2734\u2744\u2747\u274C\u274E\u2753-\u2755\u2757\u2763\u2764\u2795-\u2797\u27A1\u27B0\u27BF\u2934\u2935\u2B05-\u2B07\u2B1B\u2B1C\u2B50\u2B55\u3030\u303D\u3297\u3299]|\uD83C[\uDC04\uDCCF\uDD70\uDD71\uDD7E\uDD7F\uDD8E\uDD91-\uDD9A\uDDE6-\uDDFF\uDE01\uDE02\uDE1A\uDE2F\uDE32-\uDE3A\uDE50\uDE51\uDF00-\uDF21\uDF24-\uDF93\uDF96\uDF97\uDF99-\uDF9B\uDF9E-\uDFF0\uDFF3-\uDFF5\uDFF7-\uDFFF]|\uD83D[\uDC00-\uDCFD\uDCFF-\uDD3D\uDD49-\uDD4E\uDD50-\uDD67\uDD6F\uDD70\uDD73-\uDD7A\uDD87\uDD8A-\uDD8D\uDD90\uDD95\uDD96\uDDA4\uDDA5\uDDA8\uDDB1\uDDB2\uDDBC\uDDC2-\uDDC4\uDDD1-\uDDD3\uDDDC-\uDDDE\uDDE1\uDDE3\uDDE8\uDDEF\uDDF3\uDDFA-\uDE4F\uDE80-\uDEC5\uDECB-\uDED2\uDEE0-\uDEE5\uDEE9\uDEEB\uDEEC\uDEF0\uDEF3-\uDEF9]|\uD83E[\uDD10-\uDD3A\uDD3C-\uDD3E\uDD40-\uDD45\uDD47-\uDD70\uDD73-\uDD76\uDD7A\uDD7C-\uDDA2\uDDB0-\uDDB9\uDDC0-\uDDC2\uDDD0-\uDDFF])\uFE0F|(?:[\u261D\u26F9\u270A-\u270D]|\uD83C[\uDF85\uDFC2-\uDFC4\uDFC7\uDFCA-\uDFCC]|\uD83D[\uDC42\uDC43\uDC46-\uDC50\uDC66-\uDC69\uDC6E\uDC70-\uDC78\uDC7C\uDC81-\uDC83\uDC85-\uDC87\uDCAA\uDD74\uDD75\uDD7A\uDD90\uDD95\uDD96\uDE45-\uDE47\uDE4B-\uDE4F\uDEA3\uDEB4-\uDEB6\uDEC0\uDECC]|\uD83E[\uDD18-\uDD1C\uDD1E\uDD1F\uDD26\uDD30-\uDD39\uDD3D\uDD3E\uDDB5\uDDB6\uDDB8\uDDB9\uDDD1-\uDDDD])/g;
};


/***/ }),

/***/ "../node_modules/inherits/inherits_browser.js":
/*!****************************************************!*\
  !*** ../node_modules/inherits/inherits_browser.js ***!
  \****************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

if (typeof Object.create === 'function') {
  // implementation from standard node.js 'util' module
  module.exports = function inherits(ctor, superCtor) {
    if (superCtor) {
      ctor.super_ = superCtor
      ctor.prototype = Object.create(superCtor.prototype, {
        constructor: {
          value: ctor,
          enumerable: false,
          writable: true,
          configurable: true
        }
      })
    }
  };
} else {
  // old school shim for old browsers
  module.exports = function inherits(ctor, superCtor) {
    if (superCtor) {
      ctor.super_ = superCtor
      var TempCtor = function () {}
      TempCtor.prototype = superCtor.prototype
      ctor.prototype = new TempCtor()
      ctor.prototype.constructor = ctor
    }
  }
}


/***/ }),

/***/ "../node_modules/is-fullwidth-code-point/index.js":
/*!********************************************************!*\
  !*** ../node_modules/is-fullwidth-code-point/index.js ***!
  \********************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

/* eslint-disable yoda */
module.exports = x => {
	if (Number.isNaN(x)) {
		return false;
	}

	// code points are derived from:
	// http://www.unix.org/Public/UNIDATA/EastAsianWidth.txt
	if (
		x >= 0x1100 && (
			x <= 0x115f ||  // Hangul Jamo
			x === 0x2329 || // LEFT-POINTING ANGLE BRACKET
			x === 0x232a || // RIGHT-POINTING ANGLE BRACKET
			// CJK Radicals Supplement .. Enclosed CJK Letters and Months
			(0x2e80 <= x && x <= 0x3247 && x !== 0x303f) ||
			// Enclosed CJK Letters and Months .. CJK Unified Ideographs Extension A
			(0x3250 <= x && x <= 0x4dbf) ||
			// CJK Unified Ideographs .. Yi Radicals
			(0x4e00 <= x && x <= 0xa4c6) ||
			// Hangul Jamo Extended-A
			(0xa960 <= x && x <= 0xa97c) ||
			// Hangul Syllables
			(0xac00 <= x && x <= 0xd7a3) ||
			// CJK Compatibility Ideographs
			(0xf900 <= x && x <= 0xfaff) ||
			// Vertical Forms
			(0xfe10 <= x && x <= 0xfe19) ||
			// CJK Compatibility Forms .. Small Form Variants
			(0xfe30 <= x && x <= 0xfe6b) ||
			// Halfwidth and Fullwidth Forms
			(0xff01 <= x && x <= 0xff60) ||
			(0xffe0 <= x && x <= 0xffe6) ||
			// Kana Supplement
			(0x1b000 <= x && x <= 0x1b001) ||
			// Enclosed Ideographic Supplement
			(0x1f200 <= x && x <= 0x1f251) ||
			// CJK Unified Ideographs Extension B .. Tertiary Ideographic Plane
			(0x20000 <= x && x <= 0x3fffd)
		)
	) {
		return true;
	}

	return false;
};


/***/ }),

/***/ "../node_modules/process/browser.js":
/*!******************************************!*\
  !*** ../node_modules/process/browser.js ***!
  \******************************************/
/*! no static exports found */
/***/ (function(module, exports) {

// shim for using process in browser
var process = module.exports = {};

// cached from whatever global is present so that test runners that stub it
// don't break things.  But we need to wrap it in a try catch in case it is
// wrapped in strict mode code which doesn't define any globals.  It's inside a
// function because try/catches deoptimize in certain engines.

var cachedSetTimeout;
var cachedClearTimeout;

function defaultSetTimout() {
    throw new Error('setTimeout has not been defined');
}
function defaultClearTimeout () {
    throw new Error('clearTimeout has not been defined');
}
(function () {
    try {
        if (typeof setTimeout === 'function') {
            cachedSetTimeout = setTimeout;
        } else {
            cachedSetTimeout = defaultSetTimout;
        }
    } catch (e) {
        cachedSetTimeout = defaultSetTimout;
    }
    try {
        if (typeof clearTimeout === 'function') {
            cachedClearTimeout = clearTimeout;
        } else {
            cachedClearTimeout = defaultClearTimeout;
        }
    } catch (e) {
        cachedClearTimeout = defaultClearTimeout;
    }
} ())
function runTimeout(fun) {
    if (cachedSetTimeout === setTimeout) {
        //normal enviroments in sane situations
        return setTimeout(fun, 0);
    }
    // if setTimeout wasn't available but was latter defined
    if ((cachedSetTimeout === defaultSetTimout || !cachedSetTimeout) && setTimeout) {
        cachedSetTimeout = setTimeout;
        return setTimeout(fun, 0);
    }
    try {
        // when when somebody has screwed with setTimeout but no I.E. maddness
        return cachedSetTimeout(fun, 0);
    } catch(e){
        try {
            // When we are in I.E. but the script has been evaled so I.E. doesn't trust the global object when called normally
            return cachedSetTimeout.call(null, fun, 0);
        } catch(e){
            // same as above but when it's a version of I.E. that must have the global object for 'this', hopfully our context correct otherwise it will throw a global error
            return cachedSetTimeout.call(this, fun, 0);
        }
    }


}
function runClearTimeout(marker) {
    if (cachedClearTimeout === clearTimeout) {
        //normal enviroments in sane situations
        return clearTimeout(marker);
    }
    // if clearTimeout wasn't available but was latter defined
    if ((cachedClearTimeout === defaultClearTimeout || !cachedClearTimeout) && clearTimeout) {
        cachedClearTimeout = clearTimeout;
        return clearTimeout(marker);
    }
    try {
        // when when somebody has screwed with setTimeout but no I.E. maddness
        return cachedClearTimeout(marker);
    } catch (e){
        try {
            // When we are in I.E. but the script has been evaled so I.E. doesn't  trust the global object when called normally
            return cachedClearTimeout.call(null, marker);
        } catch (e){
            // same as above but when it's a version of I.E. that must have the global object for 'this', hopfully our context correct otherwise it will throw a global error.
            // Some versions of I.E. have different rules for clearTimeout vs setTimeout
            return cachedClearTimeout.call(this, marker);
        }
    }



}
var queue = [];
var draining = false;
var currentQueue;
var queueIndex = -1;

function cleanUpNextTick() {
    if (!draining || !currentQueue) {
        return;
    }
    draining = false;
    if (currentQueue.length) {
        queue = currentQueue.concat(queue);
    } else {
        queueIndex = -1;
    }
    if (queue.length) {
        drainQueue();
    }
}

function drainQueue() {
    if (draining) {
        return;
    }
    var timeout = runTimeout(cleanUpNextTick);
    draining = true;

    var len = queue.length;
    while(len) {
        currentQueue = queue;
        queue = [];
        while (++queueIndex < len) {
            if (currentQueue) {
                currentQueue[queueIndex].run();
            }
        }
        queueIndex = -1;
        len = queue.length;
    }
    currentQueue = null;
    draining = false;
    runClearTimeout(timeout);
}

process.nextTick = function (fun) {
    var args = new Array(arguments.length - 1);
    if (arguments.length > 1) {
        for (var i = 1; i < arguments.length; i++) {
            args[i - 1] = arguments[i];
        }
    }
    queue.push(new Item(fun, args));
    if (queue.length === 1 && !draining) {
        runTimeout(drainQueue);
    }
};

// v8 likes predictible objects
function Item(fun, array) {
    this.fun = fun;
    this.array = array;
}
Item.prototype.run = function () {
    this.fun.apply(null, this.array);
};
process.title = 'browser';
process.browser = true;
process.env = {};
process.argv = [];
process.version = ''; // empty string to avoid regexp issues
process.versions = {};

function noop() {}

process.on = noop;
process.addListener = noop;
process.once = noop;
process.off = noop;
process.removeListener = noop;
process.removeAllListeners = noop;
process.emit = noop;
process.prependListener = noop;
process.prependOnceListener = noop;

process.listeners = function (name) { return [] }

process.binding = function (name) {
    throw new Error('process.binding is not supported');
};

process.cwd = function () { return '/' };
process.chdir = function (dir) {
    throw new Error('process.chdir is not supported');
};
process.umask = function() { return 0; };


/***/ }),

/***/ "../node_modules/reassert/assert.js":
/*!******************************************!*\
  !*** ../node_modules/reassert/assert.js ***!
  \******************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

var logify_input = __webpack_require__(/*! ./log */ "../node_modules/reassert/log.js").logify_input;
var titleFormat = __webpack_require__(/*! @brillout/format-text */ "../node_modules/@brillout/format-text/index.js").titleFormat;
var isNodejs = __webpack_require__(/*! ./utils/isNodejs */ "../node_modules/reassert/utils/isNodejs.js");

var option_keys = {
    is_warning: 'is_warning',
    is_usage: 'is_usage',
    is_internal: 'is_internal',
    details: 'details',
};

module.exports = reassert;

function reassert(condition) {
    // assert
    if( condition ) {
        return condition;
    }

    // parse arguments
    var parsed = parseArguments([].slice.call(arguments, 1));
    var msgs = parsed.msgs;
    var opts = parsed.opts;

    var callStack = getCallStack();

    // build error message
    var message = getErrorMessage(condition, msgs, opts, callStack);

    // throw logic
    throwError(message, opts, callStack);

    // convenience to write code like `if( ! require('reassert/soft')(condition) ) return;`
    return condition;
}

function parseArguments(args) {
    var msgs = [];
    var opts = {};
    for(var i in args) {
        var arg = args[i];
        var is_option_arg = arg && arg.IS_REASSERT_OPTS;
        if( is_option_arg ) {
            for(var j in arg) {
                if( !option_keys[j] && j!=='IS_REASSERT_OPTS' ) {
                    var msg = 'Unkonwn option `'+j+'`';
                    throw new Error('Reassert: [Internal Error]: '+msg);
                }
                opts[j] = arg[j];
            }
        } else {
            msgs.push(arg);
        }
    }

    return {msgs: msgs, opts: opts};
}

function getErrorMessage(condition, msgs, opts, callStack) {
    var message = [];

    message = message.concat(getErrorDetailsMessage(opts));

    if( ! is_browser() ) {
        message = message.concat(getStackMessage(opts, msgs, callStack));
        message.push('\n');
    }

    message = message.concat(getErrorSummaryMessage(condition, msgs, opts));

    return message;
}
function getErrorSummaryMessage(condition, msgs, opts) {
    let message = [];

    var title = (
        opts[option_keys.is_warning] && 'Warning' ||
        opts[option_keys.is_usage] && 'Wrong Usage' ||
        opts[option_keys.is_internal] && 'Internal Error' ||
        'Assertion Fail'
    );

    message.push(titleFormat(title));

    if( msgs.length===0 ) {
        message.push('Failed assertion condition: `'+condition+' != true`');
    }

    for(var i in msgs) {
        var msg = msgs[i];
        var str = logify_input(msg);

        message.push(str);
    }

    if( opts.details ) {
        message.push('');
        message.push('See "Error Details" above for more information.');
    }

    return message;
}
function getStackMessage(opts, msgs, callStack) {
    if( opts[option_keys.is_warning] && msgs.length>0 ) {
        return [];
    }

    /*
    // Without this Node.js adds a `[` and a `]` to the error string
    var niceFormattingPrefix = 'Error\n    at:';
    */

    return [
     // niceFormattingPrefix,
        titleFormat('Stack Trace'),
        callStack.join('\n')
    ];
}
function getErrorDetailsMessage(opts) {
    if( ! opts.details ) {
        return [];
    }

    var message = [
        titleFormat('Error Details')
    ];

    for(var i in opts.details) {
        message.push(logify_input(opts.details[i]));
    }

    message.push('\n');

    return message;
}

function throwError(message, opts, callStack) {
    var interupt_execution = !opts[option_keys.is_warning];

    if( isNodejs() ) {
        if( interupt_execution ) {
            var err = new Error();
            err.stack = message.join('\n');
            throw err;
        } else {
            for(var i in message) console.error(message[i]);
        }
    }

    if( is_browser() ) {
        if( interupt_execution ) {
            throw__browser(message);
        } else {
            setTimeout(function() {
                throw__browser(message);
            }, 0);
        }
    }
}

function throw__browser(message) {
    for(var i in message) console.error(message[i]);
    Error.stackTraceLimit = Infinity;
    throw new Error();
}

function getCallStack() {
    var stackTraceLimit__original = Error.stackTraceLimit;
    Error.stackTraceLimit = Infinity;
    var callStackString = new Error().stack;
    Error.stackTraceLimit = stackTraceLimit__original;

    var lines = callStackString.split('\n');

    var lines__filtered = [];
    for(var i in lines) {
        var line = lines[i];
        if( line === 'Error' ) {
            continue;
        }
        if( line.indexOf('/node_modules/reassert/') !== -1 ) {
            continue;
        }
        if( line.indexOf(' (internal/') !== -1 ) {
            continue;
        }
     // line = line.replace(/^ */, '');
     // line = line.replace(/^at */, '  ');
        lines__filtered.push(line);
    }

    var callStack = lines__filtered;
    return callStack;
}

/* TODO - reimplement soft errors

    // determine whether we are in production
    var prod = is_prod();

    var message = 'Assertion-Error'+(prod?'[prod]':'[dev]')+': '+condition+'!=true';
    var interupt_execution = (!prod || opts[option_keys.is_hard]) && !opts[option_keys.is_soft];

function is_prod() {
    var prod_browser = is_browser() && window.location.hostname !== 'localhost';
    var prod_nodejs = isNodejs() && process.env['NODE_ENV'] === 'production';
    return prod_browser || prod_nodejs;
}
*/

function is_browser() {
    return typeof window !== "undefined";
}


/***/ }),

/***/ "../node_modules/reassert/log.js":
/*!***************************************!*\
  !*** ../node_modules/reassert/log.js ***!
  \***************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

var isNodejs = __webpack_require__(/*! ./utils/isNodejs */ "../node_modules/reassert/utils/isNodejs.js");

log.logify_input = logify_input;

module.exports = log;

var project_name = 'Reassert';
var stringification_name = '(Reassert-stringification)';

function log() {
    for(var i in arguments) {
        var input = arguments[i];
        var str = logify_input(input);
        console.log(str);
    }
}

function logify_input(input) {
    var str = get_str(input);

    // We cap huge strings to make scrolling not impossible
    var LIMIT = 10000;
    if( str && str.length > LIMIT ) {
      return str.slice(0, LIMIT)+'[CROPPED-BY-REASSERT]';
    }

    return str;
}

function get_str(input) {
    if( ! input ) {
        return input;
    }

    if( input.constructor === Array ) {
        return stringify_object(input);
    }

    var PREFIX_UGLY = '[object ';
    var input_str = toStr(input);
    if( input_str.slice(0, PREFIX_UGLY.length) === PREFIX_UGLY ) {
        return stringify_object(input);
    }
    return input_str;
}

function stringify_object(obj) {
    var obj_copy = get_prettier_copy(obj);
    try {
        return JSON.stringify(obj_copy, null, 2);
    } catch(e) {
        if( isNodejs() ) {
            var util = __webpack_require__(/*! util */ "../node_modules/util/util.js");
            return util.inspect(obj);
        }
        return toStr(obj_copy)+'['+e+'][Error]'+stringification_name;
    }
}

function get_prettier_copy(el, parent_objects=[]) {
    if( ! (el instanceof Object) ) {
        return el;
    }

    if( el instanceof RegExp ) {
        if( ! el.toJSON ) {
            el.toJSON = function() {
                var str = '[RegExp: '+toStr(el)+']';
                return str;
            };
        }
        return el;
    }
    if( el instanceof Function ) {
        if( ! el.toJSON ) {
            el.toJSON = function() {
                var str = (
                    ! el.name ? (
                        '[Function]'
                    ) : (
                        '[Function: '+el.name+']'
                    )
                );
                return str;
            };
        }
        return el;
    }

    if( el.constructor !== Object && el.constructor !== Array ) {
        return el;
    }

    if( parent_objects.includes(el) ) {
        return '[ALREADY_PRINTED_COPY]';
    }
    parent_objects = [el, ...parent_objects];

    var el_copy = new (el.constructor);
    for(var key in el) {
        el_copy[key] = get_prettier_copy(el[key], parent_objects);
    }
    return el_copy;
}

function toStr(thing) {
    if( typeof thing === "object" && !thing.toString ) {
      return '[object Object]';
    }
    return (''+thing);
}


/***/ }),

/***/ "../node_modules/reassert/utils/isNodejs.js":
/*!**************************************************!*\
  !*** ../node_modules/reassert/utils/isNodejs.js ***!
  \**************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

/* WEBPACK VAR INJECTION */(function(process) {module.exports = isNodejs;

function isNodejs() {
  return  true && process && process.versions && process.versions.node;
}

/* WEBPACK VAR INJECTION */}.call(this, __webpack_require__(/*! ./../../process/browser.js */ "../node_modules/process/browser.js")))

/***/ }),

/***/ "../node_modules/reassert/warning.js":
/*!*******************************************!*\
  !*** ../node_modules/reassert/warning.js ***!
  \*******************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

var assert = __webpack_require__(/*! ./assert */ "../node_modules/reassert/assert.js");

module.exports = function() {
    var args = [].slice.call(arguments);
    args.push({
        IS_REASSERT_OPTS: true,
        is_warning: true,
    });
    return assert.apply(this, args);
};


/***/ }),

/***/ "../node_modules/string-width/index.js":
/*!*********************************************!*\
  !*** ../node_modules/string-width/index.js ***!
  \*********************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

const stripAnsi = __webpack_require__(/*! strip-ansi */ "../node_modules/strip-ansi/index.js");
const isFullwidthCodePoint = __webpack_require__(/*! is-fullwidth-code-point */ "../node_modules/is-fullwidth-code-point/index.js");
const emojiRegex = __webpack_require__(/*! emoji-regex */ "../node_modules/emoji-regex/index.js")();

module.exports = input => {
	input = input.replace(emojiRegex, '  ');

	if (typeof input !== 'string' || input.length === 0) {
		return 0;
	}

	input = stripAnsi(input);

	let width = 0;

	for (let i = 0; i < input.length; i++) {
		const code = input.codePointAt(i);

		// Ignore control characters
		if (code <= 0x1F || (code >= 0x7F && code <= 0x9F)) {
			continue;
		}

		// Ignore combining characters
		if (code >= 0x300 && code <= 0x36F) {
			continue;
		}

		// Surrogates
		if (code > 0xFFFF) {
			i++;
		}

		width += isFullwidthCodePoint(code) ? 2 : 1;
	}

	return width;
};


/***/ }),

/***/ "../node_modules/strip-ansi/index.js":
/*!*******************************************!*\
  !*** ../node_modules/strip-ansi/index.js ***!
  \*******************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

const ansiRegex = __webpack_require__(/*! ansi-regex */ "../node_modules/ansi-regex/index.js");

const stripAnsi = string => typeof string === 'string' ? string.replace(ansiRegex(), '') : string;

module.exports = stripAnsi;
module.exports.default = stripAnsi;


/***/ }),

/***/ "../node_modules/util/support/isBufferBrowser.js":
/*!*******************************************************!*\
  !*** ../node_modules/util/support/isBufferBrowser.js ***!
  \*******************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = function isBuffer(arg) {
  return arg && typeof arg === 'object'
    && typeof arg.copy === 'function'
    && typeof arg.fill === 'function'
    && typeof arg.readUInt8 === 'function';
}

/***/ }),

/***/ "../node_modules/util/util.js":
/*!************************************!*\
  !*** ../node_modules/util/util.js ***!
  \************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

/* WEBPACK VAR INJECTION */(function(process) {// Copyright Joyent, Inc. and other Node contributors.
//
// Permission is hereby granted, free of charge, to any person obtaining a
// copy of this software and associated documentation files (the
// "Software"), to deal in the Software without restriction, including
// without limitation the rights to use, copy, modify, merge, publish,
// distribute, sublicense, and/or sell copies of the Software, and to permit
// persons to whom the Software is furnished to do so, subject to the
// following conditions:
//
// The above copyright notice and this permission notice shall be included
// in all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
// OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
// MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN
// NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
// DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
// OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE
// USE OR OTHER DEALINGS IN THE SOFTWARE.

var getOwnPropertyDescriptors = Object.getOwnPropertyDescriptors ||
  function getOwnPropertyDescriptors(obj) {
    var keys = Object.keys(obj);
    var descriptors = {};
    for (var i = 0; i < keys.length; i++) {
      descriptors[keys[i]] = Object.getOwnPropertyDescriptor(obj, keys[i]);
    }
    return descriptors;
  };

var formatRegExp = /%[sdj%]/g;
exports.format = function(f) {
  if (!isString(f)) {
    var objects = [];
    for (var i = 0; i < arguments.length; i++) {
      objects.push(inspect(arguments[i]));
    }
    return objects.join(' ');
  }

  var i = 1;
  var args = arguments;
  var len = args.length;
  var str = String(f).replace(formatRegExp, function(x) {
    if (x === '%%') return '%';
    if (i >= len) return x;
    switch (x) {
      case '%s': return String(args[i++]);
      case '%d': return Number(args[i++]);
      case '%j':
        try {
          return JSON.stringify(args[i++]);
        } catch (_) {
          return '[Circular]';
        }
      default:
        return x;
    }
  });
  for (var x = args[i]; i < len; x = args[++i]) {
    if (isNull(x) || !isObject(x)) {
      str += ' ' + x;
    } else {
      str += ' ' + inspect(x);
    }
  }
  return str;
};


// Mark that a method should not be used.
// Returns a modified function which warns once by default.
// If --no-deprecation is set, then it is a no-op.
exports.deprecate = function(fn, msg) {
  if (typeof process !== 'undefined' && process.noDeprecation === true) {
    return fn;
  }

  // Allow for deprecating things in the process of starting up.
  if (typeof process === 'undefined') {
    return function() {
      return exports.deprecate(fn, msg).apply(this, arguments);
    };
  }

  var warned = false;
  function deprecated() {
    if (!warned) {
      if (process.throwDeprecation) {
        throw new Error(msg);
      } else if (process.traceDeprecation) {
        console.trace(msg);
      } else {
        console.error(msg);
      }
      warned = true;
    }
    return fn.apply(this, arguments);
  }

  return deprecated;
};


var debugs = {};
var debugEnviron;
exports.debuglog = function(set) {
  if (isUndefined(debugEnviron))
    debugEnviron = process.env.NODE_DEBUG || '';
  set = set.toUpperCase();
  if (!debugs[set]) {
    if (new RegExp('\\b' + set + '\\b', 'i').test(debugEnviron)) {
      var pid = process.pid;
      debugs[set] = function() {
        var msg = exports.format.apply(exports, arguments);
        console.error('%s %d: %s', set, pid, msg);
      };
    } else {
      debugs[set] = function() {};
    }
  }
  return debugs[set];
};


/**
 * Echos the value of a value. Trys to print the value out
 * in the best way possible given the different types.
 *
 * @param {Object} obj The object to print out.
 * @param {Object} opts Optional options object that alters the output.
 */
/* legacy: obj, showHidden, depth, colors*/
function inspect(obj, opts) {
  // default options
  var ctx = {
    seen: [],
    stylize: stylizeNoColor
  };
  // legacy...
  if (arguments.length >= 3) ctx.depth = arguments[2];
  if (arguments.length >= 4) ctx.colors = arguments[3];
  if (isBoolean(opts)) {
    // legacy...
    ctx.showHidden = opts;
  } else if (opts) {
    // got an "options" object
    exports._extend(ctx, opts);
  }
  // set default options
  if (isUndefined(ctx.showHidden)) ctx.showHidden = false;
  if (isUndefined(ctx.depth)) ctx.depth = 2;
  if (isUndefined(ctx.colors)) ctx.colors = false;
  if (isUndefined(ctx.customInspect)) ctx.customInspect = true;
  if (ctx.colors) ctx.stylize = stylizeWithColor;
  return formatValue(ctx, obj, ctx.depth);
}
exports.inspect = inspect;


// http://en.wikipedia.org/wiki/ANSI_escape_code#graphics
inspect.colors = {
  'bold' : [1, 22],
  'italic' : [3, 23],
  'underline' : [4, 24],
  'inverse' : [7, 27],
  'white' : [37, 39],
  'grey' : [90, 39],
  'black' : [30, 39],
  'blue' : [34, 39],
  'cyan' : [36, 39],
  'green' : [32, 39],
  'magenta' : [35, 39],
  'red' : [31, 39],
  'yellow' : [33, 39]
};

// Don't use 'blue' not visible on cmd.exe
inspect.styles = {
  'special': 'cyan',
  'number': 'yellow',
  'boolean': 'yellow',
  'undefined': 'grey',
  'null': 'bold',
  'string': 'green',
  'date': 'magenta',
  // "name": intentionally not styling
  'regexp': 'red'
};


function stylizeWithColor(str, styleType) {
  var style = inspect.styles[styleType];

  if (style) {
    return '\u001b[' + inspect.colors[style][0] + 'm' + str +
           '\u001b[' + inspect.colors[style][1] + 'm';
  } else {
    return str;
  }
}


function stylizeNoColor(str, styleType) {
  return str;
}


function arrayToHash(array) {
  var hash = {};

  array.forEach(function(val, idx) {
    hash[val] = true;
  });

  return hash;
}


function formatValue(ctx, value, recurseTimes) {
  // Provide a hook for user-specified inspect functions.
  // Check that value is an object with an inspect function on it
  if (ctx.customInspect &&
      value &&
      isFunction(value.inspect) &&
      // Filter out the util module, it's inspect function is special
      value.inspect !== exports.inspect &&
      // Also filter out any prototype objects using the circular check.
      !(value.constructor && value.constructor.prototype === value)) {
    var ret = value.inspect(recurseTimes, ctx);
    if (!isString(ret)) {
      ret = formatValue(ctx, ret, recurseTimes);
    }
    return ret;
  }

  // Primitive types cannot have properties
  var primitive = formatPrimitive(ctx, value);
  if (primitive) {
    return primitive;
  }

  // Look up the keys of the object.
  var keys = Object.keys(value);
  var visibleKeys = arrayToHash(keys);

  if (ctx.showHidden) {
    keys = Object.getOwnPropertyNames(value);
  }

  // IE doesn't make error fields non-enumerable
  // http://msdn.microsoft.com/en-us/library/ie/dww52sbt(v=vs.94).aspx
  if (isError(value)
      && (keys.indexOf('message') >= 0 || keys.indexOf('description') >= 0)) {
    return formatError(value);
  }

  // Some type of object without properties can be shortcutted.
  if (keys.length === 0) {
    if (isFunction(value)) {
      var name = value.name ? ': ' + value.name : '';
      return ctx.stylize('[Function' + name + ']', 'special');
    }
    if (isRegExp(value)) {
      return ctx.stylize(RegExp.prototype.toString.call(value), 'regexp');
    }
    if (isDate(value)) {
      return ctx.stylize(Date.prototype.toString.call(value), 'date');
    }
    if (isError(value)) {
      return formatError(value);
    }
  }

  var base = '', array = false, braces = ['{', '}'];

  // Make Array say that they are Array
  if (isArray(value)) {
    array = true;
    braces = ['[', ']'];
  }

  // Make functions say that they are functions
  if (isFunction(value)) {
    var n = value.name ? ': ' + value.name : '';
    base = ' [Function' + n + ']';
  }

  // Make RegExps say that they are RegExps
  if (isRegExp(value)) {
    base = ' ' + RegExp.prototype.toString.call(value);
  }

  // Make dates with properties first say the date
  if (isDate(value)) {
    base = ' ' + Date.prototype.toUTCString.call(value);
  }

  // Make error with message first say the error
  if (isError(value)) {
    base = ' ' + formatError(value);
  }

  if (keys.length === 0 && (!array || value.length == 0)) {
    return braces[0] + base + braces[1];
  }

  if (recurseTimes < 0) {
    if (isRegExp(value)) {
      return ctx.stylize(RegExp.prototype.toString.call(value), 'regexp');
    } else {
      return ctx.stylize('[Object]', 'special');
    }
  }

  ctx.seen.push(value);

  var output;
  if (array) {
    output = formatArray(ctx, value, recurseTimes, visibleKeys, keys);
  } else {
    output = keys.map(function(key) {
      return formatProperty(ctx, value, recurseTimes, visibleKeys, key, array);
    });
  }

  ctx.seen.pop();

  return reduceToSingleString(output, base, braces);
}


function formatPrimitive(ctx, value) {
  if (isUndefined(value))
    return ctx.stylize('undefined', 'undefined');
  if (isString(value)) {
    var simple = '\'' + JSON.stringify(value).replace(/^"|"$/g, '')
                                             .replace(/'/g, "\\'")
                                             .replace(/\\"/g, '"') + '\'';
    return ctx.stylize(simple, 'string');
  }
  if (isNumber(value))
    return ctx.stylize('' + value, 'number');
  if (isBoolean(value))
    return ctx.stylize('' + value, 'boolean');
  // For some reason typeof null is "object", so special case here.
  if (isNull(value))
    return ctx.stylize('null', 'null');
}


function formatError(value) {
  return '[' + Error.prototype.toString.call(value) + ']';
}


function formatArray(ctx, value, recurseTimes, visibleKeys, keys) {
  var output = [];
  for (var i = 0, l = value.length; i < l; ++i) {
    if (hasOwnProperty(value, String(i))) {
      output.push(formatProperty(ctx, value, recurseTimes, visibleKeys,
          String(i), true));
    } else {
      output.push('');
    }
  }
  keys.forEach(function(key) {
    if (!key.match(/^\d+$/)) {
      output.push(formatProperty(ctx, value, recurseTimes, visibleKeys,
          key, true));
    }
  });
  return output;
}


function formatProperty(ctx, value, recurseTimes, visibleKeys, key, array) {
  var name, str, desc;
  desc = Object.getOwnPropertyDescriptor(value, key) || { value: value[key] };
  if (desc.get) {
    if (desc.set) {
      str = ctx.stylize('[Getter/Setter]', 'special');
    } else {
      str = ctx.stylize('[Getter]', 'special');
    }
  } else {
    if (desc.set) {
      str = ctx.stylize('[Setter]', 'special');
    }
  }
  if (!hasOwnProperty(visibleKeys, key)) {
    name = '[' + key + ']';
  }
  if (!str) {
    if (ctx.seen.indexOf(desc.value) < 0) {
      if (isNull(recurseTimes)) {
        str = formatValue(ctx, desc.value, null);
      } else {
        str = formatValue(ctx, desc.value, recurseTimes - 1);
      }
      if (str.indexOf('\n') > -1) {
        if (array) {
          str = str.split('\n').map(function(line) {
            return '  ' + line;
          }).join('\n').substr(2);
        } else {
          str = '\n' + str.split('\n').map(function(line) {
            return '   ' + line;
          }).join('\n');
        }
      }
    } else {
      str = ctx.stylize('[Circular]', 'special');
    }
  }
  if (isUndefined(name)) {
    if (array && key.match(/^\d+$/)) {
      return str;
    }
    name = JSON.stringify('' + key);
    if (name.match(/^"([a-zA-Z_][a-zA-Z_0-9]*)"$/)) {
      name = name.substr(1, name.length - 2);
      name = ctx.stylize(name, 'name');
    } else {
      name = name.replace(/'/g, "\\'")
                 .replace(/\\"/g, '"')
                 .replace(/(^"|"$)/g, "'");
      name = ctx.stylize(name, 'string');
    }
  }

  return name + ': ' + str;
}


function reduceToSingleString(output, base, braces) {
  var numLinesEst = 0;
  var length = output.reduce(function(prev, cur) {
    numLinesEst++;
    if (cur.indexOf('\n') >= 0) numLinesEst++;
    return prev + cur.replace(/\u001b\[\d\d?m/g, '').length + 1;
  }, 0);

  if (length > 60) {
    return braces[0] +
           (base === '' ? '' : base + '\n ') +
           ' ' +
           output.join(',\n  ') +
           ' ' +
           braces[1];
  }

  return braces[0] + base + ' ' + output.join(', ') + ' ' + braces[1];
}


// NOTE: These type checking functions intentionally don't use `instanceof`
// because it is fragile and can be easily faked with `Object.create()`.
function isArray(ar) {
  return Array.isArray(ar);
}
exports.isArray = isArray;

function isBoolean(arg) {
  return typeof arg === 'boolean';
}
exports.isBoolean = isBoolean;

function isNull(arg) {
  return arg === null;
}
exports.isNull = isNull;

function isNullOrUndefined(arg) {
  return arg == null;
}
exports.isNullOrUndefined = isNullOrUndefined;

function isNumber(arg) {
  return typeof arg === 'number';
}
exports.isNumber = isNumber;

function isString(arg) {
  return typeof arg === 'string';
}
exports.isString = isString;

function isSymbol(arg) {
  return typeof arg === 'symbol';
}
exports.isSymbol = isSymbol;

function isUndefined(arg) {
  return arg === void 0;
}
exports.isUndefined = isUndefined;

function isRegExp(re) {
  return isObject(re) && objectToString(re) === '[object RegExp]';
}
exports.isRegExp = isRegExp;

function isObject(arg) {
  return typeof arg === 'object' && arg !== null;
}
exports.isObject = isObject;

function isDate(d) {
  return isObject(d) && objectToString(d) === '[object Date]';
}
exports.isDate = isDate;

function isError(e) {
  return isObject(e) &&
      (objectToString(e) === '[object Error]' || e instanceof Error);
}
exports.isError = isError;

function isFunction(arg) {
  return typeof arg === 'function';
}
exports.isFunction = isFunction;

function isPrimitive(arg) {
  return arg === null ||
         typeof arg === 'boolean' ||
         typeof arg === 'number' ||
         typeof arg === 'string' ||
         typeof arg === 'symbol' ||  // ES6 symbol
         typeof arg === 'undefined';
}
exports.isPrimitive = isPrimitive;

exports.isBuffer = __webpack_require__(/*! ./support/isBuffer */ "../node_modules/util/support/isBufferBrowser.js");

function objectToString(o) {
  return Object.prototype.toString.call(o);
}


function pad(n) {
  return n < 10 ? '0' + n.toString(10) : n.toString(10);
}


var months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep',
              'Oct', 'Nov', 'Dec'];

// 26 Feb 16:19:34
function timestamp() {
  var d = new Date();
  var time = [pad(d.getHours()),
              pad(d.getMinutes()),
              pad(d.getSeconds())].join(':');
  return [d.getDate(), months[d.getMonth()], time].join(' ');
}


// log is just a thin wrapper to console.log that prepends a timestamp
exports.log = function() {
  console.log('%s - %s', timestamp(), exports.format.apply(exports, arguments));
};


/**
 * Inherit the prototype methods from one constructor into another.
 *
 * The Function.prototype.inherits from lang.js rewritten as a standalone
 * function (not on Function.prototype). NOTE: If this file is to be loaded
 * during bootstrapping this function needs to be rewritten using some native
 * functions as prototype setup using normal JavaScript does not work as
 * expected during bootstrapping (see mirror.js in r114903).
 *
 * @param {function} ctor Constructor function which needs to inherit the
 *     prototype.
 * @param {function} superCtor Constructor function to inherit prototype from.
 */
exports.inherits = __webpack_require__(/*! inherits */ "../node_modules/inherits/inherits_browser.js");

exports._extend = function(origin, add) {
  // Don't do anything if add isn't an object
  if (!add || !isObject(add)) return origin;

  var keys = Object.keys(add);
  var i = keys.length;
  while (i--) {
    origin[keys[i]] = add[keys[i]];
  }
  return origin;
};

function hasOwnProperty(obj, prop) {
  return Object.prototype.hasOwnProperty.call(obj, prop);
}

var kCustomPromisifiedSymbol = typeof Symbol !== 'undefined' ? Symbol('util.promisify.custom') : undefined;

exports.promisify = function promisify(original) {
  if (typeof original !== 'function')
    throw new TypeError('The "original" argument must be of type Function');

  if (kCustomPromisifiedSymbol && original[kCustomPromisifiedSymbol]) {
    var fn = original[kCustomPromisifiedSymbol];
    if (typeof fn !== 'function') {
      throw new TypeError('The "util.promisify.custom" argument must be of type Function');
    }
    Object.defineProperty(fn, kCustomPromisifiedSymbol, {
      value: fn, enumerable: false, writable: false, configurable: true
    });
    return fn;
  }

  function fn() {
    var promiseResolve, promiseReject;
    var promise = new Promise(function (resolve, reject) {
      promiseResolve = resolve;
      promiseReject = reject;
    });

    var args = [];
    for (var i = 0; i < arguments.length; i++) {
      args.push(arguments[i]);
    }
    args.push(function (err, value) {
      if (err) {
        promiseReject(err);
      } else {
        promiseResolve(value);
      }
    });

    try {
      original.apply(this, args);
    } catch (err) {
      promiseReject(err);
    }

    return promise;
  }

  Object.setPrototypeOf(fn, Object.getPrototypeOf(original));

  if (kCustomPromisifiedSymbol) Object.defineProperty(fn, kCustomPromisifiedSymbol, {
    value: fn, enumerable: false, writable: false, configurable: true
  });
  return Object.defineProperties(
    fn,
    getOwnPropertyDescriptors(original)
  );
}

exports.promisify.custom = kCustomPromisifiedSymbol

function callbackifyOnRejected(reason, cb) {
  // `!reason` guard inspired by bluebird (Ref: https://goo.gl/t5IS6M).
  // Because `null` is a special error value in callbacks which means "no error
  // occurred", we error-wrap so the callback consumer can distinguish between
  // "the promise rejected with null" or "the promise fulfilled with undefined".
  if (!reason) {
    var newReason = new Error('Promise was rejected with a falsy value');
    newReason.reason = reason;
    reason = newReason;
  }
  return cb(reason);
}

function callbackify(original) {
  if (typeof original !== 'function') {
    throw new TypeError('The "original" argument must be of type Function');
  }

  // We DO NOT return the promise as it gives the user a false sense that
  // the promise is actually somehow related to the callback's execution
  // and that the callback throwing will reject the promise.
  function callbackified() {
    var args = [];
    for (var i = 0; i < arguments.length; i++) {
      args.push(arguments[i]);
    }

    var maybeCb = args.pop();
    if (typeof maybeCb !== 'function') {
      throw new TypeError('The last argument must be of type Function');
    }
    var self = this;
    var cb = function() {
      return maybeCb.apply(self, arguments);
    };
    // In true node style we process the callback on `nextTick` with all the
    // implications (stack, `uncaughtException`, `async_hooks`)
    original.apply(this, args)
      .then(function(ret) { process.nextTick(cb, null, ret) },
            function(rej) { process.nextTick(callbackifyOnRejected, rej, cb) });
  }

  Object.setPrototypeOf(callbackified, Object.getPrototypeOf(original));
  Object.defineProperties(callbackified,
                          getOwnPropertyDescriptors(original));
  return callbackified;
}
exports.callbackify = callbackify;

/* WEBPACK VAR INJECTION */}.call(this, __webpack_require__(/*! ./../process/browser.js */ "../node_modules/process/browser.js")))

/***/ }),

/***/ "./index.ts":
/*!******************!*\
  !*** ./index.ts ***!
  \******************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

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
var fetch_1 = __webpack_require__(/*! @brillout/fetch */ "../node_modules/@brillout/fetch/index.js");
function isBrowser() {
    return typeof window !== 'undefined';
}
var Loggr = /** @class */ (function () {
    function Loggr(options) {
        var _this = this;
        this.log = function (level, line) {
            var meta = {
                at: Date.now(),
                app: _this.app,
                level: level || 'INFO'
            };
            console.log('isBrowser', isBrowser(), _this.host + "/api/log", fetch_1.default);
            fetch_1.default(_this.host + "/api/log", {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(__assign({ meta: meta }, line))
            })
                .then(function (res) { return res.json(); })
                .then(function (json) { return console.log('Loggr: Successful to log', json); })
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


/***/ })

/******/ });
});
//# sourceMappingURL=loggr.js.map