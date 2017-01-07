import { Component, OnInit } from 'angular2/core';
import { Router } from 'angular2/router';
import { UserService } from '../services/user.service';
import { User } from '../models/user';
import { OnCallData } from '../models/oncalldata';
import { SharedData } from '../utils/shared.data';
//import * as moment from 'moment/moment';

declare var $: any;
declare var moment: any;

@Component({
  selector: 'oncall',
  templateUrl: 'app/components/oncall.component.html',
  host: {
    '(document:click)': 'onClickBody($event)',
  },
})

export class OnCall implements OnInit {
  private model = { 'searchUser': '', 'filteredUserType': 'oncall', 'searchOffUser': '', 'searchOnCallUser': '' };
  filteredUser: User;
  calendarString: string = "";
  onCallCalendar: any;
  currentlySelectedDate: Date;
  loadingMonthData: boolean = false;
  isAddingOnCall: boolean = false;

  onCallData: OnCallData[];
  showCurrentUsersLoadingIcon: number = 0;
  hasOnCallUsers: boolean = false;

  userSearchResults: User[];
  showLoadingIcon: boolean = false;
  searchErrorMessage: string = '';

  offUserSearchResults: User[];
  selectedOffUser: User;
  showOffUserSearchIcon: number = 0;

  onCallUserSearchResults: User[];
  selectedOnCallUser: User;
  showOnCallUserSearchIcon: number = 0;

  constructor(public _router: Router, private UserService: UserService, private sharedData: SharedData) {
    this.calendarString = $('#full-clndr-template').html();
  }

  ngOnInit() {
    // Default filtered user to logged-in user
    this.filteredUser = this.sharedData.loggedInUser;

    this.ShowUsersOnCall(moment().format('YYYY/MM/DD 00:01'));
    this.UpdateMonthData(moment());
  }

  ngAfterViewInit() {
    $('.patient-search').remove();
    $('.message-area').remove();
    // Need a reference to 'this' as 'OnCall' object for clndr callbacks
    var self = this;

    this.onCallCalendar = $('#full-clndr').clndr({
      template: this.calendarString,
      trackSelectedDate: true,
      selectedDate: moment(),
      classes: {
        selected: "clndr-selected",
        today: "clndr-today",
        inactive: "clndr-inactive",
        adjacentMonth: "clndr-adjacent-month",
      },
      clickEvents: {
        click: function (target) {
          self.OnDateClick(target);
        },
        onMonthChange: function (month) {
          self.OnMonthChange(month);
        }
      },
      targets: {
        day: 'clndr-day',
        empty: 'clndr-empty'
      },
    });

    this.onCallCalendar.today();

    $('#startTimeTimepicker').timepicker({ 'selectOnBlur': true });
    $('#endTimeTimepicker').timepicker({ 'selectOnBlur': true });

    this.SetDropdownPositions();
  }

  onClickBody(event) {
    this.offUserSearchResults = null;
    this.onCallUserSearchResults = null;
  }

  SetDropdownPositions() {
    $("#offUserSearchResults").css('top', parseInt($("#offUserSearch").position().top, 10)
      + parseInt($("#offUserSearch").css('height'), 10)
      + parseInt($("#offUserSearch").css('margin-top'), 10)
      + 2); // Need to add 2 to have it appear just a little bit lower
    $("#offUserSearchResults").css('left', parseInt($("#offUserSearch").position().left, 10)
      - (parseInt($("#offUserSearchResults").css('width'), 10) - parseInt($("#offUserSearch").css('width'), 10)) / 2);

    $("#onCallUserSearchResults").css('top', parseInt($("#onCallUserSearch").position().top, 10)
      + parseInt($("#onCallUserSearch").css('height'), 10)
      + parseInt($("#onCallUserSearch").css('margin-top'), 10)
      + 2); // Need to add 2 to have it appear just a little bit lower
    $("#onCallUserSearchResults").css('left', parseInt($("#onCallUserSearch").position().left, 10)
      - (parseInt($("#onCallUserSearchResults").css('width'), 10) - parseInt($("#onCallUserSearch").css('width'), 10)) / 2);
  }

  ClearFilteredUser() {
    this.FilterUser(null);
  }

