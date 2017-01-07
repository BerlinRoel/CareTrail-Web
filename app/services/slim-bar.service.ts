import {Injectable} from 'angular2/core';

import {Observable} from 'rxjs/Observable';
import {Subscriber} from 'rxjs/Subscriber';
import {Subscription} from 'rxjs/Subscription';

import {isPresent} from '../utils/slim-bar.utils';

export enum SlimBarEventType {
    PROGRESS,
    HEIGHT,
    COLOR,
    VISIBLE
}

export class SlimBarEvent {
    constructor(public type:SlimBarEventType, public value:any) {}
}

/**
 * SlimBar service helps manage Slim bar on the top of screen or parent component
 */
@Injectable()
export class SlimBarService {

    private _progress:number = 20;
    private _height:string = '3px';
    private _color:string = 'firebrick';
    private _visible:boolean = true;

    private _intervalCounterId:any = 0;
    public interval:number = 400; // in milliseconds

    public observable: Observable<SlimBarEvent>;
    private subscriber: Subscriber<SlimBarEvent>;

    constructor() {
        this.observable = new Observable<SlimBarEvent>((subscriber:Subscriber<SlimBarEvent>) => {
            this.subscriber = subscriber;
        });
    }

    set progress(value:number) {
        if (isPresent(value)) {
        	if (value > 0) {
        		this.visible = true;
        	}
            this._progress = value;
            this.emitEvent(new SlimBarEvent(SlimBarEventType.PROGRESS, this._progress));
        }
    }

    get progress():number {
        return this._progress;
    }    

    set visible(value: boolean) {
        if (isPresent(value)) {
            this._visible = value;
            this.emitEvent(new SlimBarEvent(SlimBarEventType.VISIBLE, this._visible));
        }
    }

    get visible():boolean {
        return this._visible;
    }

    private emitEvent(event: SlimBarEvent) {
        if (this.subscriber) {
            // Push up a new event
            this.subscriber.next(event);
        }
    }

    start(onCompleted:Function = null) {        
        // Stop current timer
        this.stop();
        // Make it visible for sure
        this.visible = true;
        // Run the timer with milliseconds iterval
        this._intervalCounterId = setInterval(() => {
            // Increment the progress and update view component
            this.progress += 5;
            // If the progress is 100% - call complete
            if (this.progress === 100) {
                this.complete();
            }
        }, this.interval);
    }

    stop() {
        if (this._intervalCounterId) {
            clearInterval(this._intervalCounterId);
            this._intervalCounterId = null;
        }
    }

    reset() {
        this.stop();
        this.progress = 0;
    }

    complete() {        
        this.progress = 100;
        this.stop();
        setTimeout(() => {
            // Hide it away
            this.visible = false;
            setTimeout(() => {
                // Drop to 0
                this.progress = 0;
            }, 250);
        }, 250);
    }
}