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
    ( msg.verticalPosition === 'bottom' ) ? _messages.unshift(msg) : _messages.push(msg);

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
    return this.create( {content: msg, className: 'info'} );
  }

  function _success(msg) {
    return this.create( {content: msg, className: 'success'} );
  }

  function _warning(msg) {
    return this.create( {content: msg, className: 'warning'} );
  }

  function _danger(msg) {
    return this.create( {content: msg, className: 'danger'} );
  }

})
