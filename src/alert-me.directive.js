angular.module('alert-me')

.directive('alertMe', function(AlertMe){

  function _link(scope) {
    // bind messages to directive scope
    scope.messages = AlertMe.messages;
    // bind positions to directive scope
    scope.posH = AlertMe.defaults.horizontalPosition;
    scope.posV = AlertMe.defaults.verticalPosition;
  }

  var directive = {
    restrict: 'E',
    scope: true, // isolated scope
    templateUrl: 'alert-me/container-template.html',
    link: _link
  };

  return directive;

})

.directive('alertMessage', function($timeout, $q, AlertMe) {

  function link(scope, element) {

    /**
    * Promise for alert dismiss timeout
    */
    var promise;

    /**
    * Function that close the actual alert
    */
    scope.closeAlert = function() {
      return AlertMe.dismiss(scope.message.id);
    };

    /**
    * If dismissOnClick is set
    * add the click event binder
    */
    scope.onClick = function (e) {
      e.preventDefault();
      if( scope.message.dismissOnClick ) {
        return scope.closeAlert();
      }
    };

    /**
    * If message depend on a function
    * resolve is and than close the alert
    */
    if( scope.message.resolve && angular.isFunction(scope.message.resolve) ) {

      // wait until promise is resolved
      return $q.when( scope.message.resolve(), scope.closeAlert);
    }

    // if property dismissOnTimeout
    // and is not a progress alert
    if( scope.message.dismissOnTimeout ) {

      // run dismiss timeout
      promise = $timeout(function() {
        return scope.closeAlert();
      }, (scope.message.dismissTimeout*1000) );

      // block on mouseenter
      // example: if user focus on it for reading
      element.bind('mouseenter', function() {
        $timeout.cancel(promise);
      });

      // restart dismiss timeout when mouse leave
      element.bind('mouseleave', function() {
        promise = $timeout(function() {
          return scope.closeAlert();
        }, (scope.message.dismissTimeout*1000) );
      });

    }

    // watch if message count increase
    scope.$watch('message.count', function(n, o) {
      // block first run
      if( o === n ) { return; }
      // if count increase
      // stop and restart the timeout
      if( n > 1 && scope.message.dismissOnTimeout ) {
        // stop
        $timeout.cancel(promise);
        // restart
        promise = $timeout(function() {
          return scope.closeAlert();
        }, (scope.message.dismissTimeout*1000) );
      }

    });

  }

  var scope = {
    message: '='
  };

  var directive = {
    restrict: 'E',
    replace: true,
    scope: scope,
    templateUrl: 'alert-me/message-template.html',
    link: link
  };

  return directive;


});