  SearchForUsers() {
    //Searches for users in database & shows info
    if (this.model.searchUser) {
      console.log("USER.COMPONENT:::getUserDetails:::" + this.model.searchUser);
      this.userSearchResults = null;
      this.showLoadingIcon = true;
      this.UserService.getUserByName(this.model.searchUser).subscribe(
        data => {
          console.log("USER.COMPONENT:::getUserDetails:::" + JSON.stringify(data));
          this.userSearchResults = data;
          this.showLoadingIcon = false;
        },
        error => {
          console.log("USER.COMPONENT:::getUserDetails:::" + error);
          if (error.indexOf("token is invalid") !== -1) {
            this.searchErrorMessage = "Session invalidated as you have logged into another browser/computer. Please login again to continue..";
          } else {
            this.searchErrorMessage = "Server temporarily unavailable. Please try again later.";
          }
          this.userSearchResults = null;
          this.showLoadingIcon = false;
        }
      )
    }
    else {
      this.userSearchResults = null;
      this.showLoadingIcon = false;
    }
  }

  ValidateUserSearch() {
    if (this.model.searchUser == '') {
      this.showLoadingIcon = false;
      this.searchErrorMessage = '';
      this.userSearchResults = null;
    }
  }

  FilterUser(user) {
    this.filteredUser = user;

    this.showLoadingIcon = false;
    this.searchErrorMessage = '';
    this.userSearchResults = null;

    this.ShowUsersOnCall(this.currentlySelectedDate);
    this.UpdateMonthData(this.currentlySelectedDate);
  }

  OnDateClick(target) {
    this.ShowUsersOnCall(target.date._d);
  }

  OnMonthChange(month) {
    this.UpdateMonthData(month)
  }

  ShowUsersOnCall(date) {
    console.log(date);
    this.currentlySelectedDate = new Date(date);
    this.onCallData = null;
    this.hasOnCallUsers = true;
    this.showCurrentUsersLoadingIcon++;

    if (this.filteredUser != null) {
      console.log("ONCALL.COMPONENT:::ShowUsersOnCallForUser:::" + this.filteredUser.userid + ":::" + date);
      this.UserService.getOnCallScheduleForDayAndUser(this.filteredUser.userid, date).subscribe(
        data => {
          this.ShowUsersOnCallSuccess(data);
        },
        error => {
          console.log("ONCALL.COMPONENT:::ShowUsersOnCall:::ERROR:::" + error);
          this.ShowUsersOnCallFailure(error);
        }
      )
    }
    else {
      console.log("ONCALL.COMPONENT:::ShowUsersOnCall:::" + date);
      this.UserService.getOnCallScheduleForDay(date).subscribe(
        data => {
          this.ShowUsersOnCallSuccess(data);
        },
        error => {
          console.log("ONCALL.COMPONENT:::ShowUsersOnCall:::ERROR:::" + error);
          this.ShowUsersOnCallFailure(error);
        }
      )
    }
  }

  ShowUsersOnCallSuccess(data) {
    this.showCurrentUsersLoadingIcon--;
    if (data.onCallUsersMap == null || data.onCallUsersMap.Day.length == 0) {
      this.hasOnCallUsers = false;
      return;
    }

    if (this.showCurrentUsersLoadingIcon == 0) {
      this.onCallData = data.onCallUsersMap.Day;

      for (var i = 0; i < this.onCallData.length; i++) {
        var startDateTime = moment(moment(this.currentlySelectedDate).format("MM/DD/YYYY") + " " + this.onCallData[i].start_hour + ":" + this.onCallData[i].start_minutes, "MM/DD/YYYY HH:mm");
        var endDateTime = moment(moment(this.currentlySelectedDate).format("MM/DD/YYYY") + " " + this.onCallData[i].end_hour + ":" + this.onCallData[i].end_minutes, "MM/DD/YYYY HH:mm");

        this.onCallData[i].formattedStartTime = startDateTime.format("h:mma");
        this.onCallData[i].formattedEndTime = endDateTime.format("h:mma");
      }

      this.hasOnCallUsers = true;
    }
  }

  ShowUsersOnCallFailure(error) {
    this.hasOnCallUsers = false;
    this.showCurrentUsersLoadingIcon--;
  }

