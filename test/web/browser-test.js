(function(){
'use strict';

/* eslint brace-style: off */


var expect = chai.expect;



var setDeep = fav.prop.setDeep;

describe('fav.prop.set-deep', function() {

  it('Should set value of the specified prop path', function() {
    var obj = {
      a00: {
        a10: { a20: 1, a21: 2, a22: 3 },
        a11: { a20: 4, a21: 5, a22: 6 },
      },
    };

    setDeep(obj, ['a00', 'a10', 'a20'], 10);
    expect(obj.a00.a10.a20).to.equal(10);

    setDeep(obj, ['a00', 'a10', 'a21'], 20);
    expect(obj.a00.a10.a21).to.equal(20);

    setDeep(obj, ['a00', 'a10', 'a22'], 30);
    expect(obj.a00.a10.a22).to.equal(30);

    setDeep(obj, ['a00', 'a10'], 100);
    expect(obj.a00.a10).to.equal(100);

    setDeep(obj, ['a00', 'a11'], 110);
    expect(obj.a00.a11).to.equal(110);

    setDeep(obj, ['a00'], 999);
    expect(obj.a00).to.equal(999);
  });

  it('Should set value of the specified prop key', function() {
    var obj = {
      a00: {
        a10: { a20: 1, a21: 2, a22: 3 },
        a11: { a20: 4, a21: 5, a22: 6 },
      },
      a01: {
        a10: { a20: 7, a21: 8, a22: 9 },
        a11: {},
      },
    };

    setDeep(obj, 'a00', 100);
    expect(obj.a00, 100);

    setDeep(obj, 'a01', 200);
    expect(obj.a01, 200);
  });

  it('Should create a property and set its value when the prop does not exist',
  function() {
    var obj = {
      a00: {
        a10: { a20: 1, a21: 2, a22: 3 },
        a11: { a20: 4, a21: 5, a22: 6 },
      },
      a01: {
        a10: { a20: 7, a21: 8, a22: 9 },
        a11: {},
      },
    };

    setDeep(obj, ['a01', 'a11', 'a22'], 'A');
    expect(obj.a01.a11.a22).to.equal('A');

    setDeep(obj, 'a02', 'B');
    expect(obj.a02).to.equal('B');

    setDeep(obj, ['a', 'b', 'c', 'd', 'e'], 'C');
    expect(obj.a.b.c.d.e).to.equal('C');
  });

  it('Should do nothing when obj is primitive type', function() {
    var v = undefined;
    setDeep(v, ['length'], 123);
    expect(v).to.deep.equal(undefined);

    v = null;
    setDeep(v, ['length'], 123);
    expect(v).to.deep.equal(null);

    v = true;
    setDeep(v, ['length'], 123);
    expect(v).to.deep.equal(true);
    expect(v.length).to.equal(undefined);

    v = false;
    setDeep(v, ['length'], 123);
    expect(v).to.deep.equal(false);
    expect(v.length).to.equal(undefined);

    v = 0;
    setDeep(v, ['length'], 12333);
    expect(v).to.deep.equal(0);
    expect(v.length).to.equal(undefined);

    v = 999;
    setDeep(v, ['length'], 123);
    expect(v).to.deep.equal(999);
    expect(v.length).to.equal(undefined);

    if (typeof Symbol === 'function') {
      v = Symbol('v');
      setDeep(v, ['length'], 123);
      expect(v).to.deep.equal(v);
      expect(v.length).to.equal(undefined);
    }
  });

  it('Should set prop value when obj is not a plain object', function() {
    var obj = new Boolean(true);
    setDeep(obj, ['a', 'b', 'c'], 123);
    expect(obj.a.b.c).to.equal(123);

    obj = new Boolean(false);
    setDeep(obj, ['a', 'b', 'c'], 456);
    expect(obj.a.b.c).to.equal(456);

    obj = new Number(0);
    setDeep(obj, ['a', 'b', 'c'], 789);
    expect(obj.a.b.c).to.equal(789);

    obj = new Number(123);
    setDeep(obj, ['a', 'b', 'c'], 'abc');
    expect(obj.a.b.c).to.equal('abc');

    obj = new String('AAA');
    setDeep(obj, ['a', 'b', 'c'], 'def');
    expect(obj.a.b.c).to.equal('def');

    obj = [];
    setDeep(obj, ['a', 'b', 'c'], 'ghi');
    expect(obj.a.b.c).to.equal('ghi');

    obj = {};
    setDeep(obj, ['a', 'b', 'c'], 'jkl');
    expect(obj.a.b.c).to.equal('jkl');

    obj = function() {};
    setDeep(obj, ['a', 'b', 'c'], 'mno');
    expect(obj.a.b.c).to.equal('mno');

    obj = new Date();
    setDeep(obj, ['a', 'b', 'c'], 'pqr');
    expect(obj.a.b.c).to.equal('pqr');
  });

  it('Should set a value to enumerable property key', function() {
    var obj = { a: { b: { c: 123 } } };
    setDeep(obj, ['a', 'b', 'c'], 111);
    expect(obj.a.b.c).to.equal(111);
  });

  it('Should set a value to unenumerable property key', function() {
    var obj = {};
    Object.defineProperty(obj, 'a', { writable: true, value: {} });
    Object.defineProperty(obj.a, 'b', { writable: true, value: {} });
    Object.defineProperty(obj.a.b, 'c', { writable: true, value: 123 });
    setDeep(obj, ['a', 'b', 'c'], 222);
    expect(obj.a.b.c).to.equal(222);
  });

  it('Should not throw an error when property is read only', function() {
    var obj = {};
    Object.defineProperty(obj, 'a', { value: {} });
    Object.defineProperty(obj.a, 'b', { value: {} });
    Object.defineProperty(obj.a.b, 'c', { value: 123 });
    setDeep(obj, ['a', 'b', 'c'], 222);
    expect(obj.a.b.c).to.equal(123);

    Object.defineProperty(obj.a, 'b2', { value: 123 });
    setDeep(obj, ['a', 'b2', 'c2'], 222);
    expect(obj.a.b2).to.equal(123);
    expect(obj.a.b2.c2).to.equal(undefined);
  });

  it('Should set a value to inherited property key', function() {
    var obj0 = new function() {
      this.a = {};
    };
    Object.defineProperty(obj0.a, 'b', { value: {} });

    obj0.a.b.c = 123;
    function Fn1() {};
    Fn1.prototype = obj0;
    var obj = new Fn1();
    expect(obj.a.b.c).to.equal(123);

    setDeep(obj, ['a', 'b', 'c'], 987);
    expect(obj.a.b.c).to.equal(987);
  });

  it('Should set a value to enumerable property symbol', function() {
    if (typeof Symbol !== 'function') {
      this.skip();
      return;
    }
    var a = Symbol('a'), b = Symbol('b'), c = Symbol('c');

    var obj = {};
    obj[a] = {};
    obj[a][b] = {};
    obj[a][b][c] = 1;

    setDeep(obj, [a, b, c], 2);
    expect(obj[a][b][c], 2);
  });

  it('Should set a value to unenumerable property key', function() {
    if (typeof Symbol !== 'function') {
      this.skip();
      return;
    }
    var a = Symbol('a'), b = Symbol('b'), c = Symbol('c');

    var obj = {};
    Object.defineProperty(obj, a, { value: {} });
    Object.defineProperty(obj[a], b, { value: {} });
    Object.defineProperty(obj[a][b], c, { writable: true, value: 1 });

    setDeep(obj, [a, b, c], 2);
    expect(obj[a][b][c]).to.equal(2);
  });

  it('Should not throw an error when property is read only', function() {
    if (typeof Symbol !== 'function') {
      this.skip();
      return;
    }
    var a = Symbol('a'), b = Symbol('b'), c = Symbol('c');

    var obj = {};
    Object.defineProperty(obj, a, { value: {} });
    Object.defineProperty(obj[a], b, { value: {} });
    Object.defineProperty(obj[a][b], c, { value: 1 });

    setDeep(obj, [a, b, c], 2);
    expect(obj[a][b][c]).to.equal(1);
  });

  it('Should set a value to inherited property key', function() {
    if (typeof Symbol !== 'function') {
      this.skip();
      return;
    }
    var a = Symbol('a'), b = Symbol('b'), c = Symbol('c');

    var obj0 = new function() {
      this[a] = {};
    };
    Object.defineProperty(obj0[a], b, { value: {} });

    obj0[a][b][c] = 123;
    function Fn1() {};
    Fn1.prototype = obj0;
    var obj = new Fn1();
    expect(obj[a][b][c]).to.equal(123);

    setDeep(obj, [a, b, c], 987);
    expect(obj[a][b][c]).to.equal(987);
  });

  it('Should do nothing when all arguments is not specified', function() {
    var obj = {};
    setDeep(obj, ['a', 'b']);
    expect(obj).to.deep.equal({});

    setDeep(obj);
    expect(obj).to.deep.equal({});
  });

  it('Should not throw an error when 2nd arg is a Symbol array', function() {
    if (typeof Symbol !== 'function') {
      this.skip();
      return;
    }

    var a = Symbol('a'), b = Symbol('b'), c = Symbol('c');
    var obj = {};
    obj[a] = {};
    obj[a][b] = {};
    obj[a][b][c] = 123;

    setDeep(obj, [[a], b, c], 123);
    expect(obj[a][b][c]).to.equal(123);

    setDeep(obj, [a, [b], c], 123);
    expect(obj[a][b][c]).to.equal(123);

    setDeep(obj, [a, b, [c]], 123);
    expect(obj[a][b][c]).to.equal(123);
  });
});

})();
