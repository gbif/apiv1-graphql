"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
Object.defineProperty(exports, "batchFaker", {
  enumerable: true,
  get: function () {
    return _batchFaker.default;
  }
});
exports.default = void 0;

var _request = _interopRequireDefault(require("./request"));

var _batchFaker = _interopRequireDefault(require("./batchFaker"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var _default = _request.default;
exports.default = _default;