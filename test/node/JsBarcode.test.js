var assert = require('assert');
var JsBarcode = require('../../JsBarcode.js');
var Canvas = require("canvas");

describe('Encoders', function() {
  it('should be able to include the encoders needed', function () {
    CODE128 = JsBarcode.getModule("CODE128");
    GENERIC = JsBarcode.getModule("generic");
  });
});

describe('node-canvas generation', function() {
  it('should generate normal canvas', function () {
    var canvas = new Canvas();
    JsBarcode(canvas, "Hello");
  });

  it('checking width', function () {
    var canvas1 = new Canvas();
    var canvas2 = new Canvas();

    JsBarcode(canvas1, "Hello", {format: "CODE128"});
    JsBarcode(canvas2, "Hello", {format: "CODE39"});

    assert.notEqual(canvas1.width, canvas2.width);
  });

  it('should throws errors when suppose to', function () {
    var canvas = new Canvas();
    assert.throws(function(){JsBarcode(canvas, "Hello", {format: "EAN8"});});
    assert.throws(function(){JsBarcode(canvas, "Hello", {format: "DOESNOTEXIST"});}, /Module DOESNOTEXIST does not exist/i);
    assert.throws(function(){JsBarcode("Hello", "Hello", {format: "DOESNOTEXIST"});});
    assert.throws(function(){JsBarcode(123, "Hello", {format: "DOESNOTEXIST"});});
  });

  it('should use the valid callback correct', function (done) {
    var canvas = new Canvas();

    JsBarcode(canvas, "Hello", {
      format: "CODE128",
      valid: function(valid){
        if(valid){
          done();
        }
      }
    });
  });

  it('should use false valid callback correct', function (done) {
    var canvas = new Canvas();

    JsBarcode(canvas, "Hello", {
      format: "pharmacode",
      valid: function(valid){
        if(!valid){
          done();
        }
      }
    });
  });

  it('should create output with same input', function () {
    var canvas1 = new Canvas();
    var canvas2 = new Canvas();

    JsBarcode(canvas1, "Hello", {format: "CODE128"});
    JsBarcode(canvas2, "Hello", {format: "CODE128"});

    assert.equal(canvas1.toDataURL(), canvas2.toDataURL());
  });

  it('should set background', function () {
    var canvas = new Canvas();
    var ctx = canvas.getContext("2d");
    JsBarcode(canvas, "Hello", {format: "CODE128", background: "#f00"});

    var topLeft = ctx.getImageData(0,0,1,1);
    assert.equal(topLeft.data[0], 255);
    assert.equal(topLeft.data[1], 0);
    assert.equal(topLeft.data[2], 0);
  });

  it('should automatically select barcodes', function () {
    var canvas1 = new Canvas();
    var canvas2 = new Canvas();
    var ctx1 = canvas1.getContext("2d");
    var ctx2 = canvas2.getContext("2d");

    JsBarcode(canvas1, "5901234123457", {format: "EAN"});
    JsBarcode(canvas2, "5901234123457");

    assert.equal(canvas1.toDataURL(), canvas2.toDataURL());

    var canvas1 = new Canvas();
    var canvas2 = new Canvas();
    var ctx1 = canvas1.getContext("2d");
    var ctx2 = canvas2.getContext("2d");

    JsBarcode(canvas1, "HELL0", {format: "CODE39"});
    JsBarcode(canvas2, "HELL0");

    assert.equal(canvas1.toDataURL(), canvas2.toDataURL());
  });
});

describe('Text printing', function() {
  it('should produce different output when displaying value', function () {
    var canvas1 = new Canvas();
    var canvas2 = new Canvas();

    JsBarcode(canvas1, "Hello", {format: "CODE128", displayValue: false});
    JsBarcode(canvas2, "Hello", {format: "CODE128"});

    assert.notEqual(canvas1.toDataURL(), canvas2.toDataURL());
  });

  it('should produce different output when having different textAlign', function () {
    var canvas1 = new Canvas();
    var canvas2 = new Canvas();
    var canvas3 = new Canvas();

    JsBarcode(canvas1, "Hello", {format: "CODE128", displayValue: true, textAlign: "center"});
    JsBarcode(canvas2, "Hello", {format: "CODE128", displayValue: true, textAlign: "left"});
    JsBarcode(canvas3, "Hello", {format: "CODE128", displayValue: true, textAlign: "right"});

    assert.notEqual(canvas1.toDataURL(), canvas2.toDataURL());
    assert.notEqual(canvas2.toDataURL(), canvas3.toDataURL());
    assert.notEqual(canvas1.toDataURL(), canvas3.toDataURL());
  });
});
