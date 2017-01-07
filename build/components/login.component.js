System.register(['angular2/core', 'angular2/router', '../services/login.service', './slim-bar.component', '../services/slim-bar.service', '../utils/shared.data'], function(exports_1, context_1) {
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
    var core_1, router_1, login_service_1, slim_bar_component_1, slim_bar_service_1, shared_data_1;
    var Login;
    return {
        setters:[
            function (core_1_1) {
                core_1 = core_1_1;
            },
            function (router_1_1) {
                router_1 = router_1_1;
            },
            function (login_service_1_1) {
                login_service_1 = login_service_1_1;
            },
            function (slim_bar_component_1_1) {
                slim_bar_component_1 = slim_bar_component_1_1;
            },
            function (slim_bar_service_1_1) {
                slim_bar_service_1 = slim_bar_service_1_1;
            },
            function (shared_data_1_1) {
                shared_data_1 = shared_data_1_1;
            }],
        execute: function() {
            Login = (function () {
                function Login(_router, loginService, slimService, sharedData) {
                    this._router = _router;
                    this.loginService = loginService;
                    this.slimService = slimService;
                    this.sharedData = sharedData;
                    this.model = { 'userid': '', 'password': '', 'SupportedModalities': '["Messaging"]' };
                    this.showData = true;
                    this.loginError = '';
                    sessionStorage.clear();
                }
                Login.prototype.ngAfterViewInit = function () {
                    $('.patient-search').remove();
                    $('.message-area').remove();
                };
                Login.prototype.onSubmit = function () {
                    var _this = this;
                    this.slimService.start(function () { console.log('loading complete'); });
                    this.loginService.sendCredentials(this.model).subscribe(function (data) {
                        _this.slimService.complete();
                        setTimeout(function () {
                            sessionStorage.setItem("bearerToken", data.accessToken);
                            console.log(sessionStorage.getItem("bearerToken"));
                            if (data != null && data.userDetails != null) {
                                _this.sharedData.updateUserData(data.userDetails);
                            }
                            var name = data.userDetails.userName;
                            if (data.userDetails.lastName != null) {
                                name += " " + data.userDetails.lastName;
                            }
                            sessionStorage.setItem("currentUserName", name);
                            sessionStorage.setItem("emailAddress", _this.model.userid);
                            _this.showData = true;
                            $('iframe').attr('src', "http://app.caretrail.io/www/#/tab/timeline/home/" + data.accessToken + "/" + _this.model.userid + "/WEB");
                            _this._router.navigate(['Timeline']);
                        }, 500);
                    }, function (error) {
                        console.log("LOGIN.COMPONENT:::onSubmit:::error:::" + error);
                        _this.slimService.complete();
                        _this.loginError = error;
                        setTimeout(function () {
                            _this.showData = false;
                        }, 500);
                    }); // end of subscribe
                };
                Login.prototype.backLogin = function () {
                    location.reload();
                };
                Login = __decorate([
                    core_1.Component({
                        selector: 'login',
                        directives: [slim_bar_component_1.SlimBar],
                        providers: [slim_bar_service_1.SlimBarService],
                        templateUrl: 'app/components/login.component.html'
                    }), 
                    __metadata('design:paramtypes', [router_1.Router, login_service_1.LoginService, slim_bar_service_1.SlimBarService, shared_data_1.SharedData])
                ], Login);
                return Login;
            }());
            exports_1("Login", Login);
        }
    }
});
//# sourceMappingURL=login.component.js.map