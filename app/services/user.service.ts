import { User } from '../models/user';
import { Patient } from '../models/patient';
import { Injectable } from 'angular2/core';
import { Observable } from 'rxjs/Rx';
import { Http, Headers, Response, RequestOptions } from 'angular2/http';
import Global = require('../utils/global.util');

declare var moment: any;

@Injectable()
export class UserService {
  constructor(private http: Http) { }

  getUserByName(searchName: string) {
    let endpointUrl = Global.CARETRAIL_ENDPOINT + 'people/searchInCareTrail?userid=' + searchName;
    let header = new Headers({
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      'Authorization': sessionStorage.getItem("bearerToken"),
      'From': sessionStorage.getItem("emailAddress")
    });
    return this.http.get(endpointUrl, { headers: header }).map(this.extractData).catch(this.handleError);
  }

  getOnCallScheduleForMonth(date: Date) {
    var requestData = {
      "startDate": moment(date).format("MM/DD/YYYY:00:01")
    }

    let endpointUrl = Global.CARETRAIL_ENDPOINT + 'oncall/getOnCallSchedule/Month';
    let header = new Headers({
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      'Authorization': sessionStorage.getItem("bearerToken"),
      'From': sessionStorage.getItem("emailAddress")
    });

    let options = new RequestOptions({ headers: header, method: "post" });
    console.log("USER.SERVICE:::getOnCallScheduleForMonth:::" + JSON.stringify(requestData));

    return this.http.post(endpointUrl, JSON.stringify(requestData), options)
      .map(this.extractData)
      .catch(this.handleError);
  }

  getOnCallScheduleForMonthAndUser(userId: string, date: Date) {
    var requestData = {
      "startDate": moment(date).format("MM/DD/YYYY:00:01")
    }

    let endpointUrl = Global.CARETRAIL_ENDPOINT + 'oncall/getOnCallSchedule/Month/' + userId;
    let header = new Headers({
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      'Authorization': sessionStorage.getItem("bearerToken"),
      'From': sessionStorage.getItem("emailAddress")
    });

    let options = new RequestOptions({ headers: header, method: "post" });
    console.log("USER.SERVICE:::getOnCallScheduleForMonthAndUser:::" + userId + ":::" + JSON.stringify(requestData));

    return this.http.post(endpointUrl, JSON.stringify(requestData), options)
      .map(this.extractData)
      .catch(this.handleError);
  }

  getOnCallScheduleForDay(date: Date) {
    var requestData = {
      "startDate": moment(date).format("MM/DD/YYYY:00:01")
    }

    let endpointUrl = Global.CARETRAIL_ENDPOINT + 'oncall/getOnCallSchedule/Day';
    let header = new Headers({
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      'Authorization': sessionStorage.getItem("bearerToken"),
      'From': sessionStorage.getItem("emailAddress")
    });

    let options = new RequestOptions({ headers: header, method: "post" });
    console.log("USER.SERVICE:::getOnCallScheduleForDay:::" + JSON.stringify(requestData));

    return this.http.post(endpointUrl, JSON.stringify(requestData), options)
      .map(this.extractData)
      .catch(this.handleError);
  }

  getOnCallScheduleForDayAndUser(userId: string, date: Date) {
    var requestData = {
      "startDate": moment(date).format("MM/DD/YYYY:00:01")
    }

    let endpointUrl = Global.CARETRAIL_ENDPOINT + 'oncall/getOnCallSchedule/Day/' + userId;
    let header = new Headers({
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      'Authorization': sessionStorage.getItem("bearerToken"),
      'From': sessionStorage.getItem("emailAddress")
    });

    let options = new RequestOptions({ headers: header, method: "post" });
    console.log("USER.SERVICE:::getOnCallScheduleForDayAndUser:::" + userId + ":::" + JSON.stringify(requestData));

    return this.http.post(endpointUrl, JSON.stringify(requestData), options)
      .map(this.extractData)
      .catch(this.handleError);
  }

  addUserOnCall(startDate: Date, endDate: Date, onCallEmail: string, offEmail: string) {
    var requestData = {
      'startDate': moment(startDate).format("MM/DD/YYYY:HH:mm"),
      'endDate': moment(endDate).format("MM/DD/YYYY:HH:mm"),
      'onCallUser': {
        'emailAddress': onCallEmail
      },
      'backupForUser': {
        'emailAddress': offEmail
      }
    }

    let endpointUrl = Global.CARETRAIL_ENDPOINT + 'oncall/create';
    let header = new Headers({
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      'Authorization': sessionStorage.getItem("bearerToken"),
      'From': sessionStorage.getItem("emailAddress")
    });

    let options = new RequestOptions({ headers: header, method: "post" });
    console.log("USER.SERVICE:::addUserOnCall:::" + JSON.stringify(requestData));

    // Returns 201 with no body
    return this.http.post(endpointUrl, JSON.stringify(requestData), options)
      .catch(this.handleError);
  }

