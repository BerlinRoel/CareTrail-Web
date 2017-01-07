System.register(['angular2/core', 'angular2/router', '../services/user.service', '../services/team.service', '../services/timeline.service'], function(exports_1, context_1) {
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
    var core_1, router_1, user_service_1, team_service_1, timeline_service_1;
    var Timelines;
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
            function (timeline_service_1_1) {
                timeline_service_1 = timeline_service_1_1;
            }],
        execute: function() {
            Timelines = (function () {
                function Timelines(_router, UserService, TeamService, TimelineService) {
                    this._router = _router;
                    this.UserService = UserService;
                    this.TeamService = TeamService;
                    this.TimelineService = TimelineService;
                    this.showTimeline = true;
                    this.showPatients = false;
                    this.showingTimeline = false;
                    this.showGear = true;
                    this.isReadytoScroll = false;
                    this.showLoadingIcon = 0;
                    this.curDate = new Date();
                    this.nextPage = 1;
                    this.timelinemodel = { 'emailAddress': sessionStorage.getItem("loggedInUser.emailAddress"), 'pageNo': '0' };
                    this.patientmodel = { 'patientName': '' };
                    this.messageModel = { 'searchMessage': '' };
                    this.timelineMessageModel = {
                        messageType: 'timeline',
                        messageId: null,
                        message: '',
                        channelName: '',
                        priority: '',
                        createdTimestamp: this.curDate.getTime(),
                        patient: {
                            mrn: '',
                            firstName: '',
                            lastName: '',
                        },
                        fromUser: {
                            emailAddress: sessionStorage.getItem("loggedInUser.emailAddress"),
                            username: sessionStorage.getItem("loggedInUser.username"),
                            lastName: sessionStorage.getItem("loggedInUser.lastName")
                        }
                    };
                }
                Timelines.prototype.ngAfterViewInit = function () {
                    $('.timeline-loading').addClass('hidden');
                    var self = this;
                    this.getTimelineMessages();
                    $('#fld-search-patient').bind('input propertychange', function () {
                        setTimeout(function () {
                            if ($('#fld-search-patient').val() == '') {
                                self.getPatientList();
                                self.timeline = self.postTimeline;
                            }
                        }, 100);
                    });
                    $('#fld-search-message').bind('input propertychange', function () {
                        setTimeout(function () {
                            if ($('#fld-search-message').val() == '') {
                                self.getFilteredTimelineMessages();
                                self.timeline = self.postTimeline;
                            }
                        }, 100);
                    });
                    $('body-content').scroll(function () {
                        var bodyContent = document.getElementById("body-content");
                        if (bodyContent.offsetHeight + bodyContent.scrollTop == bodyContent.scrollHeight &&
                            location.href.indexOf('/timeline') !== -1 && self.postTimeline !== undefined &&
                            self.isReadytoScroll) {
                            self.getNextMessages();
                        }
                        else if (location.href.indexOf('/timeline') !== -1) {
                            self.isReadytoScroll = true;
                        }
                        else if (location.href.indexOf('/tasks') !== -1) {
                            self.isReadytoScroll = false;
                        }
                    });
                };
                Timelines.prototype.enableSend = function () {
                    if ($('#fld-message').val().trim() !== '') {
                        $('#btn-send-message').removeAttr('disabled');
                    }
                    else {
                        $('#btn-send-message').attr('disabled', 'disabled');
                    }
                };
                Timelines.prototype.assignPatient = function (patient) {
                    $('#fld-message').removeAttr('disabled');
                    this.timelineMessageModel.channelName = patient.mrn;
                    this.timelineMessageModel.patient.mrn = patient.mrn;
                    this.timelineMessageModel.patient.firstName = patient.firstName;
                    this.timelineMessageModel.priority = '0';
                    this.timelineMessageModel.patient.lastName = patient.lastName;
                };
                Timelines.prototype.getTimelineMessages = function () {
                    var self = this;
                    $('.timeline-loading').addClass('hidden');
                    $('#btn-load-more').removeAttr('disabled');
                    $('.patient-search').insertAfter($('div.header-item.center-align'));
                    $('.message-area').insertAfter($('body-content'));
                    this.TimelineService.getTimeLineList(this.timelinemodel.emailAddress, this.timelinemodel.pageNo).subscribe(function (data) {
                        self.postTimeline = data;
                        self.timeline = data;
                        $('#fld-search-patient').removeAttr('disabled');
                        $('#fld-search-message').removeAttr('disabled');
                        $('#btn-load-more').show();
                        self.showGear = false;
                        $('#body-content').scrollTop(0);
                        self.isReadytoScroll = true;
                    }, function (error) {
                        $('.timeline-loading').addClass('hidden');
                        self.showGear = false;
                    });
                };
                Timelines.prototype.getNextMessages = function () {
                    var self = this;
                    if (!this.showingTimeline) {
                        this.showingTimeline = true;
                        $('.timeline-loading').removeClass('hidden');
                        this.TimelineService.getTimeLineList(this.timelinemodel.emailAddress, this.nextPage + '').subscribe(function (data) {
                            if (data.length == 0) {
                                $('#btn-load-more').attr('disabled', 'disabled');
                                $('.timeline-loading').addClass('hidden');
                                self.showingTimeline = false;
                                self.isReadytoScroll = false;
                            }
                            else {
                                self.postTimeline = self.postTimeline.concat(data);
                                self.timeline = self.timeline.concat(data);
                                self.showingTimeline = false;
                                self.nextPage++;
                                $('.timeline-loading').addClass('hidden');
                                $('#body-content').scrollTop(0);
                                self.isReadytoScroll = false;
                            }
                        }, function (error) {
                            console.log("TIMELINE.COMPONENT:::getTimelineMessages:::" + error);
                        });
                    }
                };
                Timelines.prototype.getFilteredTimelineMessages = function () {
                    $('#fld-search-patient').val('');
                    this.showTimeline = true;
                    this.showPatients = false;
                    if ($('#fld-search-message').val().trim() == '') {
                        $('#btn-load-more').show();
                    }
                    else {
                        $('#btn-load-more').hide();
                    }
                    if (this.messageModel.searchMessage == '') {
                        this.timeline = this.postTimeline;
                    }
                    var filteredTimelineMessages = [];
                    for (var i = 0, j = 0; i < this.postTimeline.length; i++) {
                        var name = '';
                        if (this.postTimeline[i].message != null) {
                            name = this.postTimeline[i].message + ' ' +
                                this.postTimeline[i].fromUser.lastName + ' ' +
                                this.postTimeline[i].fromUser.username + ' ' +
                                this.postTimeline[i].toPatient.firstName + ' ' +
                                this.postTimeline[i].toPatient.lastName;
                        }
                        if (name.toUpperCase().indexOf(this.messageModel.searchMessage.toUpperCase()) != -1) {
                            filteredTimelineMessages[j] = this.postTimeline[i];
                            j++;
                        }
                    }
                    this.timeline = filteredTimelineMessages;
                };
                Timelines.prototype.getPatientList = function () {
                    var _this = this;
                    $('#fld-message').attr('disabled', 'disabled');
                    $('#btn-send-message').attr('disabled', 'disabled');
                    $('#fld-search-message').val('');
                    if ($('#fld-search-patient').val() == '') {
                        $('#btn-load-more').show();
                    }
                    else {
                        $('#btn-load-more').hide();
                    }
                    if (this.patientmodel.patientName != '') {
                        this.showTimeline = false;
                        this.showPatients = true;
                    }
                    else {
                        this.showTimeline = true;
                        this.showPatients = false;
                        this.timelineMessageModel.patient.firstName = '';
                        this.timelineMessageModel.patient.lastName = '';
                    }
                    //Shows the list of patients when doing search
                    this.TimelineService.getTimeLinePatients().subscribe(function (data) {
                        var aoResultPatient = [];
                        if (data == null || _this.patientmodel.patientName == "") {
                            _this.patients = aoResultPatient;
                        }
                        for (var i = 0, j = 0; i < data.length; i++) {
                            var name = '';
                            if (data[i].lastName != null) {
                                name = data[i].firstName + " " + data[i].lastName;
                            }
                            else {
                                name = data[i].firstName;
                            }
                            if (name.toUpperCase().indexOf(_this.patientmodel.patientName.toUpperCase()) != -1) {
                                aoResultPatient[j] = data[i];
                                j++;
                            }
                        }
                        _this.patients = aoResultPatient;
                        _this.showGear = false;
                    }, function (error) {
                        console.log("TIMELINE.COMPONENT:::getPatientList:::" + error);
                        _this.showGear = false;
                    });
                };
                Timelines.prototype.postTimelineMessage = function () {
                    var _this = this;
                    this.TimelineService.timeLinePostMessageList(this.timelineMessageModel).subscribe(function (data) {
                        _this.showGear = false;
                        location.reload();
                    }, function (error) {
                        console.log("TIMELINE.COMPONENT:::postTimelineMessage:::" + error);
                        _this.showGear = false;
                    });
                };
                Timelines.prototype.format = function (dateVal) {
                    return moment(dateVal).fromNow();
                };
                Timelines = __decorate([
                    core_1.Component({
                        selector: 'timeline',
                        templateUrl: 'app/components/timeline.component.html',
                        providers: [timeline_service_1.TimelineService]
                    }), 
                    __metadata('design:paramtypes', [router_1.Router, user_service_1.UserService, team_service_1.TeamService, timeline_service_1.TimelineService])
                ], Timelines);
                return Timelines;
            }());
            exports_1("Timelines", Timelines);
        }
    }
});
//# sourceMappingURL=timeline.component.js.map