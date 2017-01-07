import {Component} from 'angular2/core';

declare var $: any;

@Component({
  selector: 'reports',
  templateUrl: 'app/components/reports.component.html'
})
export class Reports {
  ngAfterViewInit() {
    $('.patient-search').remove();
    $('.message-area').remove();
  }


}
