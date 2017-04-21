angular.module('alert-me')

.factory('alertInterceptor', function ($q, AlertMe) {

	return {

		'requestError': function (rejection) {

			if( typeof rejection.config.notifyError !== 'undefined' && !rejection.config.notifyError ) {
				return;
			}

			AlertMe.warning({
				title: rejection.status,
				content: rejection.statusText,
			});

			return $q.reject(rejection);

		},

		'responseError': function (rejection) {

			if( typeof rejection.config.notifyError !== 'undefined' && !rejection.config.notifyError ) {
				return;
			}

			AlertMe.warning({
				title: rejection.status,
				content: rejection.statusText,
			});

			return $q.reject(rejection);

		}

	};

});
