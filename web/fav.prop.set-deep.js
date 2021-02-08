(function(f){if(typeof exports==="object"&&typeof module!=="undefined"){module.exports=f()}else if(typeof define==="function"&&define.amd){define([],f)}else{var g;if(typeof window!=="undefined"){g=window}else if(typeof global!=="undefined"){g=global}else if(typeof self!=="undefined"){g=self}else{g=this}g=(g.fav||(g.fav = {}));g=(g.prop||(g.prop = {}));g.setDeep = f()}})(function(){var define,module,exports;return (function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
'use strict';

var isArray = require('@fav/type.is-array');

var disallowProtoPath = function(path, value) {
  if (value === Object.prototype) {
    throw new Error('Unsafe path encountered: ' + path);
  }
};

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

},{"@fav/type.is-array":2}],2:[function(require,module,exports){
'use strict';

function isArray(value) {
  return Array.isArray(value);
}

function isNotArray(value) {
  return !Array.isArray(value);
}

Object.defineProperty(isArray, 'not', {
  enumerable: true,
  value: isNotArray,
});

module.exports = isArray;

},{}]},{},[1])(1)
});
