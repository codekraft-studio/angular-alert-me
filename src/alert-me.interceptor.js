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

	};

});
