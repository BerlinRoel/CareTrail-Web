import {Component, Input, OnInit} from 'angular2/core';
import {CORE_DIRECTIVES} from 'angular2/common';

import {SlimBarService, SlimBarEvent, SlimBarEventType} from '../services/slim-bar.service';
import {isPresent} from '../utils/slim-bar.utils';

/**
 * A Slim  Bar component shows message  progress bar on the top of web page or parent component.
 */
@Component({
    selector: 'ng2-slim-bar',
    directives: [CORE_DIRECTIVES],
    template: `
    <div class="slim-bar">
        <div class="slim-bar-progress" [style.width]="progress" [style.backgroundColor]="color" [style.color]="color"
            [style.height]="height" [style.opacity]="show ? '1' : '0'"></div>
    </div>`
})
export class SlimBar implements OnInit {

    private _progress: string = '0%';
    @Input() set progress(value: string) {
        if (isPresent(value)) {
            this._progress = value + '%';
        }
    }
    get progress(): string {
        return this._progress;
    }

    @Input() color: string = '#F19B5A';
    @Input() height: string = '3px';
    @Input() show: boolean = true;

    constructor(private service:SlimBarService) {}

    ngOnInit(): any {
        this.service.observable.subscribe((event:SlimBarEvent) => {
            if (event.type === SlimBarEventType.PROGRESS) {
                this.progress = event.value;
            } else if (event.type === SlimBarEventType.COLOR) {
                this.color = event.value;
            } else if (event.type === SlimBarEventType.HEIGHT) {
                this.height = event.value;
            } else if (event.type === SlimBarEventType.VISIBLE) {
                this.show = event.value;
            }
        });
    }
}