  removeUserOnCall(onCallId) {
    let endpointUrl = Global.CARETRAIL_ENDPOINT + 'oncall/delete/' + onCallId;
    let header = new Headers({
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      'Authorization': sessionStorage.getItem("bearerToken"),
      'From': sessionStorage.getItem("emailAddress")
    });

    let options = new RequestOptions({ headers: header, method: "post" });

    // Returns 201 with no body
    return this.http.post(endpointUrl, "", options)
      .catch(this.handleError);
  }

  createUser(justCreatedUser: {}) {
    let endpointUrl = Global.CARETRAIL_ENDPOINT + 'registration/user/registration';
    let header = new Headers({
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      'Authorization': sessionStorage.getItem("bearerToken"),
      'From': sessionStorage.getItem("emailAddress")
    });
    let options = new RequestOptions({ headers: header, method: "post" });
    console.log(" user created:::: " + JSON.stringify(justCreatedUser));
    return this.http.post(endpointUrl, JSON.stringify(justCreatedUser), options).map(this.extractData).catch(this.handleError);
  }

  addUser(teamJSON) {
    let endpointUrl = Global.CARETRAIL_ENDPOINT + 'people/joinTeam';
    let header = new Headers({
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      'Authorization': sessionStorage.getItem("bearerToken"),
      'From': sessionStorage.getItem("emailAddress")
    });
    let options = new RequestOptions({ headers: header, method: "post" });
    console.log("USER.SERVICE:::addUser:::" + JSON.stringify(teamJSON));
    return this.http.post(endpointUrl, JSON.stringify(teamJSON), options).catch(this.handleError);
  }

  searchPatients(name: string) {
    let endpointUrl = Global.CARETRAIL_ENDPOINT + '/patient/getPatientByName/' + name;
    let header = new Headers({
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      'Authorization': sessionStorage.getItem("bearerToken"),
      'From': sessionStorage.getItem("emailAddress")
    });
    return this.http.get(endpointUrl, { headers: header }).map(this.extractData).catch(this.handleError);
  }

  followPatients(followPatientModel) {
    let endpointUrl = Global.CARETRAIL_ENDPOINT + '/people/followPatient';
    let header = new Headers({
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      'Authorization': sessionStorage.getItem("bearerToken"),
      'From': sessionStorage.getItem("emailAddress")
    });
    let options = new RequestOptions({ headers: header, method: "post" });
    console.log("USER.SERVICE:::patient followed:::" + JSON.stringify(followPatientModel));
    return this.http.post(endpointUrl, JSON.stringify(followPatientModel), options).map(this.extractData).catch(this.handleError)

  }

  unfollowPatients(unfollowPatientModel) {
    let endpointUrl = Global.CARETRAIL_ENDPOINT + '/people/unfollowPatient';
    let header = new Headers({
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      'Authorization': sessionStorage.getItem("bearerToken"),
      'From': sessionStorage.getItem("emailAddress")
    });
    let options = new RequestOptions({ headers: header, method: "post" });
    console.log("USER.SERVICE:::patient unfollowed:::" + JSON.stringify(unfollowPatientModel));
    return this.http.post(endpointUrl, JSON.stringify(unfollowPatientModel), options).map(this.extractData).catch(this.handleError);
  }

  getPatientsForUser(userEmailAddress: string) {
    let endpointUrl = Global.CARETRAIL_ENDPOINT + 'people/myPatients/' + userEmailAddress + '/';
    let header = new Headers({
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      'Authorization': sessionStorage.getItem("bearerToken"),
      'From': sessionStorage.getItem("emailAddress")
    });
    return this.http.get(endpointUrl, { headers: header }).map(this.extractData).catch(this.handleError);
  }

  getPatientTimeline(mrn, pageNum) {
    let endpointUrl = Global.CARETRAIL_ENDPOINT + 'patient/timeline/' + mrn + '/' + pageNum;
    let header = new Headers({
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      'Authorization': sessionStorage.getItem("bearerToken"),
      'From': sessionStorage.getItem("emailAddress")
    });
    return this.http.get(endpointUrl, { headers: header }).map(this.extractData).catch(this.handleError);
  }

