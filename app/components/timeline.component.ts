import { Component, AfterViewInit, Pipe } from 'angular2/core'; 
import { Router } from 'angular2/router';
import { UserService } from '../services/user.service';
import { User } from '../models/user';
import { TeamService } from '../services/team.service';
import { Team } from '../models/team';
import { Patient } from '../models/patient';
import { Validators } from 'angular2/common';
import { Users } from '../components/users.component';
import { Timeline } from '../models/timeline';
import { TimelineService } from '../services/timeline.service';

declare var $: any;
declare var moment: any;
declare var curDate: any;

@Component({
  selector: 'timeline',
  templateUrl: 'app/components/timeline.component.html',
  providers: [TimelineService]
})

export class Timelines {  

  showTimeline: boolean = true;
  showPatients: boolean = false;
  showingTimeline: boolean = false;
  showGear: boolean = true;
  isReadytoScroll: boolean = false;
  showLoadingIcon: number = 0;
  patients: Patient[];
  timeline: Timeline[];
  postTimeline: Timeline[];
  curDate = new Date();
  imgbase64: any;
  nextPage: number = 1;

  private timelinemodel = { 'emailAddress': sessionStorage.getItem("loggedInUser.emailAddress"), 'pageNo': '0' };
  private patientmodel = { 'patientName': '' };
  private messageModel = { 'searchMessage': ''};

  private timelineMessageModel =  {
                                      messageType: 'timeline',
                                      messageId: null,
                                      message: '', // required
                                      channelName: '', // required
                                      priority: '', // 1 or 0 
                                      createdTimestamp: this.curDate.getTime(),
                                      patient: {
                                          mrn: '',
                                          firstName: '',
                                          lastName: '',
                                      },
                                      fromUser: {
                                          emailAddress: sessionStorage.getItem("loggedInUser.emailAddress"), // required
                                          username: sessionStorage.getItem("loggedInUser.username"),
                                          lastName: sessionStorage.getItem("loggedInUser.lastName")
                                      }
                                  };

  constructor(public _router: Router, private UserService: UserService, private TeamService: TeamService, private TimelineService: TimelineService) { }

  ngAfterViewInit() {    
    $('.timeline-loading').addClass('hidden');
    let self = this;

    this.getTimelineMessages();

    $('#fld-search-patient').bind('input propertychange', function() {
      setTimeout(
        function(){
          if($('#fld-search-patient').val() == '') {
            self.getPatientList();
            self.timeline = self.postTimeline;
          }
        }, 100
      );
    });

    $('#fld-search-message').bind('input propertychange', function() {
      setTimeout(
        function(){ 
          if($('#fld-search-message').val() == '') {
            self.getFilteredTimelineMessages();
            self.timeline = self.postTimeline;
          }
        }, 100
      );
    });

    $('body-content').scroll(function() {
      let bodyContent = document.getElementById("body-content");
      if ( bodyContent.offsetHeight + bodyContent.scrollTop == bodyContent.scrollHeight &&  
           location.href.indexOf('/timeline') !== -1 && self.postTimeline !== undefined &&
           self.isReadytoScroll) {
          self.getNextMessages();
      } else if(location.href.indexOf('/timeline') !== -1) {
        self.isReadytoScroll = true;
      } else if(location.href.indexOf('/tasks') !== -1) {
        self.isReadytoScroll = false;
      }
    });
  }

  enableSend() {
    if($('#fld-message').val().trim() !== '') {
      $('#btn-send-message').removeAttr('disabled');
    } else {
      $('#btn-send-message').attr('disabled','disabled');
    }
  }

  assignPatient(patient) {
    $('#fld-message').removeAttr('disabled');
    this.timelineMessageModel.channelName = patient.mrn;
    this.timelineMessageModel.patient.mrn = patient.mrn;
    this.timelineMessageModel.patient.firstName = patient.firstName;
    this.timelineMessageModel.priority = '0';
    this.timelineMessageModel.patient.lastName = patient.lastName;
  }

  getTimelineMessages() {
    let self = this;
    $('.timeline-loading').addClass('hidden');
    $('#btn-load-more').removeAttr('disabled');
    $('.patient-search').insertAfter($('div.header-item.center-align'));
    $('.message-area').insertAfter($('body-content'));

    this.TimelineService.getTimeLineList(this.timelinemodel.emailAddress, this.timelinemodel.pageNo).subscribe(
      data => { 

        self.postTimeline = data;
        self.timeline = data;

        $('#fld-search-patient').removeAttr('disabled');
        $('#fld-search-message').removeAttr('disabled');

        $('#btn-load-more').show();        
        self.showGear = false;
        $('#body-content').scrollTop(0); 
        self.isReadytoScroll = true;           
      },
      error => {
        $('.timeline-loading').addClass('hidden');
        self.showGear = false;
      }      
    )
  }

