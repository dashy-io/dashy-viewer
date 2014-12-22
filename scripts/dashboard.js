/* global console, XHR, document */
'use strict';

function Dashboard() {
  this._apiUrl = 'http://api.dashy.io';
  this._currentDashboardIndex = -1;
}

Dashboard.prototype.init = function () {
  var _this = this;

  this._id = getQueryStringValue('id');
  if (!this._id) {
    this.notInitialised();
    return;
  }

  this.waitForConnection(function (err, res) {
    if (err) {
      document.getElementById('connectionStatus').innerText = err;
    } else {
      document.getElementById('connectionStatus').innerText = 'Connected.';
      _this._config = res;
      if (!_this._config.url || _this._config.urls.length == 0) {
        return _this.notConfigured();
      }
      _this.hideAllElementsExcept('dashboard');
      _this.showNextDashboard();
    }
  });
};

Dashboard.prototype.notInitialised = function () {
  this.hideAllElementsExcept('not-initialised');
};

Dashboard.prototype.notConfigured = function () {
  this.hideAllElementsExcept('not-configured');
  this.getDashboardCode(function (err, res) {
    if (err) {
      document.getElementById('connectionStatus').innerText = err;
    } else {
      document.getElementById('code').innerText = res.code;
    }
  });
};

Dashboard.prototype.waitForConnection = function (callback) {
  var timeoutInSeconds = 15;
  var _this = this;
  var xhr = new XHR(_this._apiUrl + '/dashboards/' + this._id);
  xhr.getJson(function (err, res, statusCode) {
    if (statusCode === 404) {
      _this.registerDashboard(callback);
    }
    if (err) {
      callback(
        err + '\r\n' +
        new Date().toLocaleString() + '\r\n' +
        'Connection to server failed, retrying in ' + timeoutInSeconds + 's' + '\r\n'
      );
      window.setTimeout(function() {
        _this.waitForConnection(callback);
      }, timeoutInSeconds * 1000);
    } else {
      callback(null, res);
    }
  });
};

Dashboard.prototype.registerDashboard = function (callback) {
  var xhr = new XHR(this._apiUrl + '/dashboards');
  xhr.postJson({ id : this._id }, function (err, res, statusCode) {
    callback(err, res);
  });
};

Dashboard.prototype.getDashboardCode = function (callback) {
  var xhr = new XHR(this._apiUrl + '/dashboards/' + this._id + '/code');
  xhr.getJson(function (err, res, statusCode) {
    callback(err, res);
  });
};

Dashboard.prototype.showNextDashboard = function () {
  var _this = this;
  if (this._currentDashboardIndex >= this._config.urls.length - 1) {
    this._currentDashboardIndex = 0;
  } else {
    this._currentDashboardIndex++;
  }
  this.changeDashboard();
  setTimeout(function () {
    _this.showNextDashboard();
  }, this._config.interval * 1000);
};

Dashboard.prototype.changeDashboard = function () {
  var url = this._config.urls[this._currentDashboardIndex];
  console.log('Showing %s of %s: %s', this._currentDashboardIndex + 1, this._config.urls.length, url);
  var dashboardIFrame = document.createElement('iframe');
//    dashboard.addEventListener('load', function () {
//      dashboard.classList.remove('hidden');
//    }, false);
  // dashboard.setAttribute('allowtransparency', 'true');
  dashboardIFrame.src = url;
  var dashboardSection = document.getElementById('dashboard');
  dashboardSection.innerHTML = '';
  dashboardSection.appendChild(dashboardIFrame);
};

Dashboard.prototype.hideAllElementsExcept = function (elementId) {
  var _this = this;
  var elementIds = [
    'not-initialised',
    'not-configured',
    'disconnected',
    'dashboard'
  ];
  elementIds.forEach(function (currentElementId) {
    if (currentElementId === elementId) {
      _this.showElement(currentElementId);
    } else {
      _this.hideElement(currentElementId);
    }
  });
};

Dashboard.prototype.hideElement = function (elementId) {
  document.getElementById(elementId).classList.add('hidden');
};

Dashboard.prototype.showElement = function (elementId) {
  document.getElementById(elementId).classList.remove('hidden');
};

// taken from http://jsperf.com/querystring-with-javascript/20
function getQueryStringValue(key) {
  var arrSearch = location.search.split(key + '=')[1];
  return arrSearch ? decodeURIComponent(arrSearch.split('&')[0].replace(/\+/g, ' ')) : false;
}
