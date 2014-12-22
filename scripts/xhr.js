;(function (context) {
  'use strict';

  function XHR(url) {
    this._url = url;
  }

  XHR.prototype.request = function(method, data, callback) {
    var _this = this;
    this._callback = callback;

    var xhr = new XMLHttpRequest();
    xhr.open(method, this._url, true);
    xhr.addEventListener('load', function () { _this.onLoad(method, this); }, false);
    xhr.addEventListener('error', function () { _this.onError(method, this); }, false);
    xhr.addEventListener('abort', function () { _this.onError(method, this); }, false);
    if (method === 'POST') {
      xhr.setRequestHeader('Content-type', 'application/json');
      xhr.send(JSON.stringify(data));
    } else {
      xhr.send();
    }
  };

  XHR.prototype.getJson = function (callback) {
    this.request('GET', null, callback);
  };

  XHR.prototype.postJson = function (data, callback) {
    this.request('POST', data, callback);
  };

  XHR.prototype.onLoad = function (method, res) {
    if (res.status === 200 || res.status === 201) {
      this._callback(null, JSON.parse(res.response));
    } else {
      this.onError(method, res);
    }
  };

  XHR.prototype.onError = function (method, res) {
    var error = 'Error: ';
    if (res.status === 0) {
      error += 'Cannot ' + method + ': ' + this._url;
      this._callback(error, null, res.status);
    } else {
      error += 'GET ' + res.responseURL + ' ' + res.status + ' (' + res.statusText + ')';
      this._callback(error, JSON.parse(res.response), res.status);
    }

  };

  context.XHR = XHR;

}(window));


