System.register(['angular2/core', 'angular2/http', 'rxjs/Rx', '../utils/global.util'], function(exports_1, context_1) {
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
    var core_1, http_1, Rx_1, Global;
    var LoginService;
    return {
        setters:[
            function (core_1_1) {
                core_1 = core_1_1;
            },
            function (http_1_1) {
                http_1 = http_1_1;
            },
            function (Rx_1_1) {
                Rx_1 = Rx_1_1;
            },
            function (Global_1) {
                Global = Global_1;
            }],
        execute: function() {
            LoginService = (function () {
                function LoginService(_http) {
                    this._http = _http;
                }
                LoginService.prototype.sendCredentials = function (model) {
                    var endpointUrl = Global.CARETRAIL_ENDPOINT + 'auth/authenticate';
                    var headers = new http_1.Headers({ 'Content-type': 'application/json', 'Accept': 'application/json' });
                    var options = new http_1.RequestOptions({ headers: headers, method: "post" });
                    sessionStorage.setItem("model", JSON.stringify(model));
                    return this._http.post(endpointUrl, JSON.stringify(model), options).map(this.extractData).catch(this.handleError);
                };
                LoginService.prototype.checkLogin = function () {
                    var isLoggedIn = sessionStorage.getItem("currentUserName");
                    if (sessionStorage.getItem("smsUser") == "true") {
                        isLoggedIn = false;
                    }
                    return isLoggedIn;
                };
                LoginService.prototype.getUserName = function () {
                    return sessionStorage.getItem("currentUserName");
                };
                LoginService.prototype.logout = function () {
                    sessionStorage.removeItem("currentUserName");
                    var endpointUrl = Global.CARETRAIL_ENDPOINT + 'auth/logout';
                    var headers = new http_1.Headers({
                        'Content-type': 'application/json', 'Accept': 'application/json',
                        'Authorization': sessionStorage.getItem("bearerToken"),
                        'From': sessionStorage.getItem("emailAddress")
                    });
                    return this._http.post(endpointUrl, sessionStorage.getItem("model"), { headers: headers }).map(this.extractData).catch(this.handleError);
                };
                LoginService.prototype.extractData = function (res) {
                    var body = res.json();
                    //console.log(res.json().accessToken+"-----"+JSON.stringify(res.json()));  
                    return body || {};
                };
                LoginService.prototype.handleError = function (error) {
                    var errMsg = (error.message) ? error.message :
                        error.status ? error.status + " - " + error.statusText : 'Server error';
                    return Rx_1.Observable.throw(errMsg);
                };
                LoginService = __decorate([
                    core_1.Injectable(), 
                    __metadata('design:paramtypes', [http_1.Http])
                ], LoginService);
                return LoginService;
            }());
            exports_1("LoginService", LoginService);
        }
    }
});
//# sourceMappingURL=login.service.js.map