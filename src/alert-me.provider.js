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

})
