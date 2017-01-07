import { Component, OnInit, AfterViewInit } from 'angular2/core';
import { Router } from 'angular2/router';
import { Validators } from 'angular2/common';
import { Task } from '../models/task';
import { User } from '../models/user';
import { Patient } from '../models/patient';
import { Users } from '../components/users.component';
import { TaskService } from '../services/task.service';
import { UserService } from '../services/user.service';
declare var $: any;

@Component({
  selector: 'tasks',
  templateUrl: 'app/components/tasks.component.html'
})

export class Tasks implements OnInit {
  showUserTask: boolean = true;
  showAssignedUser: boolean = true;
  showThemTasks: boolean = true;
  isCreatingTask: boolean = false;
  isShowingTask: boolean = false;
  isShowingNextTask: boolean = false;
  isReadytoScroll: boolean = false;
  showPatientGear: boolean = false;
  showUserGear: boolean = false;
  endOfTasks: boolean = false;
  isPriority: boolean;
  Tasks: Task[];
  postTasks: Task[];
  patients: Patient[];
  users: User[];
  newtasks: Task = new Task();
  selectedUser: User = new User();
  selectedPatient: Patient = new Patient();
  nextPage: number = 1;

  userEmail: string = sessionStorage.getItem("loggedInUser.emailAddress");

  private model = { 'searchUser': '', 'searchTask' : '' };
  private patientmodel = { 'searchPatients': '' };
  private taskmodel = { 'searchTasks': '' };
  public toggleModel = [
    { value: 'untoggled', display: 'NORMAL' },
    { value: 'toggled', display: 'HIGH' }]
  ;
  public statusModel = [
    { value: 'NOT_INITIATED' },
    { value: 'INITIATED' },
    { value: 'COMPLETED' }]
  ;

  constructor(public _router: Router, private TaskService: TaskService, private UserService: UserService) { }

  ngAfterViewInit() {
    let self = this;
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

    $('#fld-search-tasks').bind('input propertychange', function() {
      setTimeout(
        function(){ 
          if ($('#fld-search-tasks').val() == '') {
            self.filterTasks();
            self.Tasks = self.postTasks;
          }
        }, 100
      );
    });

    $('body-content').scroll(function() {
      let bodyContent = document.getElementById("body-content");
      if (bodyContent.offsetHeight + bodyContent.scrollTop == bodyContent.scrollHeight &&  
          location.href.indexOf('/tasks') !== -1 && 
          self.Tasks !== undefined &&
          self.isReadytoScroll) {
        self.showNextTasks(self.selectedUser);
      } else if(location.href.indexOf('/tasks') !== -1) {
        self.isReadytoScroll = true;
      } else if(location.href.indexOf('/timeline') !== -1) {
        self.isReadytoScroll = false;
      }
    });
  }

  filterTasks() {
    this.showUserTask = true;

    if (this.model.searchTask == '') {
      this.Tasks = this.postTasks;
    }
    
    var filteredTasks = [];
    for (var i=0; i < this.postTasks.length; i++) {
        if (this.postTasks[i].taskdetails !== null && this.postTasks[i].taskdetails.toUpperCase().indexOf(this.model.searchTask.toUpperCase()) !== -1) {
            filteredTasks.push(this.postTasks[i]);
        }
    }
    this.Tasks = filteredTasks;
    if(this.Tasks.length == 0) {
      $('.no-task-results').removeClass('hidden');
    } else {
      $('.no-task-results').addClass('hidden');
    }
  }

  ngOnInit() {
    this.isShowingTask = true;
    this.showTasks(this.selectedUser);
    this.newtasks.priority = this.toggleModel[0].display;
  }

  showTasks(user) {
    //Shows tasks
    this.selectedUser = user;
    if (this.userEmail) {
      this.TaskService.getMyTask(this.userEmail,0).subscribe(
        data => {
          this.Tasks = data;
          this.postTasks = data;
          this.showUserTask = true;
          this.isShowingTask = false;
          $('#fld-search-tasks').removeAttr('disabled');
          $('#btn-create-task').removeAttr('disabled');
          $('#body-content').scrollTop(0);
          this.isReadytoScroll = true;
        },
        error => {
          this.showUserTask = false;
          this.isShowingTask = false;
        }
      )
    }
    else {
      this.Tasks = null;
      this.isShowingTask = false;
    }
  }

  showNextTasks(user) {
    if(!this.isShowingNextTask && !this.endOfTasks) {
      if(!this.isShowingTask) {
        $('.more-tasks-loading').removeClass('hidden');
      }
      this.selectedUser = user;
      this.isShowingNextTask = true;
      if (this.userEmail) {
        this.TaskService.getMyTask(this.userEmail,this.nextPage).subscribe(
          data => {
            if(data.length > 0) {
              this.Tasks = this.Tasks.concat(data);
              this.postTasks = this.Tasks;
              this.showUserTask = true;
              this.isShowingTask = false;
              this.isShowingNextTask = false;
              $('#fld-search-tasks').removeAttr('disabled');
              $('#btn-create-task').removeAttr('disabled');
              this.nextPage++;
              $('.more-tasks-loading').addClass('hidden');
              this.isReadytoScroll = false;
            } else {
              this.endOfTasks = true;
              $('.more-tasks-loading').addClass('hidden');
              this.isReadytoScroll = false;
            }        
          },
          error => {
            console.log("TASK.COMPONENT:::showTasks:::" + error);
            this.showUserTask = false;
            this.isShowingTask = false;
            $('.more-tasks-loading').addClass('hidden');
          }
        )
      } else {
        this.Tasks = [];
        this.isShowingTask = false;
      }
    }
  }