  getNextMessages() {
    let self = this;
    if(!this.showingTimeline) {
      this.showingTimeline = true; 
      $('.timeline-loading').removeClass('hidden');             
      this.TimelineService.getTimeLineList(this.timelinemodel.emailAddress, this.nextPage+'').subscribe(
        data => { 
          if(data.length == 0) {
            $('#btn-load-more').attr('disabled','disabled'); 
            $('.timeline-loading').addClass('hidden');
            self.showingTimeline = false;
            self.isReadytoScroll = false;
          } else {
            self.postTimeline = self.postTimeline.concat(data);
            self.timeline = self.timeline.concat(data);
            self.showingTimeline = false;
            self.nextPage++;
            $('.timeline-loading').addClass('hidden');
            $('#body-content').scrollTop(0);
            self.isReadytoScroll = false;
          }
        },
        error => {
          console.log("TIMELINE.COMPONENT:::getTimelineMessages:::" + error);
        }      
      )
    } 
  }  

  getFilteredTimelineMessages() {
    $('#fld-search-patient').val('');

    this.showTimeline = true;
    this.showPatients = false;


    if($('#fld-search-message').val().trim() == '') {
      $('#btn-load-more').show();  
    } else {
      $('#btn-load-more').hide();   
    }

    if(this.messageModel.searchMessage == '') {
      this.timeline = this.postTimeline;
    }
    
    var filteredTimelineMessages = [];
    for (var i = 0, j = 0; i < this.postTimeline.length; i++) {
           var name = '';
        if (this.postTimeline[i].message != null) {
            name =  this.postTimeline[i].message + ' ' + 
                    this.postTimeline[i].fromUser.lastName + ' ' +
                    this.postTimeline[i].fromUser.username + ' ' +
                    this.postTimeline[i].toPatient.firstName + ' ' + 
                    this.postTimeline[i].toPatient.lastName;
         }

        if (name.toUpperCase().indexOf(this.messageModel.searchMessage.toUpperCase()) != -1) {
            filteredTimelineMessages[j] = this.postTimeline[i];
            j++;
        }
    }
    this.timeline = filteredTimelineMessages;
  }

  getPatientList() {
    
    $('#fld-message').attr('disabled', 'disabled');
    $('#btn-send-message').attr('disabled', 'disabled');
    $('#fld-search-message').val('');

    if($('#fld-search-patient').val() == '') {
      $('#btn-load-more').show();
    } else {
      $('#btn-load-more').hide();
    }

    if(this.patientmodel.patientName != '') {
      this.showTimeline = false;
      this.showPatients = true;
    } else {
      this.showTimeline = true;
      this.showPatients = false;
      this.timelineMessageModel.patient.firstName = ''; 
      this.timelineMessageModel.patient.lastName = '';
    }

    //Shows the list of patients when doing search
    this.TimelineService.getTimeLinePatients().subscribe(
      data => { 

        var aoResultPatient = [];
        if (data == null || this.patientmodel.patientName == "") {
            this.patients = aoResultPatient;
        }

        for (var i = 0, j = 0; i < data.length; i++) {
            var name = '';
            if (data[i].lastName != null) {
                name = data[i].firstName + " " + data[i].lastName;
            }
            else {
                name = data[i].firstName;
            }

            if (name.toUpperCase().indexOf(this.patientmodel.patientName.toUpperCase()) != -1) {
                aoResultPatient[j] = data[i];
                j++;
            }
        }

        this.patients = aoResultPatient;
        this.showGear = false;
      },
      error => {
        console.log("TIMELINE.COMPONENT:::getPatientList:::" + error);
        this.showGear = false;
      }      
    )      
  }

  postTimelineMessage() { 
    this.TimelineService.timeLinePostMessageList(this.timelineMessageModel).subscribe(
      data => { 
        this.showGear = false;
        location.reload();
      },
      error => {
        console.log("TIMELINE.COMPONENT:::postTimelineMessage:::" + error);
        this.showGear = false;
      }      
    )      
  }

  format(dateVal): string {
    return moment(dateVal).fromNow();
  }

}
