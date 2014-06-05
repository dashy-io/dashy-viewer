/* global console */

(function () {
  'use strict';

  window.addEventListener('load', function () {
    var dashboardOptions = new DashboardOptions();
    dashboardOptions.init();
    var branding = new Branding(dashboardOptions);
    branding.init();
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
    this.brandingUrl = this._getBrandingUrl();
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

  DashboardOptions.prototype._getBrandingUrl = function() {
    var brandingUrl = this._parsedQueryString.branding;
    console.log('Branding url: ' + brandingUrl);
    return brandingUrl;
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
      }, this._options.interval * 1000);
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
    this._configForm = document.getElementById('config').getElementsByTagName('form')[0];
    this._urlsTextarea = document.getElementById('dashboard-urls');
    this._intervalTextbox = document.getElementById('interval');
    this._brandingUrlTextbox = document.getElementById('branding-url');
  }

  DashboardUi.prototype.init = function() {
    var _this = this;
    this._configForm.addEventListener('submit', function(e) {
      e.preventDefault();
      _this._redirectToDashboard();
    })
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
    dashboardParams += dashboardParams ? '&' : '?';
    dashboardParams += 'branding=' + this._brandingUrlTextbox.value;
    window.location.href = dashboardParams;
  };

  function Branding(options) {
    var _this = this;
    this._options = options;
    this._retryInterval = 30;
    this._xhr = new XMLHttpRequest();
    this._brandingSection = document.getElementById('branding');
    this._xhr.onreadystatechange = function () { _this._processResponse(); };
    this._xhr.timeout = this._retryInterval * 1000;
    this._xhr.ontimeout = function () { _this._handleTimeout(); };
  }

  Branding.prototype.init = function() {
    if (!this._options.brandingUrl) {
      console.log('No branding');
      return;
    }
    console.log('Loading branding from ' + this._options.brandingUrl);
    this._render('Loading branding...');
    this._xhr.open('GET', this._options.brandingUrl, true );
    this._xhr.send(null);
  };

  Branding.prototype._processResponse = function () {
    if (this._xhr.readyState != 4) {
      return;
    }
    if (this._xhr.status == 200
        || (this._xhr.status == 0 && this._xhr.response)) // for file://.. requests the status is 0
    {
      this._render(this._xhr.responseText);
    } else {
      this._handleError();
    }
  };

  Branding.prototype._handleError = function () {
    var _this = this;
    this._render('Error loading branding. Retrying in ' + this._retryInterval + ' seconds.<br />URL: ' + this._options.brandingUrl);
    setInterval(function () {
      _this.init();
    }, this._retryInterval * 1000);

  };

  Branding.prototype._render = function (content) {
    this._brandingSection.innerHTML = content;
  };

}());





