System.register(['angular2/core', 'rxjs/Observable', '../utils/slim-bar.utils'], function(exports_1, context_1) {
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
    var core_1, Observable_1, slim_bar_utils_1;
    var SlimBarEventType, SlimBarEvent, SlimBarService;
    return {
        setters:[
            function (core_1_1) {
                core_1 = core_1_1;
            },
            function (Observable_1_1) {
                Observable_1 = Observable_1_1;
            },
            function (slim_bar_utils_1_1) {
                slim_bar_utils_1 = slim_bar_utils_1_1;
            }],
        execute: function() {
            (function (SlimBarEventType) {
                SlimBarEventType[SlimBarEventType["PROGRESS"] = 0] = "PROGRESS";
                SlimBarEventType[SlimBarEventType["HEIGHT"] = 1] = "HEIGHT";
                SlimBarEventType[SlimBarEventType["COLOR"] = 2] = "COLOR";
                SlimBarEventType[SlimBarEventType["VISIBLE"] = 3] = "VISIBLE";
            })(SlimBarEventType || (SlimBarEventType = {}));
            exports_1("SlimBarEventType", SlimBarEventType);
            SlimBarEvent = (function () {
                function SlimBarEvent(type, value) {
                    this.type = type;
                    this.value = value;
                }
                return SlimBarEvent;
            }());
            exports_1("SlimBarEvent", SlimBarEvent);
            /**
             * SlimBar service helps manage Slim bar on the top of screen or parent component
             */
            SlimBarService = (function () {
                function SlimBarService() {
                    var _this = this;
                    this._progress = 20;
                    this._height = '3px';
                    this._color = 'firebrick';
                    this._visible = true;
                    this._intervalCounterId = 0;
                    this.interval = 400; // in milliseconds
                    this.observable = new Observable_1.Observable(function (subscriber) {
                        _this.subscriber = subscriber;
                    });
                }
                Object.defineProperty(SlimBarService.prototype, "progress", {
                    get: function () {
                        return this._progress;
                    },
                    set: function (value) {
                        if (slim_bar_utils_1.isPresent(value)) {
                            if (value > 0) {
                                this.visible = true;
                            }
                            this._progress = value;
                            this.emitEvent(new SlimBarEvent(SlimBarEventType.PROGRESS, this._progress));
                        }
                    },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(SlimBarService.prototype, "visible", {
                    get: function () {
                        return this._visible;
                    },
                    set: function (value) {
                        if (slim_bar_utils_1.isPresent(value)) {
                            this._visible = value;
                            this.emitEvent(new SlimBarEvent(SlimBarEventType.VISIBLE, this._visible));
                        }
                    },
                    enumerable: true,
                    configurable: true
                });
                SlimBarService.prototype.emitEvent = function (event) {
                    if (this.subscriber) {
                        // Push up a new event
                        this.subscriber.next(event);
                    }
                };
                SlimBarService.prototype.start = function (onCompleted) {
                    var _this = this;
                    if (onCompleted === void 0) { onCompleted = null; }
                    // Stop current timer
                    this.stop();
                    // Make it visible for sure
                    this.visible = true;
                    // Run the timer with milliseconds iterval
                    this._intervalCounterId = setInterval(function () {
                        // Increment the progress and update view component
                        _this.progress += 5;
                        // If the progress is 100% - call complete
                        if (_this.progress === 100) {
                            _this.complete();
                        }
                    }, this.interval);
                };
                SlimBarService.prototype.stop = function () {
                    if (this._intervalCounterId) {
                        clearInterval(this._intervalCounterId);
                        this._intervalCounterId = null;
                    }
                };
                SlimBarService.prototype.reset = function () {
                    this.stop();
                    this.progress = 0;
                };
                SlimBarService.prototype.complete = function () {
                    var _this = this;
                    this.progress = 100;
                    this.stop();
                    setTimeout(function () {
                        // Hide it away
                        _this.visible = false;
                        setTimeout(function () {
                            // Drop to 0
                            _this.progress = 0;
                        }, 250);
                    }, 250);
                };
                SlimBarService = __decorate([
                    core_1.Injectable(), 
                    __metadata('design:paramtypes', [])
                ], SlimBarService);
                return SlimBarService;
            }());
            exports_1("SlimBarService", SlimBarService);
        }
    }
});
//# sourceMappingURL=slim-bar.service.js.map