  getPatientFollowers(mrn) {
    let endpointUrl = Global.CARETRAIL_ENDPOINT + 'patient/followers/' + mrn + '/';
    let header = new Headers({
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      'Authorization': sessionStorage.getItem("bearerToken"),
      'From': sessionStorage.getItem("emailAddress")
    });
    return this.http.get(endpointUrl, { headers: header }).map(this.extractData).catch(this.handleError);
  }

  getPatientOnCallFollowers(userID) {
    let endpointUrl = Global.CARETRAIL_ENDPOINT + 'oncall/getOnCallSchedule/patient/' + userID;
    let header = new Headers({
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      'Authorization': sessionStorage.getItem("bearerToken"),
      'From': sessionStorage.getItem("emailAddress")
    });
    return this.http.get(endpointUrl, { headers: header }).map(this.extractData).catch(this.handleError);
  }

  registerUser(firstName: string, lastName: string, email: string) {
    var jsonModel = {
      "firstName": firstName,
      "lastName": lastName,
      "email": email
    }

    let endpointUrl = Global.CARETRAIL_ENDPOINT + 'registration/user/registration';
    let header = new Headers({
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      'Authorization': sessionStorage.getItem("bearerToken"),
      'From': sessionStorage.getItem("emailAddress")
    });
    let options = new RequestOptions({ headers: header, method: "post" });
    console.log("USER.SERVICE:::registerUser:::" + JSON.stringify(jsonModel));
    return this.http.post(endpointUrl, JSON.stringify(jsonModel), options).map(this.extractData).catch(this.handleError);
  }

  registerUserBySMS(firstName: string, lastName: string, email: string, phoneNumber: string) {
    var jsonModel = {
      "firstName": firstName,
      "lastName": lastName,
      "email": email,
      "phoneNumber": phoneNumber
    }

    let endpointUrl = Global.CARETRAIL_ENDPOINT + 'registration/user/registrationBySMS';
    let header = new Headers({
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      'Authorization': sessionStorage.getItem("bearerToken"),
      'From': sessionStorage.getItem("emailAddress")
    });
    let options = new RequestOptions({ headers: header, method: "post" });
    console.log("USER.SERVICE:::registerUserBySMS:::" + JSON.stringify(jsonModel));
    return this.http.post(endpointUrl, JSON.stringify(jsonModel), options).map(this.extractData).catch(this.handleError);
  }

  postToPatientTimeline(message: string, patientMrn: string, fromUserEmail: string) {
    var jsonModel = {
      "messageType": "timeline",
      "message": message,
      "channelName": patientMrn,
      "fromUser": {
        "emailAddress": fromUserEmail
      }
    }

    let endpointUrl = Global.CARETRAIL_ENDPOINT + 'messages/sendMessage';
    let header = new Headers({
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      'Authorization': sessionStorage.getItem("bearerToken"),
      'From': sessionStorage.getItem("emailAddress")
    });
    let options = new RequestOptions({ headers: header, method: "post" });
    console.log("USER.SERVICE:::postToPatientTimeline:::" + JSON.stringify(jsonModel));
    return this.http.post(endpointUrl, JSON.stringify(jsonModel), options).catch(this.handleError);
  }

  resetPassword() {
    let endpointUrl = Global.CARETRAIL_ENDPOINT + 'registration/user/savePassword';
    var jsonModel = 
    {
      "email":"nprao04@gmail.com",
      "newPassword":"nilesh123"
    }

    let header = new Headers({
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      'Authorization' : 'Bearer cwt=AAEBHAEFAAAAAAAFFQAAAHsAXEbHxgEhNpSCuUzpBQCBEBONrz77G8VQgKkPR33-Gn-CApjsgyC1Wv6uXgFpqTOj7a5DE8stbaOOEFdP-tMO8S-na1m_6YYIVyVfso5w0wgNEICZY2jjhKJSpjrDqcajWYI',
      'From': 'statchat@hfhs.org'
    });

    let options = new RequestOptions({ headers: header, method: "post" });     
    return this.http.post(endpointUrl, JSON.stringify(jsonModel), options).catch(this.handleError);
  }

  private extractData(res: Response) {
    let body = res.json();
    return body || {};
  }

  private handleError(error: any) {
    let data = JSON.parse(error._body);
    let errMsg = (data.message) ? data.message :
      error.status ? `${error.status} - ${error.statusText}` : 'Server error';
    return Observable.throw(errMsg);
  }
}