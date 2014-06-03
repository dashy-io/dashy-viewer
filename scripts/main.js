/* global console */

(function () {
  'use strict';

  window.addEventListener('load', function () {
    var dashboardOptions = new DashboardOptions();
    dashboardOptions.init();
    var dashboard = new Dashboard(dashboardOptions);
    dashboard.init();
    var dashboardUi = new DashboardUi();
    dashboardUi.init();
  }, false);

  function DashboardOptions() {
    this.dashboardSectionId = 'dashboard';
    this.configElementId = 'config';
  }

  DashboardOptions.prototype.init = function() {
    this._parsedQueryString = this._parseQueryString(location.search);
    this.urls = this._getUrlsFromQueryString();
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

  DashboardOptions.prototype._getUrlsFromQueryString = function() {
    var decodedUrls = [];
    if (this._parsedQueryString.dashboard instanceof Array) {
      for (var i = 0; i < this._parsedQueryString.dashboard.length; i++) {
        decodedUrls[i] = decodeURIComponent(this._parsedQueryString.dashboard[i]);
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
    this._options = options;
    this.currentIndex = 0;
  }

  Dashboard.prototype.init = function() {
    var _this = this;
    console.log('Initializing dashboard');

    if (this._options.urls.length === 0) {
      this._showDashboardConfig();
    } else {
      this.showNextDashboard();
      setInterval(function () {
        _this.showNextDashboard();
      }, 1000 * this._options.interval);
    }
  };

  Dashboard.prototype.showNextDashboard = function() {
    if (this.currentIndex >= this._options.urls.length) {
      this.currentIndex = 0;
    }
    this._changeDashboard(this._options.dashboardSectionId, this._options.urls[this.currentIndex]);
    this.currentIndex++;
  };

  Dashboard.prototype._changeDashboard = function(dashboardSectionId, url) {
    console.log('Showing: ' + url);
    var dashboard = document.createElement('iframe');
//    dashboard.addEventListener('load', function () {
//      dashboard.classList.remove('hidden');
//    }, false);
    dashboard.setAttribute('allowtransparency', 'true');
    // dashboard.classList.add('hidden');
    dashboard.src = url;
    var dashboardSection = document.getElementById(dashboardSectionId);
    while(dashboardSection.firstChild) {
      dashboardSection.removeChild(dashboardSection.firstChild);
    }
    dashboardSection.appendChild(dashboard);
  };

  Dashboard.prototype._showDashboardConfig = function() {
    document.getElementById(this._options.dashboardSectionId).classList.add('hidden');
    document.getElementById(this._options.configElementId).classList.remove('hidden');
  };

  function DashboardUi() {
    this._saveButton = document.getElementById('save');
    this._urlsTextarea = document.getElementById('dashboard-urls');
    this._intervalTextbox = document.getElementById('interval');
  }

  DashboardUi.prototype.init = function() {
    var _this = this;
    this._saveButton.addEventListener('click', function() {
      _this._redirectToDashboard();
    });
  };

  DashboardUi.prototype._redirectToDashboard = function() {
    var urls = this._urlsTextarea.value.split('\n');
    var dashboardParams = '';
    for (var i = 0; i < urls.length; i++) {
      var url = urls[i].trim();
      if (url) {
        dashboardParams += dashboardParams ? '&' : '?';
        dashboardParams += 'dashboard=' + encodeURIComponent(url);
      }
    }
    dashboardParams += dashboardParams ? '&' : '?';
    dashboardParams += 'interval=' + parseInt(this._intervalTextbox.value) || 90;
    window.location.href = './' + dashboardParams;
  };

}());





