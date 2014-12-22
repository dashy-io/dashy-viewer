;(function (context) {
  'use strict';

  function DashboardUi(dashboard) {
    this._dashboard = dashboard;
    this._bodyHidden = true;
  }

  DashboardUi.prototype.init = function () {
    var _this = this;
    this._dashboard.setOnStateChangedCallback(_this.updateUi.bind(this));
  };

  DashboardUi.prototype.updateUi = function () {
    var newState = this._dashboard.state;
    this.hideAllElementsExcept(newState);
    switch (this._dashboard.state) {
      case 'error':
        this.setElementText('error-message', this._dashboard.errorMessage);
        break;
      case 'not-configured':
        this.setElementText('code', this._dashboard.code);
        break;
      case 'dashboard-changed':
        this.displayDashboard();
        break;
    }
    if (this._bodyHidden) {
      this.showBody();
      this._bodyHidden = false;
    }
  };

  DashboardUi.prototype.displayDashboard = function () {
    var url = this._dashboard.url;
    var dashboardIFrame = document.createElement('iframe');
//    dashboard.addEventListener('load', function () {
//      dashboard.classList.remove('hidden');
//    }, false);
    // dashboard.setAttribute('allowtransparency', 'true');
    dashboardIFrame.src = url;
    var dashboardSection = document.getElementById('dashboard');
    dashboardSection.innerHTML = '';
    dashboardSection.appendChild(dashboardIFrame);
    this.hideAllElementsExcept('dashboard');
  };

  DashboardUi.prototype.hideAllElementsExcept = function (elementId) {
    var _this = this;
    var elementIds = [
      'error',
      'not-initialised',
      'disconnected',
      'not-registered',
      'no-code',
      'not-configured',
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

  DashboardUi.prototype.hideElement = function (elementId) {
    document.getElementById(elementId).classList.add('hidden');
  };

  DashboardUi.prototype.showElement = function (elementId) {
    document.getElementById(elementId).classList.remove('hidden');
  };

  DashboardUi.prototype.showBody = function () {
    document.getElementsByTagName('body')[0].classList.remove('hidden');
  };

  DashboardUi.prototype.setElementText = function (elementId, text) {
    document.getElementById(elementId).innerText = text;
  }

  context.DashboardUi = DashboardUi;

}(window));
