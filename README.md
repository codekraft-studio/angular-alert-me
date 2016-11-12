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
And then place the __<alert-me>__ directive wherever you want inside the body tag.
```html
<body>
  <alert-me></alert-me>
</body>
```
In any case the module run function will check if you forget, and add it, it in order to properly work.

__That's it__ now you can inject anywhere in your app controllers or something.. the __AlertMe__ service in order to manage the alerts.

---

### How to use it
Let's start by creating a simple default alert message using the __create__ function, this method will return the ID of the message just created:

```javascript
angular.module('app')
  .controller('MainCtrl', function(AlertMe) {
    var myAlert = AlertMe.create('a simple alert');
    console.log(myAlert);
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
---

## Configurable settings:
These settings can be edited using the method __configure__ of AlertMe service.
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

### Message settings
The message settings are extra settings per message that can be passed as arguments or in the object in the __create__ function. All the default settings listed above will be merged with the settings you pass to each message.
* __title__: the alert box title
* __content__: the alert box message (mandatory)
* __onBeforeCreate__: you can perform you logic for every single alert or alter configuration

---

### Usage examples

Set the max alert number to 10:
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

Don't show certain class of alerts
```javascript
// Example:
// Don't show certain class of alerts
AlertMe.configure({
  onBeforeCreate: function(msg) {

    // assume that user want
    // to disable all info alerts
    if( msg.className == 'info' && userDisabledInfos ) {

      // this will prevent the alert from being created
      return false;
    }

  }
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
