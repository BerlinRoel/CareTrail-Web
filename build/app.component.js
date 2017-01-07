System.register(['angular2/core', 'angular2/router', 'angular2/http', './components/top-bar.component', './components/side-nav.component', './components/users.component', './components/login.component', './components/reports.component', './components/timeline.component', './components/oncall.component', './components/smsdata.component', './components/teams.component', './components/tasks.component', './components/password.component', './services/login.service', './services/user.service', './services/team.service', './services/sms.service', './services/task.service', './services/timeline.service'], function(exports_1, context_1) {
    "use strict";
    var __moduleName = context_1 && context_1.id;
    var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
        var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
        if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
        else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
        return c > 3 && r && Object.defineProperty(target, key, r), r;
    };
    var __metadata = (this && this.__metadata) || function (k, v) {
        if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
    };
    var core_1, router_1, router_2, http_1, top_bar_component_1, side_nav_component_1, users_component_1, login_component_1, reports_component_1, timeline_component_1, oncall_component_1, smsdata_component_1, teams_component_1, tasks_component_1, password_component_1, login_service_1, user_service_1, team_service_1, sms_service_1, task_service_1, timeline_service_1;
    var AppComponent;
    return {
        setters:[
            function (core_1_1) {
                core_1 = core_1_1;
            },
            function (router_1_1) {
                router_1 = router_1_1;
                router_2 = router_1_1;
            },
            function (http_1_1) {
                http_1 = http_1_1;
            },
            function (top_bar_component_1_1) {
                top_bar_component_1 = top_bar_component_1_1;
            },
            function (side_nav_component_1_1) {
                side_nav_component_1 = side_nav_component_1_1;
            },
            function (users_component_1_1) {
                users_component_1 = users_component_1_1;
            },
            function (login_component_1_1) {
                login_component_1 = login_component_1_1;
            },
            function (reports_component_1_1) {
                reports_component_1 = reports_component_1_1;
            },
            function (timeline_component_1_1) {
                timeline_component_1 = timeline_component_1_1;
            },
            function (oncall_component_1_1) {
                oncall_component_1 = oncall_component_1_1;
            },
            function (smsdata_component_1_1) {
                smsdata_component_1 = smsdata_component_1_1;
            },
            function (teams_component_1_1) {
                teams_component_1 = teams_component_1_1;
            },
            function (tasks_component_1_1) {
                tasks_component_1 = tasks_component_1_1;
            },
            function (password_component_1_1) {
                password_component_1 = password_component_1_1;
            },
            function (login_service_1_1) {
                login_service_1 = login_service_1_1;
            },
            function (user_service_1_1) {
                user_service_1 = user_service_1_1;
            },
            function (team_service_1_1) {
                team_service_1 = team_service_1_1;
            },
            function (sms_service_1_1) {
                sms_service_1 = sms_service_1_1;
            },
            function (task_service_1_1) {
                task_service_1 = task_service_1_1;
            },
            function (timeline_service_1_1) {
                timeline_service_1 = timeline_service_1_1;
            }],
        execute: function() {
            AppComponent = (function () {
                function AppComponent() {
                }
                AppComponent = __decorate([
                    core_1.Component({
                        selector: 'my-app',
                        directives: [router_1.ROUTER_DIRECTIVES, login_component_1.Login, timeline_component_1.Timelines, users_component_1.Users, oncall_component_1.OnCall, reports_component_1.Reports, tasks_component_1.Tasks, teams_component_1.Teams, smsdata_component_1.SMSData, top_bar_component_1.TopBar, side_nav_component_1.SideNav],
                        providers: [router_2.ROUTER_PROVIDERS, http_1.HTTP_PROVIDERS, login_service_1.LoginService, timeline_service_1.TimelineService, user_service_1.UserService, team_service_1.TeamService, sms_service_1.SMSService, task_service_1.TaskService,],
                        template: "\n    <main>\n        <side-nav></side-nav>\n        <right-content>\n            <top-bar></top-bar>\n            <body-content id=\"body-content\">\n                <router-outlet></router-outlet>\n            </body-content>\n        </right-content>\n    </main>\n    "
                    }),
                    router_1.RouteConfig([
                        { path: '/login', name: 'Login', component: login_component_1.Login, useAsDefault: true },
                        { path: '/password', name: 'Password', component: password_component_1.Password },
                        { path: '/timeline', name: 'Timeline', component: timeline_component_1.Timelines },
                        { path: '/users', name: 'Users', component: users_component_1.Users },
                        { path: '/reports', name: 'Reports', component: reports_component_1.Reports },
                        { path: '/oncall', name: 'OnCall', component: oncall_component_1.OnCall },
                        { path: '/smsdata', name: 'SMSData', component: smsdata_component_1.SMSData },
                        { path: '/teams', name: 'Teams', component: teams_component_1.Teams },
                        { path: '/tasks', name: 'Tasks', component: tasks_component_1.Tasks }
                    ]), 
                    __metadata('design:paramtypes', [])
                ], AppComponent);
                return AppComponent;
            }());
            exports_1("AppComponent", AppComponent);
        }
    }
});
//# sourceMappingURL=app.component.js.map