  UpdateMonthData(month) {
    this.loadingMonthData = true;
    if (this.filteredUser != null) {
      console.log("ONCALL.COMPONENT:::UpdateMonthData:::" + this.filteredUser.userid + ":::" + month);
      this.UserService.getOnCallScheduleForMonthAndUser(this.filteredUser.userid, month).subscribe(
        data => {
          this.UpdateMonthDataSuccess(data, month);
        },
        error => {
          this.UpdateMonthDataFailure(error);
        }
      )
    }
    else {
      console.log("ONCALL.COMPONENT:::UpdateMonthData:::" + month);
      this.UserService.getOnCallScheduleForMonth(month).subscribe(
        data => {
          this.UpdateMonthDataSuccess(data, month);
        },
        error => {
          this.UpdateMonthDataFailure(error);
        }
      )
    }
  }

  UpdateMonthDataSuccess(data, month) {
    if (data.onCallUsersCountMap == null || data.onCallUsersCountMap.Month.length == 0) {
      this.onCallCalendar.setEvents([]);
      this.loadingMonthData = false;
      return;
    }

    var eventData = [];

    for (var i = 0; i < data.onCallUsersCountMap.Month.length; i++) {
      for (var x = 0; x < data.onCallUsersCountMap.Month[i].userCount; x++) {
        var day = data.onCallUsersCountMap.Month[i].day;
        if (day < 10) {
          day = "0" + day;
        }
        eventData.push({ date: moment(month).format("YYYY-MM-" + day), title: x });
      }
    }

    this.onCallCalendar.setEvents(eventData);

    this.loadingMonthData = false;
  }

  UpdateMonthDataFailure(error) {
    console.log("ONCALL.COMPONENT:::UpdateMonthData:::ERROR:::" + error);
    this.loadingMonthData = false;
  }

  searchForNewOnCallUsers(searchingOffUsers: boolean) {
    this.SetDropdownPositions();

    if (searchingOffUsers) {
      this.selectedOffUser = null;
    }
    else {
      this.selectedOnCallUser = null;
    }

    this.offUserSearchResults = null;
    this.onCallUserSearchResults = null;
    if (this.model.searchOffUser || this.model.searchOnCallUser) {
      if (searchingOffUsers) {
        this.showOffUserSearchIcon++;
      }
      else {
        this.showOnCallUserSearchIcon++;
      }

      var searchString = '';
      if (searchingOffUsers) {
        searchString = this.model.searchOffUser;
      }
      else {
        searchString = this.model.searchOnCallUser;
      }

      this.UserService.getUserByName(searchString).subscribe(
        data => {
          if (searchingOffUsers && this.showOffUserSearchIcon > 0) {
            this.showOffUserSearchIcon--;
          }
          else if (this.showOnCallUserSearchIcon > 0) {
            this.showOnCallUserSearchIcon--;
          }

          if ((searchingOffUsers && this.showOffUserSearchIcon == 0 ||
            !searchingOffUsers && this.showOnCallUserSearchIcon == 0)
            && searchString) {
            if (searchingOffUsers) {
              this.offUserSearchResults = data;
            }
            else {
              this.onCallUserSearchResults = data;
            }
          }
        },
        error => {
          console.log("ONCALL.COMPONENT:::getUserDetails:::ERROR:::" + error);

          if (searchingOffUsers) {
            this.showOffUserSearchIcon--;
          }
          else {
            this.showOnCallUserSearchIcon--;
          }
        }
      ) // end of subscribe
    }
    else {
      this.offUserSearchResults = null;
      this.onCallUserSearchResults = null;
      if (searchingOffUsers) {
        this.showOffUserSearchIcon = 0;
      }
      else {
        this.showOnCallUserSearchIcon = 0;
      }
    }
  }

  selectUser(user: User, isOffUser: boolean) {
    if (isOffUser) {
      this.selectOffUser(user);
    }
    else {
      this.selectOnCallUser(user);
    }
  }

  selectOffUser(user: User) {
    if (user.lastName != null) {
      this.model.searchOffUser = user.username + " " + user.lastName;
    }
    else {
      this.model.searchOffUser = user.username;
    }

    this.selectedOffUser = user;
  }

