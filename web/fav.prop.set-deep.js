(function(f){if(typeof exports==="object"&&typeof module!=="undefined"){module.exports=f()}else if(typeof define==="function"&&define.amd){define([],f)}else{var g;if(typeof window!=="undefined"){g=window}else if(typeof global!=="undefined"){g=global}else if(typeof self!=="undefined"){g=self}else{g=this}g=(g.fav||(g.fav = {}));g=(g.prop||(g.prop = {}));g.setDeep = f()}})(function(){var define,module,exports;return (function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
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