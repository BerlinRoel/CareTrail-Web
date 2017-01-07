System.register(['angular2/core', 'rxjs/Rx', 'angular2/http', '../utils/global.util'], function(exports_1, context_1) {
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
    var core_1, Rx_1, http_1, Global;
    var SMSService;
    return {
        setters:[
            function (core_1_1) {
                core_1 = core_1_1;
            },
            function (Rx_1_1) {
                Rx_1 = Rx_1_1;
            },
            function (http_1_1) {
                http_1 = http_1_1;
            },
            function (Global_1) {
                Global = Global_1;
            }],
        execute: function() {
            SMSService = (function () {
                function SMSService(http) {
                    this.http = http;
                }
                SMSService.prototype.validateSMSCode = function (authCode, lastName) {
                    var jsonData = {
                        "oneTimeAuthcode": authCode,
                        "lastName": lastName
                    };
                    var endpointUrl = Global.CARETRAIL_ENDPOINT + 'sms/token';
                    var header = new http_1.Headers({
                        'Content-Type': 'application/json',
                        'Accept': 'application/json',
                        'Authorization': sessionStorage.getItem("bearerToken"),
                        'From': sessionStorage.getItem("emailAddress")
                    });
                    var options = new http_1.RequestOptions({ headers: header, method: "post" });
                    console.log("USER.SERVICE:::addUser:::" + JSON.stringify(jsonData));
                    return this.http.post(endpointUrl, JSON.stringify(jsonData), options).map(this.extractData).catch(this.handleError);
                };
                SMSService.prototype.extractData = function (res) {
                    var body = res.json();
                    //console.log(res.json()+":::::"+JSON.stringify(res.json()));  
                    return body || {};
                };
                SMSService.prototype.handleError = function (error) {
                    var errMsg = (error.message) ? error.message :
                        error.status ? error.status + " - " + error.statusText : 'Server error';
                    //console.log("TEAM.SERVICE:::handleError:::"+ errMsg); // log to console instead
                    return Rx_1.Observable.throw(errMsg);
                };
                SMSService = __decorate([
                    core_1.Injectable(), 
                    __metadata('design:paramtypes', [http_1.Http])
                ], SMSService);
                return SMSService;
            }());
            exports_1("SMSService", SMSService);
        }
    }
});
//# sourceMappingURL=sms.service.js.map