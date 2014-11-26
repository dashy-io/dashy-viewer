/* global console, XHR */

function Dashboard(options) {
  this._options = options;
  this.currentIndex = 0;
}

Dashboard.prototype.init = function () {
  var _this = this;
  var id = getQueryStringValue('id');
  console.log('Initializing dashboard ' + id);
  var xhr = new XHR('http://api.dashy.io/status');
  xhr.getJson(function (err, res) {
    if (err) {
      console.log(err);
      if (res) {
        console.log(res);
      }
    } else {
      console.log(res);
    }
  });

  if (this._options.urls.length === 0) {
    // this._showDashboardConfig();
  } else {
    this.showNextDashboard();
    setInterval(function () {
      _this.showNextDashboard();
    }, this._options.interval * 1000);
  }
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

//Dashboard.prototype._showDashboardConfig = function () {
//  document.getElementById(this._options.dashboardSectionId).classList.add('hidden');
//  document.getElementById(this._options.configElementId).classList.remove('hidden');
//};

// taken from http://jsperf.com/querystring-with-javascript/20
function getQueryStringValue(key) {
  var arrSearch = location.search.split(key + '=')[1];
  return arrSearch ? decodeURIComponent(arrSearch.split('&')[0].replace(/\+/g, ' ')) : false;
}
