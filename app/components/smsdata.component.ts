import {Component, OnInit, HostListener} from 'angular2/core';
import {Router} from 'angular2/router';
import {UserService} from '../services/user.service';
import {SMSService} from '../services/sms.service';
import {SharedData} from '../utils/shared.data';
import {User} from '../models/user';
import {Patient} from '../models/patient';
import {Timeline} from '../models/timeline';

declare var $: any;

@Component({
  selector: 'smsdata',
  templateUrl: 'app/components/smsdata.component.html'
})

export class SMSData {
  private model = { 'invitationCode': '', 'lastName': '', 'timelineMessage': '', 'signupFirstName': '', 'signupLastName': '', 'signupEmail': '' };
  invCodeFocus: boolean = false;
  lastNameFocus: boolean = false;
  invCodeError: boolean = false;
  lastNameError: boolean = false;
  authorizationErrors: string = '';
  validatingCode: boolean = false;
  validCodeEntered: boolean = false;
  phoneNumber: string = '';

  patients: Patient[];
  selectedPatient: Patient;
  selectedTab: string = '';

  timelineError: string = '';
  timelineLoading: boolean = false;
  timelineItems: Timeline[];
  postToTimelineError: boolean = false;
  submittingToTimeline: boolean = false;

  followersError: string = '';
  followersLoading: boolean = false;
  followers: User[];

  onCallFollowersError: string = '';
  onCallFollowersLoading: boolean = false;
  onCallFollowers: User[];

  signingUp: boolean = false;
  signupFirstNameError: boolean = false;
  signupLastNameError: boolean = false;
  signupEmailError: boolean = false;
  registrationSuccessful: boolean = false;

  constructor(public _router: Router, private UserService: UserService, private SMSService: SMSService, private sharedData: SharedData) {
  }

  @HostListener('window:unload', ['$event'])
  unloadHandler(event) {
    sessionStorage.clear();
  }

  ngAfterViewInit() {
    // jQuery here
  }

  ClearInvCodeErrors() {
    this.invCodeError = false;
  }

  ClearLastNameErrors() {
    this.lastNameError = false;
  }

  SubmitAuthorization() {
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

    this.SMSService.validateSMSCode(this.model.invitationCode, this.model.lastName).subscribe(
      data => {
        console.log("SMSDATA.COMPONENT:::validateSMSCode:::", data);

        //TODO: We should use data.userDetails.emailAddress for the endpoint below, but the data isn't being returned yet
        var email = this.model.invitationCode + "@caretrail.io";

        this.model.signupFirstName = data.userDetails.userName;
        this.phoneNumber = data.userDetails.phoneNumber;

        var fullName = data.userDetails.userName;
        if (data.userDetails.lastName != null) {
          fullName += " " + data.userDetails.lastName;

          this.model.signupLastName = data.userDetails.lastName;
        }

        // Code validated, so let's write to the session
        sessionStorage.setItem("smsUser", "true");
        sessionStorage.setItem("bearerToken", data.accessToken);
        sessionStorage.setItem("currentUserName", fullName);
        sessionStorage.setItem("emailAddress", email);

        // Load patient data
        this.UserService.getPatientsForUser(email).subscribe(
          data => {
            console.log("SMSDATA.COMPONENT:::getPatientsForUser:::", data);
            if (data.length > 0) {
              this.patients = data;
              // Pick the last patient as the currently selected patient
              this.selectedPatient = this.patients[data.length - 1];
              this.SetTab("timeline");

              this.validatingCode = false;
              this.validCodeEntered = true;
            }
            else {
              //TODO: No patients are followed by this user. Let user know.

              this.validatingCode = false;
              this.validCodeEntered = true;
            }
          },
          error => {
            console.log("SMSDATA.COMPONENT:::getPatientsForUser:::" + error);
            //TODO: Show error

            this.validatingCode = false;
            this.validCodeEntered = true;
          }
        );
      },
      error => {
        console.log("SMSDATA.COMPONENT:::validateSMSCode:::" + error);
        this.authorizationErrors = "Invalid invitation code or last name. Please check your SMS message and try again.";
        this.validatingCode = false;
      }
    )
  }

