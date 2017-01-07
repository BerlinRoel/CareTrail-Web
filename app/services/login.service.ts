import {Injectable} from 'angular2/core';
import {Http, Headers, Response, RequestOptions} from 'angular2/http';
import {Observable} from 'rxjs/Rx';
import Global = require('../utils/global.util');

@Injectable()
export class LoginService {
  token: string;

  constructor(private _http: Http) { }

  sendCredentials(model) {

    let endpointUrl = Global.CARETRAIL_ENDPOINT + 'auth/authenticate';
    let headers = new Headers({ 'Content-type': 'application/json', 'Accept': 'application/json' });
    let options = new RequestOptions({ headers: headers, method: "post" });
    sessionStorage.setItem("model", JSON.stringify(model));
    return this._http.post(endpointUrl, JSON.stringify(model), options).map(this.extractData).catch(this.handleError);
  }

  checkLogin() {
    var isLoggedIn = sessionStorage.getItem("currentUserName");
    if (sessionStorage.getItem("smsUser") == "true") {
      isLoggedIn = false;
    }

    return isLoggedIn;
  }

  getUserName() {
    return sessionStorage.getItem("currentUserName");
  }

  logout() {
    sessionStorage.removeItem("currentUserName");
    let endpointUrl = Global.CARETRAIL_ENDPOINT + 'auth/logout';
    let headers = new Headers({
      'Content-type': 'application/json', 'Accept': 'application/json',
      'Authorization': sessionStorage.getItem("bearerToken"),
      'From': sessionStorage.getItem("emailAddress")
    });
    return this._http.post(endpointUrl, sessionStorage.getItem("model"), { headers: headers }).map(this.extractData).catch(this.handleError);
  }

  private extractData(res: Response) {
    let body = res.json();
    //console.log(res.json().accessToken+"-----"+JSON.stringify(res.json()));  
    return body || {};
  }

  private handleError(error: any) {
    let errMsg = (error.message) ? error.message :
      error.status ? `${error.status} - ${error.statusText}` : 'Server error';
    return Observable.throw(errMsg);
  }

}
