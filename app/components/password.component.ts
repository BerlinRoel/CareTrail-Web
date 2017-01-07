import { Component, AfterViewInit } from 'angular2/core';
import { Router } from 'angular2/router';
import { Observable } from 'rxjs/Observable';
import { UserService } from '../services/user.service';
import { SlimBar } from './slim-bar.component';
import { SlimBarService } from '../services/slim-bar.service';
import { User } from '../models/user';
import { SharedData } from '../utils/shared.data';
declare var $: any;

@Component({
  selector: 'password',
  directives: [SlimBar],
  providers: [SlimBarService],
  templateUrl: 'app/components/password.component.html'
})
export class Password {

	constructor(private UserService: UserService) { }

	submitPassword() {
		$('.confirmed').addClass('hidden');
		$('.validation').addClass('hidden');		
		if( /(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z])(?=.*[_!@#\$%\^&\*])(?=.{8,})/.test($('#fld-new-password').val()) &&  
			$('#fld-new-password').val() == $('#fld-confirm-password').val() ) {
			$('#fld-new-password').attr('disabled','disabled');
			$('#fld-confirm-password').attr('disabled','disabled');
			$('#fld-lastname').attr('disabled','disabled');
			$('#login-btn').attr('disabled','disabled');

			this.UserService.resetPassword().subscribe(
				data => {
					console.log(data);
					$('.confirmed').removeClass('hidden');
					$('.dv-login-container').addClass('hidden');
				},
				error => {
				  console.log("USER.COMPONENT:::resetPassword() " + error);
				}
			);
		} else {
			$('.confirmed').addClass('hidden');
			$('.validation').removeClass('hidden');
		}
	}

	closeValidation() {
		$('.validation').addClass('hidden');
	}

	backLogin() {
		location.href = '/login';
	}
}
