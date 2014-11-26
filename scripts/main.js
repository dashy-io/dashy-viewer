/* global DashboardOptions, Dashboard, DashboardUi */

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

}());





