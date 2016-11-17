angular.module('alert-me')

.factory('alertInterceptor', function ($q, AlertMe) {

	return {

		'requestError': function (rejection) {

			AlertMe.warning({
				title: rejection.status,
				content: rejection.statusText,
			});

			return $q.reject(rejection);

		},

		'responseError': function (rejection) {

			AlertMe.warning({
				title: rejection.status,
				content: rejection.statusText,
			});

			return $q.reject(rejection);

		}

	}

});