  SetTab(tabName) {
    this.selectedTab = tabName;

    if (tabName == "timeline") {
      this.timelineLoading = true;
      this.timelineError = "";
      this.UserService.getPatientTimeline(this.selectedPatient.mrn, 0).subscribe(
        data => {
          console.log("SMSDATA.COMPONENT:::getPatientTimeline:::", data);
          this.timelineItems = data;
          this.timelineLoading = false;
        },
        error => {
          console.log("SMSDATA.COMPONENT:::getPatientTimeline:::" + error);
          this.timelineError = error;
          this.timelineLoading = false;
        }
      )
    }
    else if (tabName == "followers") {
      this.followersLoading = true;
      this.followersError = "";
      this.UserService.getPatientFollowers(this.selectedPatient.mrn).subscribe(
        data => {
          console.log("SMSDATA.COMPONENT:::getPatientFollowers:::", data);
          this.followers = data;
          this.followersLoading = false;
        },
        error => {
          console.log("SMSDATA.COMPONENT:::getPatientFollowers:::" + error);
          this.followersError = error;
          this.followersLoading = false;
        }
      )
    }
    else if (tabName == "oncall") {
      this.onCallFollowersLoading = true;
      this.onCallFollowersError = "";
      this.UserService.getPatientOnCallFollowers(this.selectedPatient.patientid).subscribe(
        data => {
          console.log("SMSDATA.COMPONENT:::getPatientOnCallFollowers:::", data);

          var onCallUsers: User[] = new Array();
          if (data != null && data.onCallUsersMap != null && data.onCallUsersMap.Day != null && data.onCallUsersMap.Day.length > 0) {
            for (var i = 0; i < data.onCallUsersMap.Day.length; i++) {
              var onCallData = data.onCallUsersMap.Day[i];
              if (onCallData.onCallUser != null) {
                onCallUsers.push(onCallData.onCallUser);
              }
            }

            this.onCallFollowers = onCallUsers;
          }
          this.onCallFollowersLoading = false;
        },
        error => {
          console.log("SMSDATA.COMPONENT:::getPatientOnCallFollowers:::" + error);
          this.onCallFollowersError = error;
          this.onCallFollowersLoading = false;
        }
      )
    }
  }

  SubmitToTimeline() {
    this.submittingToTimeline = true;
    this.postToTimelineError = false;
    if (this.model.timelineMessage == '') {
      this.postToTimelineError = true;
      this.submittingToTimeline = false;
      return;
    }

    var email = this.model.invitationCode + "@caretrail.io";

    this.UserService.postToPatientTimeline(this.model.timelineMessage, this.selectedPatient.mrn, email).subscribe(
      data => {
        console.log("SMSDATA.COMPONENT:::postToPatientTimeline:::", data);
        this.submittingToTimeline = false;
        this.model.timelineMessage = '';
        this.SetTab("timeline");
      },
      error => {
        console.log("SMSDATA.COMPONENT:::postToPatientTimeline:::" + error);
        this.submittingToTimeline = false;
        alert("Something went wrong. Please try again! Error: " + error);
      }
    );

    //TODO: Submit message and refresh 
    // SetTab("timeline");
    // this.submittingToTimeline = false;
  }

  Signup() {
    this.signingUp = true;
    this.signupFirstNameError = false;
    this.signupLastNameError = false;
    this.signupEmailError = false;
    var hasError: boolean = false;

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
      this.UserService.registerUserBySMS(this.model.signupFirstName, this.model.signupLastName, this.model.signupEmail, this.phoneNumber).subscribe(
        data => {
          console.log("SMSDATA.COMPONENT:::registerUserBySMS:::", data);
          this.signingUp = false;
          this.FlipRegistrationCard();
        },
        error => {
          console.log("SMSDATA.COMPONENT:::registerUserBySMS:::" + error);
          this.signingUp = false;
          alert("Something went wrong. Please try again! Error: " + error);
        }
      );
    }
    else {
      this.UserService.registerUser(this.model.signupFirstName, this.model.signupLastName, this.model.signupEmail).subscribe(
        data => {
          console.log("SMSDATA.COMPONENT:::registerUser:::", data);
          this.signingUp = false;
          this.FlipRegistrationCard();
        },
        error => {
          console.log("SMSDATA.COMPONENT:::registerUser:::" + error);
          this.signingUp = false;
          alert("Something went wrong. Please try again! Error: " + error);
        }
      );
    }
  }

  FlipRegistrationCard() {
    this.registrationSuccessful = true;
  }
}