/* global console, XHR, document */

function Dashboard(options) {
  this._options = options;
  this.currentIndex = 0;
}

Dashboard.prototype.init = function () {
  var _this = this;

  this._id = getQueryStringValue('id');
  console.log('Initializing dashboard ' + this._id);

  this.waitForConnection(function (err) {
    if (err) {
      document.getElementById('connectionStatus').innerText = err;
    } else {
      document.getElementById('connectionStatus').innerText = 'Connected.';
      console.log('Connected!');
    }
  });

  //if (this._options.urls.length === 0) {
  //  // this._showDashboardConfig();
  //} else {
  //  this.showNextDashboard();
  //  setInterval(function () {
  //    _this.showNextDashboard();
  //  }, this._options.interval * 1000);
  //}
};

Dashboard.prototype.waitForConnection = function (callback) {
  var timeoutInSeconds = 3;
  var _this = this;
  var xhr = new XHR('http://localhost:3001/dashboard/' + this._id);
  xhr.getJson(function (err, res) {
    if (err) {
      callback('Connection to server failed, retrying in ' + timeoutInSeconds + 's' + '\r\n' + err);
      window.setTimeout(function() {
        _this.waitForConnection(callback);
      }, timeoutInSeconds * 1000);
    } else {
      callback();
    }
  });
};

Dashboard.prototype.showNextDashboard = function () {
  if (this.currentIndex >= this._options.urls.length) {
    this.currentIndex = 0;
  }
  this._changeDashboard(this._options.dashboardSectionId, this._options.urls[this.currentIndex]);
  this.currentIndex++;
};

Dashboard.prototype._changeDashboard = function (dashboardSectionId, url) {
  console.log('Showing: ' + url);
  var dashboard = document.createElement('iframe');
//    dashboard.addEventListener('load', function () {
//      dashboard.classList.remove('hidden');
//    }, false);
  dashboard.setAttribute('allowtransparency', 'true');
  // dashboard.classList.add('hidden');
  dashboard.src = url;
  var dashboardSection = document.getElementById(dashboardSectionId);
  while (dashboardSection.firstChild) {
    dashboardSection.removeChild(dashboardSection.firstChild);
  }
  dashboardSection.appendChild(dashboard);
};

Dashboard.prototype._hideElement = function (elementId) {
  document.getElementById(elementId).classList.add('hidden');
};

Dashboard.prototype._showElement = function (elementId) {
  document.getElementById(elementId).classList.remove('hidden');
};

// taken from http://jsperf.com/querystring-with-javascript/20
function getQueryStringValue(key) {
  var arrSearch = location.search.split(key + '=')[1];
  return arrSearch ? decodeURIComponent(arrSearch.split('&')[0].replace(/\+/g, ' ')) : false;
}
