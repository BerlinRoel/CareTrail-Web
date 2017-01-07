System.register(['angular2/core', 'angular2/router', '../services/user.service', '../utils/shared.data'], function(exports_1, context_1) {
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
    var core_1, router_1, user_service_1, shared_data_1;
    var OnCall;
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
            function (shared_data_1_1) {
                shared_data_1 = shared_data_1_1;
            }],
        execute: function() {
            OnCall = (function () {
                function OnCall(_router, UserService, sharedData) {
                    this._router = _router;
                    this.UserService = UserService;
                    this.sharedData = sharedData;
                    this.model = { 'searchUser': '', 'filteredUserType': 'oncall', 'searchOffUser': '', 'searchOnCallUser': '' };
                    this.calendarString = "";
                    this.loadingMonthData = false;
                    this.isAddingOnCall = false;
                    this.showCurrentUsersLoadingIcon = 0;
                    this.hasOnCallUsers = false;
                    this.showLoadingIcon = false;
                    this.searchErrorMessage = '';
                    this.showOffUserSearchIcon = 0;
                    this.showOnCallUserSearchIcon = 0;
                    this.calendarString = $('#full-clndr-template').html();
                }
                OnCall.prototype.ngOnInit = function () {
                    // Default filtered user to logged-in user
                    this.filteredUser = this.sharedData.loggedInUser;
                    this.ShowUsersOnCall(moment().format('YYYY/MM/DD 00:01'));
                    this.UpdateMonthData(moment());
                };
                OnCall.prototype.ngAfterViewInit = function () {
                    $('.patient-search').remove();
                    $('.message-area').remove();
                    // Need a reference to 'this' as 'OnCall' object for clndr callbacks
                    var self = this;
                    this.onCallCalendar = $('#full-clndr').clndr({
                        template: this.calendarString,
                        trackSelectedDate: true,
                        selectedDate: moment(),
                        classes: {
                            selected: "clndr-selected",
                            today: "clndr-today",
                            inactive: "clndr-inactive",
                            adjacentMonth: "clndr-adjacent-month",
                        },
                        clickEvents: {
                            click: function (target) {
                                self.OnDateClick(target);
                            },
                            onMonthChange: function (month) {
                                self.OnMonthChange(month);
                            }
                        },
                        targets: {
                            day: 'clndr-day',
                            empty: 'clndr-empty'
                        },
                    });
                    this.onCallCalendar.today();
                    $('#startTimeTimepicker').timepicker({ 'selectOnBlur': true });
                    $('#endTimeTimepicker').timepicker({ 'selectOnBlur': true });
                    this.SetDropdownPositions();
                };
                OnCall.prototype.onClickBody = function (event) {
                    this.offUserSearchResults = null;
                    this.onCallUserSearchResults = null;
                };
                OnCall.prototype.SetDropdownPositions = function () {
                    $("#offUserSearchResults").css('top', parseInt($("#offUserSearch").position().top, 10)
                        + parseInt($("#offUserSearch").css('height'), 10)
                        + parseInt($("#offUserSearch").css('margin-top'), 10)
                        + 2); // Need to add 2 to have it appear just a little bit lower
                    $("#offUserSearchResults").css('left', parseInt($("#offUserSearch").position().left, 10)
                        - (parseInt($("#offUserSearchResults").css('width'), 10) - parseInt($("#offUserSearch").css('width'), 10)) / 2);
                    $("#onCallUserSearchResults").css('top', parseInt($("#onCallUserSearch").position().top, 10)
                        + parseInt($("#onCallUserSearch").css('height'), 10)
                        + parseInt($("#onCallUserSearch").css('margin-top'), 10)
                        + 2); // Need to add 2 to have it appear just a little bit lower
                    $("#onCallUserSearchResults").css('left', parseInt($("#onCallUserSearch").position().left, 10)
                        - (parseInt($("#onCallUserSearchResults").css('width'), 10) - parseInt($("#onCallUserSearch").css('width'), 10)) / 2);
                };
                OnCall.prototype.ClearFilteredUser = function () {
                    this.FilterUser(null);
                };
                OnCall.prototype.SearchForUsers = function () {
                    var _this = this;
                    //Searches for users in database & shows info
                    if (this.model.searchUser) {
                        console.log("USER.COMPONENT:::getUserDetails:::" + this.model.searchUser);
                        this.userSearchResults = null;
                        this.showLoadingIcon = true;
                        this.UserService.getUserByName(this.model.searchUser).subscribe(function (data) {
                            console.log("USER.COMPONENT:::getUserDetails:::" + JSON.stringify(data));
                            _this.userSearchResults = data;
                            _this.showLoadingIcon = false;
                        }, function (error) {
                            console.log("USER.COMPONENT:::getUserDetails:::" + error);
                            if (error.indexOf("token is invalid") !== -1) {
                                _this.searchErrorMessage = "Session invalidated as you have logged into another browser/computer. Please login again to continue..";
                            }
                            else {
                                _this.searchErrorMessage = "Server temporarily unavailable. Please try again later.";
                            }
                            _this.userSearchResults = null;
                            _this.showLoadingIcon = false;
                        });
                    }
                    else {
                        this.userSearchResults = null;
                        this.showLoadingIcon = false;
                    }
                };
                OnCall.prototype.ValidateUserSearch = function () {
                    if (this.model.searchUser == '') {
                        this.showLoadingIcon = false;
                        this.searchErrorMessage = '';
                        this.userSearchResults = null;
                    }
                };
                OnCall.prototype.FilterUser = function (user) {
                    this.filteredUser = user;
                    this.showLoadingIcon = false;
                    this.searchErrorMessage = '';
                    this.userSearchResults = null;
                    this.ShowUsersOnCall(this.currentlySelectedDate);
                    this.UpdateMonthData(this.currentlySelectedDate);
                };
                OnCall.prototype.OnDateClick = function (target) {
                    this.ShowUsersOnCall(target.date._d);
                };
                OnCall.prototype.OnMonthChange = function (month) {
                    this.UpdateMonthData(month);
                };
                OnCall.prototype.ShowUsersOnCall = function (date) {
                    var _this = this;
                    console.log(date);
                    this.currentlySelectedDate = new Date(date);
                    this.onCallData = null;
                    this.hasOnCallUsers = true;
                    this.showCurrentUsersLoadingIcon++;
                    if (this.filteredUser != null) {
                        console.log("ONCALL.COMPONENT:::ShowUsersOnCallForUser:::" + this.filteredUser.userid + ":::" + date);
                        this.UserService.getOnCallScheduleForDayAndUser(this.filteredUser.userid, date).subscribe(function (data) {
                            _this.ShowUsersOnCallSuccess(data);
                        }, function (error) {
                            console.log("ONCALL.COMPONENT:::ShowUsersOnCall:::ERROR:::" + error);
                            _this.ShowUsersOnCallFailure(error);
                        });
                    }
                    else {
                        console.log("ONCALL.COMPONENT:::ShowUsersOnCall:::" + date);
                        this.UserService.getOnCallScheduleForDay(date).subscribe(function (data) {
                            _this.ShowUsersOnCallSuccess(data);
                        }, function (error) {
                            console.log("ONCALL.COMPONENT:::ShowUsersOnCall:::ERROR:::" + error);
                            _this.ShowUsersOnCallFailure(error);
                        });
                    }
                };
                OnCall.prototype.ShowUsersOnCallSuccess = function (data) {
                    this.showCurrentUsersLoadingIcon--;
                    if (data.onCallUsersMap == null || data.onCallUsersMap.Day.length == 0) {
                        this.hasOnCallUsers = false;
                        return;
                    }
                    if (this.showCurrentUsersLoadingIcon == 0) {
                        this.onCallData = data.onCallUsersMap.Day;
                        for (var i = 0; i < this.onCallData.length; i++) {
                            var startDateTime = moment(moment(this.currentlySelectedDate).format("MM/DD/YYYY") + " " + this.onCallData[i].start_hour + ":" + this.onCallData[i].start_minutes, "MM/DD/YYYY HH:mm");
                            var endDateTime = moment(moment(this.currentlySelectedDate).format("MM/DD/YYYY") + " " + this.onCallData[i].end_hour + ":" + this.onCallData[i].end_minutes, "MM/DD/YYYY HH:mm");
                            this.onCallData[i].formattedStartTime = startDateTime.format("h:mma");
                            this.onCallData[i].formattedEndTime = endDateTime.format("h:mma");
                        }
                        this.hasOnCallUsers = true;
                    }
                };
                OnCall.prototype.ShowUsersOnCallFailure = function (error) {
                    this.hasOnCallUsers = false;
                    this.showCurrentUsersLoadingIcon--;
                };
                OnCall.prototype.UpdateMonthData = function (month) {
                    var _this = this;
                    this.loadingMonthData = true;
                    if (this.filteredUser != null) {
                        console.log("ONCALL.COMPONENT:::UpdateMonthData:::" + this.filteredUser.userid + ":::" + month);
                        this.UserService.getOnCallScheduleForMonthAndUser(this.filteredUser.userid, month).subscribe(function (data) {
                            _this.UpdateMonthDataSuccess(data, month);
                        }, function (error) {
                            _this.UpdateMonthDataFailure(error);
                        });
                    }
                    else {
                        console.log("ONCALL.COMPONENT:::UpdateMonthData:::" + month);
                        this.UserService.getOnCallScheduleForMonth(month).subscribe(function (data) {
                            _this.UpdateMonthDataSuccess(data, month);
                        }, function (error) {
                            _this.UpdateMonthDataFailure(error);
                        });
                    }
                };
                OnCall.prototype.UpdateMonthDataSuccess = function (data, month) {
                    if (data.onCallUsersCountMap == null || data.onCallUsersCountMap.Month.length == 0) {
                        this.onCallCalendar.setEvents([]);
                        this.loadingMonthData = false;
                        return;
                    }
                    var eventData = [];
                    for (var i = 0; i < data.onCallUsersCountMap.Month.length; i++) {
                        for (var x = 0; x < data.onCallUsersCountMap.Month[i].userCount; x++) {
                            var day = data.onCallUsersCountMap.Month[i].day;
                            if (day < 10) {
                                day = "0" + day;
                            }
                            eventData.push({ date: moment(month).format("YYYY-MM-" + day), title: x });
                        }
                    }
                    this.onCallCalendar.setEvents(eventData);
                    this.loadingMonthData = false;
                };
                OnCall.prototype.UpdateMonthDataFailure = function (error) {
                    console.log("ONCALL.COMPONENT:::UpdateMonthData:::ERROR:::" + error);
                    this.loadingMonthData = false;
                };
                OnCall.prototype.searchForNewOnCallUsers = function (searchingOffUsers) {
                    var _this = this;
                    this.SetDropdownPositions();
                    if (searchingOffUsers) {
                        this.selectedOffUser = null;
                    }
                    else {
                        this.selectedOnCallUser = null;
                    }
                    this.offUserSearchResults = null;
                    this.onCallUserSearchResults = null;
                    if (this.model.searchOffUser || this.model.searchOnCallUser) {
                        if (searchingOffUsers) {
                            this.showOffUserSearchIcon++;
                        }
                        else {
                            this.showOnCallUserSearchIcon++;
                        }
                        var searchString = '';
                        if (searchingOffUsers) {
                            searchString = this.model.searchOffUser;
                        }
                        else {
                            searchString = this.model.searchOnCallUser;
                        }
                        this.UserService.getUserByName(searchString).subscribe(function (data) {
                            if (searchingOffUsers && _this.showOffUserSearchIcon > 0) {
                                _this.showOffUserSearchIcon--;
                            }
                            else if (_this.showOnCallUserSearchIcon > 0) {
                                _this.showOnCallUserSearchIcon--;
                            }
                            if ((searchingOffUsers && _this.showOffUserSearchIcon == 0 ||
                                !searchingOffUsers && _this.showOnCallUserSearchIcon == 0)
                                && searchString) {
                                if (searchingOffUsers) {
                                    _this.offUserSearchResults = data;
                                }
                                else {
                                    _this.onCallUserSearchResults = data;
                                }
                            }
                        }, function (error) {
                            console.log("ONCALL.COMPONENT:::getUserDetails:::ERROR:::" + error);
                            if (searchingOffUsers) {
                                _this.showOffUserSearchIcon--;
                            }
                            else {
                                _this.showOnCallUserSearchIcon--;
                            }
                        }); // end of subscribe
                    }
                    else {
                        this.offUserSearchResults = null;
                        this.onCallUserSearchResults = null;
                        if (searchingOffUsers) {
                            this.showOffUserSearchIcon = 0;
                        }
                        else {
                            this.showOnCallUserSearchIcon = 0;
                        }
                    }
                };
                OnCall.prototype.selectUser = function (user, isOffUser) {
                    if (isOffUser) {
                        this.selectOffUser(user);
                    }
                    else {
                        this.selectOnCallUser(user);
                    }
                };
                OnCall.prototype.selectOffUser = function (user) {
                    if (user.lastName != null) {
                        this.model.searchOffUser = user.username + " " + user.lastName;
                    }
                    else {
                        this.model.searchOffUser = user.username;
                    }
                    this.selectedOffUser = user;
                };
                OnCall.prototype.selectOnCallUser = function (user) {
                    if (user.lastName != null) {
                        this.model.searchOnCallUser = user.username + " " + user.lastName;
                    }
                    else {
                        this.model.searchOnCallUser = user.username;
                    }
                    this.selectedOnCallUser = user;
                };
                OnCall.prototype.selectOffSearchResult = function (event, selectedOffUsers) {
                    if (event.key == "ArrowDown") {
                        if (selectedOffUsers) {
                            this.selectNextSearchResult(true, this.offUserSearchResults, "#offUserSearchResults");
                        }
                        else {
                            this.selectNextSearchResult(false, this.onCallUserSearchResults, "#onCallUserSearchResults");
                        }
                    }
                    else if (event.key == "ArrowUp") {
                        if (selectedOffUsers) {
                            this.selectPreviousSearchResult(true, this.offUserSearchResults, "#offUserSearchResults");
                        }
                        else {
                            this.selectPreviousSearchResult(false, this.onCallUserSearchResults, "#onCallUserSearchResults");
                        }
                    }
                    else if (event.key == "Tab" || event.key == "Enter") {
                        if (selectedOffUsers) {
                            this.offUserSearchResults = null;
                        }
                        else {
                            this.onCallUserSearchResults = null;
                        }
                    }
                };
                OnCall.prototype.selectNextSearchResult = function (isOffSearchModel, results, dropdownId) {
                    if (results != null && results.length >= 1) {
                        var selectNext = false;
                        var didSelect = false;
                        for (var i = 0; i < results.length; i++) {
                            if (!didSelect && selectNext) {
                                results[i].isSelected = true;
                                selectNext = false;
                                didSelect = true;
                                this.selectUser(results[i], isOffSearchModel);
                            }
                            else {
                                if (results[i].isSelected == true) {
                                    selectNext = true;
                                }
                                results[i].isSelected = false;
                            }
                        }
                        if (didSelect == false) {
                            results[0].isSelected = true;
                            this.selectUser(results[0], isOffSearchModel);
                        }
                    }
                    setTimeout(function () {
                        var $scrollTo = $('.oncall-addoncall-selected');
                        if ($scrollTo.length > 0) {
                            var win = $(dropdownId);
                            var viewport = {
                                top: win.scrollTop(),
                                bottom: win.scrollTop() + win.height()
                            };
                            var bounds = $scrollTo.offset();
                            bounds.bottom = bounds.top + $scrollTo.outerHeight();
                            var isOnScreen = (!(viewport.bottom < bounds.top || viewport.top > bounds.bottom));
                            if (!isOnScreen || $scrollTo.position().top < 0) {
                                $(dropdownId).animate({ scrollTop: $scrollTo.offset().top - $(dropdownId).offset().top + $(dropdownId).scrollTop(), scrollLeft: 0 }, 100);
                            }
                        }
                    }, 200);
                };
                OnCall.prototype.selectPreviousSearchResult = function (isOffSearchModel, results, dropdownId) {
                    if (results != null && results.length >= 1) {
                        var selectNext = false;
                        var didSelect = false;
                        for (var i = results.length - 1; i >= 0; i--) {
                            if (!didSelect && selectNext) {
                                results[i].isSelected = true;
                                selectNext = false;
                                didSelect = true;
                                this.selectUser(results[i], isOffSearchModel);
                            }
                            else {
                                if (results[i].isSelected == true) {
                                    selectNext = true;
                                }
                                results[i].isSelected = false;
                            }
                        }
                        if (didSelect == false) {
                            results[results.length - 1].isSelected = true;
                            this.selectUser(results[results.length - 1], isOffSearchModel);
                        }
                    }
                    setTimeout(function () {
                        var $scrollTo = $('.oncall-addoncall-selected');
                        if ($scrollTo.length > 0) {
                            var win = $(dropdownId);
                            var viewport = {
                                top: win.scrollTop(),
                                bottom: win.scrollTop() + win.height()
                            };
                            var bounds = $scrollTo.offset();
                            bounds.bottom = bounds.top + $scrollTo.outerHeight();
                            var isOnScreen = (!(viewport.bottom < bounds.top || viewport.top > bounds.bottom));
                            if (!isOnScreen || $scrollTo.position().top < 0) {
                                $(dropdownId).animate({ scrollTop: $scrollTo.offset().top - $(dropdownId).offset().top + $(dropdownId).scrollTop(), scrollLeft: 0 }, 100);
                            }
                        }
                    }, 200);
                };
                OnCall.prototype.addOnCallData = function () {
                    var _this = this;
                    this.isAddingOnCall = true;
                    if (!moment(moment(this.currentlySelectedDate).format("MM/DD/YYYY") + " " + $('#startTimeTimepicker').val(), "MM/DD/YYYY h:mma", true).isValid()) {
                        alert('Invalid start time.');
                        this.isAddingOnCall = false;
                        return;
                    }
                    if (!moment(moment(this.currentlySelectedDate).format("MM/DD/YYYY") + " " + $('#endTimeTimepicker').val(), "MM/DD/YYYY h:mma", true).isValid()) {
                        alert('Invalid end time.');
                        this.isAddingOnCall = false;
                        return;
                    }
                    if (this.filteredUser == null) {
                        if (this.model.searchOnCallUser == null || this.model.searchOnCallUser == '' || this.selectedOnCallUser == null) {
                            alert('An On-Call User is required.');
                            this.isAddingOnCall = false;
                            return;
                        }
                    }
                    var startDateTime = moment(moment(this.currentlySelectedDate).format("MM/DD/YYYY") + " " + $('#startTimeTimepicker').val(), "MM/DD/YYYY h:mma", true);
                    var endDateTime = moment(moment(this.currentlySelectedDate).format("MM/DD/YYYY") + " " + $('#endTimeTimepicker').val(), "MM/DD/YYYY h:mma", true);
                    var offUserEmail = "";
                    var onCallUserEmail = "";
                    if (this.filteredUser == null) {
                        onCallUserEmail = this.selectedOnCallUser.emailAddress;
                        if (this.selectedOffUser != null) {
                            offUserEmail = this.selectedOffUser.emailAddress;
                        }
                    }
                    else {
                        // For filtered data, check the select dropdown for what the user selected
                        if (this.model.filteredUserType == 'oncall') {
                            // The filtered user is on-call
                            if (this.filteredUser.emailAddress.constructor === Array) {
                                onCallUserEmail = this.filteredUser.emailAddress[0];
                            }
                            else {
                                onCallUserEmail = this.filteredUser.emailAddress;
                            }
                            if (this.selectedOffUser != null) {
                                offUserEmail = this.selectedOffUser.emailAddress;
                            }
                        }
                        else {
                            // The filtered user is off
                            offUserEmail = this.filteredUser.emailAddress;
                            // An on-call user is now required, and their data will be in the offUser input since we're re-using that
                            if (this.model.searchOffUser == null || this.model.searchOffUser == '' || this.selectedOffUser == null) {
                                alert('A user is required to go on-call in your place');
                                this.isAddingOnCall = false;
                                return;
                            }
                            else {
                                onCallUserEmail = this.selectedOffUser.emailAddress;
                            }
                        }
                    }
                    console.log("ONCALL.COMPONENT:::addOnCallData:::" + this.currentlySelectedDate);
                    this.UserService.addUserOnCall(startDateTime, endDateTime, onCallUserEmail, offUserEmail).subscribe(function (data) {
                        _this.isAddingOnCall = false;
                        _this.selectedOffUser = null;
                        _this.selectedOnCallUser = null;
                        // Refresh everything
                        _this.UpdateMonthData(_this.currentlySelectedDate);
                        _this.ShowUsersOnCall(_this.currentlySelectedDate);
                        // Clear results
                        $('#startTimeTimepicker').val('');
                        $('#endTimeTimepicker').val('');
                        _this.model.searchOffUser = '';
                        _this.model.searchOnCallUser = '';
                    }, function (error) {
                        _this.isAddingOnCall = false;
                        console.log("ONCALL.COMPONENT:::addOnCallData:::ERROR:::" + error);
                    });
                };
                OnCall.prototype.removeOnCallData = function (onCallData) {
                    var _this = this;
                    onCallData.isWorking = true;
                    console.log("ONCALL.COMPONENT:::removeOnCallData:::" + this.currentlySelectedDate + "," + onCallData.oncallid);
                    this.UserService.removeUserOnCall(onCallData.oncallid).subscribe(function (data) {
                        onCallData.isWorking = false;
                        // Refresh everything
                        _this.UpdateMonthData(_this.currentlySelectedDate);
                        _this.ShowUsersOnCall(_this.currentlySelectedDate);
                    }, function (error) {
                        onCallData.isWorking = false;
                        console.log("ONCALL.COMPONENT:::removeOnCallData:::ERROR:::" + error);
                    });
                };
                OnCall = __decorate([
                    core_1.Component({
                        selector: 'oncall',
                        templateUrl: 'app/components/oncall.component.html',
                        host: {
                            '(document:click)': 'onClickBody($event)',
                        },
                    }), 
                    __metadata('design:paramtypes', [router_1.Router, user_service_1.UserService, shared_data_1.SharedData])
                ], OnCall);
                return OnCall;
            }());
            exports_1("OnCall", OnCall);
        }
    }
});
//# sourceMappingURL=oncall.component.js.map