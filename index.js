'use strict';

var isArray = require('@fav/type.is-array');

function setDeep(obj, propPath, value) {
  if (arguments.length < 3) {
    return;
  }

  if (!isArray(propPath)) {
    propPath = [propPath];
  }

  if (!canHaveProp(obj)) {
    return;
  }

  var i = 0, last = propPath.length - 1;

  for (; i < last; i++) {
    var prop = propPath[i];
    var v = obj[prop];

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