  selectOnCallUser(user: User) {
    if (user.lastName != null) {
      this.model.searchOnCallUser = user.username + " " + user.lastName;
    }
    else {
      this.model.searchOnCallUser = user.username;
    }

    this.selectedOnCallUser = user;
  }

  selectOffSearchResult(event, selectedOffUsers: boolean) {
    if (event.key == "ArrowDown") {
      if (selectedOffUsers) {
        this.selectNextSearchResult(true, this.offUserSearchResults, "#offUserSearchResults");
      }
      else {
        this.selectNextSearchResult(false, this.onCallUserSearchResults, "#onCallUserSearchResults");
      }
    }
    else if (event.key == "ArrowUp") {
      if (selectedOffUsers) {
        this.selectPreviousSearchResult(true, this.offUserSearchResults, "#offUserSearchResults");
      }
      else {
        this.selectPreviousSearchResult(false, this.onCallUserSearchResults, "#onCallUserSearchResults");
      }
    }
    else if (event.key == "Tab" || event.key == "Enter") {
      if (selectedOffUsers) {
        this.offUserSearchResults = null;
      }
      else {
        this.onCallUserSearchResults = null;
      }
    }
  }

  selectNextSearchResult(isOffSearchModel, results, dropdownId) {
    if (results != null && results.length >= 1) {
      var selectNext = false;
      var didSelect = false;
      for (var i = 0; i < results.length; i++) {
        if (!didSelect && selectNext) {
          results[i].isSelected = true;
          selectNext = false;
          didSelect = true;

          this.selectUser(results[i], isOffSearchModel);
        }
        else {
          if (results[i].isSelected == true) {
            selectNext = true;
          }
          results[i].isSelected = false;
        }
      }

      if (didSelect == false) {
        results[0].isSelected = true;
        this.selectUser(results[0], isOffSearchModel);
      }
    }

    setTimeout(function () {
      var $scrollTo = $('.oncall-addoncall-selected');
      if ($scrollTo.length > 0) {
        var win = $(dropdownId);
        var viewport = {
          top: win.scrollTop(),
          bottom: win.scrollTop() + win.height()
        };

        var bounds = $scrollTo.offset();
        bounds.bottom = bounds.top + $scrollTo.outerHeight();

        var isOnScreen = (!(viewport.bottom < bounds.top || viewport.top > bounds.bottom));

        if (!isOnScreen || $scrollTo.position().top < 0) {
          $(dropdownId).animate({ scrollTop: $scrollTo.offset().top - $(dropdownId).offset().top + $(dropdownId).scrollTop(), scrollLeft: 0 }, 100);
        }
      }
    }, 200);
  }

  selectPreviousSearchResult(isOffSearchModel, results, dropdownId) {
    if (results != null && results.length >= 1) {
      var selectNext = false;
      var didSelect = false;
      for (var i = results.length - 1; i >= 0; i--) {
        if (!didSelect && selectNext) {
          results[i].isSelected = true;
          selectNext = false;
          didSelect = true;

          this.selectUser(results[i], isOffSearchModel);
        }
        else {
          if (results[i].isSelected == true) {
            selectNext = true;
          }
          results[i].isSelected = false;
        }
      }

      if (didSelect == false) {
        results[results.length - 1].isSelected = true;
        this.selectUser(results[results.length - 1], isOffSearchModel);
      }
    }

    setTimeout(function () {
      var $scrollTo = $('.oncall-addoncall-selected');
      if ($scrollTo.length > 0) {
        var win = $(dropdownId);
        var viewport = {
          top: win.scrollTop(),
          bottom: win.scrollTop() + win.height()
        };

        var bounds = $scrollTo.offset();
        bounds.bottom = bounds.top + $scrollTo.outerHeight();

        var isOnScreen = (!(viewport.bottom < bounds.top || viewport.top > bounds.bottom));

        if (!isOnScreen || $scrollTo.position().top < 0) {
          $(dropdownId).animate({ scrollTop: $scrollTo.offset().top - $(dropdownId).offset().top + $(dropdownId).scrollTop(), scrollLeft: 0 }, 100);
        }
      }
    }, 200);
  }

