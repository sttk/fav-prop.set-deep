'use strict';

var isArray = require('@fav/type.is-array');

var disallowProtoPath = function(path, value) {
  if (value === Object.prototype) {
    throw new Error("Unsafe path encountered: " + path);
  }
}

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

  var i, last = propPath.length - 1;

  for (i = 0; i < last; i++) {
    var existentProp = propPath[i];
    if (isArray(existentProp)) {
      // This function doesn't allow to use an array as a property.
      return;
    }

    var child = obj[existentProp];
    if (!canHaveProp(child)) {
      break;
    }
    disallowProtoPath(existentProp, child);
    obj = child;
  }

  for (var j = last; j > i; j--) {
    var nonExistentProp = propPath[j];
    if (isArray(nonExistentProp)) {
      // This function doesn't allow to use an array as a property.
      return;
    }

    var parent = {};
    parent[nonExistentProp] = value;
    value = parent;
  }

  try {
    var graftedProp = propPath[i];
    if (isArray(graftedProp)) {
      // This function doesn't allow to use an array as a property.
      return;
    }
    obj[graftedProp] = value;
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
