/* global console, XHR */
;(function (context) {
  'use strict';

  // taken from http://jsperf.com/querystring-with-javascript/20
  function getQueryStringValue(key) {
    var arrSearch = location.search.split(key + '=')[1];
    return arrSearch ? decodeURIComponent(arrSearch.split('&')[0].replace(/\+/g, ' ')) : false;
  }

  function Dashboard() {
    this._apiUrl = 'http://api.dashy.io';
    this._currentDashboardIndex = -1;
  }

  Dashboard.prototype.setOnStateChangedCallback = function (cb) {
    this.onStateChanged = cb;
  };

  Dashboard.prototype.setState = function (state) {
    this.state = state;
    if (this.onStateChanged) {
      this.onStateChanged();
    }
    this.connect();
  };

  Dashboard.prototype.init = function () {
    this._id = getQueryStringValue('id');
    if (!this._id) {
      this.notInitialised();
      return;
    }
    this.disconnected();
  };

  Dashboard.prototype.disconnected = function () {
    this.setState('disconnected');
  };

  Dashboard.prototype.notInitialised = function () {
    this.setState('not-initialised');
  };

  Dashboard.prototype.hasError = function (error) {
    this.errorMessage = error;
    this.setState('error');
  };

  Dashboard.prototype.notRegistered = function () {
    this.setState('not-registered');
  };

  Dashboard.prototype.noCode = function () {
    this.setState('no-code');
  };

  Dashboard.prototype.notConfigured = function () {
    this.setState('not-configured');
  };

  Dashboard.prototype.dashboard = function () {
    this.setState('dashboard');
  };

  Dashboard.prototype.dashboardChanged = function () {
    this.setState('dashboard-changed');
  };

  Dashboard.prototype.connect = function () {
    var _this = this;
    switch (this.state) {
      case 'disconnected':
        this.getConfiguration();
        break;
      case 'not-registered':
        this.registerDashboard();
        break;
      case 'no-code':
        this.getDashboardCode();
        break;
      case 'not-configured':
        window.setTimeout(this.connect.bind(this), 10 * 1000);
        break;
      case 'dashboard':
        if (this._currentDashboardIndex === -1) {
          _this.nextDashboard();
        }
        window.setInterval(function () {
          _this.nextDashboard();
        }, this.config.interval * 1000);
        break;
      case 'dashboard-changed':
        break;
    }
  };

  Dashboard.prototype.getConfiguration = function () {
    var _this = this;
    var xhr = new XHR(_this._apiUrl + '/dashboards/' + this._id);
    xhr.getJson(function (err, res, statusCode) {
      if (statusCode === 404) {
        return _this.notRegistered();
      }
      if (err) { return _this.hasError(err); }
      _this.config = res;
      if (!_this.config.urls || _this.config.urls.length === 0) {
        return _this.noCode();
      }
      return _this.dashboard();
    });
  };

  Dashboard.prototype.registerDashboard = function () {
    var _this = this;
    var xhr = new XHR(this._apiUrl + '/dashboards');
    xhr.postJson({ id : this._id }, function (err, res, statusCode) {
      if (err) { return _this.hasError(err); }
      _this.noCode();
    });
  };

  Dashboard.prototype.getDashboardCode = function () {
    var _this = this;
    var xhr = new XHR(this._apiUrl + '/dashboards/' + this._id + '/code');
    xhr.getJson(function (err, res, statusCode) {
      if (err) { return _this.hasError(err); }
      _this.code = res.code;
      _this.notConfigured();
    });
  };

  Dashboard.prototype.nextDashboard = function () {
    if (this._currentDashboardIndex >= this.config.urls.length - 1) {
      this._currentDashboardIndex = 0;
    } else {
      this._currentDashboardIndex++;
    }
    this.url = this.config.urls[this._currentDashboardIndex];
    console.log('Showing %s of %s: %s', this._currentDashboardIndex + 1, this.config.urls.length, this.url);
    this.dashboardChanged();
  };

  context.Dashboard = Dashboard;

}(window));
