import { Component } from 'angular2/core';
import { Validators } from 'angular2/common';
import { Router } from 'angular2/router';

import { Users } from '../components/users.component';

import { UserService } from '../services/user.service';
import { TeamService } from '../services/team.service';

import { User } from '../models/user';
import { Team } from '../models/team';
import { Patient } from '../models/patient';

declare var $: any;

@Component({
  selector: 'teams',
  templateUrl: 'app/components/teams.component.html'
})

export class Teams {

  private teammodel = { 'searchTeams': '' };
  private model = { 'searchUser': '' };
  teams: Team[];
  onTeams: Team[];
  selectedTeam: Team = new Team();
  selectedUser: User = new User();
  showTeams: boolean = true;
  isRemovingingUser: boolean = false;
  isShowingTeam: boolean = true;
  showUserData: boolean = true;
  errorMessage: string;
  showLoadingIcon: number = 0;
  memberLoadingIcon: number = 0;
  joinedTeam: string;
  leftTeam: string;

  loggedUser: string = sessionStorage.getItem("loggedInUser.emailAddress");
  loggedUsername: string = sessionStorage.getItem("loggedInUser.username");
  loggedLastName: string =  sessionStorage.getItem("loggedInUser.lastName");

  users: User[];
  patients: Patient[];

  constructor(public _router: Router, private UserService: UserService, private TeamService: TeamService) { }

  ngAfterViewInit() {
    $('.patient-search').remove();
    $('.message-area').remove();
    $('#popupviewMembers_background').remove();
    $('#popupviewMembers_wrapper').remove();
    $('#popupaddMembers_background').remove();
    $('#popupaddMembers_wrapper').remove();
    $('#popupLeaveTeam_background').remove();
    $('#popupLeaveTeam_wrapper').remove();

    let self = this;

    this.getUserTeams();

    $('#fld-user-search').bind('input propertychange', function () {
      setTimeout(
        function () {
          if ($('#fld-user-search').val() == '') {
            self.getUserDetails();
          }
        }, 100
      );
    });

    $('#fld-team-search').bind('input propertychange', function () {
      setTimeout(
        function () {
          if ($('#fld-team-search').val() == '') {
            self.getUserTeams();
          }
        }, 100
      );
    });    
  }

  getTeamDetails() {
    $('.team-results').addClass('hidden');
    //Searches for teams in database & shows them
    if (this.teammodel.searchTeams) {
      console.log("USER.COMPONENT:::getTeamDetails:::" + this.teammodel.searchTeams);
      this.showLoadingIcon++;
      this.TeamService.getTeamByName(this.teammodel.searchTeams).subscribe(
        data => {
          if (this.showLoadingIcon > 0) {
            this.showLoadingIcon--;
          }
          if (this.showLoadingIcon == 0 && this.teammodel.searchTeams) {
            this.teams = data;

            if (this.teams.length > 0) {
              $('.team-results').addClass('hidden');
            } else {
              $('.team-results').removeClass('hidden');
            }

            this.showTeams = true;
          }
        },
        error => {
          console.log("USER.COMPONENT:::getTeamDetails:::" + error);
          this.showTeams = false;
          this.showLoadingIcon--;
          this.showLoadingIcon = 0;
        }
      )
    }
  }

  getUserTeams() {
      this.TeamService.getTeamNamesImOn(sessionStorage.getItem("loggedInUser.emailAddress")).subscribe(
        data => {
          this.teams = data;
          this.isShowingTeam = false;
        },
        error => {
          console.log("USER.COMPONENT:::getUserTeams:::" + error);
          this.isShowingTeam = false;
        }
      )
  }

