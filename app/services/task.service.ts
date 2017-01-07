import { User } from '../models/user';
import { Patient } from '../models/patient';
import { Task } from '../models/task';
import { Injectable } from 'angular2/core';
import { Observable } from 'rxjs/Rx';
import { Http, Headers, Response, RequestOptions } from 'angular2/http';
import Global = require('../utils/global.util');

declare var moment: any;

@Injectable()
export class TaskService {
  constructor(private http: Http) { }

  getMyTask(email: string, page: number) {
    let endpointUrl = Global.CARETRAIL_ENDPOINT + '/people/myTask/' + email + '/' + page;
    let header = new Headers({
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      'Authorization': sessionStorage.getItem("bearerToken"),
      'From': sessionStorage.getItem("emailAddress")
    });
    return this.http.get(endpointUrl, { headers: header }).map(this.extractData).catch(this.handleError);
  }

  createTask(taskJSON) {
    let endpointUrl = Global.CARETRAIL_ENDPOINT + 'task/create';
    let header = new Headers({
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      'Authorization': sessionStorage.getItem("bearerToken"),
      'From': sessionStorage.getItem("emailAddress")
    });
    let options = new RequestOptions({ headers: header, method: "post" });
    return this.http.post(endpointUrl, JSON.stringify(taskJSON), options).map(this.extractData).catch(this.handleError);
  }
  updateTask(updateTaskJSON) {
    let endpointUrl = Global.CARETRAIL_ENDPOINT + 'task/update';
    let header = new Headers({
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      'Authorization': sessionStorage.getItem("bearerToken"),
      'From': sessionStorage.getItem("emailAddress")
    });
    let options = new RequestOptions({ headers: header, method: "post" });
    console.log(" status updated:::: " + JSON.stringify(updateTaskJSON));
    return this.http.post(endpointUrl, JSON.stringify(updateTaskJSON), options).map(this.extractData).catch(this.handleError);
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
