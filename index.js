'use strict';

var isArray = require('@fav/type.is-array');
var ignoredError = new Error();

function setDeep(obj, propPath, value) {
  if (arguments.length < 3) {
    return;
  }

  if (!isArray(propPath)) {
    return;
  }

  if (!canHaveProp(obj)) {
    return;
  }

  var last = propPath.length - 1;

  try {
    for (var i = 0; i < last; i++) {
      var prop = propPath[i];
      var child = getProp(obj, prop);

      if (!canHaveProp(child)) {
        setProp(obj, prop, createDeep(propPath, i + 1, value));
        return;
      }

      obj = child;
    }
    setProp(obj, propPath[last], value);
  } catch (e) {
    /* istanbul ignore if */
    if (e !== ignoredError) {
      throw e;
    }
  }
}

function createDeep(propPath, topIndex, value) {
  var obj = value;
  for (var i = propPath.length - 1; i >= topIndex; i--) {
    var parent = {};
    setProp(parent, propPath[i], obj);
    obj = parent;
  }
  return obj;
}

function canHaveProp(obj) {
  switch (typeof obj) {
    case 'object': {
      return (obj != null);
    }
    case 'function': {
      return true;
    }
    default: {
      return false;
    }
  }
}

function getProp(obj, prop) {
  try {
    return obj[prop];
  } catch (e) {
    // If `prop` is an array of Symbol, obj[prop] throws
    // an error, but this function suppress it.
    throw ignoredError;
  }
}

function setProp(obj, prop, value) {
  try {
    obj[prop] = value;
  } catch (e) {
    // If a property is read only, TypeError is thrown,
    // but this function ignores it.
    // In addition, if `prop` is an array of Symbol, obj[prop] throws
    // an error, but this function suppress it.
    throw ignoredError;
  }
}

module.exports = setDeep;
