'use strict';

var isArray = require('@fav/type.is-array');

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

  var i = 0, last = propPath.length - 1;

  for (; i < last; i++) {
    var prop = propPath[i];
    var v;
    try {
      v = obj[prop];
    } catch (e) {
      // If `prop` is an array of Symbol, obj[prop] throws an error,
      // but this function suppress it and return undefined.
      return;
    }

    if (!canHaveProp(v)) {
      break;
    }

    obj = v;
  }

  for (; i < last; i++) {
    try {
      obj = obj[propPath[i]] = {};
    } catch (e) {
      // If a property is read only, TypeError is thrown,
      // but this function suppresses the error and stop setting.
      // In addition if `prop` is an array of Symbol, obj[prop] throws an
      // error, but this function suppress it.
      return;
    }
  }

  try {
    obj[propPath[last]] = value;
  } catch (e) {
    // If a property is read only, TypeError is thrown,
    // but this function ignores it.
  }
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

module.exports = setDeep;
