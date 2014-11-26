/* global console */

function DashboardOptions() {
  this.dashboardSectionId = 'dashboard';
}

DashboardOptions.prototype.init = function () {
  this._parsedQueryString = this._parseQueryString(location.search);
  this.urls = this._getUrlsFromQueryString();
  this.interval = this._getUpdateIntervalInSeconds();
};

DashboardOptions.prototype._parseQueryString = function (queryString) {
  // Taken from http://stackoverflow.com/a/21152762/26754
  var qd = {};
  queryString.substr(1).split('&').forEach(function (item) {
    (item.split('=')[0] in qd) ?
      qd[item.split('=')[0]].push(item.split('=')[1]) : qd[item.split('=')[0]] = [item.split('=')[1],];
  });
  return qd;
};

DashboardOptions.prototype._getUrlsFromQueryString = function () {
  var decodedUrls = [];
  if (this._parsedQueryString.dashboard instanceof Array) {
    for (var i = 0; i < this._parsedQueryString.dashboard.length; i++) {
      decodedUrls[i] = decodeURIComponent(this._parsedQueryString.dashboard[i]);
    }
  }
  console.log('Available dashboards (' + decodedUrls.length + '): ' + decodedUrls);
  return decodedUrls;
};

DashboardOptions.prototype._getUpdateIntervalInSeconds = function () {
  var updateIntervalInSeconds = parseInt(this._parsedQueryString.interval) || 0;
  if (updateIntervalInSeconds < 3) {
    updateIntervalInSeconds = 90;
  }
  console.log('Refresh interval: ' + updateIntervalInSeconds);
  return updateIntervalInSeconds;
};
