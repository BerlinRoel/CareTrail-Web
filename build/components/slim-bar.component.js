System.register(['angular2/core', 'angular2/common', '../services/slim-bar.service', '../utils/slim-bar.utils'], function(exports_1, context_1) {
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
    var core_1, common_1, slim_bar_service_1, slim_bar_utils_1;
    var SlimBar;
    return {
        setters:[
            function (core_1_1) {
                core_1 = core_1_1;
            },
            function (common_1_1) {
                common_1 = common_1_1;
            },
            function (slim_bar_service_1_1) {
                slim_bar_service_1 = slim_bar_service_1_1;
            },
            function (slim_bar_utils_1_1) {
                slim_bar_utils_1 = slim_bar_utils_1_1;
            }],
        execute: function() {
            /**
             * A Slim  Bar component shows message  progress bar on the top of web page or parent component.
             */
            SlimBar = (function () {
                function SlimBar(service) {
                    this.service = service;
                    this._progress = '0%';
                    this.color = '#F19B5A';
                    this.height = '3px';
                    this.show = true;
                }
                Object.defineProperty(SlimBar.prototype, "progress", {
                    get: function () {
                        return this._progress;
                    },
                    set: function (value) {
                        if (slim_bar_utils_1.isPresent(value)) {
                            this._progress = value + '%';
                        }
                    },
                    enumerable: true,
                    configurable: true
                });
                SlimBar.prototype.ngOnInit = function () {
                    var _this = this;
                    this.service.observable.subscribe(function (event) {
                        if (event.type === slim_bar_service_1.SlimBarEventType.PROGRESS) {
                            _this.progress = event.value;
                        }
                        else if (event.type === slim_bar_service_1.SlimBarEventType.COLOR) {
                            _this.color = event.value;
                        }
                        else if (event.type === slim_bar_service_1.SlimBarEventType.HEIGHT) {
                            _this.height = event.value;
                        }
                        else if (event.type === slim_bar_service_1.SlimBarEventType.VISIBLE) {
                            _this.show = event.value;
                        }
                    });
                };
                __decorate([
                    core_1.Input(), 
                    __metadata('design:type', String), 
                    __metadata('design:paramtypes', [String])
                ], SlimBar.prototype, "progress", null);
                __decorate([
                    core_1.Input(), 
                    __metadata('design:type', String)
                ], SlimBar.prototype, "color", void 0);
                __decorate([
                    core_1.Input(), 
                    __metadata('design:type', String)
                ], SlimBar.prototype, "height", void 0);
                __decorate([
                    core_1.Input(), 
                    __metadata('design:type', Boolean)
                ], SlimBar.prototype, "show", void 0);
                SlimBar = __decorate([
                    core_1.Component({
                        selector: 'ng2-slim-bar',
                        directives: [common_1.CORE_DIRECTIVES],
                        template: "\n    <div class=\"slim-bar\">\n        <div class=\"slim-bar-progress\" [style.width]=\"progress\" [style.backgroundColor]=\"color\" [style.color]=\"color\"\n            [style.height]=\"height\" [style.opacity]=\"show ? '1' : '0'\"></div>\n    </div>"
                    }), 
                    __metadata('design:paramtypes', [slim_bar_service_1.SlimBarService])
                ], SlimBar);
                return SlimBar;
            }());
            exports_1("SlimBar", SlimBar);
        }
    }
});
//# sourceMappingURL=slim-bar.component.js.map