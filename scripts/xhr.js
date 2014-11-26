;(function (context) {
  'use strict';

  function XHR(url) {
    this._url = url;
  }

  XHR.prototype.getJson = function (callback) {
    var _this = this;
    this._callback = callback;

    var xhr = new XMLHttpRequest();
    xhr.open('GET', this._url, true);
    xhr.addEventListener('load', function () { _this.onLoad(this); }, false);
    xhr.addEventListener('error', function () {
      _this.onError(this);
    }, false);
    xhr.addEventListener('abort', function () { _this.onError(this); }, false);
    xhr.send();
  };

  XHR.prototype.onLoad = function (res) {
    if (res.status === 200) {
      this._callback(null, JSON.parse(res.response));
    } else {
      this.onError(res);
    }
  };

  XHR.prototype.onError = function (res) {
    var error = 'Error: ';
    if (res.status === 0) {
      error += 'Cannot GET ' + this._url;
      this._callback(error);
    } else {
      error += 'GET ' + res.responseURL + ' ' + res.status + ' (' + res.statusText + ')';
      this._callback(error, JSON.parse(res.response));
    }

  };

  context.XHR = XHR;

}(window));


