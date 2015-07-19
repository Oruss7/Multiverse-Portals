angular.module('common', ['ngMessages'])
        .controller('BaseFormCtrl', ['$scope', '$http', '$location', '$anchorScroll', function ($scope, $http, $location, $anchorScroll) {

                var fieldWithFocus;
                $scope.focusDiv = 'page_1';

                $scope.scrollTo = function (id) {
                    $location.hash(id);
                    $anchorScroll();
                    $scope.focusDiv = id;
                };

                $scope.vm = {
                    submitted: false,
                    errorMessages: []
                };

                $scope.focus = function (fieldName) {
                    fieldWithFocus = fieldName;
                };

                $scope.blur = function (fieldName) {
                    fieldWithFocus = undefined;
                };

                $scope.isMessagesVisible = function (fieldName) {
                    return fieldWithFocus === fieldName || $scope.vm.submitted;
                };

                $scope.preparePostData = function () {
                    var username = $scope.vm.username != undefined ? $scope.vm.username : '';
                    var password = $scope.vm.password != undefined ? $scope.vm.password : '';
                    var email = $scope.vm.email != undefined ? $scope.vm.email : '';

                    return 'username=' + username + '&password=' + password + '&email=' + email;
                };

                $scope.login = function (username, password) {
                    var postData = $scope.preparePostData();

                    $http({
                        method: 'POST',
                        url: '/authenticate',
                        data: postData,
                        headers: {
                            "Content-Type": "application/x-www-form-urlencoded",
                            "X-Login-Ajax-call": 'true'
                        }
                    })
                            .then(function (response) {
                                if (response.data == 'ok') {
                                    window.location.replace('/resources/index.html');
                                }
                                else {
                                    $scope.vm.errorMessages = [];
                                    $scope.vm.errorMessages.push({description: 'Identifiants incorrects !'});
                                }
                            });
                }


            }])
        .directive('checkPasswordsMatch', function () {
            return {
                require: 'ngModel',
                link: function (scope, elm, attrs, ngModel) {
                    ngModel.$validators.checkPasswordsMatch = function (modelValue, viewValue) {
                        if (scope.vm && scope.vm.password && viewValue) {
                            return scope.vm.password === viewValue;
                        }
                        return true;
                    };
                }
            };
        });