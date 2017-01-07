import {Component} from 'angular2/core';
import {ROUTER_DIRECTIVES} from 'angular2/router';
import {LoginService} from '../services/login.service';

@Component({
  selector: 'top-bar',
  directives: [ROUTER_DIRECTIVES],
  templateUrl: 'app/components/top-bar.component.html'
})
export class TopBar {
  constructor (private loginService:LoginService) {

  }
}
