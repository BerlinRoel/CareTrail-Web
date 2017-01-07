import {Component} from 'angular2/core';
import {ROUTER_DIRECTIVES} from 'angular2/router';
import {LoginService} from '../services/login.service';
declare var jQuery:any;

@Component({
  selector: 'side-nav',
  directives: [ROUTER_DIRECTIVES],
  templateUrl: 'app/components/side-nav.component.html'
})
export class SideNav {
  accesstoken: string;
  emailAddress: string;
  constructor (private loginService:LoginService) {
      this.accesstoken = sessionStorage.getItem("bearerToken");
      this.emailAddress = sessionStorage.getItem("emailAddress");
  }

  onClick() {
    if (this.loginService.checkLogin()) {
        this.loginService.logout().subscribe(
        data => { 
            sessionStorage.clear();  
        },
        error => {
          sessionStorage.clear(); 
        }
      )
    }
  }
    
}