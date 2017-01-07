import { Component, AfterViewInit } from 'angular2/core';
import { Router } from 'angular2/router';
import { Observable } from 'rxjs/Observable';
import { LoginService } from '../services/login.service'
import { SlimBar } from './slim-bar.component';
import { SlimBarService } from '../services/slim-bar.service';
import { User } from '../models/user';
import { SharedData } from '../utils/shared.data';
declare var $: any;

@Component({
  selector: 'login',
  directives: [SlimBar],
  providers: [SlimBarService],
  templateUrl: 'app/components/login.component.html'
})
export class Login {
  private model = { 'userid': '', 'password': '', 'SupportedModalities': '["Messaging"]' };
  showData: boolean = true;
  loginError: string = '';
  constructor(public _router: Router, private loginService: LoginService, private slimService: SlimBarService, private sharedData: SharedData) {
    sessionStorage.clear();
  }

  ngAfterViewInit() {
    $('.patient-search').remove();
    $('.message-area').remove();
  }

  onSubmit() {
    this.slimService.start(() => { console.log('loading complete') });
    this.loginService.sendCredentials(this.model).subscribe(
      data => {
        this.slimService.complete();
        setTimeout(() => {
          sessionStorage.setItem("bearerToken", data.accessToken);
          console.log(sessionStorage.getItem("bearerToken"));

          if (data != null && data.userDetails != null) {
            this.sharedData.updateUserData(data.userDetails);
          }

          var name = data.userDetails.userName;
          if (data.userDetails.lastName != null) {
            name += " " + data.userDetails.lastName;
          }
          sessionStorage.setItem("currentUserName", name);
          sessionStorage.setItem("emailAddress", this.model.userid);
          this.showData = true;
          $('iframe').attr('src', "http://app.caretrail.io/www/#/tab/timeline/home/" + data.accessToken + "/" + this.model.userid + "/WEB");

          this._router.navigate(['Timeline']);
        },
          500);
      },
      error => {
        console.log("LOGIN.COMPONENT:::onSubmit:::error:::" + error);
        this.slimService.complete();

        this.loginError = error;

        setTimeout(() => {
          this.showData = false;
        },
          500);
      }
    ) // end of subscribe
  }

  backLogin() {
    location.reload();
  }

}
