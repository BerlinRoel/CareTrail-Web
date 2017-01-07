System.register(['angular2/core', 'angular2/router', '../services/user.service', '../services/team.service', '../models/user', '../models/team'], function(exports_1, context_1) {
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
    var core_1, router_1, user_service_1, team_service_1, user_1, team_1;
    var Users;
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
            function (team_service_1_1) {
                team_service_1 = team_service_1_1;
            },
            function (user_1_1) {
                user_1 = user_1_1;
            },
            function (team_1_1) {
                team_1 = team_1_1;
            }],
        execute: function() {
            Users = (function () {
                function Users(_router, UserService, TeamService) {
                    this._router = _router;
                    this.UserService = UserService;
                    this.TeamService = TeamService;
                    this.model = { 'searchUser': '' };
                    this.newUserData = { 'firstName': '', 'lastName': '', 'email': '', 'phoneNumber': '', 'jobTitle': '' };
                    this.showLoadingIcon = 0;
                    this.teamLoadingIcon = 0;
                    this.patientLoadingIcon = 0;
                    this.showUserData = true;
                    this.justCreatedUser = new user_1.User();
                    this.selectedUser = new user_1.User();
                    this.isCreatingUser = false;
                    this.follower = '-';
                    this.teammodel = { 'searchTeams': '' };
                    this.selectedTeam = new team_1.Team();
                    this.showTeams = true;
                    this.patientmodel = { 'searchPatients': '' };
                    this.showPatients = true;
                }
                Users.prototype.ngAfterViewInit = function () {
                    $('.patient-search').remove();
                    $('.message-area').remove();
                    $('#popupViewTeams_background').remove();
                    $('#popupViewTeams_wrapper').remove();
                    $('#popupViewPatients_background').remove();
                    $('#popupViewPatients_wrapper').remove();
                    $('.user-patients').bind('focus', function () {
                        alert("The paragraph was clicked.");
                    });
                };
                Users.prototype.getUserDetails = function () {
                    var _this = this;
                    //Searches for users in database & shows info
                    if (this.model.searchUser) {
                        this.showLoadingIcon++;
                        this.UserService.getUserByName(this.model.searchUser).subscribe(function (data) {
                            // console.log("USER.COMPONENT:::getUserDetails:::" + JSON.stringify(data));
                            if (_this.showLoadingIcon > 0) {
                                _this.showLoadingIcon--;
                            }
                            if (_this.showLoadingIcon == 0 && _this.model.searchUser) {
                                _this.users = data;
                                if (_this.users.length > 0) {
                                    $('.user-results').addClass('hidden');
                                }
                                else {
                                    $('.user-results').removeClass('hidden');
                                }
                                _this.showUserData = true;
                            }
                        }, function (error) {
                            console.log("USER.COMPONENT:::getUserDetails:::" + error);
                            _this.showUserData = false;
                            if (error.indexOf("token is invalid") !== -1) {
                                _this.errorMessage = "Session invalidated as you have logged into another browser/computer. Please login again to continue..";
                            }
                            else {
                                _this.errorMessage = "Server temporarily unavailable. Please try again later.";
                            }
                            _this.showLoadingIcon--;
                        });
                    }
                    else {
                        this.users = null;
                        this.showLoadingIcon = 0;
                    }
                };
                Users.prototype.viewPatients = function (user) {
                    this.patients = [];
                    this.followedPatients = [];
                    this.patientLoadingIcon = 1;
                    this.justCreatedUser = user;
                    $('#popupViewPatients').popup({
                        opacity: 0.7,
                        transition: 'all 0.3s',
                    }).popup('show');
                    this.getFollowedPatientsNames();
                };
                Users.prototype.createdUser = function (user) {
                    this.justCreatedUser = user;
                    $('#popupSuccessUser').popup({
                        opacity: 0.7,
                        transition: 'all 0.3s',
                    }).popup('show');
                };
                Users.prototype.viewTeams = function (user) {
                    this.selectedUser = user;
                    $('#popupViewTeams').popup({
                        opacity: 0.7,
                        transition: 'all 0.3s',
                    }).popup('show');
                    this.getTeamImOn();
                };
                Users.prototype.close = function () {
                    $('#searchTeams, #viewPatients').val('');
                };
                Users.prototype.addUserToTeam = function (teamId, teamName) {
                    var _this = this;
                    var teamJSON = {
                        "username": this.selectedUser.username,
                        "emailAddress": this.selectedUser.emailAddress,
                        "useravitar": this.selectedUser.userAvitar,
                        "team": [
                            {
                                "teamName": teamName,
                                "teamId": teamId
                            }
                        ]
                    };
                    this.UserService.addUser(teamJSON).subscribe(function (data) {
                        _this.joinedTeam = teamJSON.team[0].teamName;
                        teamJSON = null;
                        _this.teammodel.searchTeams = null;
                        _this.showTeams = false;
                        _this.closeThisPop('#popupViewTeams');
                        _this.joinTeamSuccess();
                    }, function (error) {
                        _this.showUserData = false;
                        if (error.indexOf("token is invalid") !== -1) {
                            _this.errorMessage = "Session invalidated as you have logged into another browser/computer. Please login again to continue..";
                        }
                        else {
                            _this.errorMessage = "Server temporarily unavailable. Please try again later.";
                        }
                    });
                };
                Users.prototype.removeUserFromTeam = function (selectedUser, team, index, numofTeams) {
                    var _this = this;
                    var i;
                    for (i = 0; i <= (numofTeams - 1); i++) {
                        $('.user-team' + i).attr('disabled', 'disabled');
                    }
                    // This removes user from team
                    $('.user-team' + index).html('<img src="resources/static/icons/loading_ring_small.svg" />');
                    var removeUserModel = { 'emailAddress': this.selectedUser.emailAddress, 'team': [{ "teamId": selectedUser.teamId, "teamName": team.teamName }] };
                    this.isCreatingUser = true;
                    this.TeamService.leaveTeam(removeUserModel).subscribe(function (data) {
                        _this.isCreatingUser = false;
                        _this.getTeamImOn();
                    }, function (error) {
                        _this.showUserData = false;
                        if (error.indexOf("token is invalid") !== -1) {
                            _this.errorMessage = "Session invalidated as you have logged into another browser/computer. Please login again to continue..";
                        }
                        else {
                            _this.errorMessage = "Server temporarily unavailable. Please try again later.";
                        }
                    });
                };
                Users.prototype.deleteUser = function (user) {
                    alert("Delete user coming soon...");
                };
                Users.prototype.followPatientSuccess = function () {
                    $('#popupFollowPatient').popup({
                        opacity: 0.7
                    }).popup('show');
                };
                Users.prototype.joinTeamSuccess = function () {
                    $('#popupJoinTeam').popup({
                        opacity: 0.7
                    }).popup('show');
                };
                Users.prototype.followPatient = function () {
                    this.patients = [];
                    this.closeThisPop('#popupSuccessUser');
                    this.closeThisPop('#popupFollowPatient');
                    this.viewPatients(this.justCreatedUser);
                };
                Users.prototype.joinTeam = function () {
                    this.closeThisPop('#popupJoinTeam');
                    this.viewTeams(this.selectedUser);
                };
                Users.prototype.createUser = function () {
                    this.clearFields();
                    $('#popupCreateUser').popup({
                        opacity: 0.7
                    }).popup('show');
                };
                Users.prototype.onCreateUser = function () {
                    var _this = this;
                    this.isCreatingUser = true;
                    this.UserService.createUser(this.newUserData).subscribe(function (data) {
                        if (data != null && data.userid != null) {
                            _this.isCreatingUser = false;
                            _this.closePop();
                            _this.justCreatedUser.userid = data.userid;
                            _this.justCreatedUser.username = _this.newUserData.firstName + " " + _this.newUserData.lastName;
                            _this.justCreatedUser.emailAddress = _this.newUserData.email;
                            _this.justCreatedUser.jobTitle = _this.newUserData.jobTitle;
                            _this.justCreatedUser.phoneNumber = _this.newUserData.phoneNumber;
                            _this.createdUser(_this.justCreatedUser);
                            _this.newUserData.firstName = null;
                            _this.newUserData.lastName = null;
                            _this.newUserData.email = null;
                            _this.newUserData.jobTitle = null;
                            _this.newUserData.phoneNumber = null;
                        }
                        else {
                            _this.isCreatingUser = false;
                            console.log(data.message);
                        }
                    }, function (error) {
                        _this.isCreatingUser = false;
                        $('.errorCreateUser').show();
                        _this.errorMessage = error;
                        $('.popup-create-user').css('height', '415px').css('width', '420px');
                    });
                };
                Users.prototype.clearFields = function () {
                    this.newUserData.email = null;
                    $('.popup-create-user').css('height', '415px').css('width', '420px');
                    $('#firstName, #lastName, #phoneNumber, #email, #jobTitle').val('');
                    $('.errorCreateUser').hide();
                    $('#btn-create-user').attr('disabled', 'disabled');
                };
                Users.prototype.closeThisPop = function (popItem) {
                    $(popItem).popup({}).popup('hide');
                };
                Users.prototype.closePop = function () {
                    $('#popupCreateUser').popup({}).popup('hide');
                };
                Users.prototype.getTeamDetails = function () {
                    var _this = this;
                    //Searches for teams in database & shows them
                    var filterData = [];
                    if (this.teammodel.searchTeams) {
                        console.log("USER.COMPONENT:::getTeamDetails:::" + this.teammodel.searchTeams);
                        this.TeamService.getTeamByName(this.teammodel.searchTeams).subscribe(function (data) {
                            if (_this.teammodel.searchTeams) {
                                var i = void 0;
                                var n = void 0;
                                for (i = 0; i < data.length; i++) {
                                    var teamId = null;
                                    for (n = 0; n < _this.onTeams.length; n++) {
                                        if (data[i].teamid !== _this.onTeams[n].teamid) {
                                            teamId = data[i].teamid;
                                        }
                                        else {
                                            teamId = 0;
                                            break;
                                        }
                                    }
                                    if (teamId > 0 || teamId == null) {
                                        filterData.push(data[i]);
                                    }
                                }
                                _this.teams = filterData;
                                _this.showTeams = true;
                            }
                        }, function (error) {
                            console.log("USER.COMPONENT:::getTeamDetails:::" + error);
                            _this.showTeams = false;
                        });
                    }
                    else {
                        this.teams = null;
                    }
                };
                Users.prototype.getTeamImOn = function () {
                    var _this = this;
                    this.onTeams = [];
                    this.teams = [];
                    this.teamLoadingIcon = 1;
                    if (this.selectedUser.emailAddress) {
                        console.log("TEAM.COMPONENT:::getTeamImOn:::" + this.selectedUser.emailAddress);
                        this.TeamService.getTeamNamesImOn(this.selectedUser.emailAddress).subscribe(function (data) {
                            _this.onTeams = data;
                            console.log(data);
                            _this.teamLoadingIcon = 0;
                            _this.showTeams = true;
                        }, function (error) {
                            console.log("TEAM.COMPONENT:::getTeamImOn:::" + error);
                            _this.showTeams = false;
                            _this.teamLoadingIcon = 0;
                        });
                    }
                    else {
                        this.onTeams = null;
                    }
                };
                Users.prototype.getPatientNames = function () {
                    var _this = this;
                    var filterData = [];
                    if (this.patientmodel.searchPatients) {
                        this.UserService.searchPatients(this.patientmodel.searchPatients).subscribe(function (data) {
                            if (_this.patientmodel.searchPatients) {
                                var i = void 0;
                                var n = void 0;
                                for (i = 0; i < data.length; i++) {
                                    var patientId = null;
                                    for (n = 0; n < _this.followedPatients.length; n++) {
                                        if (data[i].patientid !== _this.followedPatients[n].patientid) {
                                            patientId = data[i].patientid;
                                        }
                                        else {
                                            patientId = 0;
                                            break;
                                        }
                                    }
                                    if (patientId !== 0 || patientId == null) {
                                        filterData.push(data[i]);
                                    }
                                }
                                _this.patients = filterData;
                                _this.showPatients = true;
                            }
                        }, function (error) {
                            console.log("USER.COMPONENT:::getPatientNames:::" + error);
                            _this.showPatients = false;
                        });
                    }
                    else {
                        this.patients = null;
                    }
                };
                Users.prototype.getFollowedPatientsNames = function () {
                    var _this = this;
                    //Shows followed patients of user
                    if (this.justCreatedUser.emailAddress) {
                        console.log("USER.COMPONENT:::getPatientNames:::" + this.justCreatedUser.emailAddress);
                        this.UserService.getPatientsForUser(this.justCreatedUser.emailAddress).subscribe(function (data) {
                            _this.followedPatients = data;
                            _this.patientLoadingIcon = 0;
                            console.log(data);
                            _this.showPatients = true;
                        }, function (error) {
                            console.log("USER.COMPONENT:::getPatientNames:::" + error);
                            _this.patientLoadingIcon = 0;
                            _this.showPatients = false;
                        });
                    }
                    else {
                        this.followedPatients = null;
                    }
                };
                Users.prototype.goFollowPatient = function (patient, follower) {
                    var _this = this;
                    //Action that makes user follow a specific patient
                    this.justFollowedPatient = patient.firstName + ' ' + patient.lastName;
                    var followPatientModel = { 'emailAddress': this.justCreatedUser.emailAddress, 'patient': [{ "mrn": patient.mrn }] };
                    this.UserService.followPatients(followPatientModel).subscribe(function (data) {
                        //make patients results go empty following patient
                        patient = null;
                        _this.patientmodel.searchPatients = null;
                        _this.showPatients = false;
                        _this.closeThisPop('#popupViewPatients');
                        _this.followPatientSuccess();
                    }, function (error) {
                        console.log("USER.COMPONENT:::viewPatients:::error:::" + error);
                        _this.showPatients = false;
                        if (error.indexOf("token is invalid") !== -1) {
                            _this.errorMessage = "Session invalidated as you have logged into another browser/computer. Please login again to continue..";
                        }
                        else {
                            _this.errorMessage = "Server temporarily unavailable. Please try again later.";
                        }
                    });
                };
                Users.prototype.goUnfollowPatient = function (followedPatient, index, numofpatients) {
                    var _this = this;
                    console.log(numofpatients);
                    var i;
                    for (i = 0; i <= (numofpatients - 1); i++) {
                        $('.user-patients' + i).attr('disabled', 'disabled');
                    }
                    //Action that makes user unfollow a specific patient    
                    $('.user-patients' + index).html('<img src="resources/static/icons/loading_ring_small.svg" />');
                    var unfollowPatientModel = { 'emailAddress': this.justCreatedUser.emailAddress, 'patient': [{ "patientid": followedPatient.patientid, "mrn": followedPatient.mrn }] };
                    this.isCreatingUser = true;
                    this.UserService.unfollowPatients(unfollowPatientModel).subscribe(function (data) {
                        _this.isCreatingUser = false;
                        _this.getFollowedPatientsNames();
                    }, function (error) {
                        console.log("USER.COMPONENT:::viewPatients:::error:::" + error);
                        _this.showPatients = false;
                        if (error.indexOf("token is invalid") !== -1) {
                            _this.errorMessage = "Session invalidated as you have logged into another browser/computer. Please login again to continue..";
                        }
                        else {
                            _this.errorMessage = "Server temporarily unavailable. Please try again later.";
                        }
                    });
                };
                Users = __decorate([
                    core_1.Component({
                        selector: 'users',
                        templateUrl: 'app/components/users.component.html'
                    }), 
                    __metadata('design:paramtypes', [router_1.Router, user_service_1.UserService, team_service_1.TeamService])
                ], Users);
                return Users;
            }());
            exports_1("Users", Users);
        }
    }
});
//# sourceMappingURL=users.component.js.map