angular.module('alert-me', [])

/**
* At start check if element is
* in the document body
*/
.run(function($log, $document, $templateCache, AlertMe) {

  var mainTmpl =  '<div class="notify-container {{posV}} {{posH}}">'+
                      '<ul class="notify-nav" >'+
                          '<alert-message ng-repeat="message in messages" message="message"></alert-message>'+
                      '</ul>'+
                  '</div>';

  var listTmpl =  '<li class="notify-message" ng-click="onClick($event)">' +

                      '<div class="notify-message-inner {{message.className}}" ng-class="{dismissable: message.dismissButton}">' +

                          '<div ng-if="message.icon" class="notify-icon">' +
                            '<img ng-src="{{message.icon}}" title="{{message.title}}" />' +
                          '</div>' +

                          '<div ng-show="message.count > 1" class="count" ng-bind="message.count"></div>' +

                          '<div class="notify-content">' +

                            '<span ng-if="message.title" class="notify-title" ng-bind="message.title"></span>' +
                            '<span ng-if="message.isTrustedHtml" class="notify-message" ng-bind-html="message.content"></span>' +
                            '<span ng-if="!message.isTrustedHtml" class="notify-message" ng-bind="message.content"></span>' +

                          '</div>' +

                          '<span ng-if="message.dismissButton" class="close" ng-click="closeAlert()">X</span>' +

                      '</div>' +

                  '</li>';

  $templateCache.put('alert-me/container-template.html', mainTmpl);
  $templateCache.put('alert-me/message-template.html', listTmpl);

  // If global default notification
  // init main directive and exit
  if( !AlertMe.defaults.desktop ) {
    return AlertMe.$$init();
  }

  // If Notification is not available fallback to default method
  if( !window.Notification || typeof window.Notification === 'undefined' ) {

    // Alert the user (or developer)
    $log.warn('angular-alert-me: Notifications are not supported in your browser.');

    // Remove global option
    AlertMe.defaults.desktop = false;

    // Init directive
    AlertMe.$$init();

  }

});
