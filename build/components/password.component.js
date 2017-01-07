System.register(['angular2/core', '../services/user.service', './slim-bar.component', '../services/slim-bar.service'], function(exports_1, context_1) {
    "use strict";
    var __moduleName = context_1 && context_1.id;
    var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
        var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
        if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
        else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
        return c > 3 && r && Object.defineProperty(target, key, r), r;
    };
    var __metadata = (this && this.__metadata) || function (k, v) {
        if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
    };
    var core_1, user_service_1, slim_bar_component_1, slim_bar_service_1;
    var Password;
    return {
        setters:[
            function (core_1_1) {
                core_1 = core_1_1;
            },
            function (user_service_1_1) {
                user_service_1 = user_service_1_1;
            },
            function (slim_bar_component_1_1) {
                slim_bar_component_1 = slim_bar_component_1_1;
            },
            function (slim_bar_service_1_1) {
                slim_bar_service_1 = slim_bar_service_1_1;
            }],
        execute: function() {
            Password = (function () {
                function Password(UserService) {
                    this.UserService = UserService;
                }
                Password.prototype.submitPassword = function () {
                    $('.confirmed').addClass('hidden');
                    $('.validation').addClass('hidden');
                    if (/(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z])(?=.*[_!@#\$%\^&\*])(?=.{8,})/.test($('#fld-new-password').val()) &&
                        $('#fld-new-password').val() == $('#fld-confirm-password').val()) {
                        $('#fld-new-password').attr('disabled', 'disabled');
                        $('#fld-confirm-password').attr('disabled', 'disabled');
                        $('#fld-lastname').attr('disabled', 'disabled');
                        $('#login-btn').attr('disabled', 'disabled');
                        this.UserService.resetPassword().subscribe(function (data) {
                            console.log(data);
                            $('.confirmed').removeClass('hidden');
                            $('.dv-login-container').addClass('hidden');
                        }, function (error) {
                            console.log("USER.COMPONENT:::resetPassword() " + error);
                        });
                    }
                    else {
                        $('.confirmed').addClass('hidden');
                        $('.validation').removeClass('hidden');
                    }
                };
                Password.prototype.closeValidation = function () {
                    $('.validation').addClass('hidden');
                };
                Password.prototype.backLogin = function () {
                    location.href = '/login';
                };
                Password = __decorate([
                    core_1.Component({
                        selector: 'password',
                        directives: [slim_bar_component_1.SlimBar],
                        providers: [slim_bar_service_1.SlimBarService],
                        templateUrl: 'app/components/password.component.html'
                    }), 
                    __metadata('design:paramtypes', [user_service_1.UserService])
                ], Password);
                return Password;
            }());
            exports_1("Password", Password);
        }
    }
});
//# sourceMappingURL=password.component.js.map