  addOnCallData() {
    this.isAddingOnCall = true;

    if (!moment(moment(this.currentlySelectedDate).format("MM/DD/YYYY") + " " + $('#startTimeTimepicker').val(), "MM/DD/YYYY h:mma", true).isValid()) {
      alert('Invalid start time.');
      this.isAddingOnCall = false;
      return;
    }

    if (!moment(moment(this.currentlySelectedDate).format("MM/DD/YYYY") + " " + $('#endTimeTimepicker').val(), "MM/DD/YYYY h:mma", true).isValid()) {
      alert('Invalid end time.');
      this.isAddingOnCall = false;
      return;
    }

    if (this.filteredUser == null) {
      if (this.model.searchOnCallUser == null || this.model.searchOnCallUser == '' || this.selectedOnCallUser == null) {
        alert('An On-Call User is required.');
        this.isAddingOnCall = false;
        return;
      }
    }

    var startDateTime = moment(moment(this.currentlySelectedDate).format("MM/DD/YYYY") + " " + $('#startTimeTimepicker').val(), "MM/DD/YYYY h:mma", true);
    var endDateTime = moment(moment(this.currentlySelectedDate).format("MM/DD/YYYY") + " " + $('#endTimeTimepicker').val(), "MM/DD/YYYY h:mma", true);

    var offUserEmail = "";
    var onCallUserEmail = "";
    if (this.filteredUser == null) {
      onCallUserEmail = this.selectedOnCallUser.emailAddress;
      if (this.selectedOffUser != null) {
        offUserEmail = this.selectedOffUser.emailAddress;
      }
    }
    else {
      // For filtered data, check the select dropdown for what the user selected
      if (this.model.filteredUserType == 'oncall') {
        // The filtered user is on-call
        if (this.filteredUser.emailAddress.constructor === Array) {
          onCallUserEmail = this.filteredUser.emailAddress[0];
        }
        else {
          onCallUserEmail = this.filteredUser.emailAddress;
        }
        if (this.selectedOffUser != null) {
          offUserEmail = this.selectedOffUser.emailAddress;
        }
      }
      else {
        // The filtered user is off
        offUserEmail = this.filteredUser.emailAddress;

        // An on-call user is now required, and their data will be in the offUser input since we're re-using that
        if (this.model.searchOffUser == null || this.model.searchOffUser == '' || this.selectedOffUser == null) {
          alert('A user is required to go on-call in your place');
          this.isAddingOnCall = false;
          return;
        }
        else {
          onCallUserEmail = this.selectedOffUser.emailAddress;
        }
      }
    }

    console.log("ONCALL.COMPONENT:::addOnCallData:::" + this.currentlySelectedDate);
    this.UserService.addUserOnCall(startDateTime, endDateTime, onCallUserEmail, offUserEmail).subscribe(
      data => {
        this.isAddingOnCall = false;
        this.selectedOffUser = null;
        this.selectedOnCallUser = null;

        // Refresh everything
        this.UpdateMonthData(this.currentlySelectedDate);
        this.ShowUsersOnCall(this.currentlySelectedDate);

        // Clear results
        $('#startTimeTimepicker').val('');
        $('#endTimeTimepicker').val('');
        this.model.searchOffUser = '';
        this.model.searchOnCallUser = '';
      },
      error => {
        this.isAddingOnCall = false;
        console.log("ONCALL.COMPONENT:::addOnCallData:::ERROR:::" + error);
      }
    )
  }

  removeOnCallData(onCallData: OnCallData) {
    onCallData.isWorking = true;

    console.log("ONCALL.COMPONENT:::removeOnCallData:::" + this.currentlySelectedDate + "," + onCallData.oncallid);
    this.UserService.removeUserOnCall(onCallData.oncallid).subscribe(
      data => {
        onCallData.isWorking = false;

        // Refresh everything
        this.UpdateMonthData(this.currentlySelectedDate);
        this.ShowUsersOnCall(this.currentlySelectedDate);
      },
      error => {
        onCallData.isWorking = false;
        console.log("ONCALL.COMPONENT:::removeOnCallData:::ERROR:::" + error);
      }
    )
  }
}
