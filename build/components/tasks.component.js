System.register(['angular2/core', 'angular2/router', '../models/task', '../models/user', '../models/patient', '../services/task.service', '../services/user.service'], function(exports_1, context_1) {
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
    var core_1, router_1, task_1, user_1, patient_1, task_service_1, user_service_1;
    var Tasks;
    return {
        setters:[
            function (core_1_1) {
                core_1 = core_1_1;
            },
            function (router_1_1) {
                router_1 = router_1_1;
            },
            function (task_1_1) {
                task_1 = task_1_1;
            },
            function (user_1_1) {
                user_1 = user_1_1;
            },
            function (patient_1_1) {
                patient_1 = patient_1_1;
            },
            function (task_service_1_1) {
                task_service_1 = task_service_1_1;
            },
            function (user_service_1_1) {
                user_service_1 = user_service_1_1;
            }],
        execute: function() {
            Tasks = (function () {
                function Tasks(_router, TaskService, UserService) {
                    this._router = _router;
                    this.TaskService = TaskService;
                    this.UserService = UserService;
                    this.showUserTask = true;
                    this.showAssignedUser = true;
                    this.showThemTasks = true;
                    this.isCreatingTask = false;
                    this.isShowingTask = false;
                    this.isShowingNextTask = false;
                    this.isReadytoScroll = false;
                    this.showPatientGear = false;
                    this.showUserGear = false;
                    this.endOfTasks = false;
                    this.newtasks = new task_1.Task();
                    this.selectedUser = new user_1.User();
                    this.selectedPatient = new patient_1.Patient();
                    this.nextPage = 1;
                    this.userEmail = sessionStorage.getItem("loggedInUser.emailAddress");
                    this.model = { 'searchUser': '', 'searchTask': '' };
                    this.patientmodel = { 'searchPatients': '' };
                    this.taskmodel = { 'searchTasks': '' };
                    this.toggleModel = [
                        { value: 'untoggled', display: 'NORMAL' },
                        { value: 'toggled', display: 'HIGH' }];
                    this.statusModel = [
                        { value: 'NOT_INITIATED' },
                        { value: 'INITIATED' },
                        { value: 'COMPLETED' }];
                }
                Tasks.prototype.ngAfterViewInit = function () {
                    var self = this;
                    $('.more-tasks-loading').addClass('hidden');
                    $('.patient-search').remove();
                    $('.message-area').remove();
                    $('#popupCreateTask_background').remove();
                    $('#popupCreateTask_wrapper').remove();
                    $('#popupViewTaskPatients_background').remove();
                    $('#popupViewTaskPatients_wrapper').remove();
                    $('#popupViewAssignedToUser_background').remove();
                    $('#popupViewAssignedToUser_wrapper').remove();
                    $('#dv-status-change_background').remove();
                    $('#dv-status-change_wrapper').remove();
                    $('#fld-search-tasks').bind('input propertychange', function () {
                        setTimeout(function () {
                            if ($('#fld-search-tasks').val() == '') {
                                self.filterTasks();
                                self.Tasks = self.postTasks;
                            }
                        }, 100);
                    });
                    $('body-content').scroll(function () {
                        var bodyContent = document.getElementById("body-content");
                        if (bodyContent.offsetHeight + bodyContent.scrollTop == bodyContent.scrollHeight &&
                            location.href.indexOf('/tasks') !== -1 &&
                            self.Tasks !== undefined &&
                            self.isReadytoScroll) {
                            self.showNextTasks(self.selectedUser);
                        }
                        else if (location.href.indexOf('/tasks') !== -1) {
                            self.isReadytoScroll = true;
                        }
                        else if (location.href.indexOf('/timeline') !== -1) {
                            self.isReadytoScroll = false;
                        }
                    });
                };
                Tasks.prototype.filterTasks = function () {
                    this.showUserTask = true;
                    if (this.model.searchTask == '') {
                        this.Tasks = this.postTasks;
                    }
                    var filteredTasks = [];
                    for (var i = 0; i < this.postTasks.length; i++) {
                        if (this.postTasks[i].taskdetails !== null && this.postTasks[i].taskdetails.toUpperCase().indexOf(this.model.searchTask.toUpperCase()) !== -1) {
                            filteredTasks.push(this.postTasks[i]);
                        }
                    }
                    this.Tasks = filteredTasks;
                    if (this.Tasks.length == 0) {
                        $('.no-task-results').removeClass('hidden');
                    }
                    else {
                        $('.no-task-results').addClass('hidden');
                    }
                };
                Tasks.prototype.ngOnInit = function () {
                    this.isShowingTask = true;
                    this.showTasks(this.selectedUser);
                    this.newtasks.priority = this.toggleModel[0].display;
                };
                Tasks.prototype.showTasks = function (user) {
                    var _this = this;
                    //Shows tasks
                    this.selectedUser = user;
                    if (this.userEmail) {
                        this.TaskService.getMyTask(this.userEmail, 0).subscribe(function (data) {
                            _this.Tasks = data;
                            _this.postTasks = data;
                            _this.showUserTask = true;
                            _this.isShowingTask = false;
                            $('#fld-search-tasks').removeAttr('disabled');
                            $('#btn-create-task').removeAttr('disabled');
                            $('#body-content').scrollTop(0);
                            _this.isReadytoScroll = true;
                        }, function (error) {
                            _this.showUserTask = false;
                            _this.isShowingTask = false;
                        });
                    }
                    else {
                        this.Tasks = null;
                        this.isShowingTask = false;
                    }
                };
                Tasks.prototype.showNextTasks = function (user) {
                    var _this = this;
                    if (!this.isShowingNextTask && !this.endOfTasks) {
                        if (!this.isShowingTask) {
                            $('.more-tasks-loading').removeClass('hidden');
                        }
                        this.selectedUser = user;
                        this.isShowingNextTask = true;
                        if (this.userEmail) {
                            this.TaskService.getMyTask(this.userEmail, this.nextPage).subscribe(function (data) {
                                if (data.length > 0) {
                                    _this.Tasks = _this.Tasks.concat(data);
                                    _this.postTasks = _this.Tasks;
                                    _this.showUserTask = true;
                                    _this.isShowingTask = false;
                                    _this.isShowingNextTask = false;
                                    $('#fld-search-tasks').removeAttr('disabled');
                                    $('#btn-create-task').removeAttr('disabled');
                                    _this.nextPage++;
                                    $('.more-tasks-loading').addClass('hidden');
                                    _this.isReadytoScroll = false;
                                }
                                else {
                                    _this.endOfTasks = true;
                                    $('.more-tasks-loading').addClass('hidden');
                                    _this.isReadytoScroll = false;
                                }
                            }, function (error) {
                                console.log("TASK.COMPONENT:::showTasks:::" + error);
                                _this.showUserTask = false;
                                _this.isShowingTask = false;
                                $('.more-tasks-loading').addClass('hidden');
                            });
                        }
                        else {
                            this.Tasks = [];
                            this.isShowingTask = false;
                        }
                    }
                };
                Tasks.prototype.createTask = function () {
                    $('#viewTaskPatients').val('');
                    $('#viewUsers').val('');
                    $('#fld-task-description').val('');
                    $('#popupCreateTask').popup({
                        opacity: 0.7
                    }).popup('show');
                };
                Tasks.prototype.viewTaskPatients = function () {
                    //Pop-up to Search Patient the Task is for
                    $('#popupViewTaskPatients').popup({
                        opacity: 0.7,
                        transition: 'all 0.3s',
                    }).popup('show');
                    $('#viewTaskPatients').val('');
                    this.patients = null;
                    this.showUserTask = false;
                };
                Tasks.prototype.viewAssignedToUser = function () {
                    //Pop-up for Assigning a User to Task
                    $('#popupViewAssignedToUser').popup({
                        opacity: 0.7,
                        transition: 'all 0.3s',
                    }).popup('show');
                    $('#viewUsers').val('');
                    this.users = null;
                    this.showAssignedUser = false;
                };
                Tasks.prototype.showSuccessMessage = function () {
                    $('#dv-success-message').popup({
                        opacity: 0.7,
                        transition: 'all 0.3s',
                    }).popup('show');
                };
                Tasks.prototype.statusChangeSuccess = function () {
                    $('#dv-status-change').popup({
                        opacity: 0.7,
                        transition: 'all 0.3s',
                    }).popup('show');
                };
                Tasks.prototype.clearPatientUser = function () {
                    this.selectedPatient = new patient_1.Patient();
                    this.selectedUser = new user_1.User();
                    $('#chk-priority').attr('checked', false);
                    this.newtasks.priority = 'NORMAL';
                };
                Tasks.prototype.closePop = function () {
                    //Closes out (hides) pop-up
                    $('#popupCreateTask').popup('hide');
                };
                Tasks.prototype.closePickPatient = function () {
                    $('#popupViewTaskPatients').popup('hide');
                    this.createTask();
                };
                Tasks.prototype.closeAssignToUser = function () {
                    $('#popupViewAssignedToUser').popup('hide');
                    this.createTask();
                };
                Tasks.prototype.closeSuccessMessage = function () {
                    $('#dv-success-message').popup('hide');
                };
                Tasks.prototype.closeStatusChange = function () {
                    $('#dv-status-change').popup('hide');
                };
                Tasks.prototype.pickPatient = function () {
                    this.closePop();
                    this.patients = [];
                    this.viewTaskPatients();
                };
                Tasks.prototype.pickAssignedToUser = function () {
                    this.closePop();
                    this.users = [];
                    this.viewAssignedToUser();
                };
                Tasks.prototype.selectPatient = function (patient) {
                    //button to pick which Patient the Task is for
                    this.selectedPatient = patient;
                    $('#popupViewTaskPatients').popup('hide');
                    this.createTask();
                };
                Tasks.prototype.selectUser = function (user) {
                    //button to pick which user to Assign Task to
                    this.selectedUser = user;
                    $('#popupViewAssignedToUser').popup('hide');
                    $('#viewTaskPatients').val('');
                    this.createTask();
                };
                Tasks.prototype.onCreateTask = function () {
                    var _this = this;
                    // This should Create a new Task
                    this.isCreatingTask = true;
                    var taskJSON = {
                        "patient": { "mrn": this.selectedPatient.mrn },
                        "user": { "emailAddress": this.selectedUser.emailAddress },
                        "taskStatus": [{
                                "status": "NOT_INITIATED",
                            }],
                        "priority": this.newtasks.priority,
                        "taskdetails": this.newtasks.taskdetails
                    };
                    this.TaskService.createTask(taskJSON).subscribe(function (data) {
                        //make task form go null after Creating new Task
                        _this.isCreatingTask = false;
                        taskJSON = null;
                        _this.closePop();
                        _this.showSuccessMessage();
                        _this.showTasks(_this.selectedUser);
                        _this.clearPatientUser();
                    }, function (error) {
                        _this.showUserTask = false;
                        console.log(error);
                    });
                };
                Tasks.prototype.updateTaskStatus = function (taskId, status) {
                    var _this = this;
                    // This should change Status of task
                    var updateTaskJSON = {
                        "taskId": taskId,
                        "taskStatus": [{
                                "status": status
                            }]
                    };
                    this.TaskService.updateTask(updateTaskJSON).subscribe(function (data) {
                        _this.statusChangeSuccess();
                    }, function (error) {
                        console.log(error);
                    });
                };
                Tasks.prototype.getPatientNames = function () {
                    var _this = this;
                    //Searches for patientss in database & displays them
                    this.showPatientGear = true;
                    this.patients = [];
                    $('.no-patient-results').addClass('hidden');
                    if (this.patientmodel.searchPatients) {
                        this.UserService.searchPatients(this.patientmodel.searchPatients).subscribe(function (data) {
                            if (_this.patientmodel.searchPatients) {
                                _this.patients = data;
                                _this.showUserTask = true;
                                _this.showPatientGear = false;
                                if (_this.patients.length == 0) {
                                    $('.no-patient-results').removeClass('hidden');
                                }
                                else {
                                    $('.no-patient-results').addClass('hidden');
                                }
                            }
                        }, function (error) {
                            _this.showUserTask = false;
                            _this.showPatientGear = false;
                        });
                    }
                    else {
                        this.patients = null;
                        this.showPatientGear = false;
                    }
                };
                Tasks.prototype.getUserDetails = function () {
                    var _this = this;
                    //Searches for users in database & shows info
                    this.showUserGear = true;
                    this.users = [];
                    $('.no-user-results').addClass('hidden');
                    if (this.model.searchUser) {
                        this.UserService.getUserByName(this.model.searchUser).subscribe(function (data) {
                            if (_this.model.searchUser) {
                                _this.users = data;
                                _this.showUserGear = false;
                                _this.showAssignedUser = true;
                                if (_this.users.length == 0) {
                                    $('.no-user-results').removeClass('hidden');
                                }
                                else {
                                    $('.no-user-results').addClass('hidden');
                                }
                            }
                        }, function (error) {
                            _this.showAssignedUser = false;
                            _this.showUserGear = false;
                        });
                    }
                    else {
                        this.users = null;
                        this.showAssignedUser = false;
                        this.showUserGear = false;
                    }
                };
                Tasks = __decorate([
                    core_1.Component({
                        selector: 'tasks',
                        templateUrl: 'app/components/tasks.component.html'
                    }), 
                    __metadata('design:paramtypes', [router_1.Router, task_service_1.TaskService, user_service_1.UserService])
                ], Tasks);
                return Tasks;
            }());
            exports_1("Tasks", Tasks);
        }
    }
});
//# sourceMappingURL=tasks.component.js.map