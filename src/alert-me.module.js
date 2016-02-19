angular.module('alert-me', [])

/**
 * At start check if element is
 * in the document body
 */
.run(function($document,$templateCache) {

  var mainTmpl = '<div class="tm-container {{posV}} {{posH}}">'+
                  '<ul class="tm-nav" >'+
                    '<alert-message ng-repeat="message in messages" message="message">'+
                    '</alert-message>'+
                  '</ul>'+
                '</div>';

  var listTmpl = '<li class="tm-list" ng-click="clickEvent($event)">' +
                    '<div class="tm-alert {{message.className}}">' +
                      '<span ng-show="message.count > 1" class="count" ng-bind="message.count"></span>' +
                      '<span ng-if="message.title" class="title" ng-bind="message.title"></span>' +
                      '<span ng-if="message.isTrustedHtml" class="content" ng-bind-html="message.content"></span>' +
                      '<span ng-if="!message.isTrustedHtml" class="content" ng-bind="message.content"></span>' +
                      '<span ng-if="message.dismissButton" class="close" ng-click="closeAlert()">X</span>' +
                    '</div>' +
                  '</li>';

  $templateCache.put('alert-me/main-template.html', mainTmpl);
  $templateCache.put('alert-me/list-template.html', listTmpl);

  // check if element is in page
  if( !$document.find('alert-me').length ) {
    return $document[0].body.appendChild( $document[0].createElement('alert-me') );
  }
  
})
