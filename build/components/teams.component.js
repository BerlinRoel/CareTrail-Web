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
    var Teams;
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
            Teams = (function () {
                function Teams(_router, UserService, TeamService) {
                    this._router = _router;
                    this.UserService = UserService;
                    this.TeamService = TeamService;
                    this.teammodel = { 'searchTeams': '' };
                    this.model = { 'searchUser': '' };
                    this.selectedTeam = new team_1.Team();
                    this.selectedUser = new user_1.User();
                    this.showTeams = true;
                    this.isRemovingingUser = false;
                    this.isShowingTeam = true;
                    this.showUserData = true;
                    this.showLoadingIcon = 0;
                    this.memberLoadingIcon = 0;
                    this.loggedUser = sessionStorage.getItem("loggedInUser.emailAddress");
                    this.loggedUsername = sessionStorage.getItem("loggedInUser.username");
                    this.loggedLastName = sessionStorage.getItem("loggedInUser.lastName");
                }
                Teams.prototype.ngAfterViewInit = function () {
                    $('.patient-search').remove();
                    $('.message-area').remove();
                    $('#popupviewMembers_background').remove();
                    $('#popupviewMembers_wrapper').remove();
                    $('#popupaddMembers_background').remove();
                    $('#popupaddMembers_wrapper').remove();
                    $('#popupLeaveTeam_background').remove();
                    $('#popupLeaveTeam_wrapper').remove();
                    var self = this;
                    this.getUserTeams();
                    $('#fld-user-search').bind('input propertychange', function () {
                        setTimeout(function () {
                            if ($('#fld-user-search').val() == '') {
                                self.getUserDetails();
                            }
                        }, 100);
                    });
                    $('#fld-team-search').bind('input propertychange', function () {
                        setTimeout(function () {
                            if ($('#fld-team-search').val() == '') {
                                self.getUserTeams();
                            }
                        }, 100);
                    });
                };
                Teams.prototype.getTeamDetails = function () {
                    var _this = this;
                    $('.team-results').addClass('hidden');
                    //Searches for teams in database & shows them
                    if (this.teammodel.searchTeams) {
                        console.log("USER.COMPONENT:::getTeamDetails:::" + this.teammodel.searchTeams);
                        this.showLoadingIcon++;
                        this.TeamService.getTeamByName(this.teammodel.searchTeams).subscribe(function (data) {
                            if (_this.showLoadingIcon > 0) {
                                _this.showLoadingIcon--;
                            }
                            if (_this.showLoadingIcon == 0 && _this.teammodel.searchTeams) {
                                _this.teams = data;
                                if (_this.teams.length > 0) {
                                    $('.team-results').addClass('hidden');
                                }
                                else {
                                    $('.team-results').removeClass('hidden');
                                }
                                _this.showTeams = true;
                            }
                        }, function (error) {
                            console.log("USER.COMPONENT:::getTeamDetails:::" + error);
                            _this.showTeams = false;
                            _this.showLoadingIcon--;
                            _this.showLoadingIcon = 0;
                        });
                    }
                };
                Teams.prototype.getUserTeams = function () {
                    var _this = this;
                    this.TeamService.getTeamNamesImOn(sessionStorage.getItem("loggedInUser.emailAddress")).subscribe(function (data) {
                        _this.teams = data;
                        _this.isShowingTeam = false;
                    }, function (error) {
                        console.log("USER.COMPONENT:::getUserTeams:::" + error);
                        _this.isShowingTeam = false;
                    });
                };
                Teams.prototype.removeUserFromTeam = function (team, user, index, numofTeams) {
                    var _this = this;
                    // This removes user from team
                    var i;
                    for (i = 0; i <= (numofTeams - 1); i++) {
                        $('.user-team' + i).attr('disabled', 'disabled');
                    }
                    $('.user-team' + index).html('<img src="resources/static/icons/loading_ring_small.svg" />');
                    var removeUserModel = {
                        'emailAddress': user.emailAddress,
                        'username': user.username,
                        'lastName': user.lastName,
                        'team': [{ "teamId": team.teamid, "teamName": team.teamName }]
                    };
                    this.isRemovingingUser = true;
                    this.TeamService.leaveTeam(removeUserModel).subscribe(function (data) {
                        _this.onTeams = data;
                        _this.isRemovingingUser = false;
                        _this.viewMembers(team.teamName, team.teamid, user.username, user.email);
                    }, function (error) {
                        console.log(error);
                        _this.showTeams = false;
                    });
                };
                Teams.prototype.userLeaveTeam = function (team) {
                    var _this = this;
                    var removeUserModel = {
                        'emailAddress': sessionStorage.getItem("loggedInUser.emailAddress"),
                        'username': sessionStorage.getItem("loggedInUser.username"),
                        'lastName': sessionStorage.getItem("loggedInUser.lastName"),
                        'team': [{ "teamId": team.teamid, "teamName": team.teamName }]
                    };
                    this.leftTeam = team.teamName;
                    this.TeamService.leaveTeam(removeUserModel).subscribe(function (data) {
                        _this.leaveTeamSuccess();
                    }, function (error) {
                        console.log(error);
                    });
                };
                Teams.prototype.getTeamMembers = function (selectedTeam, teamid) {
                    var _this = this;
                    this.selectedTeam.teamName = selectedTeam;
                    this.selectedTeam.teamid = teamid;
                    //function to Users patients of selected team
                    if (this.showTeams) {
                        console.log("TEAM.COMPONENT:::getTeamImOn:::" + selectedTeam);
                        this.TeamService.getTeamMembersNames(selectedTeam).subscribe(function (data) {
                            _this.onTeams = data;
                            console.log(data);
                            _this.memberLoadingIcon = 0;
                            _this.showTeams = true;
                        }, function (error) {
                            console.log("TEAM.COMPONENT:::getTeamImOn:::" + error);
                            _this.showTeams = false;
                            _this.memberLoadingIcon = 0;
                        });
                    }
                    else {
                        this.onTeams = null;
                    }
                };
                Teams.prototype.getTeamPatients = function (selectedTeam) {
                    var _this = this;
                    //function to show patients of selected team
                    if (this.showTeams) {
                        console.log("TEAM.COMPONENT:::getPatientsFromTeam:::" + selectedTeam);
                        this.showTeams = false;
                        this.TeamService.getTeamPatientsNames(selectedTeam).subscribe(function (data) {
                            _this.onTeams = data;
                            console.log(data);
                            _this.memberLoadingIcon = 0;
                            _this.showTeams = true;
                        }, function (error) {
                            console.log("TEAM.COMPONENT:::getPatientsFromTeam:::" + error);
                            _this.showTeams = false;
                            _this.memberLoadingIcon = 0;
                        });
                    }
                    else {
                        this.onTeams = null;
                    }
                };
                Teams.prototype.viewMembers = function (teamName, teamid, username, email) {
                    //Popup that shows Users on selected team
                    this.onTeams = [];
                    this.memberLoadingIcon = 1;
                    $('#popupviewMembers').popup({
                        opacity: 0.7,
                        transition: 'all 0.3s',
                        focuselement: '#viewMembers',
                    }).popup('show');
                    $('.viewteams-header-name').html(teamName);
                    //function for showing memebers of that team
                    this.getTeamMembers(teamName, teamid);
                };
                Teams.prototype.closeSuccessMessage = function () {
                    this.closeThisPop('#popupJoinTeam');
                    this.users = [];
                    $('#fld-user-search').val('');
                };
                Teams.prototype.closeLeaveTeam = function () {
                    this.closeThisPop('#popupLeaveTeam');
                    this.getUserTeams();
                };
                Teams.prototype.backToTeamMembers = function () {
                    this.users = [];
                    $('#fld-user-search').val('');
                    this.closeThisPop('#popupaddMembers');
                    $('#popupviewMembers').popup({}).popup('show');
                };
                Teams.prototype.close = function () {
                    this.onTeams = [];
                    this.users = [];
                    $('#fld-user-search').val('');
                };
                Teams.prototype.closeThisPop = function (popItem) {
                    $(popItem).popup({}).popup('hide');
                };
                Teams.prototype.addMember = function () {
                    this.closeThisPop('#popupviewMembers');
                    $('#popupaddMembers').popup({
                        opacity: 0.7,
                        transition: 'all 0.3s',
                    }).popup('show');
                };
                Teams.prototype.getUserDetails = function () {
                    var _this = this;
                    //Searches for users in database & shows info
                    $('.add-member-results').addClass('hidden');
                    this.users = [];
                    var filterData = [];
                    var self = this;
                    if (this.model.searchUser) {
                        console.log("USER.COMPONENT:::getUserDetails:::" + this.model.searchUser);
                        this.memberLoadingIcon++;
                        this.UserService.getUserByName(this.model.searchUser).subscribe(function (data) {
                            var i;
                            var n;
                            for (i = 0; i < data.length; i++) {
                                var userid = null;
                                for (n = 0; n < _this.onTeams.length; n++) {
                                    if (data[i].userid !== _this.onTeams[n].userid) {
                                        userid = data[i].userid;
                                    }
                                    else {
                                        userid = 0;
                                        break;
                                    }
                                }
                                if (userid > 0 || userid == null) {
                                    filterData.push(data[i]);
                                }
                            }
                            _this.users = filterData;
                            _this.memberLoadingIcon = 0;
                            if (filterData.length == 0) {
                                $('.add-member-results').removeClass('hidden');
                                _this.memberLoadingIcon = 0;
                            }
                            else {
                                $('.add-member-results').addClass('hidden');
                            }
                            console.log(_this.users);
                            _this.showUserData = true;
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
                        this.users = [];
                        this.showLoadingIcon = 0;
                    }
                };
                Teams.prototype.viewPatients = function (teamName) {
                    //Popup that shows patients on selected team
                    this.onTeams = [];
                    this.memberLoadingIcon = 1;
                    $('#popupviewPatients').popup({
                        opacity: 0.7,
                        transition: 'all 0.3s',
                        focuselement: '#viewPatients',
                    }).popup('show');
                    $('.viewteams-header-name').html(teamName);
                    //function for showing patients of that team
                    this.getTeamPatients(teamName);
                };
                Teams.prototype.addUserToTeam = function (teamId, teamName, username, email, lastName) {
                    var _this = this;
                    // This should add the user to the team
                    this.selectedUser.username = username;
                    this.selectedUser.lastName = lastName;
                    var teamJSON = {
                        "username": username,
                        "emailAddress": email,
                        "team": [
                            {
                                "teamName": teamName,
                                "teamId": teamId
                            }
                        ]
                    };
                    this.UserService.addUser(teamJSON).subscribe(function (data) {
                        //make teams results go null after joining a team
                        _this.joinedTeam = teamJSON.team[0].teamName;
                        teamJSON = null;
                        _this.teammodel.searchTeams = null;
                        // this.showTeams = false;
                        _this.closeThisPop('#popupaddMembers');
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
                Teams.prototype.joinTeamSuccess = function () {
                    $('#popupJoinTeam').popup({
                        opacity: 0.7
                    }).popup('show');
                };
                Teams.prototype.leaveTeamSuccess = function () {
                    $('#popupLeaveTeam').popup({
                        opacity: 0.7
                    }).popup('show');
                };
                Teams = __decorate([
                    core_1.Component({
                        selector: 'teams',
                        templateUrl: 'app/components/teams.component.html'
                    }), 
                    __metadata('design:paramtypes', [router_1.Router, user_service_1.UserService, team_service_1.TeamService])
                ], Teams);
                return Teams;
            }());
            exports_1("Teams", Teams);
        }
    }
});
//# sourceMappingURL=teams.component.js.map