angular.module('alert-me', [])

/**
* At start check if element is
* in the document body
*/
.run(function($document,$templateCache) {

    var mainTmpl =  '<div class="notify-container {{posV}} {{posH}}">'+
                        '<ul class="notify-nav" >'+
                            '<alert-message ng-repeat="message in messages" message="message"></alert-message>'+
                        '</ul>'+
                    '</div>';

    var listTmpl =  '<li class="notify-list" ng-click="onClick($event)">' +
                        '<div class="notify-alert {{message.className}}">' +
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

});

angular.module('alert-me')

.directive('alertMe', function(AlertMe){

    var directive = {
        restrict: 'E',
        scope: true, // isolated scope
        templateUrl: 'alert-me/main-template.html',
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
        templateUrl: 'alert-me/list-template.html',
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
        * If dismissOnClick is set
        * add the click event binder
        */
        scope.onClick = function (e) {
            e.preventDefault();
            if( scope.message.dismissOnClick ) {
                return scope.closeAlert();
            }
        }

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
            element.bind('mouseenter', function(e) {
                $timeout.cancel(promise);
            });

            // restart dismiss timeout when mouse leave
            element.bind('mouseleave', function(e) {
                promise = $timeout(function() {
                    return scope.closeAlert();
                }, (scope.message.dismissTimeout*1000) );
            });

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
                    return scope.closeAlert();
                }, (scope.message.dismissTimeout*1000) );
            }
        })

    }

})

angular.module('alert-me')

.factory('AlertMe', function($sce, $q, Alert){

    // all the messages
    var _messages = [];

    // default view and message options
    var _defaults = Alert.defaults;

    // the service public methods
    var service = {
        defaults: _defaults,
        messages: _messages,
        create: _create,
        dismiss: _dismiss,
        info: _info,
        success: _success,
        warning: _warning,
        danger: _danger
    }

    return service;

    function _create(msg) {

        // get the toast object or
        // if text create new object with content in it
        msg = ( typeof msg === 'object' ) ? msg : {content: msg};

        // extend message options with defaults
        msg = angular.extend( {}, _defaults, msg )

        // if on before create function is false
        if( angular.isFunction(msg.onBeforeCreate(msg)) && !msg.onBeforeCreate(msg) ) {
            return;
        }

        // first message, init message inenr counter
        msg.count = 1;

        // set classname by obj property or default value
        msg.className = (msg.className) ? msg.className : defaults.className;

        // if there are more messages than maximum
        // and the messages position is top, remove first
        // otherwise remove last
        if( msg.maxNum && _messages.length >= msg.maxNum && msg.verticalPosition === 'top' ) {
            // dismiss first
            this.dismiss( _messages[0].id );

        } else if( msg.maxNum && _messages.length >= msg.maxNum && msg.verticalPosition === 'bottom' ) {
            // dismiss last
            this.dismiss( _messages[_messages.length-1].id );
        }

        // combine duplications of
        // _messages that have same attributes
        if( msg.combineDuplications ) {
            // check for equal objects
            for (var i = 0; i < _messages.length; i++) {
                // if _messages has same content and class
                // return and don't show the toast
                if( _messages[i].content == msg.content && _messages[i].className == msg.className ) {
                    return _messages[i].count++;
                }
            }
        }

        // set new id for the message
        msg.id = 'ID:' + Date.now() + Math.floor((Math.random() * 10) + 1);

        // get msg.content
        msg.content = (msg.isTrustedHtml) ? $sce.trustAsHtml(msg.content) : msg.content;

        // push to correct position
        if( msg.verticalPosition === 'bottom' ) {
            _messages.unshift(msg);
        } else {
            _messages.push(msg);
        }

        // return created message id
        if( msg.onAfterCreate && angular.isFunction(msg.onAfterCreate) ) {
            // run after create callback
            msg.onAfterCreate();
        }

        // return alert id
        return msg.id;
    }

    // dismiss existing alert by ID
    function _dismiss(id) {
        // loop through _messages
        for (var i = 0; i < _messages.length; i++) {
            // find matching message id
            if( _messages[i].id == id ) {
                // copy message
                var message = angular.copy(_messages[i]);
                // remove it
                _messages.splice(i, 1);
                // if valid function
                if( angular.isFunction(message.onDismiss) ) {
                    // run callback passing message
                    return message.onDismiss(message)
                }
            }

        }

    }

    function _info(msg) {
        var object = _mergeParams(msg, { className: 'info' });
        return this.create( object );
    }

    function _success(msg) {
        var object = _mergeParams(msg, { className: 'success' });
        return this.create( object );
    }

    function _warning(msg) {
        var object = _mergeParams(msg, { className: 'warning' });
        return this.create( object );
    }

    function _danger(msg) {
        var object = _mergeParams(msg, { className: 'danger' });
        return this.create( object );
    }

    /**
     * Extend the user options with the default method settings
     */
    function _mergeParams(object, defaults) {

        if( angular.isString(object) ) {
            defaults.content = object;
        } else if( angular.isObject(object) ) {
            defaults = angular.extend(object, defaults);
        }

        return defaults;

    }


})

angular.module('alert-me')

.factory('alertInterceptor', function ($q, AlertMe) {

	return {

		'requestError': function (rejection) {

			if( !rejection.config.notifyError ) {
				return;
			}

			AlertMe.warning({
				title: rejection.status,
				content: rejection.statusText,
			});

			return $q.reject(rejection);

		},

		'responseError': function (rejection) {

			if( !rejection.config.notifyError ) {
				return;
			}

			AlertMe.warning({
				title: rejection.status,
				content: rejection.statusText,
			});

			return $q.reject(rejection);

		}

	}

});

angular.module('alert-me')

.provider('Alert', function () {

    // the module defaults
    var _defaults = {
        maxNum: 0, // max alerts to show ( default unlimited )
        verticalPosition: 'top', // vertical toast container position
        horizontalPosition: 'right', // horizontal toast container position
        className: 'default', // default classname
        isTrustedHtml: false, // if content is HTML
        combineDuplications: true, // combine duplicated alerts (default true)
        dismissButton: true, // show / hide the dismiss button
        dismissOnTimeout: true, // dismiss alert on timeout
        dismissTimeout: 4, // the dismiss timeout (in seconds)
        dismissOnClick: true, // dimiss alert on click
        onBeforeCreate: function(msg) { // on before create funtion
            return true; // returning false will block the alert
        },
        onAfterCreate: null, // on create callback
        onBeforeDismiss: null, // on before alert dismiss
        onDismiss: null // on dismiss callback
    };

    // configure default settings
    this.configure = function (options) {
        return _defaults = angular.extend(_defaults, options);
    }

    // return object
    this.$get = function () {

        return {
            defaults: _defaults,
        }

    }

});
