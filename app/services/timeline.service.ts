import { User } from '../models/user';
import { Patient } from '../models/patient';
import { Injectable } from 'angular2/core';
import { Observable } from 'rxjs/Rx';
import { Http, Headers, Response, RequestOptions } from 'angular2/http';
import Global = require('../utils/global.util');

declare var moment: any;

@Injectable()
export class TimelineService {
  constructor(private http: Http) { }

  getTimeLineList(emailAddress: string, pageNo: string) {
    let endpointUrl = Global.CARETRAIL_ENDPOINT + 'people/timeline/' + emailAddress + '/' +  pageNo;
    let header = new Headers({
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      'Authorization': sessionStorage.getItem("bearerToken"),
      'From': sessionStorage.getItem("emailAddress")
    });
    return this.http.get(endpointUrl, { headers: header }).map(this.extractData).catch(this.handleError);
  }

  getTimeLinePatients() {
    let endpointUrl = Global.CARETRAIL_ENDPOINT + 'people/myPatients/' + sessionStorage.getItem("emailAddress") + '/';
    let header = new Headers({
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      'Authorization': sessionStorage.getItem("bearerToken"),
      'From': sessionStorage.getItem("emailAddress")
    });

    return this.http.get(endpointUrl, { headers: header }).map(this.extractData).catch(this.handleError);    
  }

  timeLinePostMessageList(postdata) {
    let endpointUrl = Global.CARETRAIL_ENDPOINT + 'messages/sendMessage';
    let header = new Headers({
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      'Authorization': sessionStorage.getItem("bearerToken"),
      'From': sessionStorage.getItem("emailAddress")
    });
    let options = new RequestOptions({ headers: header, method: "post" });
    return this.http.post(endpointUrl, JSON.stringify(postdata), options).catch(this.handleError);
  }

  private extractData(res: Response): Patient[] {
    let body = res.json();
    return body || [] as Patient[];
  }

  private handleError(error: any) {
    let data = JSON.parse(error._body);
    let errMsg = (data.message) ? data.message :
      error.status ? `${error.status} - ${error.statusText}` : 'Server error';
    return Observable.throw(errMsg);
  }
}