  createTask() {
    $('#viewTaskPatients').val('');
    $('#viewUsers').val('');
    $('#fld-task-description').val('');    
    $('#popupCreateTask').popup({
      opacity: 0.7
    }).popup('show');
  }

  viewTaskPatients() {
    //Pop-up to Search Patient the Task is for
    $('#popupViewTaskPatients').popup({
      opacity: 0.7,
      transition: 'all 0.3s',
    }).popup('show');
    $('#viewTaskPatients').val('');
    this.patients = null;
    this.showUserTask = false;
  }

  viewAssignedToUser() {
    //Pop-up for Assigning a User to Task
    $('#popupViewAssignedToUser').popup({
      opacity: 0.7,
      transition: 'all 0.3s',
    }).popup('show');
    $('#viewUsers').val('');
    this.users = null;
    this.showAssignedUser = false;
  }

  showSuccessMessage() {
    $('#dv-success-message').popup({
      opacity: 0.7,
      transition: 'all 0.3s',
    }).popup('show');
  }

  statusChangeSuccess() {
    $('#dv-status-change').popup({
      opacity: 0.7,
      transition: 'all 0.3s',
    }).popup('show');
  }  

  clearPatientUser() {
    this.selectedPatient = new Patient();
    this.selectedUser = new User();
    $('#chk-priority').attr('checked', false);
    this.newtasks.priority = 'NORMAL';
  }

  closePop() {
    //Closes out (hides) pop-up
    $('#popupCreateTask').popup('hide');
  }

  closePickPatient() {
    $('#popupViewTaskPatients').popup('hide');
    this.createTask();
  }

  closeAssignToUser() {
    $('#popupViewAssignedToUser').popup('hide');
    this.createTask();
  }

  closeSuccessMessage() {
    $('#dv-success-message').popup('hide');
  }

  closeStatusChange() {
    $('#dv-status-change').popup('hide');
  }

  pickPatient() {
    this.closePop();
    this.patients = [];
    this.viewTaskPatients();
  }

  pickAssignedToUser() {
    this.closePop();
    this.users = [];
    this.viewAssignedToUser();
  }

  selectPatient(patient: Patient) {
    //button to pick which Patient the Task is for
    this.selectedPatient = patient;
    $('#popupViewTaskPatients').popup('hide');
    this.createTask();
  }

  selectUser(user: User) {
    //button to pick which user to Assign Task to
    this.selectedUser = user;
    $('#popupViewAssignedToUser').popup('hide');
    $('#viewTaskPatients').val('');
    this.createTask();
  }

  onCreateTask() {
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
    this.TaskService.createTask(taskJSON).subscribe(
      data => {
        //make task form go null after Creating new Task
        this.isCreatingTask = false;
        taskJSON = null;
        this.closePop();
        this.showSuccessMessage();
        this.showTasks(this.selectedUser);
        this.clearPatientUser()
      },

      error => {
        this.showUserTask = false;
        console.log(error);
      }
    )
  }
  updateTaskStatus(taskId, status) {
    // This should change Status of task
    var updateTaskJSON = {
      "taskId": taskId,
      "taskStatus": [{
        "status": status
      }]
    };

    this.TaskService.updateTask(updateTaskJSON).subscribe(
      data => {
        this.statusChangeSuccess();
      },
      error => {
        console.log(error);
      }
    )
  }

  getPatientNames() {
    //Searches for patientss in database & displays them
    this.showPatientGear = true;
    this.patients = [];
    $('.no-patient-results').addClass('hidden');

    if (this.patientmodel.searchPatients) {
      this.UserService.searchPatients(this.patientmodel.searchPatients).subscribe(
        data => {
          if (this.patientmodel.searchPatients) {
            this.patients = data;
            this.showUserTask = true;
            this.showPatientGear = false;
            if (this.patients.length == 0) {
              $('.no-patient-results').removeClass('hidden');
            } else {
              $('.no-patient-results').addClass('hidden');
            }
          }
        },
        error => {
          this.showUserTask = false;
          this.showPatientGear = false;
        }
      )
    }
    else {
      this.patients = null;
      this.showPatientGear = false;
    }
  }

  getUserDetails() {
    //Searches for users in database & shows info
    this.showUserGear = true;
    this.users = [];
    $('.no-user-results').addClass('hidden');

    if (this.model.searchUser) {
      this.UserService.getUserByName(this.model.searchUser).subscribe(
        data => {
          if (this.model.searchUser) {
            this.users = data;
            this.showUserGear = false;
            this.showAssignedUser = true;
            if(this.users.length == 0) {
              $('.no-user-results').removeClass('hidden');  
            } else {
              $('.no-user-results').addClass('hidden'); 
            }

          }
        },
        error => {
          this.showAssignedUser = false;
          this.showUserGear = false;
        }
      )
    }
    else {
      this.users = null;
      this.showAssignedUser = false;
      this.showUserGear = false;
    }
  }

}
