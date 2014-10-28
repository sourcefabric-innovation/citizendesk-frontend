'use strict';

angular.module('citizendeskFrontendApp')
  .controller('CommonReportDetailPartCtrl', function ($scope, Coverages, SharedReport, $routeParams, lodash, screenSize, api, session, $http, config, superdeskDate, gettextCatalog, $window, Raven) {
    var coveragesData = new Bacon.Bus(),
        shared = SharedReport.get($routeParams.id),
        _ = lodash;

    function addSteps(report) {
      if (!('steps' in report)) {
        api.steps.query()
          .then(function(response) {
            var data = response._items;
            if (data.length === 0) {
              Raven.raven.captureMessage('no validation steps for report detail');
            } else {
              report.steps = data.map(function(step) {
                step.done = false;
                return step;
              });
            }
          });
      }
    }
    function checkPublished(report) {
      if (report.coverages && report.coverages.published) {
        return report.coverages.published.length > 0;
      } else {
        return false;
      }
    }

    Coverages.promise.then(function (coverages) {
      coveragesData.push(coverages);
    });
    coveragesData.onValue(function(coverages) {
      $scope.coverages = coverages;
    });
    shared.property.onValue(function (report) {
      $scope.report = report; // shadows a report in the parent scope
      addSteps($scope.report); // idempotent
      $scope.isPublished = checkPublished(report);
      if (report.on_behalf_id) {
        api.users.getById(report.on_behalf_id)
          .then(function(user) {
            $scope.onBehalf = user;
          });
      }
      if (report.notices_outer.length) {
        $scope.comment = true;
        $scope.commentCopy = report.notices_outer[0];
      }
    });
    // watchers have to be added just once
    shared.property.take(1).onValue(function(){
      $scope.$watch('report.status', function(newValue, oldValue){
        if(newValue === oldValue) {
          return;
        }
        // possibly complain about doing the necessary steps
        if ($scope.report.steps) {
          var badVerification = gettextCatalog.getString('This report is being marked as verified without going through the planned verification steps');
          var allDone = $scope.report.steps.every(function(step) {
            return step.done;
          });
          if (newValue === 'verified' && allDone === false) {
            $window.alert(badVerification);
          }
        }
        // possibly complain about not playing with verification
        if (oldValue === 'verified') {
          var doNotJump = gettextCatalog.getString('This report was marked as verified, and now it is marked as unverified again! This is a very bad practice, and should be avoided');
          $window.alert(doNotJump);
        }
      });
      $scope.$watch('report.steps', function() {
        if ($scope.report && $scope.report.steps) {
          $scope.verificationDisabled = $scope.report.steps
            .some(function(step) {
              return step.mandatory && (!step.done);
            });
        }
      }, true);
      $scope.$watch('report.status', function(n, o) {
        if(n === o) {
          return;
        }
        $scope.report.status_updated = superdeskDate.render(new Date());
        $scope.save();
      });
      $scope.$watch('report.notices_outer', function(n, o) {
        if(n === o) {
          return;
        }
        // do not auto save when the report is already published
        if($scope.isPublished) {
          return;
        }
        $scope.report.status_updated = superdeskDate.render(new Date());
        $scope.save();
      }, true);
      $scope.$watch('comment', function(n, o) {
        if(n === o) {
          return;
        }
        if(n === false) {
          $scope.report.notices_outer = [];
        }
      });
    });
    Bacon
      .combineAsArray(shared.property, coveragesData)
      .onValue(function(value) {
        var report = value[0], coverages = value[1];
        if (coverages && report.coverages && report.coverages.published) {
          $scope.selectedCoverage = _.find(coverages, {
            uuid: report.coverages.published[0]
          });
        }
      });

    $scope.changeStep = function(checking) {
      if (!checking) {
        alert('A validation step should never be unchecked, if you are unchecking now this means that the validation process was poor. Please be sure to avoid this in the future');
      }
      $scope.save();
    };

    $scope.publish = function() {
      $scope.disablePublish = true;
      api.reports
        .save($scope.report, {on_behalf_id: session.identity._id})
        .then(function(report) {
          return $http
            .post(config.server.url + 'proxy/publish', {
              report: report._id,
              coverage: $scope.selectedCoverage.uuid
            });
        })
        .then(function() {
          shared.update();
          $scope.disablePublish = false;
        });
    };

    $scope.unpublish = function() {
      $scope.disablePublish = true;

      $http
        .post(config.server.url + 'proxy/unpublish', {
          report: $scope.report._id,
          coverage: $scope.report.coverages.published[0]
        })
        .then(function() {
          shared.update();
          $scope.disablePublish = false;
        });
    };
    $scope.save = function() {
      $scope.status = 'info';
      $scope.alert = 'saving';
      $scope.disabled = true;

      api.reports.save($scope.report)
        .then(function (saved) {
          $scope.status = 'success';
          $scope.alert = 'saved';
          $scope.disabled = false;
          shared.stream.push(saved);
        });
    };
    $scope.largeScreen = screenSize.is('md,lg');
  });
