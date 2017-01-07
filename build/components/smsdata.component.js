System.register(['angular2/core', 'angular2/router', '../services/user.service', '../services/sms.service', '../utils/shared.data'], function(exports_1, context_1) {
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
    var core_1, router_1, user_service_1, sms_service_1, shared_data_1;
    var SMSData;
    return {
        setters:[
            function (core_1_1) {
                core_1 = core_1_1;
            },
            function (router_1_1) {
                router_1 = router_1_1;
            },
            function (user_service_1_1) {
                user_service_1 = user_service_1_1;
            },
            function (sms_service_1_1) {
                sms_service_1 = sms_service_1_1;
            },
            function (shared_data_1_1) {
                shared_data_1 = shared_data_1_1;
            }],
        execute: function() {
            SMSData = (function () {
                function SMSData(_router, UserService, SMSService, sharedData) {
                    this._router = _router;
                    this.UserService = UserService;
                    this.SMSService = SMSService;
                    this.sharedData = sharedData;
                    this.model = { 'invitationCode': '', 'lastName': '', 'timelineMessage': '', 'signupFirstName': '', 'signupLastName': '', 'signupEmail': '' };
                    this.invCodeFocus = false;
                    this.lastNameFocus = false;
                    this.invCodeError = false;
                    this.lastNameError = false;
                    this.authorizationErrors = '';
                    this.validatingCode = false;
                    this.validCodeEntered = false;
                    this.phoneNumber = '';
                    this.selectedTab = '';
                    this.timelineError = '';
                    this.timelineLoading = false;
                    this.postToTimelineError = false;
                    this.submittingToTimeline = false;
                    this.followersError = '';
                    this.followersLoading = false;
                    this.onCallFollowersError = '';
                    this.onCallFollowersLoading = false;
                    this.signingUp = false;
                    this.signupFirstNameError = false;
                    this.signupLastNameError = false;
                    this.signupEmailError = false;
                    this.registrationSuccessful = false;
                }
                SMSData.prototype.unloadHandler = function (event) {
                    sessionStorage.clear();
                };
                SMSData.prototype.ngAfterViewInit = function () {
                    // jQuery here
                };
                SMSData.prototype.ClearInvCodeErrors = function () {
                    this.invCodeError = false;
                };
                SMSData.prototype.ClearLastNameErrors = function () {
                    this.lastNameError = false;
                };
                SMSData.prototype.SubmitAuthorization = function () {
                    var _this = this;
                    this.validatingCode = true;
                    this.authorizationErrors = "";
                    this.invCodeError = false;
                    this.lastNameError = false;
                    if (this.model.invitationCode == '') {
                        this.invCodeError = true;
                    }
                    if (this.model.lastName == '') {
                        this.lastNameError = true;
                    }
                    if (this.invCodeError || this.lastNameError) {
                        this.authorizationErrors = "Please type in an invitation code and your last name.";
                        this.validatingCode = false;
                        return;
                    }
                    this.SMSService.validateSMSCode(this.model.invitationCode, this.model.lastName).subscribe(function (data) {
                        console.log("SMSDATA.COMPONENT:::validateSMSCode:::", data);
                        //TODO: We should use data.userDetails.emailAddress for the endpoint below, but the data isn't being returned yet
                        var email = _this.model.invitationCode + "@caretrail.io";
                        _this.model.signupFirstName = data.userDetails.userName;
                        _this.phoneNumber = data.userDetails.phoneNumber;
                        var fullName = data.userDetails.userName;
                        if (data.userDetails.lastName != null) {
                            fullName += " " + data.userDetails.lastName;
                            _this.model.signupLastName = data.userDetails.lastName;
                        }
                        // Code validated, so let's write to the session
                        sessionStorage.setItem("smsUser", "true");
                        sessionStorage.setItem("bearerToken", data.accessToken);
                        sessionStorage.setItem("currentUserName", fullName);
                        sessionStorage.setItem("emailAddress", email);
                        // Load patient data
                        _this.UserService.getPatientsForUser(email).subscribe(function (data) {
                            console.log("SMSDATA.COMPONENT:::getPatientsForUser:::", data);
                            if (data.length > 0) {
                                _this.patients = data;
                                // Pick the last patient as the currently selected patient
                                _this.selectedPatient = _this.patients[data.length - 1];
                                _this.SetTab("timeline");
                                _this.validatingCode = false;
                                _this.validCodeEntered = true;
                            }
                            else {
                                //TODO: No patients are followed by this user. Let user know.
                                _this.validatingCode = false;
                                _this.validCodeEntered = true;
                            }
                        }, function (error) {
                            console.log("SMSDATA.COMPONENT:::getPatientsForUser:::" + error);
                            //TODO: Show error
                            _this.validatingCode = false;
                            _this.validCodeEntered = true;
                        });
                    }, function (error) {
                        console.log("SMSDATA.COMPONENT:::validateSMSCode:::" + error);
                        _this.authorizationErrors = "Invalid invitation code or last name. Please check your SMS message and try again.";
                        _this.validatingCode = false;
                    });
                };
                SMSData.prototype.SetTab = function (tabName) {
                    var _this = this;
                    this.selectedTab = tabName;
                    if (tabName == "timeline") {
                        this.timelineLoading = true;
                        this.timelineError = "";
                        this.UserService.getPatientTimeline(this.selectedPatient.mrn, 0).subscribe(function (data) {
                            console.log("SMSDATA.COMPONENT:::getPatientTimeline:::", data);
                            _this.timelineItems = data;
                            _this.timelineLoading = false;
                        }, function (error) {
                            console.log("SMSDATA.COMPONENT:::getPatientTimeline:::" + error);
                            _this.timelineError = error;
                            _this.timelineLoading = false;
                        });
                    }
                    else if (tabName == "followers") {
                        this.followersLoading = true;
                        this.followersError = "";
                        this.UserService.getPatientFollowers(this.selectedPatient.mrn).subscribe(function (data) {
                            console.log("SMSDATA.COMPONENT:::getPatientFollowers:::", data);
                            _this.followers = data;
                            _this.followersLoading = false;
                        }, function (error) {
                            console.log("SMSDATA.COMPONENT:::getPatientFollowers:::" + error);
                            _this.followersError = error;
                            _this.followersLoading = false;
                        });
                    }
                    else if (tabName == "oncall") {
                        this.onCallFollowersLoading = true;
                        this.onCallFollowersError = "";
                        this.UserService.getPatientOnCallFollowers(this.selectedPatient.patientid).subscribe(function (data) {
                            console.log("SMSDATA.COMPONENT:::getPatientOnCallFollowers:::", data);
                            var onCallUsers = new Array();
                            if (data != null && data.onCallUsersMap != null && data.onCallUsersMap.Day != null && data.onCallUsersMap.Day.length > 0) {
                                for (var i = 0; i < data.onCallUsersMap.Day.length; i++) {
                                    var onCallData = data.onCallUsersMap.Day[i];
                                    if (onCallData.onCallUser != null) {
                                        onCallUsers.push(onCallData.onCallUser);
                                    }
                                }
                                _this.onCallFollowers = onCallUsers;
                            }
                            _this.onCallFollowersLoading = false;
                        }, function (error) {
                            console.log("SMSDATA.COMPONENT:::getPatientOnCallFollowers:::" + error);
                            _this.onCallFollowersError = error;
                            _this.onCallFollowersLoading = false;
                        });
                    }
                };
                SMSData.prototype.SubmitToTimeline = function () {
                    var _this = this;
                    this.submittingToTimeline = true;
                    this.postToTimelineError = false;
                    if (this.model.timelineMessage == '') {
                        this.postToTimelineError = true;
                        this.submittingToTimeline = false;
                        return;
                    }
                    var email = this.model.invitationCode + "@caretrail.io";
                    this.UserService.postToPatientTimeline(this.model.timelineMessage, this.selectedPatient.mrn, email).subscribe(function (data) {
                        console.log("SMSDATA.COMPONENT:::postToPatientTimeline:::", data);
                        _this.submittingToTimeline = false;
                        _this.model.timelineMessage = '';
                        _this.SetTab("timeline");
                    }, function (error) {
                        console.log("SMSDATA.COMPONENT:::postToPatientTimeline:::" + error);
                        _this.submittingToTimeline = false;
                        alert("Something went wrong. Please try again! Error: " + error);
                    });
                    //TODO: Submit message and refresh 
                    // SetTab("timeline");
                    // this.submittingToTimeline = false;
                };
                SMSData.prototype.Signup = function () {
                    var _this = this;
                    this.signingUp = true;
                    this.signupFirstNameError = false;
                    this.signupLastNameError = false;
                    this.signupEmailError = false;
                    var hasError = false;
                    if (this.model.signupFirstName == '') {
                        this.signupFirstNameError = true;
                        hasError = true;
                    }
                    if (this.model.signupLastName == '') {
                        this.signupLastNameError = true;
                        hasError = true;
                    }
                    if (this.model.signupEmail == '') {
                        this.signupEmailError = true;
                        hasError = true;
                    }
                    if (hasError) {
                        this.signingUp = false;
                        return;
                    }
                    if (this.validCodeEntered) {
                        this.UserService.registerUserBySMS(this.model.signupFirstName, this.model.signupLastName, this.model.signupEmail, this.phoneNumber).subscribe(function (data) {
                            console.log("SMSDATA.COMPONENT:::registerUserBySMS:::", data);
                            _this.signingUp = false;
                            _this.FlipRegistrationCard();
                        }, function (error) {
                            console.log("SMSDATA.COMPONENT:::registerUserBySMS:::" + error);
                            _this.signingUp = false;
                            alert("Something went wrong. Please try again! Error: " + error);
                        });
                    }
                    else {
                        this.UserService.registerUser(this.model.signupFirstName, this.model.signupLastName, this.model.signupEmail).subscribe(function (data) {
                            console.log("SMSDATA.COMPONENT:::registerUser:::", data);
                            _this.signingUp = false;
                            _this.FlipRegistrationCard();
                        }, function (error) {
                            console.log("SMSDATA.COMPONENT:::registerUser:::" + error);
                            _this.signingUp = false;
                            alert("Something went wrong. Please try again! Error: " + error);
                        });
                    }
                };
                SMSData.prototype.FlipRegistrationCard = function () {
                    this.registrationSuccessful = true;
                };
                __decorate([
                    core_1.HostListener('window:unload', ['$event']), 
                    __metadata('design:type', Function), 
                    __metadata('design:paramtypes', [Object]), 
                    __metadata('design:returntype', void 0)
                ], SMSData.prototype, "unloadHandler", null);
                SMSData = __decorate([
                    core_1.Component({
                        selector: 'smsdata',
                        templateUrl: 'app/components/smsdata.component.html'
                    }), 
                    __metadata('design:paramtypes', [router_1.Router, user_service_1.UserService, sms_service_1.SMSService, shared_data_1.SharedData])
                ], SMSData);
                return SMSData;
            }());
            exports_1("SMSData", SMSData);
        }
    }
});
//# sourceMappingURL=smsdata.component.js.map