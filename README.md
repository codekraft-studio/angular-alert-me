# angular-alert-me
#### a notification manager for angularjs with many options

### [DEMO](http://www.codekraft.it/demos/angular-alert-me/)

### Getting started
Download the module using npm:
```bash
npm install angular-alert-me
```
or download it from github.

Add the style and the script to your html page:
```html
<link rel="stylesheet" type="text/css" href="angular-alert-me.css">
<script type="text/javascript" src="angular-alert-me.js"></script>
```
Add module name to your application dependencies:
```javascript
angular.module('app', ['alert-me']);
```
__That's it__ now you can inject anywhere in your app the __AlertMe__ service in order to manage the notifications.

---

### How to use it
Let's start by creating a simple default notification using the __create__ function, this method will return the message just created:

```javascript
angular.module('app')
.controller('MainCtrl', function(AlertMe) {
  AlertMe.create('a simple alert').then(function(message) {
    console.log('Message created:', message);
  });
});
```
You can use the **create** function in two ways:
* Passing a string will output the default alert message with the string you passed as content.
* Passing a object with the attributes you want to override to customize the alert message appearance and beaviour, the mandatory property is **content** with is the message of the alert.

The default alert class is **default**, (not so fantasy) but you can create a fully customized alert your custom classes and doing your own style.

```javascript
var msg = {
  content: 'a custom alert',
  className: 'my-class'
}

AlertMe.create(msg);
```

You can override the module defaults settings using __configure__ method inside the config function:

```javascript
angular.module('app')
.config(function(AlertProvider) {

  AlertProvider.configure({
    className: 'success' // this will be the default class if nothing is passed,
    onBeforeCreate: function(conf) {
      // do some checks
    }
  })

})
```

But you can always set override the properties per message passing a object to the __create__ method, like in this example:

```javascript
var msg = {
  content: 'another custom alert!',
  className: 'different',
  dismissOnClick: true, // by clicking it will dismiss the alert
  onDismiss: myCallBack // the callback to run when the alert is dismissed
}

function myCallback() { ... }

AlertMe.create(msg);
```

You can also use html text as content for your alerts, but be sure to add the __isTrustedHtml__ flag property to your settings or to the message you want to be threated as html, like so:
```javascript
var msg = {
  content: 'visit our <a href="#!">page</a> on github',
  isTrustedHtml: true // this will threat the content as html text
}

```

Also you can specify to use the default __interceptor__ to notify all the HTTP request and responses errors.
```javascript
angular.module('app')
.config(function($httpProvider) {
  $httpProvider.interceptors.push('alertInterceptor');
});
```

But you can always disable notifications for particular HTTP calls by setting the __notifyError__ configuration option to __false__.
```javascript
$http({url: '/api/something', notifyError: false});
$http.get('/api/something', {notifyError: false});
$http.post('/api/something', data, {notifyError: false});
```

Now you can also use the desktop notifications if supported by the browser, for now you must set it globally:
```javascript
angular.module('app')
.config(function(AlertProvider) {
  AlertProvider.configure({ desktop: true });
});
```

### Important:
In the new __version 1.1.0__ the create method (and also info, success, warning, danger) returns a Promise so you need to change the code if you want to upgrade from previous versions.

---

### Methods
To all the methods listed below you can pass both a `string` or a `object`.
* __create__; The main method for creating alerts
* __dismiss__; Dismiss a message using his ID
* __dismissAll__; To dismiss all the messages at once
* __info__; This method will call create with default class 'info'
* __success__; This method will call create with default class 'success'
* __warning__; This method will call create with default class 'warning'
* __danger__; This method will call create with default class 'danger'

---

## Configurable settings:
These settings can be edited using the method __configure__ of AlertMe
service.

* __desktop__: If true it will try to use the desktop notifications
* __maxNum__: max alerts to show ( default 0 = unlimited )
* __verticalPosition__: vertical alert container position (default 'bottom')
* __horizontalPosition__: horizontal alert container position (default 'right')
* __className__: the default alert class to use in case of nothing is specified
* __isTrustedHtml__: if the content has to been treated as HTML
* __combineDuplications__: combine duplicated alerts (default true)
* __dismissButton__: if the dismiss button is show (default true)
* __dismissOnClick__: the alert is dismissable by clicking on it (default true)
* __dismissOnTimeout__: the alert is dismissed with a timeout (default true)
* __dismissTimeout__: the dismiss timeout (in seconds)
* __onBeforeCreate__: the function that run after before the alert is created (default return true)
* __onAfterCreate__: the function that run after the alert has been created
* __onBeforeDismiss__: the function that run before dismissing the alert
* __onDismiss__: the function that run when the alert hsa been dismissed (1 arg)

See the examples section for more details about them.

---

### Usage examples

Set the max simultaneous notification number to 10:
```javascript
// Set the max alert number to 10:
AlertMe.configure({
  maxNum: 10
});
```

Show he dismiss button for all the alerts:
```javascript
// Show he dismiss button for all the alerts:
AlertMe.configure({
  dismissButton: true
});
```

Error message with status code and text (assuming exist error object)
```javascript
// Error message with status code and text
AlertMe.create({
  className: 'error',
  title: error.status,
  content: error.statusText
});
```

Do a fixed alert that can't be closed
```javascript
// Do a fixed alert that can't be closed
AlertMe.create({
  content: 'This is very important.',
  dismissButton: false,
  dismissOnClick: false,
  dismissTimeout: false
});
```
