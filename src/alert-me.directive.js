.directive('alertMe', function(AlertMe){

  var directive = {
    restrict: 'E',
    template:   '<div class="tm-container {{posV}} {{posH}}">'+
                  '<ul class="tm-nav" >'+
                    '<alert-message ng-repeat="message in messages" message="message">'+
                    '</alert-message>'+
                  '</ul>'+
                '</div>',
    link: link
  }

  return directive;

  function link(scope, elem, attrs) {
    // bind messages to directive scope
    scope.messages = AlertMe.messages;
    // bind positions to directive scope
    scope.posH = AlertMe.defaults.horizontalPosition;
    scope.posV = AlertMe.defaults.verticalPosition;
  }

})

.directive('alertMessage', function($timeout,$q,$sce,$location,AlertMe) {

  var scope = {
    message: '='
  }

  var directive = {
    restrict: 'E',
    replace: true,
    scope: scope,
    template: '<li class="tm-list">' +
                '<div class="tm-alert {{message.className}}">' +
                  '<span ng-show="message.count > 1" class="count" ng-bind="message.count"></span>' +
                  '<span ng-if="message.title" class="title" ng-bind="message.title"></span>' +
                  '<span ng-if="message.isTrustedHtml" class="content" ng-bind-html="message.content"></span>' +
                  '<span ng-if="!message.isTrustedHtml" class="content" ng-bind="message.content"></span>' +
                  '<span ng-if="message.dismissButton" class="close" ng-click="closeAlert()">X</span>' +
                '</div>' +
              '</li>',
    link: link
  }

  return directive;

  function link(scope, element, attrs, ctrl, transclude) {

    /**
     * Promise for alert dismiss timeout
     */
    var promise;

    /**
     * Function that close the actual alert
     */
    scope.closeAlert = function() {
      return AlertMe.dismiss(scope.message.id);
    }

    /**
     * If message depend on a function
     * resolve is and than close the alert
     */
    if( scope.message.resolve && angular.isFunction(scope.message.resolve) ) {

      // wait until promise is resolved
      return $q.when( scope.message.resolve(), scope.closeAlert);
    }

    /**
     * If dismissOnClick is set
     * add the click event binder
     */
    if( scope.message.dismissOnClick ) {
      // bind click
      element.bind('click', function(e) {
        scope.$apply(function(){
          // clear timeout promise
          if(promise) { $timeout.cancel(promise); }
          // dismiss message
          return scope.closeAlert()
        })
      })
    }

    // if property dismissOnTimeout
    // and is not a progress alert
    if( scope.message.dismissOnTimeout ) {

      // run dismiss timeout
      promise = $timeout(function() {
        return scope.closeAlert()
      }, (scope.message.dismissTimeout*1000) );

      // block on mouseenter
      // example: if user focus on it for reading
      element.bind('mouseenter', function(e) {
        $timeout.cancel(promise);
      })

      // restart dismiss timeout when mouse leave
      element.bind('mouseleave', function(e) {
        promise = $timeout(function() {
          return scope.closeAlert()
        }, (scope.message.dismissTimeout*1000) );
      })
    }

    // watch if message count increase
    scope.$watch('message.count', function(n, o) {
      // block first run
      if( o === n ) return;
      // if count increase
      // stop and restart the timeout
      if( n > 1 && scope.message.dismissOnTimeout ) {
        // stop
        $timeout.cancel(promise);
        // restart
        promise = $timeout(function() {
          return scope.closeAlert()
        }, (scope.message.dismissTimeout*1000) );
      }
    })

  }

})
