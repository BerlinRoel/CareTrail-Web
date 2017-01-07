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
    var UserService;
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
            UserService = (function () {
                function UserService(http) {
                    this.http = http;
                }
                UserService.prototype.getUserByName = function (searchName) {
                    var endpointUrl = Global.CARETRAIL_ENDPOINT + 'people/searchInCareTrail?userid=' + searchName;
                    var header = new http_1.Headers({
                        'Content-Type': 'application/json',
                        'Accept': 'application/json',
                        'Authorization': sessionStorage.getItem("bearerToken"),
                        'From': sessionStorage.getItem("emailAddress")
                    });
                    return this.http.get(endpointUrl, { headers: header }).map(this.extractData).catch(this.handleError);
                };
                UserService.prototype.getOnCallScheduleForMonth = function (date) {
                    var requestData = {
                        "startDate": moment(date).format("MM/DD/YYYY:00:01")
                    };
                    var endpointUrl = Global.CARETRAIL_ENDPOINT + 'oncall/getOnCallSchedule/Month';
                    var header = new http_1.Headers({
                        'Content-Type': 'application/json',
                        'Accept': 'application/json',
                        'Authorization': sessionStorage.getItem("bearerToken"),
                        'From': sessionStorage.getItem("emailAddress")
                    });
                    var options = new http_1.RequestOptions({ headers: header, method: "post" });
                    console.log("USER.SERVICE:::getOnCallScheduleForMonth:::" + JSON.stringify(requestData));
                    return this.http.post(endpointUrl, JSON.stringify(requestData), options)
                        .map(this.extractData)
                        .catch(this.handleError);
                };
                UserService.prototype.getOnCallScheduleForMonthAndUser = function (userId, date) {
                    var requestData = {
                        "startDate": moment(date).format("MM/DD/YYYY:00:01")
                    };
                    var endpointUrl = Global.CARETRAIL_ENDPOINT + 'oncall/getOnCallSchedule/Month/' + userId;
                    var header = new http_1.Headers({
                        'Content-Type': 'application/json',
                        'Accept': 'application/json',
                        'Authorization': sessionStorage.getItem("bearerToken"),
                        'From': sessionStorage.getItem("emailAddress")
                    });
                    var options = new http_1.RequestOptions({ headers: header, method: "post" });
                    console.log("USER.SERVICE:::getOnCallScheduleForMonthAndUser:::" + userId + ":::" + JSON.stringify(requestData));
                    return this.http.post(endpointUrl, JSON.stringify(requestData), options)
                        .map(this.extractData)
                        .catch(this.handleError);
                };
                UserService.prototype.getOnCallScheduleForDay = function (date) {
                    var requestData = {
                        "startDate": moment(date).format("MM/DD/YYYY:00:01")
                    };
                    var endpointUrl = Global.CARETRAIL_ENDPOINT + 'oncall/getOnCallSchedule/Day';
                    var header = new http_1.Headers({
                        'Content-Type': 'application/json',
                        'Accept': 'application/json',
                        'Authorization': sessionStorage.getItem("bearerToken"),
                        'From': sessionStorage.getItem("emailAddress")
                    });
                    var options = new http_1.RequestOptions({ headers: header, method: "post" });
                    console.log("USER.SERVICE:::getOnCallScheduleForDay:::" + JSON.stringify(requestData));
                    return this.http.post(endpointUrl, JSON.stringify(requestData), options)
                        .map(this.extractData)
                        .catch(this.handleError);
                };
                UserService.prototype.getOnCallScheduleForDayAndUser = function (userId, date) {
                    var requestData = {
                        "startDate": moment(date).format("MM/DD/YYYY:00:01")
                    };
                    var endpointUrl = Global.CARETRAIL_ENDPOINT + 'oncall/getOnCallSchedule/Day/' + userId;
                    var header = new http_1.Headers({
                        'Content-Type': 'application/json',
                        'Accept': 'application/json',
                        'Authorization': sessionStorage.getItem("bearerToken"),
                        'From': sessionStorage.getItem("emailAddress")
                    });
                    var options = new http_1.RequestOptions({ headers: header, method: "post" });
                    console.log("USER.SERVICE:::getOnCallScheduleForDayAndUser:::" + userId + ":::" + JSON.stringify(requestData));
                    return this.http.post(endpointUrl, JSON.stringify(requestData), options)
                        .map(this.extractData)
                        .catch(this.handleError);
                };
                UserService.prototype.addUserOnCall = function (startDate, endDate, onCallEmail, offEmail) {
                    var requestData = {
                        'startDate': moment(startDate).format("MM/DD/YYYY:HH:mm"),
                        'endDate': moment(endDate).format("MM/DD/YYYY:HH:mm"),
                        'onCallUser': {
                            'emailAddress': onCallEmail
                        },
                        'backupForUser': {
                            'emailAddress': offEmail
                        }
                    };
                    var endpointUrl = Global.CARETRAIL_ENDPOINT + 'oncall/create';
                    var header = new http_1.Headers({
                        'Content-Type': 'application/json',
                        'Accept': 'application/json',
                        'Authorization': sessionStorage.getItem("bearerToken"),
                        'From': sessionStorage.getItem("emailAddress")
                    });
                    var options = new http_1.RequestOptions({ headers: header, method: "post" });
                    console.log("USER.SERVICE:::addUserOnCall:::" + JSON.stringify(requestData));
                    // Returns 201 with no body
                    return this.http.post(endpointUrl, JSON.stringify(requestData), options)
                        .catch(this.handleError);
                };
                UserService.prototype.removeUserOnCall = function (onCallId) {
                    var endpointUrl = Global.CARETRAIL_ENDPOINT + 'oncall/delete/' + onCallId;
                    var header = new http_1.Headers({
                        'Content-Type': 'application/json',
                        'Accept': 'application/json',
                        'Authorization': sessionStorage.getItem("bearerToken"),
                        'From': sessionStorage.getItem("emailAddress")
                    });
                    var options = new http_1.RequestOptions({ headers: header, method: "post" });
                    // Returns 201 with no body
                    return this.http.post(endpointUrl, "", options)
                        .catch(this.handleError);
                };
                UserService.prototype.createUser = function (justCreatedUser) {
                    var endpointUrl = Global.CARETRAIL_ENDPOINT + 'registration/user/registration';
                    var header = new http_1.Headers({
                        'Content-Type': 'application/json',
                        'Accept': 'application/json',
                        'Authorization': sessionStorage.getItem("bearerToken"),
                        'From': sessionStorage.getItem("emailAddress")
                    });
                    var options = new http_1.RequestOptions({ headers: header, method: "post" });
                    console.log(" user created:::: " + JSON.stringify(justCreatedUser));
                    return this.http.post(endpointUrl, JSON.stringify(justCreatedUser), options).map(this.extractData).catch(this.handleError);
                };
                UserService.prototype.addUser = function (teamJSON) {
                    var endpointUrl = Global.CARETRAIL_ENDPOINT + 'people/joinTeam';
                    var header = new http_1.Headers({
                        'Content-Type': 'application/json',
                        'Accept': 'application/json',
                        'Authorization': sessionStorage.getItem("bearerToken"),
                        'From': sessionStorage.getItem("emailAddress")
                    });
                    var options = new http_1.RequestOptions({ headers: header, method: "post" });
                    console.log("USER.SERVICE:::addUser:::" + JSON.stringify(teamJSON));
                    return this.http.post(endpointUrl, JSON.stringify(teamJSON), options).catch(this.handleError);
                };
                UserService.prototype.searchPatients = function (name) {
                    var endpointUrl = Global.CARETRAIL_ENDPOINT + '/patient/getPatientByName/' + name;
                    var header = new http_1.Headers({
                        'Content-Type': 'application/json',
                        'Accept': 'application/json',
                        'Authorization': sessionStorage.getItem("bearerToken"),
                        'From': sessionStorage.getItem("emailAddress")
                    });
                    return this.http.get(endpointUrl, { headers: header }).map(this.extractData).catch(this.handleError);
                };
                UserService.prototype.followPatients = function (followPatientModel) {
                    var endpointUrl = Global.CARETRAIL_ENDPOINT + '/people/followPatient';
                    var header = new http_1.Headers({
                        'Content-Type': 'application/json',
                        'Accept': 'application/json',
                        'Authorization': sessionStorage.getItem("bearerToken"),
                        'From': sessionStorage.getItem("emailAddress")
                    });
                    var options = new http_1.RequestOptions({ headers: header, method: "post" });
                    console.log("USER.SERVICE:::patient followed:::" + JSON.stringify(followPatientModel));
                    return this.http.post(endpointUrl, JSON.stringify(followPatientModel), options).map(this.extractData).catch(this.handleError);
                };
                UserService.prototype.unfollowPatients = function (unfollowPatientModel) {
                    var endpointUrl = Global.CARETRAIL_ENDPOINT + '/people/unfollowPatient';
                    var header = new http_1.Headers({
                        'Content-Type': 'application/json',
                        'Accept': 'application/json',
                        'Authorization': sessionStorage.getItem("bearerToken"),
                        'From': sessionStorage.getItem("emailAddress")
                    });
                    var options = new http_1.RequestOptions({ headers: header, method: "post" });
                    console.log("USER.SERVICE:::patient unfollowed:::" + JSON.stringify(unfollowPatientModel));
                    return this.http.post(endpointUrl, JSON.stringify(unfollowPatientModel), options).map(this.extractData).catch(this.handleError);
                };
                UserService.prototype.getPatientsForUser = function (userEmailAddress) {
                    var endpointUrl = Global.CARETRAIL_ENDPOINT + 'people/myPatients/' + userEmailAddress + '/';
                    var header = new http_1.Headers({
                        'Content-Type': 'application/json',
                        'Accept': 'application/json',
                        'Authorization': sessionStorage.getItem("bearerToken"),
                        'From': sessionStorage.getItem("emailAddress")
                    });
                    return this.http.get(endpointUrl, { headers: header }).map(this.extractData).catch(this.handleError);
                };
                UserService.prototype.getPatientTimeline = function (mrn, pageNum) {
                    var endpointUrl = Global.CARETRAIL_ENDPOINT + 'patient/timeline/' + mrn + '/' + pageNum;
                    var header = new http_1.Headers({
                        'Content-Type': 'application/json',
                        'Accept': 'application/json',
                        'Authorization': sessionStorage.getItem("bearerToken"),
                        'From': sessionStorage.getItem("emailAddress")
                    });
                    return this.http.get(endpointUrl, { headers: header }).map(this.extractData).catch(this.handleError);
                };
                UserService.prototype.getPatientFollowers = function (mrn) {
                    var endpointUrl = Global.CARETRAIL_ENDPOINT + 'patient/followers/' + mrn + '/';
                    var header = new http_1.Headers({
                        'Content-Type': 'application/json',
                        'Accept': 'application/json',
                        'Authorization': sessionStorage.getItem("bearerToken"),
                        'From': sessionStorage.getItem("emailAddress")
                    });
                    return this.http.get(endpointUrl, { headers: header }).map(this.extractData).catch(this.handleError);
                };
                UserService.prototype.getPatientOnCallFollowers = function (userID) {
                    var endpointUrl = Global.CARETRAIL_ENDPOINT + 'oncall/getOnCallSchedule/patient/' + userID;
                    var header = new http_1.Headers({
                        'Content-Type': 'application/json',
                        'Accept': 'application/json',
                        'Authorization': sessionStorage.getItem("bearerToken"),
                        'From': sessionStorage.getItem("emailAddress")
                    });
                    return this.http.get(endpointUrl, { headers: header }).map(this.extractData).catch(this.handleError);
                };
                UserService.prototype.registerUser = function (firstName, lastName, email) {
                    var jsonModel = {
                        "firstName": firstName,
                        "lastName": lastName,
                        "email": email
                    };
                    var endpointUrl = Global.CARETRAIL_ENDPOINT + 'registration/user/registration';
                    var header = new http_1.Headers({
                        'Content-Type': 'application/json',
                        'Accept': 'application/json',
                        'Authorization': sessionStorage.getItem("bearerToken"),
                        'From': sessionStorage.getItem("emailAddress")
                    });
                    var options = new http_1.RequestOptions({ headers: header, method: "post" });
                    console.log("USER.SERVICE:::registerUser:::" + JSON.stringify(jsonModel));
                    return this.http.post(endpointUrl, JSON.stringify(jsonModel), options).map(this.extractData).catch(this.handleError);
                };
                UserService.prototype.registerUserBySMS = function (firstName, lastName, email, phoneNumber) {
                    var jsonModel = {
                        "firstName": firstName,
                        "lastName": lastName,
                        "email": email,
                        "phoneNumber": phoneNumber
                    };
                    var endpointUrl = Global.CARETRAIL_ENDPOINT + 'registration/user/registrationBySMS';
                    var header = new http_1.Headers({
                        'Content-Type': 'application/json',
                        'Accept': 'application/json',
                        'Authorization': sessionStorage.getItem("bearerToken"),
                        'From': sessionStorage.getItem("emailAddress")
                    });
                    var options = new http_1.RequestOptions({ headers: header, method: "post" });
                    console.log("USER.SERVICE:::registerUserBySMS:::" + JSON.stringify(jsonModel));
                    return this.http.post(endpointUrl, JSON.stringify(jsonModel), options).map(this.extractData).catch(this.handleError);
                };
                UserService.prototype.postToPatientTimeline = function (message, patientMrn, fromUserEmail) {
                    var jsonModel = {
                        "messageType": "timeline",
                        "message": message,
                        "channelName": patientMrn,
                        "fromUser": {
                            "emailAddress": fromUserEmail
                        }
                    };
                    var endpointUrl = Global.CARETRAIL_ENDPOINT + 'messages/sendMessage';
                    var header = new http_1.Headers({
                        'Content-Type': 'application/json',
                        'Accept': 'application/json',
                        'Authorization': sessionStorage.getItem("bearerToken"),
                        'From': sessionStorage.getItem("emailAddress")
                    });
                    var options = new http_1.RequestOptions({ headers: header, method: "post" });
                    console.log("USER.SERVICE:::postToPatientTimeline:::" + JSON.stringify(jsonModel));
                    return this.http.post(endpointUrl, JSON.stringify(jsonModel), options).catch(this.handleError);
                };
                UserService.prototype.resetPassword = function () {
                    var endpointUrl = Global.CARETRAIL_ENDPOINT + 'registration/user/savePassword';
                    var jsonModel = {
                        "email": "nprao04@gmail.com",
                        "newPassword": "nilesh123"
                    };
                    var header = new http_1.Headers({
                        'Content-Type': 'application/json',
                        'Accept': 'application/json',
                        'Authorization': 'Bearer cwt=AAEBHAEFAAAAAAAFFQAAAHsAXEbHxgEhNpSCuUzpBQCBEBONrz77G8VQgKkPR33-Gn-CApjsgyC1Wv6uXgFpqTOj7a5DE8stbaOOEFdP-tMO8S-na1m_6YYIVyVfso5w0wgNEICZY2jjhKJSpjrDqcajWYI',
                        'From': 'statchat@hfhs.org'
                    });
                    var options = new http_1.RequestOptions({ headers: header, method: "post" });
                    return this.http.post(endpointUrl, JSON.stringify(jsonModel), options).catch(this.handleError);
                };
                UserService.prototype.extractData = function (res) {
                    var body = res.json();
                    return body || {};
                };
                UserService.prototype.handleError = function (error) {
                    var data = JSON.parse(error._body);
                    var errMsg = (data.message) ? data.message :
                        error.status ? error.status + " - " + error.statusText : 'Server error';
                    return Rx_1.Observable.throw(errMsg);
                };
                UserService = __decorate([
                    core_1.Injectable(), 
                    __metadata('design:paramtypes', [http_1.Http])
                ], UserService);
                return UserService;
            }());
            exports_1("UserService", UserService);
        }
    }
});
//# sourceMappingURL=user.service.js.map