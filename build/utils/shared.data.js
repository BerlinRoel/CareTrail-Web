System.register(['../models/user'], function(exports_1, context_1) {
    "use strict";
    var __moduleName = context_1 && context_1.id;
    var user_1;
    var SharedData;
    return {
        setters:[
            function (user_1_1) {
                user_1 = user_1_1;
            }],
        execute: function() {
            SharedData = (function () {
                function SharedData() {
                    this.restoreSessionData();
                }
                SharedData.prototype.restoreSessionData = function () {
                    this.loggedInUser = new user_1.User();
                    this.loggedInUser.userid = sessionStorage.getItem("loggedInUser.userid");
                    this.loggedInUser.username = sessionStorage.getItem("loggedInUser.username");
                    this.loggedInUser.lastName = sessionStorage.getItem("loggedInUser.lastName");
                    this.loggedInUser.emailAddress = sessionStorage.getItem("loggedInUser.emailAddress");
                    this.loggedInUser.userAvitar = sessionStorage.getItem("loggedInUser.userAvitar");
                    this.loggedInUser.jobTitle = sessionStorage.getItem("loggedInUser.jobTitle");
                    this.loggedInUser.phoneNumber = sessionStorage.getItem("loggedInUser.phoneNumber");
                    this.loggedInUser.status = sessionStorage.getItem("loggedInUser.status");
                };
                SharedData.prototype.updateUserData = function (userData) {
                    this.loggedInUser = new user_1.User();
                    this.loggedInUser.userid = userData.userid;
                    this.loggedInUser.username = userData.userName;
                    this.loggedInUser.lastName = userData.lastName;
                    this.loggedInUser.emailAddress = userData.emailAddress;
                    this.loggedInUser.userAvitar = userData.base64Image;
                    this.loggedInUser.jobTitle = userData.jobTitle;
                    this.loggedInUser.phoneNumber = userData.phoneNumber;
                    this.loggedInUser.status = userData.status;
                    sessionStorage.setItem("loggedInUser.userid", this.loggedInUser.userid);
                    sessionStorage.setItem("loggedInUser.username", this.loggedInUser.username);
                    sessionStorage.setItem("loggedInUser.lastName", this.loggedInUser.lastName);
                    sessionStorage.setItem("loggedInUser.emailAddress", this.loggedInUser.emailAddress);
                    sessionStorage.setItem("loggedInUser.userAvitar", this.loggedInUser.userAvitar);
                    sessionStorage.setItem("loggedInUser.jobTitle", this.loggedInUser.jobTitle);
                    sessionStorage.setItem("loggedInUser.phoneNumber", this.loggedInUser.phoneNumber);
                    sessionStorage.setItem("loggedInUser.status", this.loggedInUser.status);
                };
                return SharedData;
            }());
            exports_1("SharedData", SharedData);
        }
    }
});
//# sourceMappingURL=shared.data.js.map