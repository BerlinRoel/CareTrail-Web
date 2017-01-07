import { Team } from '../models/team';
import { Patient } from '../models/patient';
import { Injectable } from 'angular2/core';
import { Observable } from 'rxjs/Rx';
import { Http, Headers, Response, RequestOptions } from 'angular2/http';
import Global = require('../utils/global.util');

@Injectable()
export class TeamService {
  constructor(private http: Http) { }

  getTeamByName(TeamName: string) {
    let endpointUrl = Global.CARETRAIL_ENDPOINT + '/team/getTeamByName/' + TeamName;
    let header = new Headers({
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      'Authorization': sessionStorage.getItem("bearerToken"),
      'From': sessionStorage.getItem("emailAddress")
    });
    return this.http.get(endpointUrl, { headers: header }).map(this.extractData).catch(this.handleError);
  }

  leaveTeam(removeUserModel) {
    let endpointUrl = Global.CARETRAIL_ENDPOINT + 'people/leaveTeam';
    let header = new Headers({
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      'Authorization': sessionStorage.getItem("bearerToken"),
      'From': sessionStorage.getItem("emailAddress")
    });
    let options = new RequestOptions({ headers: header, method: "post" });
    console.log("TEAM.SERVICE:::leaveTeam:::" + JSON.stringify(removeUserModel));
    return this.http.post(endpointUrl, JSON.stringify(removeUserModel), options).catch(this.handleError);
  }
  getTeamNamesImOn(userEmailAddress: string) {
    let endpointUrl = Global.CARETRAIL_ENDPOINT + 'people/myTeams/' + userEmailAddress + '/';
    let header = new Headers({
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      'Authorization': sessionStorage.getItem("bearerToken"),
      'From': sessionStorage.getItem("emailAddress")
    });
    return this.http.get(endpointUrl, { headers: header }).map(this.extractData).catch(this.handleError);
  }
  getTeamMembersNames(teamName: string) {
    let endpointUrl = Global.CARETRAIL_ENDPOINT + '/team/getMembers/' + teamName;
    let header = new Headers({
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      'Authorization': sessionStorage.getItem("bearerToken"),
      'From': sessionStorage.getItem("emailAddress")
    });
    return this.http.get(endpointUrl, { headers: header }).map(this.extractData).catch(this.handleError);
  }
  getTeamPatientsNames(teamName: string) {
    let endpointUrl = Global.CARETRAIL_ENDPOINT + '/team/getPatients/' + teamName;
    let header = new Headers({
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      'Authorization': sessionStorage.getItem("bearerToken"),
      'From': sessionStorage.getItem("emailAddress")
    });
    return this.http.get(endpointUrl, { headers: header }).map(this.extractData).catch(this.handleError);
  }

  private extractData(res: Response) {
    let body = res.json();
    //console.log(res.json()+":::::"+JSON.stringify(res.json()));
    return body || {};
  }

  private handleError(error: any) {
    let errMsg = (error.message) ? error.message :
      error.status ? `${error.status} - ${error.statusText}` : 'Server error';
    //console.log("TEAM.SERVICE:::handleError:::"+ errMsg); // log to console instead
    return Observable.throw(errMsg);
  }
}
