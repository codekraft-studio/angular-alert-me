angular.module('alert-me')

.factory('AlertMe', function($log, $sce, $injector, $rootScope, $q, $document, Alert){

  // all the messages
  var _messages = [];

  // default view and message options
  var _defaults = Alert.defaults;

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

  /**
   * Create the main directive for the "web mode" append it to the DOM
   * and compile it with a new scope since it requires isolated scope
   * @method _createDirective
   */
  function _createDirective() {

    // if already in exit
    if( $document.find('alert-me').length ) {
      return;
    }

    var directive = $document[0].createElement('alert-me');
    $document[0].body.appendChild(directive);

  }

  /**
   * Dismiss a message by ID
   * @method _dismiss
   * @param  {String} id The message unique id
   */
  function _dismiss(id) {

    // loop through _messages
    for (var i = 0; i < _messages.length; i++) {

      // find matching message id
      if( _messages[i].id === id ) {

        // copy message
        var message = angular.copy(_messages[i]);

        // remove it from the messages array
        _messages.splice(i, 1);

        // if callback is a valid function
        if( angular.isFunction(message.onDismiss) ) {
          // run callback passing message
          return message.onDismiss(message);
        }

      }

    }

  }

  /**
   * Do the default browser notification
   * @method _doDefaultNotification
   * @param  {Object} message The object with notification content and options
   * @param  {Function} callback The internal callback to call after creating the message
   */
  function _doDefaultNotification(message, callback) {

    // combine duplications of
    // _messages that have same attributes
    if( message.combineDuplications ) {

      // check for equal objects
      for (var i = 0; i < _messages.length; i++) {
        // if _messages has same content and class
        // return and don't show the toast
        if( _messages[i].content === message.content && _messages[i].className === message.className ) {
          _messages[i].count = _messages[i].count + 1;
          return callback(_messages[i]);
        }
      }

    }

    // if there are more messages than maximum
    // and the messages position is top, remove first
    // otherwise remove last
    if( message.maxNum && _messages.length >= message.maxNum && message.verticalPosition === 'top' ) {

      // dismiss first
      this.dismiss( _messages[0].id );

    } else if( message.maxNum && _messages.length >= message.maxNum && message.verticalPosition === 'bottom' ) {

      // dismiss last
      this.dismiss( _messages[_messages.length-1].id );

    }

    // Get the message content as html or string
    message.content = (message.isTrustedHtml) ? $sce.trustAsHtml(message.content) : message.content;

    // Select where to push the message depending on vertical alinement
    if( message.verticalPosition === 'bottom' ) {
      _messages.unshift(message);
    } else {
      _messages.push(message);
    }

    // Add dismiss method
    message.dismiss = function() {
      return _dismiss(message.id);
    };

    // Do the onCreate callback passing the message id and object
    if( message.onAfterCreate && angular.isFunction(message.onAfterCreate) ) {
      // run after create callback
      message.onAfterCreate(message.id, message);
    }

    return callback(message);

  }

  /**
   * Do the desktop notification
   * @method _doDesktopNotification
   * @param  {Object} message The object with notification content and options
   * @param  {Function} callback The internal callback to call after creating the message
   */
  function _doDesktopNotification(message, callback) {

    var notify = new Notification(message.title, {
      tag: message.id,
      body: message.content.replace(/(<([^>]+)>)/ig, ''),
      image: message.image,
      icon: message.icon,
      sticky: !message.dismissButton && !message.dismissOnTimeout,
      requireInteraction: !message.dismissOnTimeout
    });

    // Add dismiss function
    message.dismiss = function() {
      return notify.close();
    };

    // Assign create callback
    if( angular.isFunction(message.onAfterCreate) ) {

      notify.onshow = function() {
        return message.onAfterCreate();
      };

    }

    // When the notification is closed ensure is removed from
    // messages array and optionally call the onDismiss callback
    notify.onclose = function() {
      return _dismiss(message.id);
    };

    // Add notification to messages array
    _messages.push(message);

    return callback(message);

  }

  function _init() {

    var deferred = $q.defer();

    if( _defaults.desktop ) {

      // Get desktop notification permission
      Notification.requestPermission().then(function(result) {

        if (result === 'denied' || result === 'default') {

          $log.warn('angular-alert-me: The client rejected the desktop notification permission.');

          // Reset option to avoid running multiple times this function
          _defaults.desktop = false;

          // Reject promise
          deferred.resolve('DEFAULT');

          // check if element is in page
          if( !$document.find('alert-me').length ) {
            return _createDirective();
          }

        }

        deferred.resolve('DESKTOP');

      });

    } else {

      deferred.resolve('DEFAULT');

    }

    return deferred.promise;

  }

  function _create(msg) {

    var deferred = $q.defer();

    // get the toast object or
    // if text create new object with content in it
    msg = ( typeof msg === 'object' ) ? msg : { content: msg };

    // set new id for the message
    msg.id = 'ID:' + Date.now() + Math.floor((Math.random() * 10) + 1);

    // first message, init message inenr counter
    msg.count = 1;

    // extend message options with defaults
    msg = angular.extend( {}, _defaults, msg );

    // if on before create function is false
    if( angular.isFunction(msg.onBeforeCreate) && !msg.onBeforeCreate(msg) ) {

      // reject notify creation
      deferred.reject();

    } else  {

      // Run the init function that check which type of
      // notification to show and eventually ask for permission
      // in case of desktop notification
      _init().then(function(type) {

        if( type === 'DEFAULT' ) {

          _doDefaultNotification(msg, function(response) {
            deferred.resolve(response);
          });

        }

        if( type === 'DESKTOP' ) {

          _doDesktopNotification(msg, function(response) {
            deferred.resolve(response);
          });

        }

      }, function() {

        // warn the user/developer about the error
        $log.warn('angular-alert-me: Something went wrong during the creation of notification:', msg);

        // reject notify creation
        deferred.reject();

      });

    }

    return deferred.promise;

  }

  /**
   * Dismiss all the messages at once
   * @method _dismissAll
   */
  function _dismissAll() {

    var i = _messages.length;

    while (i--) {
      _messages[i].dismiss();
    }

  }

  /**
   * Create a notification with default info class
   * this method is working only in browser mode
   * @method _info
   * @param  {String|Object} msg The message string or object
   * @return {Promise}
   */
  function _info(msg) {
    var object = _mergeParams(msg, { className: 'info' });
    return this.create( object );
  }

  /**
   * Create a notification with default success class
   * this method is working only in browser mode
   * @method _success
   * @param  {String|Object} msg The message string or object
   * @return {Promise}
   */
  function _success(msg) {
    var object = _mergeParams(msg, { className: 'success' });
    return this.create( object );
  }

  /**
   * Create a notification with default warning class
   * this method is working only in browser mode
   * @method _warning
   * @param  {String|Object} msg The message string or object
   * @return {Promise}
   */
  function _warning(msg) {
    var object = _mergeParams(msg, { className: 'warning' });
    return this.create( object );
  }

  /**
   * Create a notification with default danger class
   * this method is working only in browser mode
   * @method _danger
   * @param  {String|Object} msg The message string or object
   * @return {Promise}
   */
  function _danger(msg) {
    var object = _mergeParams(msg, { className: 'danger' });
    return this.create( object );
  }

  // the service public methods
  var service = {
    $$init: _createDirective,
    defaults: _defaults,
    messages: _messages,
    create: _create,
    dismiss: _dismiss,
    dismissAll: _dismissAll,
    info: _info,
    success: _success,
    warning: _warning,
    danger: _danger
  };

  return service;

});
