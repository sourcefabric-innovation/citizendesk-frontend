angular.module('citizendeskFrontendApp').run(['$templateCache', function($templateCache) {
  'use strict';

  $templateCache.put('views/assign.html',
    "<h3>\n" +
    "  <span class=\"glyphicon glyphicon-user\"></span>\n" +
    "  <span translate>Assign to:</span>\n" +
    "</h3>\n" +
    "<p>\n" +
    "  <button type=\"button\" class=\"btn btn-info btn-lg btn-block\" translate\n" +
    "          ng-click=\"assignTo(identity._id)\"\n" +
    "          ng-disabled=\"disabled\"\n" +
    "          >\n" +
    "    Me\n" +
    "  </button>\n" +
    "</p>\n" +
    "<p ng-repeat=\"user in users\" ng-hide=\"user._id === identity._id\">\n" +
    "  <button type=\"button\" class=\"btn btn-default btn-lg btn-block\"\n" +
    "          ng-click=\"assignTo(user._id)\"\n" +
    "          ng-disabled=\"disabled\"\n" +
    "          ng-bind=\"user.username\">\n" +
    "  </button>\n" +
    "</p>\n"
  );


  $templateCache.put('views/assigned-to-me.html',
    "<h3 translate>\n" +
    "  Items assigned to you\n" +
    "</h3>\n" +
    "<p>\n" +
    "  <div class=\"input-group\">\n" +
    "    <div class=\"input-group-addon\">\n" +
    "      <span class=\"glyphicon glyphicon-search\"></span>\n" +
    "    </div>\n" +
    "    <input class=\"form-control\" type=\"search\" ng-model=\"q\" />\n" +
    "  </div>\n" +
    "</p>\n" +
    "<div\n" +
    "   ng-repeat=\"report in reports | filter:q\"\n" +
    "   report-summary\n" +
    "   >\n" +
    "</div>\n" +
    "<div ng-hide=\"reports.length\" translate>No reports in this queue</div>\n"
  );


  $templateCache.put('views/citizen-card.html',
    "<div ng-switch=\"alias.authority\">\n" +
    "  <div ng-switch-when=\"twitter\">\n" +
    "    <p>\n" +
    "      <div class=\"media\">\n" +
    "        <a class=\"pull-left\"\n" +
    "           ng-href=\"//twitter.com/{{alias.identifiers.user_name_search}}\"\n" +
    "           target=\"_blank\"\n" +
    "           >\n" +
    "          <img class=\"media-object\" ng-src=\"{{alias.avatars[0].https}}\">\n" +
    "        </a>\n" +
    "        <div class=\"media-body\">\n" +
    "          <h4 class=\"media-heading\"\n" +
    "              ng-bind=\"alias.name_full\"\n" +
    "              >\n" +
    "          </h4>\n" +
    "          <p ng-bind=\"alias.description\">\n" +
    "          </p>\n" +
    "          <p>\n" +
    "            <dl class=\"dl-horizontal\">\n" +
    "              <dt translate>Time Zone</dt>\n" +
    "              <dd ng-bind=\"alias.time_zone\"></dd>\n" +
    "            </dl>\n" +
    "          </p>\n" +
    "        </div>\n" +
    "      </div>\n" +
    "    </p>\n" +
    "  </div>\n" +
    "  <div ng-switch-default>\n" +
    "    <h4 translate>\n" +
    "      Mobile user {{alias.identifiers.user_name}}\n" +
    "    </h4>\n" +
    "  </div>\n" +
    "</div>\n" +
    "<div>\n" +
    "  <div translate>\n" +
    "    Reports authored by this user\n" +
    "  </div>\n" +
    "  <div\n" +
    "     ng-repeat=\"report in reports\"\n" +
    "     report-summary\n" +
    "     >\n" +
    "  </div>\n" +
    "  <div ng-hide=\"reports.length\" translate>\n" +
    "    No reports here at the moment\n" +
    "  </div>\n" +
    "</div>\n"
  );


  $templateCache.put('views/configure-autoreply.html',
    "<ol class=\"breadcrumb\">\n" +
    "  <li><a href=\"#/configure\">Configure</a></li>\n" +
    "  <li class=\"active\">Autoreply</li>\n" +
    "</ol>\n" +
    "<div class=\"alert alert-{{status}}\" ng-hide=\"alert==''\" ng-bind=\"alert\">\n" +
    "</div>\n" +
    "<form class=\"form-horizontal\">\n" +
    "  <fieldset ng-disabled=\"disabled\">\n" +
    "    <div class=\"form-group\">\n" +
    "      <label class=\"col-md-2\">Autoreply enabled</label>\n" +
    "      <div class=\"col-md-10\">\n" +
    "        <input type=\"checkbox\" class=\"col-md-10 form-control\" ng-model=\"enabled.value\">\n" +
    "      </div>\n" +
    "    </div>\n" +
    "    <div class=\"form-group\">\n" +
    "      <label class=\"col-md-2\">Text to send automatically</label>\n" +
    "      <div class=\"col-md-10\">\n" +
    "        <textarea type=\"text\" class=\"col-md-10 form-control\" placeholder=\"Thank you for reporting\" ng-model=\"text.value\"></textarea>\n" +
    "      </div>\n" +
    "    </div>\n" +
    "    <div class=\"form-group\">\n" +
    "      <label class=\"col-md-2\">Timeout in minutes</label>\n" +
    "      <div class=\"col-md-10\">\n" +
    "        <input type=\"number\" class=\"col-md-10 form-control\" ng-model=\"timeout.value\">\n" +
    "      </div>\n" +
    "    </div>\n" +
    "    <div class=\"col-md-10 col-md-offset-2\">\n" +
    "      <button class=\"btn btn-primary\" ng-click=\"submit()\">\n" +
    "        Submit\n" +
    "      </button>\n" +
    "    </div>\n" +
    "  </fieldset>\n" +
    "</form>\n"
  );


  $templateCache.put('views/configure-steps.html',
    "<ol class=\"breadcrumb\">\n" +
    "  <li><a href=\"#/configure\">Configure</a></li>\n" +
    "  <li class=\"active\">Validation steps</li>\n" +
    "</ol>\n" +
    "<div class=\"alert alert-{{status}}\" ng-hide=\"alert==''\" ng-bind=\"alert\">\n" +
    "</div>\n" +
    "<form class=\"form-horizontal\"\n" +
    "      ng-repeat=\"step in steps\"\n" +
    "      >\n" +
    "  <fieldset ng-disabled=\"status[step._id] == 'disabled'\"\n" +
    "            >\n" +
    "    <div class=\"form-group\">\n" +
    "      <label class=\"col-md-2\"></label>\n" +
    "      <div class=\"col-md-10\">\n" +
    "        <input type=\"text\"\n" +
    "               class=\"col-md-10 form-control\"\n" +
    "               ng-model=\"step.description\"\n" +
    "               >\n" +
    "      </div>\n" +
    "    </div>\n" +
    "    <div class=\"col-md-10 col-md-offset-2\">\n" +
    "      <button class=\"btn btn-primary\"\n" +
    "              ng-click=\"save(step)\"\n" +
    "              >\n" +
    "        Save\n" +
    "      </button>\n" +
    "      <button class=\"btn btn-danger\" ng-click=\"remove(step)\">\n" +
    "        Delete\n" +
    "      </button>\n" +
    "    </div>\n" +
    "  </fieldset>\n" +
    "</form>\n" +
    "<div class=\"col-md-10 col-md-offset-2\">\n" +
    "  <button class=\"btn btn-warning\" ng-click=\"add()\">\n" +
    "    Add\n" +
    "  </button>\n" +
    "</div>\n"
  );


  $templateCache.put('views/configure-twitter-ingestion-filters.html',
    "<ol class=\"breadcrumb\">\n" +
    "  <li><a href=\"#/configure\">Configure</a></li>\n" +
    "  <li><a href=\"#/configure-twitter-ingestion\">Twitter ingestion</a></li>\n" +
    "  <li class=\"active\">Filters</li>\n" +
    "</ol>\n" +
    "<div class=\"alert alert-{{status}}\" ng-hide=\"alert==''\" ng-bind=\"alert\">\n" +
    "</div>\n" +
    "<form class=\"form-horizontal\">\n" +
    "  <form class=\"form-horizontal\">\n" +
    "    <fieldset ng-repeat=\"element in twtFilters\" ng-disabled=\"disabled\">\n" +
    "      <div class=\"form-group\">\n" +
    "        <label class=\"col-md-2\">Identifier</label>\n" +
    "        <p class=\"col-md-10 form-control-static\" ng-bind=\"element.id\"></p>\n" +
    "      </div>\n" +
    "      <div class=\"form-group\">\n" +
    "        <label class=\"col-md-2\">Updated</label>\n" +
    "        <p class=\"col-md-10 form-control-static\" ng-bind=\"element.logs.updated|date\"></p>\n" +
    "      </div>\n" +
    "      <div class=\"form-group\">\n" +
    "        <label class=\"col-md-2\">Created</label>\n" +
    "        <p class=\"col-md-10 form-control-static\" ng-bind=\"element.logs.created|date\"></p>\n" +
    "      </div>\n" +
    "      <div class=\"form-group\">\n" +
    "        <label class=\"col-md-2\">track</label>\n" +
    "        <div class=\"col-md-10\">\n" +
    "          <input\n" +
    "             type=\"text\"\n" +
    "             class=\"col-md-10 form-control\"\n" +
    "             ng-list\n" +
    "             ng-model=\"element.spec.track\">\n" +
    "        </div>\n" +
    "      </div>\n" +
    "      <div class=\"form-group\">\n" +
    "        <label class=\"col-md-2\">follow</label>\n" +
    "        <div class=\"col-md-10\">\n" +
    "          <input\n" +
    "             type=\"text\"\n" +
    "             class=\"col-md-10 form-control\"\n" +
    "             ng-list\n" +
    "             ng-model=\"element.spec.follow\">\n" +
    "        </div>\n" +
    "      </div>\n" +
    "      <div ng-repeat=\"e in element.spec.follow\" class=\"form-group\">\n" +
    "        <label class=\"col-md-2\">follow {{$index + 1}}</label>\n" +
    "        <div class=\"col-md-10\">\n" +
    "          <input type=\"text\" class=\"col-md-10 form-control\" ng-model=\"e\">\n" +
    "        </div>\n" +
    "      </div>\n" +
    "      <div ng-repeat=\"e in element.spec.locations\" class=\"form-group\">\n" +
    "        <div class=\"form-group\">\n" +
    "          <label class=\"col-md-2\">location {{$index + 1}} west</label>\n" +
    "          <div class=\"col-md-10\">\n" +
    "            <input type=\"text\" class=\"col-md-10 form-control\" ng-model=\"e.west\">\n" +
    "          </div>\n" +
    "        </div>\n" +
    "        <div class=\"form-group\">\n" +
    "          <label class=\"col-md-2\">location {{$index + 1}} east</label>\n" +
    "          <div class=\"col-md-10\">\n" +
    "            <input type=\"text\" class=\"col-md-10 form-control\" ng-model=\"e.east\">\n" +
    "          </div>\n" +
    "        </div>\n" +
    "        <div class=\"form-group\">\n" +
    "          <label class=\"col-md-2\">location {{$index + 1}} north</label>\n" +
    "          <div class=\"col-md-10\">\n" +
    "            <input type=\"text\" class=\"col-md-10 form-control\" ng-model=\"e.south\">\n" +
    "          </div>\n" +
    "        </div>\n" +
    "        <div class=\"form-group\">\n" +
    "          <label class=\"col-md-2\">location {{$index + 1}} west</label>\n" +
    "          <div class=\"col-md-10\">\n" +
    "            <input type=\"text\" class=\"col-md-10 form-control\" ng-model=\"e.west\">\n" +
    "          </div>\n" +
    "        </div>\n" +
    "      </div>\n" +
    "      <div class=\"form-group\">\n" +
    "        <label class=\"col-md-2\">Language</label>\n" +
    "        <div class=\"col-md-10\">\n" +
    "          <input type=\"text\" class=\"col-md-10 form-control\" placeholder=\"Language\" ng-model=\"element.language\">\n" +
    "        </div>\n" +
    "      </div>\n" +
    "      <div class=\"col-md-10 col-md-offset-2\">\n" +
    "        <button class=\"btn btn-primary\" ng-click=\"saveFilter(element)\">\n" +
    "          Save\n" +
    "        </button>\n" +
    "      </div>\n" +
    "    </fieldset>\n" +
    "  </form>\n" +
    "  <button class=\"btn btn-primary\" ng-click=\"addFilter()\">\n" +
    "    Add filter\n" +
    "  </button>\n"
  );


  $templateCache.put('views/configure-twitter-ingestion-oauths.html',
    "<ol class=\"breadcrumb\">\n" +
    "  <li><a href=\"#/configure\">Configure</a></li>\n" +
    "  <li><a href=\"#/configure-twitter-ingestion\">Twitter ingestion</a></li>\n" +
    "  <li class=\"active\">OAuth</li>\n" +
    "</ol>\n" +
    "<form class=\"form-horizontal\">\n" +
    "  <fieldset ng-repeat=\"element in twtOauths\" disabled>\n" +
    "    <div class=\"form-group\">\n" +
    "      <label class=\"col-md-2\">Identifier</label>\n" +
    "      <p class=\"col-md-10 form-control-static\" ng-bind=\"element.id\"></p>\n" +
    "    </div>\n" +
    "    <div class=\"form-group\">\n" +
    "      <label class=\"col-md-2\">Updated</label>\n" +
    "      <p class=\"col-md-10 form-control-static\" ng-bind=\"element.logs.updated|date\"></p>\n" +
    "    </div>\n" +
    "    <div class=\"form-group\">\n" +
    "      <label class=\"col-md-2\">Created</label>\n" +
    "      <p class=\"col-md-10 form-control-static\" ng-bind=\"element.logs.created|date\"></p>\n" +
    "    </div>\n" +
    "    <div class=\"form-group\">\n" +
    "      <label class=\"col-md-2\">Consumer secret</label>\n" +
    "      <div class=\"col-md-10\">\n" +
    "        <input type=\"text\" class=\"col-md-10 form-control\" placeholder=\"Consumer secret\" ng-model=\"element.spec.consumer_secret\">\n" +
    "      </div>\n" +
    "    </div>\n" +
    "    <div class=\"form-group\">\n" +
    "      <label class=\"col-md-2\">Consumer key</label>\n" +
    "      <div class=\"col-md-10\">\n" +
    "        <input type=\"text\" class=\"col-md-10 form-control\" placeholder=\"Consumer secret\" ng-model=\"element.spec.consumer_key\">\n" +
    "      </div>\n" +
    "    </div>\n" +
    "    <div class=\"form-group\">\n" +
    "      <label class=\"col-md-2\">Access token secret</label>\n" +
    "      <div class=\"col-md-10\">\n" +
    "        <input type=\"text\" class=\"form-control\" placeholder=\"Consumer secret\" ng-model=\"element.spec.access_token_secret\">\n" +
    "      </div>\n" +
    "    </div>\n" +
    "    <div class=\"form-group\">\n" +
    "      <label class=\"col-md-2\">Access token key</label>\n" +
    "      <div class=\"col-md-10\">\n" +
    "        <input\n" +
    "           type=\"text\"\n" +
    "           class=\"col-md-10 form-control\"\n" +
    "           placeholder=\"Consumer secret\"\n" +
    "           ng-model=\"element.spec.access_token_key\">\n" +
    "      </div>\n" +
    "    </div>\n" +
    "    <div class=\"col-md-10 col-md-offset-2\">\n" +
    "      <button class=\"btn btn-primary\">\n" +
    "        Submit\n" +
    "      </button>\n" +
    "    </div>\n" +
    "  </fieldset>\n" +
    "</form>\n"
  );


  $templateCache.put('views/configure-twitter-ingestion-streams.html',
    "<ol class=\"breadcrumb\">\n" +
    "  <li><a href=\"#/configure\">Configure</a></li>\n" +
    "  <li><a href=\"#/configure-twitter-ingestion\">Twitter ingestion</a></li>\n" +
    "  <li class=\"active\">Streams</li>\n" +
    "</ol>\n" +
    "<form class=\"form-horizontal\">\n" +
    "  <fieldset ng-repeat=\"element in twtStreams\">\n" +
    "    <div class=\"form-group\">\n" +
    "      <label class=\"col-md-2\">Active</label>\n" +
    "      <div class=\"col-md-10\">\n" +
    "        <input\n" +
    "           type=\"checkbox\"\n" +
    "           class=\"col-md-10 form-control\"\n" +
    "           ng-model=\"element.control.switch_on\"\n" +
    "           disabled\n" +
    "           >\n" +
    "      </div>\n" +
    "    </div>\n" +
    "    <div class=\"form-group\">\n" +
    "      <label class=\"col-md-2\">Identifier</label>\n" +
    "      <p class=\"col-md-10 form-control-static\" ng-bind=\"element.id\"></p>\n" +
    "    </div>\n" +
    "    <div class=\"form-group\">\n" +
    "      <label class=\"col-md-2\">Updated</label>\n" +
    "      <p class=\"col-md-10 form-control-static\" ng-bind=\"element.logs.updated|date\"></p>\n" +
    "    </div>\n" +
    "    <div class=\"form-group\">\n" +
    "      <label class=\"col-md-2\">Created</label>\n" +
    "      <p class=\"col-md-10 form-control-static\" ng-bind=\"element.logs.created|date\"></p>\n" +
    "    </div>\n" +
    "    <div class=\"form-group\">\n" +
    "      <label class=\"col-md-2\">Started</label>\n" +
    "      <p class=\"col-md-10 form-control-static\" ng-bind=\"element.logs.started|date\"></p>\n" +
    "    </div>\n" +
    "    <div class=\"form-group\">\n" +
    "      <label class=\"col-md-2\">Stopped</label>\n" +
    "      <p class=\"col-md-10 form-control-static\" ng-bind=\"element.logs.stopped|date\"></p>\n" +
    "    </div>\n" +
    "    <div class=\"form-group\">\n" +
    "      <label class=\"col-md-2\">OAuth</label>\n" +
    "      <div class=\"col-md-10\">\n" +
    "        <input disabled type=\"text\" class=\"col-md-10 form-control\" placeholder=\"Consumer secret\" ng-model=\"element.spec.oauth_id\">\n" +
    "      </div>\n" +
    "    </div>\n" +
    "    <div class=\"form-group\">\n" +
    "      <label class=\"col-md-2\">Filter</label>\n" +
    "      <div class=\"col-md-10\">\n" +
    "        <select\n" +
    "           class=\"col-md-10 form-control\"\n" +
    "           ng-model=\"element.spec.filter_id\"\n" +
    "           ng-options=\"filter._id as filter._id for filter in twtFilters\"\n" +
    "           ng-disabled=\"disabled[element._id]\"\n" +
    "           ng-class=\"{'has-error': error[element._id]}\"\n" +
    "           ng-change=\"saveStream(element)\"\n" +
    "           >\n" +
    "        </select>\n" +
    "      </div>\n" +
    "    </div>\n" +
    "    <div>\n" +
    "      <button class=\"btn\"\n" +
    "              ng-class=\"{'btn-success': !restartError[element._id], 'btn-error': restartError[element._id]}\"\n" +
    "              ng-disabled=\"restartDisabled[element._id]\"\n" +
    "              ng-click=\"restart(element)\"\n" +
    "              >\n" +
    "        Restart\n" +
    "      </button>\n" +
    "    </div>\n" +
    "  </fieldset>\n" +
    "</form>\n"
  );


  $templateCache.put('views/configure-twitter-ingestion.html',
    "<ol class=\"breadcrumb\">\n" +
    "  <li><a href=\"#/configure\">Configure</a></li>\n" +
    "  <li class=\"active\">Twitter ingestion</li>\n" +
    "</ol>\n" +
    "<div class=\"list-group\">\n" +
    "  <a href=\"#/configure-twitter-ingestion-filters\" class=\"list-group-item\">\n" +
    "    Filters\n" +
    "  </a>\n" +
    "  <a href=\"#/configure-twitter-ingestion-oauths\" class=\"list-group-item\">\n" +
    "    OAuth\n" +
    "  </a>\n" +
    "  <a href=\"#/configure-twitter-ingestion-streams\" class=\"list-group-item\">\n" +
    "    Streams\n" +
    "  </a>\n" +
    "</div>\n"
  );


  $templateCache.put('views/configure.html',
    "<ol class=\"breadcrumb\">\n" +
    "  <li class=\"active\" translate>Configure</li>\n" +
    "</ol>\n" +
    "<div class=\"list-group\">\n" +
    "  <a href=\"#/configure-twitter-ingestion\" class=\"list-group-item\" translate>\n" +
    "    Twitter ingestion\n" +
    "  </a>\n" +
    "  <a href=\"#/configure-autoreply\" class=\"list-group-item\" translate>\n" +
    "    Autoreply\n" +
    "  </a>\n" +
    "  <a href=\"#/configure-steps\" class=\"list-group-item\" translate>\n" +
    "    Validation steps\n" +
    "  </a>\n" +
    "</div>\n"
  );


  $templateCache.put('views/directives/queue-selection.html',
    "<div class=\"dropdown\" ng-controller=\"QueueSelectionCtrl\">\n" +
    "  <a data-toggle=\"dropdown\">\n" +
    "    <h3 ng-bind=\"service.description\"></h3>\n" +
    "  </a>\n" +
    "  <ul class=\"dropdown-menu\">\n" +
    "    <li ng-repeat=\"queue in searches\">\n" +
    "      <a ng-href=\"#/twitter-search/{{queue._id}}\">\n" +
    "        <span ng-bind=\"queue.description\"></span>\n" +
    "        <span class=\"badge\" ng-bind=\"queue.reports.length\"></span>\n" +
    "      </a>\n" +
    "    </li>\n" +
    "    <li ng-repeat=\"queue in monitors\">\n" +
    "      <a ng-href=\"#/monitor/{{queue.slug}}\">\n" +
    "        <span ng-bind=\"queue.description\"></span>\n" +
    "        <span class=\"badge\" ng-bind=\"queue.reports.length\"></span>\n" +
    "      </a>\n" +
    "    </li>\n" +
    "    <li class=\"divider\"></li>\n" +
    "    <li>\n" +
    "      <a ng-href=\"#/mobile-queue\">\n" +
    "        <span>Mobile reports</span>\n" +
    "      </a>\n" +
    "    </li>\n" +
    "    <li class=\"divider\"></li>\n" +
    "    <li>\n" +
    "      <a ng-href=\"#/web-queue\">\n" +
    "        <span>From the web</span>\n" +
    "      </a>\n" +
    "    </li>\n" +
    "    <li class=\"divider\"></li>\n" +
    "    <li>\n" +
    "      <a ng-href=\"#/new-twitter-search\">\n" +
    "        <span>New Twitter search</span>\n" +
    "      </a>\n" +
    "    </li>\n" +
    "  </ul>\n" +
    "</div>\n"
  );


  $templateCache.put('views/directives/report-summary.html',
    "<div\n" +
    "   data-id=\"{{report._id}}\"\n" +
    "   class=\"panel panel-default\"\n" +
    "   >\n" +
    "  <div class=\"panel-heading\">\n" +
    "    <h5>\n" +
    "      <a ng-bind=\"report.authors[0].identifiers.user_name\"\n" +
    "       ng-href=\"#/citizen-card/{{report.authors[0].authority}}/{{report.authors[0].identifiers.user_name}}\"\n" +
    "       ></a>\n" +
    "    <small ng-bind=\"report.produced | date:'medium'\"></small>\n" +
    "    </h5>\n" +
    "  </div>\n" +
    "  <div class=\"panel-body break-long-words\"\n" +
    "       ng-bind=\"report.texts[0].original\"></div>\n" +
    "  <div class=\"panel-footer clearfix\">\n" +
    "    <span ng-switch=\"report.verified\">\n" +
    "      <a href=\"#/reports/{{report._id}}\"\n" +
    "         class=\"btn btn-info pull-right\"\n" +
    "         ng-switch-when=\"true\"\n" +
    "         >\n" +
    "        <span translate>\n" +
    "          Details\n" +
    "        </span>\n" +
    "      </a>\n" +
    "      <span\n" +
    "         class=\"pull-right\"\n" +
    "         ng-switch-default\n" +
    "         >\n" +
    "        <span ng-switch=\"report.assignments.length\">\n" +
    "          <span ng-switch-when=\"0\">\n" +
    "            <a class=\"btn btn-warning\"\n" +
    "               ng-show=\"assign\"\n" +
    "               ng-click=\"assign(report)\"\n" +
    "               >\n" +
    "              <span translate>\n" +
    "                Assign\n" +
    "              </span>\n" +
    "            </a>\n" +
    "          </span>\n" +
    "          <span ng-switch-default>\n" +
    "            <a class=\"btn btn-info\"\n" +
    "               ng-show=\"assign\"\n" +
    "               disabled\n" +
    "               >\n" +
    "              <span translate>\n" +
    "                Assigned\n" +
    "              </span>\n" +
    "            </a>\n" +
    "          </span>\n" +
    "        </span>\n" +
    "        <a href=\"#/reports/{{report._id}}\"\n" +
    "           class=\"btn btn-primary\"\n" +
    "           >\n" +
    "          <span translate>\n" +
    "            Check\n" +
    "          </span>\n" +
    "        </a>\n" +
    "      </span>\n" +
    "    </span>\n" +
    "  </div>\n" +
    "</div>\n"
  );


  $templateCache.put('views/error-no-monitors.html',
    "<div class=\"alert alert-danger\" translate>\n" +
    "  There are no monitors defined\n" +
    "</div>\n"
  );


  $templateCache.put('views/error-no-searches.html',
    "<div class=\"alert alert-danger\" translate>\n" +
    "  There are no twitter searches defined. You\n" +
    "  can <a href=\"#/new-twitter-search\">define one</a>\n" +
    "</div>\n"
  );


  $templateCache.put('views/main.html',
    ""
  );


  $templateCache.put('views/mobile-queue.html',
    "<div queue-selection></div>\n" +
    "<p>\n" +
    "  <div class=\"input-group\">\n" +
    "    <div class=\"input-group-addon\">\n" +
    "      <span class=\"glyphicon glyphicon-search\"></span>\n" +
    "    </div>\n" +
    "    <input class=\"form-control\" type=\"search\" ng-model=\"q\" />\n" +
    "  </div>\n" +
    "</p>\n" +
    "<div\n" +
    "   ng-repeat=\"report in reports | filter:q\"\n" +
    "   report-summary\n" +
    "   >\n" +
    "</div>\n" +
    "<div ng-hide=\"reports.length\" translate>No reports in this queue</div>\n"
  );


  $templateCache.put('views/modals/login.html',
    "<div class=\"modal\" tabindex=\"-1\" role=\"dialog\"\n" +
    "     ng-controller=\"LoginModalCtrl\">\n" +
    "  <div class=\"modal-dialog\">\n" +
    "    <div class=\"modal-content\">\n" +
    "      <div class=\"modal-header\">\n" +
    "        <!--button type=\"button\" class=\"close\" ng-click=\"$hide()\"\n" +
    "            >&times;</button-->\n" +
    "        <h4 class=\"modal-title\" translate>\n" +
    "          Login\n" +
    "        </h4>\n" +
    "      </div>\n" +
    "      <div class=\"modal-body\">\n" +
    "        <div ng-messages=\"errors\">\n" +
    "          <div class=\"alert alert-danger\" ng-message=\"service\">\n" +
    "            <span translate>\n" +
    "              An error occurred while logging in\n" +
    "            </span>\n" +
    "          </div>\n" +
    "        </div>\n" +
    "        <form role=\"form\">\n" +
    "          <div class=\"form-group\">\n" +
    "            <label for=\"username\" translate>User name</label>\n" +
    "            <input type=\"text\" class=\"form-control\" id=\"username\"\n" +
    "                   placeholder=\"Enter name\"\n" +
    "                   ng-model=\"username\">\n" +
    "          </div>\n" +
    "          <div class=\"form-group\">\n" +
    "            <label for=\"password\" translate>Password</label>\n" +
    "            <input type=\"password\" class=\"form-control\" id=\"password\"\n" +
    "                   placeholder=\"Password\"\n" +
    "                   ng-model=\"password\">\n" +
    "          </div>\n" +
    "          <!--button type=\"submit\" class=\"btn btn-default\">Submit</button-->\n" +
    "        </form>\n" +
    "      </div>\n" +
    "      <div class=\"modal-footer\">\n" +
    "        <button type=\"button\" class=\"btn btn-default\" ng-click=\"submit()\"\n" +
    "                translate>\n" +
    "          Submit\n" +
    "        </button>\n" +
    "      </div>\n" +
    "    </div>\n" +
    "  </div>\n" +
    "</div>\n"
  );


  $templateCache.put('views/monitor.html',
    "<div queue-selection></div>\n" +
    "<form ng-hide=\"editing\" class=\"form-inline\">\n" +
    "  <div class=\"form-group\">\n" +
    "    <button class=\"btn btn-default\"\n" +
    "            type=\"button\"\n" +
    "            ng-click=\"resetNewTrack(); editing=true\"\n" +
    "            ><span class=\"glyphicon glyphicon-pencil\"\n" +
    "                   ></span>\n" +
    "    </button>\n" +
    "  </div>\n" +
    "</form>\n" +
    "<form ng-show=\"editing\" class=\"form-inline\" ng-submit=\"save()\">\n" +
    "  <div class=\"form-group\">\n" +
    "    <button class=\"btn btn-default\"\n" +
    "            type=\"button\"\n" +
    "            ng-click=\"resetNewTrack(); editing=false\"\n" +
    "            ><span class=\"glyphicon glyphicon-remove\"\n" +
    "                   ></span>\n" +
    "    </button>\n" +
    "    <button class=\"btn btn-default\"\n" +
    "            type=\"submit\"\n" +
    "            ><span class=\"glyphicon glyphicon-floppy-disk\"></span>\n" +
    "    </button>\n" +
    "  </div>\n" +
    "  <div class=\"form-group\">\n" +
    "    <input class=\"form-control\"\n" +
    "           ng-model=\"newTrack\"\n" +
    "           ng-list>\n" +
    "  </div>\n" +
    "</form>\n" +
    "<div\n" +
    "   ng-repeat=\"report in monitor.reports\"\n" +
    "   report-summary\n" +
    "   >\n" +
    "</div>\n"
  );


  $templateCache.put('views/new-report.html',
    "<form\n" +
    "   class=\"form-horizontal\"\n" +
    "   ng-submit=\"submit()\"\n" +
    "   >\n" +
    "  <div class=\"form-group\">\n" +
    "    <label class=\"col-md-2 control-label\">Report content</label>\n" +
    "    <div class=\"col-md-10\">\n" +
    "      <textarea class=\"form-control\" required ng-model=\"content\"></textarea>\n" +
    "    </div>\n" +
    "  </div>\n" +
    "  <div class=\"form-group\">\n" +
    "    <div class=\"col-md-offset-2 col-md-10\">\n" +
    "      <button class=\"btn btn-default\" type=\"submit\">Submit</button>\n" +
    "    </div>\n" +
    "  </div>\n" +
    "</form>\n"
  );


  $templateCache.put('views/new-twitter-search.html',
    "<h2 translate>New Twitter search</h2>\n" +
    "<form class=\"form-horizontal\">\n" +
    "  <fieldset>\n" +
    "    <div class=\"form-group\">\n" +
    "      <label class=\"col-md-2\" translate>\n" +
    "        Please specify some search terms\n" +
    "      </label>\n" +
    "      <div class=\"col-md-10\">\n" +
    "        <input type=\"text\" class=\"col-md-10 form-control\" ng-model=\"terms\">\n" +
    "      </div>\n" +
    "    </div>\n" +
    "    <div class=\"col-md-10 col-md-offset-2\">\n" +
    "      <button class=\"btn btn-primary\" ng-click=\"submit()\">\n" +
    "        Submit\n" +
    "      </button>\n" +
    "    </div>\n" +
    "  </fieldset>\n" +
    "</form>\n"
  );


  $templateCache.put('views/report.html',
    "<div class=\"col-md-2 hidden-sm hidden-xs\">\n" +
    "  <div class=\"bs-sidebar\">\n" +
    "    <ul class=\"nav\">\n" +
    "      <li bs-scrollspy>\n" +
    "        <a ng-click=\"scrollTo('text')\">Text</a>\n" +
    "      </li>\n" +
    "      <li bs-scrollspy>\n" +
    "        <a ng-click=\"scrollTo('tasks')\">Tasks</a>\n" +
    "      </li>\n" +
    "    </ul>\n" +
    "  </div>\n" +
    "</div>\n" +
    "<div class=\"col-md-10\">\n" +
    "  <div class=\"panel panel-info\">\n" +
    "    <div class=\"panel-heading\" translate>\n" +
    "      Text\n" +
    "    </div>\n" +
    "    <div class=\"panel-body break-long-words\">\n" +
    "      <div ng-show=\"hasTranscript || transcriptCandidate\">\n" +
    "        <div ng-show=\"editingTranscript\" class=\"form-group\">\n" +
    "          <textarea ng-model=\"transcriptCandidate\" class=\"form-control\"\n" +
    "                    rows=\"5\"\n" +
    "                    ></textarea>\n" +
    "          <button type=\"button\" class=\"btn btn-default btn-sm\" translate\n" +
    "                  ng-click=\"saveTranscript()\"\n" +
    "                  ng-disabled=\"disableTranscript\"\n" +
    "                  >\n" +
    "            Save\n" +
    "          </button>\n" +
    "          <button type=\"button\" class=\"btn btn-default btn-sm\" translate\n" +
    "                  ng-click=\"cancelTranscriptEditing()\"\n" +
    "                  ng-disabled=\"disableTranscript\"\n" +
    "                  >\n" +
    "            Cancel\n" +
    "          </button>\n" +
    "        </div>\n" +
    "        <div ng-hide=\"editingTranscript\">\n" +
    "          <p\n" +
    "             class=\"lead\"\n" +
    "             id=\"text\"\n" +
    "             ng-bind=\"report.texts[0].transcript\"\n" +
    "             ></p>\n" +
    "          <button type=\"button\" class=\"btn btn-default btn-sm\" translate\n" +
    "                  ng-click=\"startTranscript()\"\n" +
    "                  >\n" +
    "            Edit\n" +
    "          </button>\n" +
    "          <button type=\"button\" class=\"btn btn-default btn-sm\" translate\n" +
    "                  ng-click=\"discardTranscript()\"\n" +
    "                  >\n" +
    "            Discard\n" +
    "          </button>\n" +
    "        </div>\n" +
    "        <hr>\n" +
    "      </div>\n" +
    "      <h5 ng-show=\"hasTranscript || transcriptCandidate\" translate>\n" +
    "        Original text:\n" +
    "      </h5>\n" +
    "      <p\n" +
    "         id=\"text\"\n" +
    "         ng-bind=\"report.texts[0].original\"\n" +
    "         ng-class=\"{lead: !hasTranscript}\"\n" +
    "         ></p>\n" +
    "      <button type=\"button\" class=\"btn btn-default btn-sm\" translate\n" +
    "              ng-click=\"startTranscript()\"\n" +
    "              ng-hide=\"hasTranscript || transcriptCandidate\"\n" +
    "              >\n" +
    "        Edit\n" +
    "      </button>\n" +
    "    </div>\n" +
    "  </div>\n" +
    "  <p ng-show=\"report.feed_type=='sms'\">\n" +
    "    <!--a class=\"btn btn-primary\"\n" +
    "       ng-href=\"#/session/{{encodedSession}}/{{report._id}}\"\n" +
    "       translate\n" +
    "       >\n" +
    "      Reply\n" +
    "    </a-->\n" +
    "    <a class=\"btn btn-default\"\n" +
    "       ng-href=\"#/session/{{encodedSession}}\"\n" +
    "       translate\n" +
    "       >\n" +
    "      Session\n" +
    "    </a>\n" +
    "  </p>\n" +
    "  <div>\n" +
    "    <div class=\"row\">\n" +
    "      <div class=\"col-sm-6\">\n" +
    "        <dl>\n" +
    "          <dt translate>Author</dt>\n" +
    "          <dd>\n" +
    "            <a ng-bind=\"report.authors[0].identifiers.user_name\"\n" +
    "               ng-href=\"#/citizen-card/{{report.authors[0].authority}}/{{report.authors[0].identifiers.user_name}}\"\n" +
    "               ></a>\n" +
    "          </dd>\n" +
    "        </dl>\n" +
    "      </div>\n" +
    "      <div class=\"col-sm-6\">\n" +
    "        <dl>\n" +
    "          <dt translate>Created</dt>\n" +
    "          <dd ng-bind=\"report.produced | date:'medium'\"></dd>\n" +
    "        </dl>\n" +
    "      </div>\n" +
    "    </div>\n" +
    "  </div>\n" +
    "  <div class=\"alert alert-{{status}}\"\n" +
    "       ng-hide=\"alert==''\"\n" +
    "       ng-bind=\"alert\"></div>\n" +
    "  <form id=\"tasks\" class=\"form-horizontal\" ng-repeat=\"step in report.steps\">\n" +
    "    <div class=\"form-group\">\n" +
    "      <div class=\"checkbox\">\n" +
    "        <label>\n" +
    "          <input type=\"checkbox\"\n" +
    "                 ng-model=\"step.done\"\n" +
    "                 ng-change=\"changeStep(step.done)\"\n" +
    "                 ng-disabled=\"stepsDisabled\"\n" +
    "                 >\n" +
    "          {{step.description}}\n" +
    "        </label>\n" +
    "      </div>\n" +
    "    </div>\n" +
    "  </form>\n" +
    "  <form class=\"form-horizontal\">\n" +
    "    <div class=\"form-group\">\n" +
    "      <div class=\"checkbox\">\n" +
    "        <label>\n" +
    "          <input type=\"checkbox\"\n" +
    "                 ng-model=\"report.verified\"\n" +
    "                 ng-change=\"save()\"\n" +
    "                 ng-disabled=\"wait\"\n" +
    "                 >\n" +
    "          <strong translate>This report is verified</strong>\n" +
    "        </label>\n" +
    "      </div>\n" +
    "    </div>\n" +
    "  </form>\n" +
    "</div>\n" +
    "<div class=\"clearfix\"></div>\n"
  );


  $templateCache.put('views/session.html',
    "<div ng-repeat=\"report in reports\">\n" +
    "  <div class=\"row\">\n" +
    "    <div ng-show=\"report.authors[0].identifiers.user_id == identity.user\"\n" +
    "         class=\"col-md-9 col-md-offset-3\">\n" +
    "      <div class=\"panel panel-info\">\n" +
    "        <div class=\"panel-heading\">\n" +
    "          <small class=\"pull-right\" ng-bind=\"report.produced | date:'medium'\">\n" +
    "          </small>\n" +
    "          <span ng-if=\"report.local\">\n" +
    "            <span ng-if=\"report.user_id.username\">\n" +
    "              <span ng-bind=\"report.user_id.username\">\n" +
    "              </span>\n" +
    "            </span>\n" +
    "            <span ng-if=\"!report.user_id.username\">\n" +
    "              <span translate>\n" +
    "                Sent by Citizendesk\n" +
    "              </span>\n" +
    "            </span>\n" +
    "          </span>\n" +
    "          <span ng-if=\"!report.local\">\n" +
    "            <span ng-repeat=\"author in report.authors\"\n" +
    "                  ng-bind=\"author.identifiers.user_name\">\n" +
    "            </span>\n" +
    "          </span>\n" +
    "        </div>\n" +
    "        <div class=\"panel-body\" ng-bind=\"report.texts[0].original\">\n" +
    "        </div>\n" +
    "      </div>\n" +
    "    </div>\n" +
    "    <div ng-hide=\"report.authors[0].identifiers.user_id == identity.user\"\n" +
    "         class=\"col-md-9\">\n" +
    "      <div class=\"panel panel-primary\">\n" +
    "        <div class=\"panel-heading\">\n" +
    "          <small class=\"pull-right\" ng-bind=\"report.produced | date:'medium'\">\n" +
    "          </small>\n" +
    "          <span ng-bind=\"report.authors[0].identifiers.user_name\">\n" +
    "          </span>\n" +
    "        </div>\n" +
    "        <div class=\"panel-body\" ng-bind=\"report.texts[0].original\">\n" +
    "        </div>\n" +
    "      </div>\n" +
    "    </div>\n" +
    "  </div>\n" +
    "</div>\n" +
    "<form>\n" +
    "  <div class=\"form-group\">\n" +
    "    <label translate>\n" +
    "      Reply to {{replyReport.authors[0].identifiers.user_name}}\n" +
    "    </label>\n" +
    "    <textarea class=\"form-control\" rows=\"3\" ng-model=\"reply\">\n" +
    "    </textarea>\n" +
    "  </div>\n" +
    "  <button class=\"btn btn-primary\" translate\n" +
    "          ng-click=\"sendReply({report_id: replyReport._id, message: reply})\"\n" +
    "          type=\"submit\">\n" +
    "    Send\n" +
    "  </button>\n" +
    "  <button class=\"btn btn-default\" translate\n" +
    "          ng-click=\"reset()\">\n" +
    "    Reset\n" +
    "  </button>\n" +
    "</form>\n"
  );


  $templateCache.put('views/twitter-search.html',
    "<div queue-selection></div>\n" +
    "<div>\n" +
    "  <p ng-switch=\"status\" class=\"clearfix\">\n" +
    "    <span class=\"pull-right\">\n" +
    "    <button class=\"btn btn-warning btn-xs pull-right\"\n" +
    "            ng-switch-when=\"deleted\"\n" +
    "            disabled\n" +
    "            >\n" +
    "      <span translate>Deleted</span>\n" +
    "    </button>\n" +
    "    <span\n" +
    "       ng-switch-when=\"error\"\n" +
    "       >\n" +
    "      <span translate>Error deleting</span>\n" +
    "      <button class=\"btn btn-warning btn-xs\"\n" +
    "              ng-click=\"delete()\"\n" +
    "              >\n" +
    "        <span translate>Try again</span>\n" +
    "      </button>\n" +
    "    </span>\n" +
    "    <button class=\"btn btn-warning btn-xs\"\n" +
    "            ng-switch-when=\"deleting\"\n" +
    "            disabled\n" +
    "            >\n" +
    "      <span class=\"fa fa-refresh fa-spin\"></span>\n" +
    "      <span translate>Deleting</span>\n" +
    "    </button>\n" +
    "    <button class=\"btn btn-warning btn-xs\"\n" +
    "            ng-switch-default\n" +
    "            ng-click=\"delete()\"\n" +
    "            >\n" +
    "      <span translate>Delete search</span>\n" +
    "    </button>\n" +
    "    </span>\n" +
    "  </p>\n" +
    "</div>\n" +
    "<p>\n" +
    "  <div class=\"input-group\">\n" +
    "    <div class=\"input-group-addon\">\n" +
    "      <span class=\"glyphicon glyphicon-search\"></span>\n" +
    "    </div>\n" +
    "    <input class=\"form-control\" type=\"search\" ng-model=\"q\" />\n" +
    "  </div>\n" +
    "</p>\n" +
    "<div\n" +
    "   ng-repeat=\"report in queue.reports | filter:q | limitTo:limit\"\n" +
    "   report-summary\n" +
    "   >\n" +
    "</div>\n" +
    "<p ng-show=\"queue.reports.length > limit\">\n" +
    "  <button class=\"btn btn-default btn-lg btn-block\"\n" +
    "          ng-click=\"limit = limit + 50\"\n" +
    "          >\n" +
    "    <span translate>\n" +
    "      See more reports\n" +
    "    </span>\n" +
    "  </button>\n" +
    "</p>\n" +
    "<div ng-hide=\"queue.reports.length\" translate>\n" +
    "  No reports match your search criteria\n" +
    "</div>\n"
  );


  $templateCache.put('views/verified-reports.html',
    "<ol class=\"breadcrumb\">\n" +
    "  <li class=\"active\" translate>Verified reports</li>\n" +
    "</ol>\n" +
    "<div\n" +
    "   ng-repeat=\"report in reports\"\n" +
    "   report-summary\n" +
    "   >\n" +
    "</div>\n" +
    "<p ng-hide=\"reports.length\" translate>\n" +
    "  There are no verified reports yet\n" +
    "</p>\n"
  );


  $templateCache.put('views/web-queue.html',
    "<div queue-selection></div>\n" +
    "<div\n" +
    "   ng-repeat=\"report in reports\"\n" +
    "   report-summary\n" +
    "   >\n" +
    "</div>\n"
  );

}]);
