(function(f){if(typeof exports==="object"&&typeof module!=="undefined"){module.exports=f()}else if(typeof define==="function"&&define.amd){define([],f)}else{var g;if(typeof window!=="undefined"){g=window}else if(typeof global!=="undefined"){g=global}else if(typeof self!=="undefined"){g=self}else{g=this}g=(g.fav||(g.fav = {}));g=(g.prop||(g.prop = {}));g.setDeep = f()}})(function(){var define,module,exports;return (function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
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