/* global Dashboard, DashboardUi */

(function () {
  'use strict';

  window.addEventListener('load', function () {
    var dashboard = new Dashboard();
    var dashboardUi = new DashboardUi(dashboard);
    dashboardUi.init();
    dashboard.init();
  }, false);

}());





