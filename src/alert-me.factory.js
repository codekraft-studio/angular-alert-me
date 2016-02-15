.factory('AlertMe', function($sce, $q){

  // all the messages
  var messages = [];

  // default view and message options
  var defaults = {
    maxNum: 0, // max alerts to show ( default unlimited )
    verticalPosition: 'top', // vertical toast container position
    horizontalPosition: 'right', // horizontal toast container position
    className: 'info', // default classname
    isTrustedHtml: false, // if content is HTML
    combineDuplications: true, // combine duplicated alerts (default true)
    dismissButton: false, // show / hide the dismiss button
    dismissOnTimeout: false, // dismiss alert on timeout
    dismissTimeout: 4, // the dismiss timeout (in seconds)
    dismissOnClick: false, // dimiss alert on click
    onBeforeCreate: function(msg) { // on before create funtion
      return true; // returning false will block the alert
    },
    onAfterCreate: null, // on create callback
    onBeforeDismiss: null, // on before alert dismiss
    onDismiss: null // on dismiss callback
  };

  // the service public methods
  var service = {
    defaults: defaults,
    configure: _configure,
    messages: messages,
    create: _create,
    dismiss: _dismiss,
    info: _info,
    success: _success,
    warning: _warning,
    danger: _danger
  }

  return service;

  // change default options
  function _configure(params) {
    angular.forEach(params, function(key, val) {
      if(defaults.hasOwnProperty(val)) { defaults[val] = key; }
    })
  }

  function _create(msg) {

    // get the toast object or
    // if text create new object with content in it
    msg = ( typeof msg === 'object' ) ? msg : {content: msg};

    // extend message options with defaults
    msg = angular.extend( {}, defaults, msg )

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
    if( msg.maxNum && messages.length >= msg.maxNum && msg.verticalPosition === 'top' ) {
      // dismiss first
      this.dismiss( messages[0].id );

    } else if( msg.maxNum && messages.length >= msg.maxNum && msg.verticalPosition === 'bottom' ) {
      // dismiss last
      this.dismiss( messages[messages.length-1].id );
    }

    // combine duplications of
    // messages that have same attributes
    if( msg.combineDuplications ) {
      // check for equal objects
      for (var i = 0; i < messages.length; i++) {
        // if messages has same content and class
        // return and don't show the toast
        if( messages[i].content == msg.content && messages[i].className == msg.className ) {
          return messages[i].count++;
        }
      }
    }

    // set new id for the message
    msg.id = 'ID:' + Date.now() + Math.floor((Math.random() * 10) + 1);

    // get msg.content
    msg.content = (msg.isTrustedHtml) ? $sce.trustAsHtml(msg.content) : msg.content;

    // push to correct position
    ( msg.verticalPosition === 'bottom' ) ? messages.unshift(msg) : messages.push(msg);

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
    // loop through messages
    for (var i = 0; i < messages.length; i++) {
      // find matching message id
      if( messages[i].id == id ) {
        // copy message
        var message = angular.copy(messages[i]);
        // remove it
        messages.splice(i, 1);
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
