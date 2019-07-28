export const isArray = ob =>
  Object.prototype.toString.call(ob) === "[object Array]";
export const isNumber = ob =>
  Object.prototype.toString.call(ob) === "[object Number]";
export const isString = ob =>
  Object.prototype.toString.call(ob) === "[object String]";
export const isObject = ob =>
  Object.prototype.toString.call(ob) === "[object Object]";
