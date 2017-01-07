import { Component } from 'angular2/core';
import { Router } from 'angular2/router';
import { Validators } from 'angular2/common';
import { Teams } from '../components/teams.component';
import { UserService } from '../services/user.service';
import { TeamService } from '../services/team.service';
import { User } from '../models/user';
import { Team } from '../models/team';
import { Patient } from '../models/patient';

declare var $: any;

@Component({
  selector: 'users',
  templateUrl: 'app/components/users.component.html'
})
export class Users {
  private model = { 'searchUser': '' };
  private newUserData = { 'firstName': '', 'lastName': '', 'email': '', 'phoneNumber': '', 'jobTitle': '' };
  users: User[];
  showLoadingIcon: number = 0;
  teamLoadingIcon: number = 0;
  patientLoadingIcon: number = 0;
  showUserData: boolean = true;
  errorMessage: string;
  justCreatedUser: User = new User();
  justFollowedPatient: string;
  joinedTeam: string;
  selectedUser: User = new User();
  isCreatingUser: boolean = false;
  follower: string = '-';

  private teammodel = { 'searchTeams': '' };
  teams: Team[];
  onTeams: Team[];
  selectedTeam: Team = new Team();
  showTeams: boolean = true;

  private patientmodel = { 'searchPatients': '' };
  patients: Patient[];
  followedPatients: Patient[];
  showPatients: boolean = true;

  constructor(public _router: Router, private UserService: UserService, private TeamService: TeamService) { }

  ngAfterViewInit() {
    $('.patient-search').remove();
    $('.message-area').remove();
    $('#popupViewTeams_background').remove();
    $('#popupViewTeams_wrapper').remove();
    $('#popupViewPatients_background').remove();
    $('#popupViewPatients_wrapper').remove();

    $('.user-patients').bind('focus', function(){
        alert("The paragraph was clicked.");
    });

  }

  getUserDetails() {
    //Searches for users in database & shows info
    if (this.model.searchUser) {
      this.showLoadingIcon++;
      this.UserService.getUserByName(this.model.searchUser).subscribe(
        data => {
          // console.log("USER.COMPONENT:::getUserDetails:::" + JSON.stringify(data));
          if (this.showLoadingIcon > 0) {
            this.showLoadingIcon--;
          }

          if (this.showLoadingIcon == 0 && this.model.searchUser) {
            this.users = data;

            if (this.users.length > 0) {
              $('.user-results').addClass('hidden');
            } else {
              $('.user-results').removeClass('hidden');
            }

            this.showUserData = true;
          }

        },
        error => {
          console.log("USER.COMPONENT:::getUserDetails:::" + error);
          this.showUserData = false;
          if (error.indexOf("token is invalid") !== -1) {
            this.errorMessage = "Session invalidated as you have logged into another browser/computer. Please login again to continue..";
          } else {
            this.errorMessage = "Server temporarily unavailable. Please try again later.";
          }
          this.showLoadingIcon--;
        }
      )
    }
    else {
      this.users = null;
      this.showLoadingIcon = 0;
    }
  }

  viewPatients(user) {
    this.patients = [];
    this.followedPatients = [];
    this.patientLoadingIcon = 1;
    this.justCreatedUser = user;
    $('#popupViewPatients').popup({
      opacity: 0.7,
      transition: 'all 0.3s',
    }).popup('show');
    this.getFollowedPatientsNames();
  }

  createdUser(user) {
    this.justCreatedUser = user;
    $('#popupSuccessUser').popup({
      opacity: 0.7,
      transition: 'all 0.3s',
    }).popup('show');
  }

  viewTeams(user: User) {
    this.selectedUser = user;
    $('#popupViewTeams').popup({
      opacity: 0.7,
      transition: 'all 0.3s',
    }).popup('show');
    this.getTeamImOn();
  }

  close() {
    $('#searchTeams, #viewPatients').val('');
  }

