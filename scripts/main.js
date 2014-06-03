/* global console */

(function () {
  'use strict';

  window.addEventListener('load', function () {
     var dashboardOptions = new DashboardOptions();
    dashboardOptions.init();
    var dashboard = new Dashboard(dashboardOptions);
    dashboard.init();
  }, false);

  function DashboardOptions() {
    this.dashboardElementId = 'dashboard';
    this.configElementId = 'config';
  }

  DashboardOptions.prototype.init = function() {
    this._parsedQueryString = this._parseQueryString(location.search);
    this.urls = this._getDashboardsFromQueryString();
    this.interval = this._getUpdateIntervalInSeconds();
  };

  DashboardOptions.prototype._parseQueryString = function(queryString) {
    // Taken from http://stackoverflow.com/a/21152762/26754
    var qd = {};
    queryString.substr(1).split('&').forEach(function (item) {
      (item.split('=')[0] in qd) ?
        qd[item.split('=')[0]].push(item.split('=')[1]) : qd[item.split('=')[0]] = [item.split('=')[1], ];
    });
    return qd;
  };

  DashboardOptions.prototype._getDashboardsFromQueryString = function() {
    var decodedUrls = [];
    if (this._parsedQueryString.dashboard instanceof Array) {
      for (var i = 0; i < this._parsedQueryString.dashboard.length; i++) {
        decodedUrls[i] = decodeURIComponent(this._parsedQueryString.dashboard[i]);
      }
    } else {
      if (this._parsedQueryString.dashboard) {
        decodedUrls[0] = decodeURIComponent(this._parsedQueryString.dashboard);
      }
    }
    console.log('Available dashboards (' + decodedUrls.length + '): ' + decodedUrls);
    return decodedUrls;
  };

  DashboardOptions.prototype._getUpdateIntervalInSeconds = function() {
    var updateIntervalInSeconds = parseInt(this._parsedQueryString.interval) || 0;
    if (updateIntervalInSeconds < 3) {
      updateIntervalInSeconds = 90;
    }
    console.log('Refresh interval: ' + updateIntervalInSeconds);
    return updateIntervalInSeconds;
  };

  function Dashboard(options) {
    this.options = options;
    this.currentIndex = 0;
  }

  Dashboard.prototype.init = function() {
    var _this = this;
    console.log('Initializing dashboard');

    if (this.options.urls.length === 0) {
      this._showDashboardConfig();
    } else {
      this.showNextDashboard();
      setInterval(function () {
        _this.showNextDashboard();
      }, 1000 * this.options.interval);
    }
  };

  Dashboard.prototype.showNextDashboard = function() {
    if (this.currentIndex >= this.options.urls.length) {
      this.currentIndex = 0;
    }
    this._setFrameSrc(this.options.dashboardElementId, this.options.urls[this.currentIndex]);
    this.currentIndex++;
  };

  Dashboard.prototype._setFrameSrc = function(frameId, url) {
    console.log('Showing: ' + url);
    var frame = document.getElementById(frameId);
    frame.src = url;
  };

  Dashboard.prototype._showDashboardConfig = function() {
    document.getElementById(this.options.dashboardElementId).classList.add('hidden');
    document.getElementById(this.options.configElementId).classList.remove('hidden');
  };

}());





