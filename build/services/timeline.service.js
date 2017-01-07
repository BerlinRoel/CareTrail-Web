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
    var TimelineService;
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
            TimelineService = (function () {
                function TimelineService(http) {
                    this.http = http;
                }
                TimelineService.prototype.getTimeLineList = function (emailAddress, pageNo) {
                    var endpointUrl = Global.CARETRAIL_ENDPOINT + 'people/timeline/' + emailAddress + '/' + pageNo;
                    var header = new http_1.Headers({
                        'Content-Type': 'application/json',
                        'Accept': 'application/json',
                        'Authorization': sessionStorage.getItem("bearerToken"),
                        'From': sessionStorage.getItem("emailAddress")
                    });
                    return this.http.get(endpointUrl, { headers: header }).map(this.extractData).catch(this.handleError);
                };
                TimelineService.prototype.getTimeLinePatients = function () {
                    var endpointUrl = Global.CARETRAIL_ENDPOINT + 'people/myPatients/' + sessionStorage.getItem("emailAddress") + '/';
                    var header = new http_1.Headers({
                        'Content-Type': 'application/json',
                        'Accept': 'application/json',
                        'Authorization': sessionStorage.getItem("bearerToken"),
                        'From': sessionStorage.getItem("emailAddress")
                    });
                    return this.http.get(endpointUrl, { headers: header }).map(this.extractData).catch(this.handleError);
                };
                TimelineService.prototype.timeLinePostMessageList = function (postdata) {
                    var endpointUrl = Global.CARETRAIL_ENDPOINT + 'messages/sendMessage';
                    var header = new http_1.Headers({
                        'Content-Type': 'application/json',
                        'Accept': 'application/json',
                        'Authorization': sessionStorage.getItem("bearerToken"),
                        'From': sessionStorage.getItem("emailAddress")
                    });
                    var options = new http_1.RequestOptions({ headers: header, method: "post" });
                    return this.http.post(endpointUrl, JSON.stringify(postdata), options).catch(this.handleError);
                };
                TimelineService.prototype.extractData = function (res) {
                    var body = res.json();
                    return body || [];
                };
                TimelineService.prototype.handleError = function (error) {
                    var data = JSON.parse(error._body);
                    var errMsg = (data.message) ? data.message :
                        error.status ? error.status + " - " + error.statusText : 'Server error';
                    return Rx_1.Observable.throw(errMsg);
                };
                TimelineService = __decorate([
                    core_1.Injectable(), 
                    __metadata('design:paramtypes', [http_1.Http])
                ], TimelineService);
                return TimelineService;
            }());
            exports_1("TimelineService", TimelineService);
        }
    }
});
//# sourceMappingURL=timeline.service.js.map