  addUserToTeam(teamId, teamName) {
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
    }
    this.UserService.addUser(teamJSON).subscribe(
      data => {
        this.joinedTeam = teamJSON.team[0].teamName;
        teamJSON = null;
        this.teammodel.searchTeams = null;
        this.showTeams = false;
        this.closeThisPop('#popupViewTeams');
        this.joinTeamSuccess();
      },
      error => {
        this.showUserData = false;
        if (error.indexOf("token is invalid") !== -1) {
          this.errorMessage = "Session invalidated as you have logged into another browser/computer. Please login again to continue..";
        } else {
          this.errorMessage = "Server temporarily unavailable. Please try again later.";
        }
      }
    )
  }

  removeUserFromTeam(selectedUser, team, index, numofTeams) {
    let i;
    for (i = 0; i <= (numofTeams - 1); i++ ) {
      $('.user-team' + i).attr('disabled', 'disabled');  
    }

    // This removes user from team
    $('.user-team' + index).html('<img src="resources/static/icons/loading_ring_small.svg" />');
    var removeUserModel = { 'emailAddress': this.selectedUser.emailAddress, 'team': [{ "teamId": selectedUser.teamId, "teamName": team.teamName }] };
    this.isCreatingUser = true;
    this.TeamService.leaveTeam(removeUserModel).subscribe(
      data => {
        this.isCreatingUser = false;
        this.getTeamImOn();
      },
      error => {
        this.showUserData = false;
        if (error.indexOf("token is invalid") !== -1) {
          this.errorMessage = "Session invalidated as you have logged into another browser/computer. Please login again to continue..";
        } else {
          this.errorMessage = "Server temporarily unavailable. Please try again later.";
        }
      }
    )
  }

  deleteUser(user: User) {
    alert("Delete user coming soon...");
  }

  followPatientSuccess() {
    $('#popupFollowPatient').popup({
      opacity: 0.7
    }).popup('show');
  }

  joinTeamSuccess() {
    $('#popupJoinTeam').popup({
      opacity: 0.7
    }).popup('show');
  }

  followPatient() {
    this.patients = [];
    this.closeThisPop('#popupSuccessUser');
    this.closeThisPop('#popupFollowPatient');
    this.viewPatients(this.justCreatedUser);
  }

  joinTeam() {
    this.closeThisPop('#popupJoinTeam');
    this.viewTeams(this.selectedUser);
  }

  createUser() {
    this.clearFields();
    $('#popupCreateUser').popup({
      opacity: 0.7
    }).popup('show');
  }

  onCreateUser() {
    this.isCreatingUser = true;
    this.UserService.createUser(this.newUserData).subscribe(
      data => {

        if (data != null && data.userid != null) {

          this.isCreatingUser = false;
          this.closePop();

          this.justCreatedUser.userid = data.userid;
          this.justCreatedUser.username = this.newUserData.firstName + " " + this.newUserData.lastName;
          this.justCreatedUser.emailAddress = this.newUserData.email;
          this.justCreatedUser.jobTitle = this.newUserData.jobTitle;
          this.justCreatedUser.phoneNumber = this.newUserData.phoneNumber;
          this.createdUser(this.justCreatedUser);
          this.newUserData.firstName = null;
          this.newUserData.lastName = null;
          this.newUserData.email = null;
          this.newUserData.jobTitle = null;
          this.newUserData.phoneNumber = null;
        }
        else {
          this.isCreatingUser = false;
          console.log(data.message);
        }
      },
      error => {
        this.isCreatingUser = false;
        $('.errorCreateUser').show();
        this.errorMessage = error;
        $('.popup-create-user').css('height', '415px').css('width', '420px');
      }
    );
  }

  clearFields() {
    this.newUserData.email = null;
    $('.popup-create-user').css('height', '415px').css('width', '420px');
    $('#firstName, #lastName, #phoneNumber, #email, #jobTitle').val('');
    $('.errorCreateUser').hide();
    $('#btn-create-user').attr('disabled', 'disabled');
  }

  closeThisPop(popItem) {
    $(popItem).popup({

    }).popup('hide');
  }


  closePop() {
    $('#popupCreateUser').popup({
    }).popup('hide');
  }

  getTeamDetails() {
    //Searches for teams in database & shows them
    let filterData = [];

    if (this.teammodel.searchTeams) {
      console.log("USER.COMPONENT:::getTeamDetails:::" + this.teammodel.searchTeams);

      this.TeamService.getTeamByName(this.teammodel.searchTeams).subscribe(
        data => {

          if (this.teammodel.searchTeams) {
            let i;
            let n;

            for (i = 0; i < data.length; i++) {
              let teamId = null;
              for (n = 0; n < this.onTeams.length; n++) {
                if (data[i].teamid !== this.onTeams[n].teamid) {
                  teamId = data[i].teamid;
                } else {
                  teamId = 0;
                  break;
                }
              }
              if (teamId > 0 || teamId == null) {
                filterData.push(data[i]);
              }
            }

            this.teams = filterData;
            this.showTeams = true;
          }
        },
        error => {
          console.log("USER.COMPONENT:::getTeamDetails:::" + error);
          this.showTeams = false;
        }
      )
    }
    else {
      this.teams = null;
    }
  }
  getTeamImOn() {
    this.onTeams = [];
    this.teams = [];
    this.teamLoadingIcon = 1;
    if (this.selectedUser.emailAddress) {
      console.log("TEAM.COMPONENT:::getTeamImOn:::" + this.selectedUser.emailAddress);

      this.TeamService.getTeamNamesImOn(this.selectedUser.emailAddress).subscribe(
        data => {

          this.onTeams = data;
          console.log(data);
          this.teamLoadingIcon = 0;
          this.showTeams = true;
        },
        error => {
          console.log("TEAM.COMPONENT:::getTeamImOn:::" + error);
          this.showTeams = false;
          this.teamLoadingIcon = 0;
        }
      )
    }
    else {
      this.onTeams = null;
    }
  }

  getPatientNames() {
    let filterData = [];

    if (this.patientmodel.searchPatients) {
      this.UserService.searchPatients(this.patientmodel.searchPatients).subscribe(
        data => {
          if (this.patientmodel.searchPatients) {

            let i;
            let n;
            for (i = 0; i < data.length; i++) {
              let patientId = null;
              for (n = 0; n < this.followedPatients.length; n++) {
                if (data[i].patientid !== this.followedPatients[n].patientid) {
                  patientId = data[i].patientid;
                } else {
                  patientId = 0;
                  break;
                }
              }
              if (patientId !== 0 || patientId == null) {
                filterData.push(data[i]);
              }
            }

            this.patients = filterData;
            this.showPatients = true;
          }
        },
        error => {
          console.log("USER.COMPONENT:::getPatientNames:::" + error);
          this.showPatients = false;

        }
      )
    }
    else {
      this.patients = null;

    }
  }
  getFollowedPatientsNames() {
    //Shows followed patients of user
    if (this.justCreatedUser.emailAddress) {
      console.log("USER.COMPONENT:::getPatientNames:::" + this.justCreatedUser.emailAddress);

      this.UserService.getPatientsForUser(this.justCreatedUser.emailAddress).subscribe(
        data => {
          this.followedPatients = data;
          this.patientLoadingIcon = 0;
          console.log(data);
          this.showPatients = true;
        },
        error => {
          console.log("USER.COMPONENT:::getPatientNames:::" + error);
          this.patientLoadingIcon = 0;
          this.showPatients = false;
        }
      )
    }
    else {
      this.followedPatients = null;
    }
  }

  goFollowPatient(patient, follower) {
    //Action that makes user follow a specific patient
    this.justFollowedPatient = patient.firstName + ' ' + patient.lastName;

    var followPatientModel = { 'emailAddress': this.justCreatedUser.emailAddress, 'patient': [{ "mrn": patient.mrn }] };
    this.UserService.followPatients(followPatientModel).subscribe(
      data => {
        //make patients results go empty following patient
        patient = null;
        this.patientmodel.searchPatients = null;
        this.showPatients = false;
        this.closeThisPop('#popupViewPatients');
        this.followPatientSuccess();
      },
      error => {
        console.log("USER.COMPONENT:::viewPatients:::error:::" + error);
        this.showPatients = false;
        if (error.indexOf("token is invalid") !== -1) {
          this.errorMessage = "Session invalidated as you have logged into another browser/computer. Please login again to continue..";
        } else {
          this.errorMessage = "Server temporarily unavailable. Please try again later.";
        }
      }
    )
  }

  goUnfollowPatient(followedPatient, index, numofpatients) {
    console.log(numofpatients);
    let i;
    for (i = 0; i <= (numofpatients - 1); i++ ) {
      $('.user-patients' + i).attr('disabled', 'disabled');
    }

    //Action that makes user unfollow a specific patient    
    $('.user-patients'+ index).html('<img src="resources/static/icons/loading_ring_small.svg" />');
    var unfollowPatientModel = { 'emailAddress': this.justCreatedUser.emailAddress, 'patient': [{ "patientid": followedPatient.patientid, "mrn": followedPatient.mrn }] };
    this.isCreatingUser = true;
    this.UserService.unfollowPatients(unfollowPatientModel).subscribe(
      data => {
        this.isCreatingUser = false;
        this.getFollowedPatientsNames();
      },
      error => {
        console.log("USER.COMPONENT:::viewPatients:::error:::" + error);
        this.showPatients = false;
        if (error.indexOf("token is invalid") !== -1) {
          this.errorMessage = "Session invalidated as you have logged into another browser/computer. Please login again to continue..";
        } else {
          this.errorMessage = "Server temporarily unavailable. Please try again later.";
        }
      }
    )
  }
}
