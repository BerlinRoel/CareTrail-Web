import { Injectable } from 'angular2/core';
import { Observable } from 'rxjs/Rx';
import { Http, Headers, Response, RequestOptions } from 'angular2/http';
import Global = require('../utils/global.util');

@Injectable()
export class SMSService {
	constructor(private http: Http) { }

	validateSMSCode(authCode: string, lastName: string) {
		var jsonData = {
			"oneTimeAuthcode": authCode,
			"lastName": lastName
		}

		let endpointUrl = Global.CARETRAIL_ENDPOINT + 'sms/token';
		let header = new Headers({
			'Content-Type': 'application/json',
			'Accept': 'application/json',
			'Authorization': sessionStorage.getItem("bearerToken"),
			'From': sessionStorage.getItem("emailAddress")
		});
		let options = new RequestOptions({ headers: header, method: "post" });
		console.log("USER.SERVICE:::addUser:::" + JSON.stringify(jsonData));
		return this.http.post(endpointUrl, JSON.stringify(jsonData), options).map(this.extractData).catch(this.handleError);
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