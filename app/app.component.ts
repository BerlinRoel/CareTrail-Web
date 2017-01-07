import { Component } from 'angular2/core';
import { RouteConfig, ROUTER_DIRECTIVES } from 'angular2/router';
import { ROUTER_PROVIDERS } from 'angular2/router';
import { HTTP_PROVIDERS } from 'angular2/http';

import { TopBar } from './components/top-bar.component';
import { SideNav } from './components/side-nav.component';
import { Users } from './components/users.component';
import { Login } from './components/login.component';
import { Reports } from './components/reports.component';
import { Timelines } from './components/timeline.component';
import { OnCall } from './components/oncall.component';
import { SMSData } from './components/smsdata.component';
import { Teams } from './components/teams.component';
import { Tasks } from './components/tasks.component';
import { Password } from './components/password.component';
import { LoginService } from './services/login.service';
import { UserService } from './services/user.service';
import { TeamService } from './services/team.service';
import { SMSService } from './services/sms.service';
import { TaskService } from './services/task.service';
import { TimelineService } from './services/timeline.service';

@Component({
    selector: 'my-app',
    directives: [ROUTER_DIRECTIVES, Login, Timelines, Users, OnCall, Reports, Tasks, Teams, SMSData, TopBar, SideNav],
    providers: [ROUTER_PROVIDERS, HTTP_PROVIDERS, LoginService, TimelineService, UserService, TeamService, SMSService, TaskService,],
    template: `
    <main>
        <side-nav></side-nav>
        <right-content>
            <top-bar></top-bar>
            <body-content id="body-content">
                <router-outlet></router-outlet>
            </body-content>
        </right-content>
    </main>
    `
})

@RouteConfig([
    { path: '/login', name: 'Login', component: Login, useAsDefault: true },
    { path: '/password', name: 'Password', component: Password },
    { path: '/timeline', name: 'Timeline', component: Timelines },
    { path: '/users', name: 'Users', component: Users },
    { path: '/reports', name: 'Reports', component: Reports },
    { path: '/oncall', name: 'OnCall', component: OnCall },
    { path: '/smsdata', name: 'SMSData', component: SMSData },
    { path: '/teams', name: 'Teams', component: Teams },
    { path: '/tasks', name: 'Tasks', component: Tasks }
])
export class AppComponent { }