  removeUserFromTeam(team, user, index, numofTeams) {
    // This removes user from team
    let i;
    for (i = 0; i <= (numofTeams - 1); i++ ) {
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
    this.TeamService.leaveTeam(removeUserModel).subscribe(
      data => {
        this.onTeams = data;
        this.isRemovingingUser = false;
        this.viewMembers(team.teamName, team.teamid, user.username, user.email);
      },
      error => {
        console.log(error);
        this.showTeams = false;
      }
    );
  }

  userLeaveTeam(team) {
    var removeUserModel = {
      'emailAddress': sessionStorage.getItem("loggedInUser.emailAddress"),
      'username': sessionStorage.getItem("loggedInUser.username"),
      'lastName': sessionStorage.getItem("loggedInUser.lastName"),
      'team': [{ "teamId": team.teamid, "teamName": team.teamName }]
    };

    this.leftTeam = team.teamName;

    this.TeamService.leaveTeam(removeUserModel).subscribe(
      data => {
        this.leaveTeamSuccess();
      },
      error => {
        console.log(error);
      }
    );        
  }

  getTeamMembers(selectedTeam, teamid) {
    this.selectedTeam.teamName = selectedTeam;
    this.selectedTeam.teamid = teamid;

    //function to Users patients of selected team
    if (this.showTeams) {
      console.log("TEAM.COMPONENT:::getTeamImOn:::" + selectedTeam);
      this.TeamService.getTeamMembersNames(selectedTeam).subscribe(
        data => {

          this.onTeams = data;
          console.log(data);
          this.memberLoadingIcon = 0;
          this.showTeams = true;
        },
        error => {
          console.log("TEAM.COMPONENT:::getTeamImOn:::" + error);
          this.showTeams = false;
          this.memberLoadingIcon = 0;
        }
      )
    }
    else {
      this.onTeams = null;
    }
  }

  getTeamPatients(selectedTeam) {
    //function to show patients of selected team
    if (this.showTeams) {
      console.log("TEAM.COMPONENT:::getPatientsFromTeam:::" + selectedTeam);
      this.showTeams = false;
      this.TeamService.getTeamPatientsNames(selectedTeam).subscribe(
        data => {

          this.onTeams = data;
          console.log(data);
          this.memberLoadingIcon = 0;
          this.showTeams = true;
        },
        error => {
          console.log("TEAM.COMPONENT:::getPatientsFromTeam:::" + error);
          this.showTeams = false;
          this.memberLoadingIcon = 0;
        }
      )
    }
    else {
      this.onTeams = null;
    }
  }

  viewMembers(teamName, teamid, username, email) {
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
  }


  closeSuccessMessage() {
    this.closeThisPop('#popupJoinTeam');
    this.users = [];
    $('#fld-user-search').val('');
  }

  closeLeaveTeam() {
    this.closeThisPop('#popupLeaveTeam');
    this.getUserTeams();
  }

  backToTeamMembers() {
    this.users = [];
    $('#fld-user-search').val('');
    this.closeThisPop('#popupaddMembers');
    $('#popupviewMembers').popup({
    }).popup('show');
  }

  close() {
    this.onTeams = [];
    this.users = []
    $('#fld-user-search').val('');
  }

  closeThisPop(popItem) {
    $(popItem).popup({

    }).popup('hide');
  }

  addMember() {
    this.closeThisPop('#popupviewMembers');

    $('#popupaddMembers').popup({
      opacity: 0.7,
      transition: 'all 0.3s',
    }).popup('show');
  }
  getUserDetails() {
    //Searches for users in database & shows info
    $('.add-member-results').addClass('hidden');
    this.users = [];
    let filterData = [];
    let self = this;

    if (this.model.searchUser) {
      console.log("USER.COMPONENT:::getUserDetails:::" + this.model.searchUser);
      this.memberLoadingIcon++;
      this.UserService.getUserByName(this.model.searchUser).subscribe(
        data => {
          let i;
          let n;

          for (i = 0; i < data.length; i++) {
            let userid = null;
            for (n = 0; n < this.onTeams.length; n++) {
              if (data[i].userid !== this.onTeams[n].userid) {
                userid = data[i].userid;
              } else {
                userid = 0;
                break;
              }
            }
            if (userid > 0 || userid == null) {
              filterData.push(data[i]);
            }
          }

          this.users = filterData;
          this.memberLoadingIcon = 0;

          if (filterData.length == 0) {
            $('.add-member-results').removeClass('hidden');
            this.memberLoadingIcon = 0;
          } else {
            $('.add-member-results').addClass('hidden');
          }


          console.log(this.users);
          this.showUserData = true;
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
      this.users = [];
      this.showLoadingIcon = 0;
    }
  }


  viewPatients(teamName) {
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
  }

  addUserToTeam(teamId, teamName, username, email, lastName) {
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
    }
    this.UserService.addUser(teamJSON).subscribe(
      data => {
        //make teams results go null after joining a team
        this.joinedTeam = teamJSON.team[0].teamName;
        teamJSON = null;
        this.teammodel.searchTeams = null;
        // this.showTeams = false;
        this.closeThisPop('#popupaddMembers');
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

  joinTeamSuccess() {
    $('#popupJoinTeam').popup({
      opacity: 0.7
    }).popup('show');
  }

  leaveTeamSuccess() {
    $('#popupLeaveTeam').popup({
      opacity: 0.7
    }).popup('show');
  }  

}
