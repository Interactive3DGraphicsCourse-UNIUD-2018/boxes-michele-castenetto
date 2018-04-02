;(function(global) {
'use strict'; 
    


// var Engine = (function() {
//     var Engine = function(updateFunction) {
//         this._runLoop = false;
//         this._updateFunction = updateFunction;
//     };
//     Engine.prototype._runFrame = function() {
//         var _this = this;
//         if (!this._runLoop) {
//             return;
//         }
//         requestAnimationFrame( _this._runFrame.bind(_this) );
//         this._updateFunction();
//     };
//     Engine.prototype.startRenderLoop = function() {
//         this._runLoop = true;
//         this._runFrame();
//     };
//     Engine.prototype.stopRenderLoop = function() {
//         this._runLoop = false;
//     };
//     return Engine;
// })();


var Engine = (function() {
    var _runFrame = function(e) {
        if (!e._runLoop) {
            return;
        }
        requestAnimationFrame( function() {_runFrame(e);} );
        e._updateFunction();
    };
    var Engine = function(updateFunction) {
        this._runLoop = false;
        this._updateFunction = updateFunction;
    };
    Engine.prototype.startRenderLoop = function() {
        this._runLoop = true;
        _runFrame(this);
    };
    Engine.prototype.stopRenderLoop = function() {
        this._runLoop = false;
    };
    return Engine;
})();






if (typeof exports === 'object') {
    // node export
    module.exports = Engine;
} else if (typeof define === 'function' && define.amd) {
    // amd export
    define(function () {
        return Engine;
    });
} else {
    // browser global
    global.Engine = Engine;
}
})(this);