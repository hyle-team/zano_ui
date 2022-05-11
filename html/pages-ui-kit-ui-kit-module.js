(window["webpackJsonp"] = window["webpackJsonp"] || []).push([["pages-ui-kit-ui-kit-module"],{

/***/ "./src/app/pages/ui-kit/modules/components/breadcrumbs/breadcrumbs.component.html":
/*!****************************************************************************************!*\
  !*** ./src/app/pages/ui-kit/modules/components/breadcrumbs/breadcrumbs.component.html ***!
  \****************************************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = "<h3>Default</h3>\n<div class=\"breadcrumbs mb-2\">\n    <div class=\"breadcrumb\">\n        <a>test 1 (link)</a>\n    </div>\n    <div class=\"breadcrumb\">\n        <span>test 2 (text)</span>\n    </div>\n    <div class=\"breadcrumb\">\n        <a>test 3 (link)</a>\n    </div>\n    <div class=\"breadcrumb\">\n        <span>test 4 (text)</span>\n    </div>\n    <div class=\"breadcrumb\">\n        <a>test 5 (link)</a>\n    </div>\n    <div class=\"breadcrumb\">\n        <a>test 6 (link)</a>\n    </div>\n    <div class=\"breadcrumb\">\n        <span>last item (text)</span>\n    </div>\n</div>\n\n<h3>With scroll</h3>\n<div class=\"breadcrumbs scrolled mb-2\">\n    <div class=\"breadcrumb\">\n        <a>test 1 (link)</a>\n    </div>\n    <div class=\"breadcrumb\">\n        <span>test 2 (text)</span>\n    </div>\n    <div class=\"breadcrumb\">\n        <a>test 3 (link)</a>\n    </div>\n    <div class=\"breadcrumb\">\n        <span>test 4 (text)</span>\n    </div>\n    <div class=\"breadcrumb\">\n        <a>test 5 (link)</a>\n    </div>\n    <div class=\"breadcrumb\">\n        <a>test 6 (link)</a>\n    </div>\n    <div class=\"breadcrumb\">\n        <a>test 7 (link)</a>\n    </div>\n    <div class=\"breadcrumb\">\n        <span>test 8 (text)</span>\n    </div>\n    <div class=\"breadcrumb\">\n        <a>test 9 (link)</a>\n    </div>\n    <div class=\"breadcrumb\">\n        <span>test 10 (text)</span>\n    </div>\n    <div class=\"breadcrumb\">\n        <a>test 11 (link)</a>\n    </div>\n    <div class=\"breadcrumb\">\n        <a>test 12 (link)</a>\n    </div>\n    <div class=\"breadcrumb\">\n        <span>last item (text)</span>\n    </div>\n</div>\n"

/***/ }),

/***/ "./src/app/pages/ui-kit/modules/components/breadcrumbs/breadcrumbs.component.scss":
/*!****************************************************************************************!*\
  !*** ./src/app/pages/ui-kit/modules/components/breadcrumbs/breadcrumbs.component.scss ***!
  \****************************************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = "\n/*# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IiIsImZpbGUiOiJzcmMvYXBwL3BhZ2VzL3VpLWtpdC9tb2R1bGVzL2NvbXBvbmVudHMvYnJlYWRjcnVtYnMvYnJlYWRjcnVtYnMuY29tcG9uZW50LnNjc3MifQ== */"

/***/ }),

/***/ "./src/app/pages/ui-kit/modules/components/breadcrumbs/breadcrumbs.component.ts":
/*!**************************************************************************************!*\
  !*** ./src/app/pages/ui-kit/modules/components/breadcrumbs/breadcrumbs.component.ts ***!
  \**************************************************************************************/
/*! exports provided: BreadcrumbsComponent */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "BreadcrumbsComponent", function() { return BreadcrumbsComponent; });
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @angular/core */ "./node_modules/@angular/core/fesm5/core.js");
var __decorate = (undefined && undefined.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (undefined && undefined.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};

var BreadcrumbsComponent = /** @class */ (function () {
    function BreadcrumbsComponent() {
    }
    BreadcrumbsComponent.prototype.ngOnInit = function () {
    };
    BreadcrumbsComponent = __decorate([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_0__["Component"])({
            selector: 'app-breadcrumbs',
            template: __webpack_require__(/*! ./breadcrumbs.component.html */ "./src/app/pages/ui-kit/modules/components/breadcrumbs/breadcrumbs.component.html"),
            styles: [__webpack_require__(/*! ./breadcrumbs.component.scss */ "./src/app/pages/ui-kit/modules/components/breadcrumbs/breadcrumbs.component.scss")]
        }),
        __metadata("design:paramtypes", [])
    ], BreadcrumbsComponent);
    return BreadcrumbsComponent;
}());



/***/ }),

/***/ "./src/app/pages/ui-kit/modules/components/buttons/buttons.component.html":
/*!********************************************************************************!*\
  !*** ./src/app/pages/ui-kit/modules/components/buttons/buttons.component.html ***!
  \********************************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = "<h3 class=\"mb-1\">Primary</h3>\r\n<button class=\"m-1 primary small\">Add Wallet</button>\r\n<button class=\"m-1 primary big\">Add / Save</button>\r\n<button class=\"m-1 primary big\"\r\n        disabled>Add / Save\r\n</button>\r\n\r\n<h3 class=\"mb-1\">Outline</h3>\r\n<button class=\"m-1 outline small\"><i class=\"icon plus mr-1\"></i>Add Wallet</button>\r\n<button class=\"m-1 outline big\">Add / Save</button>\r\n<button class=\"m-1 outline big\"\r\n        disabled>Add / Save\r\n</button>\r\n\r\n<h3 class=\"mb-1\">Circle</h3>\r\n<button class=\"m-1 btn-icon circle small mr-2\"><i class=\"icon dropdown-arrow-left\"></i></button>\r\n<button class=\"m-1 btn-icon circle big mr-2\"><i class=\"icon dropdown-arrow-left\"></i></button>\r\n<button class=\"m-1 btn-icon circle big mr-2\" disabled><i class=\"icon dropdown-arrow-left\"></i></button>\r\n"

/***/ }),

/***/ "./src/app/pages/ui-kit/modules/components/buttons/buttons.component.scss":
/*!********************************************************************************!*\
  !*** ./src/app/pages/ui-kit/modules/components/buttons/buttons.component.scss ***!
  \********************************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = "\n/*# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IiIsImZpbGUiOiJzcmMvYXBwL3BhZ2VzL3VpLWtpdC9tb2R1bGVzL2NvbXBvbmVudHMvYnV0dG9ucy9idXR0b25zLmNvbXBvbmVudC5zY3NzIn0= */"

/***/ }),

/***/ "./src/app/pages/ui-kit/modules/components/buttons/buttons.component.ts":
/*!******************************************************************************!*\
  !*** ./src/app/pages/ui-kit/modules/components/buttons/buttons.component.ts ***!
  \******************************************************************************/
/*! exports provided: ButtonsComponent */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "ButtonsComponent", function() { return ButtonsComponent; });
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @angular/core */ "./node_modules/@angular/core/fesm5/core.js");
var __decorate = (undefined && undefined.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (undefined && undefined.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};

var ButtonsComponent = /** @class */ (function () {
    function ButtonsComponent() {
    }
    ButtonsComponent.prototype.ngOnInit = function () {
    };
    ButtonsComponent = __decorate([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_0__["Component"])({
            selector: 'app-buttons',
            template: __webpack_require__(/*! ./buttons.component.html */ "./src/app/pages/ui-kit/modules/components/buttons/buttons.component.html"),
            styles: [__webpack_require__(/*! ./buttons.component.scss */ "./src/app/pages/ui-kit/modules/components/buttons/buttons.component.scss")]
        }),
        __metadata("design:paramtypes", [])
    ], ButtonsComponent);
    return ButtonsComponent;
}());



/***/ }),

/***/ "./src/app/pages/ui-kit/modules/components/components.module.ts":
/*!**********************************************************************!*\
  !*** ./src/app/pages/ui-kit/modules/components/components.module.ts ***!
  \**********************************************************************/
/*! exports provided: ComponentsModule */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "ComponentsModule", function() { return ComponentsModule; });
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @angular/core */ "./node_modules/@angular/core/fesm5/core.js");
/* harmony import */ var _angular_common__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @angular/common */ "./node_modules/@angular/common/fesm5/common.js");
/* harmony import */ var ___WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./ */ "./src/app/pages/ui-kit/modules/components/index.ts");
/* harmony import */ var _breadcrumbs_breadcrumbs_component__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./breadcrumbs/breadcrumbs.component */ "./src/app/pages/ui-kit/modules/components/breadcrumbs/breadcrumbs.component.ts");
/* harmony import */ var _ngx_translate_core__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! @ngx-translate/core */ "./node_modules/@ngx-translate/core/fesm5/ngx-translate-core.js");
/* harmony import */ var _wallets_wallets_component__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./wallets/wallets.component */ "./src/app/pages/ui-kit/modules/components/wallets/wallets.component.ts");
/* harmony import */ var _shared_shared_module__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ../../../../_shared/shared.module */ "./src/app/_shared/shared.module.ts");
var __decorate = (undefined && undefined.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};







var ComponentsModule = /** @class */ (function () {
    function ComponentsModule() {
    }
    ComponentsModule = __decorate([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_0__["NgModule"])({
            declarations: [___WEBPACK_IMPORTED_MODULE_2__["ButtonsComponent"], ___WEBPACK_IMPORTED_MODULE_2__["ProgressBarsComponent"], _breadcrumbs_breadcrumbs_component__WEBPACK_IMPORTED_MODULE_3__["BreadcrumbsComponent"], _wallets_wallets_component__WEBPACK_IMPORTED_MODULE_5__["WalletsComponent"]],
            imports: [
                _angular_common__WEBPACK_IMPORTED_MODULE_1__["CommonModule"],
                _ngx_translate_core__WEBPACK_IMPORTED_MODULE_4__["TranslateModule"],
                _shared_shared_module__WEBPACK_IMPORTED_MODULE_6__["SharedModule"]
            ],
            exports: [___WEBPACK_IMPORTED_MODULE_2__["ButtonsComponent"], ___WEBPACK_IMPORTED_MODULE_2__["ProgressBarsComponent"], _breadcrumbs_breadcrumbs_component__WEBPACK_IMPORTED_MODULE_3__["BreadcrumbsComponent"], _wallets_wallets_component__WEBPACK_IMPORTED_MODULE_5__["WalletsComponent"]]
        })
    ], ComponentsModule);
    return ComponentsModule;
}());



/***/ }),

/***/ "./src/app/pages/ui-kit/modules/components/index.ts":
/*!**********************************************************!*\
  !*** ./src/app/pages/ui-kit/modules/components/index.ts ***!
  \**********************************************************/
/*! exports provided: ButtonsComponent, ProgressBarsComponent */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _buttons_buttons_component__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./buttons/buttons.component */ "./src/app/pages/ui-kit/modules/components/buttons/buttons.component.ts");
/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "ButtonsComponent", function() { return _buttons_buttons_component__WEBPACK_IMPORTED_MODULE_0__["ButtonsComponent"]; });

/* harmony import */ var _progress_bars_progress_bars_component__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./progress-bars/progress-bars.component */ "./src/app/pages/ui-kit/modules/components/progress-bars/progress-bars.component.ts");
/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "ProgressBarsComponent", function() { return _progress_bars_progress_bars_component__WEBPACK_IMPORTED_MODULE_1__["ProgressBarsComponent"]; });





/***/ }),

/***/ "./src/app/pages/ui-kit/modules/components/progress-bars/progress-bars.component.html":
/*!********************************************************************************************!*\
  !*** ./src/app/pages/ui-kit/modules/components/progress-bars/progress-bars.component.html ***!
  \********************************************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = "<div class=\"synchronization-status flex flex__direction-column\">\r\n    <div class=\"status-container\">\r\n        <div class=\"offline mb-0_5\">\r\n            <span>{{ 'SIDEBAR.SYNCHRONIZATION.OFFLINE' | translate }}</span>\r\n        </div>\r\n        <div class=\"syncing mb-0_5\">\r\n            {{ 'SIDEBAR.SYNCHRONIZATION.SYNCING' | translate }} {{ 100 }}{{\r\n            'SIDEBAR.SYNCHRONIZATION.SLASH' | translate }}{{ 20000 }}\r\n        </div>\r\n        <div class=\"online mb-0_5\">\r\n            <span>{{ 'SIDEBAR.SYNCHRONIZATION.ONLINE' | translate }}</span>\r\n        </div>\r\n        <div class=\"loading mb-0_5\">\r\n            {{ 'SIDEBAR.SYNCHRONIZATION.LOADING' | translate }}\r\n        </div>\r\n        <div class=\"offline mb-0_5\">\r\n            {{ 'SIDEBAR.SYNCHRONIZATION.ERROR' | translate }}\r\n        </div>\r\n        <div class=\"online mb-0_5\">\r\n            {{ 'SIDEBAR.SYNCHRONIZATION.COMPLETE' | translate }}\r\n        </div>\r\n        <div class=\"syncing mb-0_5\">\r\n            {{ 'SIDEBAR.SYNCHRONIZATION.DOWNLOADING' | translate }}\r\n            {{ 2345 }}\r\n            {{ 'SIDEBAR.SYNCHRONIZATION.SLASH' | translate }}\r\n            {{ 18000 }}{{ 'SIDEBAR.SYNCHRONIZATION.MB' | translate }}\r\n        </div>\r\n\r\n        <div class=\"progress-bar-container mb-1\">\r\n            <div class=\"syncing\">\r\n                <div class=\"progress-bar\">\r\n                    <div class=\"fill\"\r\n                         [style.width]=\"50 + '%'\"></div>\r\n                </div>\r\n            </div>\r\n        </div>\r\n\r\n        <div class=\"progress-bar-container mb-1\">\r\n            <div class=\"loading\"></div>\r\n        </div>\r\n\r\n        <div class=\"progress-bar-container mb-1\">\r\n            <div class=\"syncing downloading\">\r\n                <div class=\"progress-bar\">\r\n                    <div class=\"fill\"\r\n                         [style.width]=\"44 + '%'\"></div>\r\n                </div>\r\n            </div>\r\n        </div>\r\n    </div>\r\n\r\n    <div class=\"update-container\">\r\n\r\n        <div class=\"update-text standard mb-0_5\">\r\n            <span [style.cursor]=\"'pointer'\">{{ 'SIDEBAR.UPDATE.STANDARD' | translate }}</span>\r\n        </div>\r\n        <i class=\"icon update standard\"></i>\r\n    </div>\r\n\r\n    <div class=\"update-container\">\r\n        <div class=\"update-text important\">\r\n            <span [style.cursor]=\"'pointer'\">{{ 'SIDEBAR.UPDATE.IMPORTANT' | translate }}</span>\r\n            <span style=\"font-size: 1rem\">{{ 'SIDEBAR.UPDATE.IMPORTANT_HINT' | translate }}</span>\r\n        </div>\r\n        <i class=\"icon update important\"></i>\r\n    </div>\r\n\r\n    <div class=\"update-container\">\r\n        <div class=\"update-text critical\">\r\n            <span [style.cursor]=\"'pointer'\">{{ 'SIDEBAR.UPDATE.CRITICAL' | translate }}</span>\r\n            <span style=\"font-size: 1rem\">{{ 'SIDEBAR.UPDATE.IMPORTANT_HINT' | translate }}</span>\r\n        </div>\r\n        <i class=\"icon update critical\"></i>\r\n    </div>\r\n\r\n    <div class=\"update-container\">\r\n        <div class=\"update-text time-orange\">\r\n            <span>{{ 'SIDEBAR.UPDATE.TIME' | translate }}</span>\r\n        </div>\r\n        <i class=\"icon time-orange\"></i>\r\n    </div>\r\n</div>\r\n\r\n"

/***/ }),

/***/ "./src/app/pages/ui-kit/modules/components/progress-bars/progress-bars.component.scss":
/*!********************************************************************************************!*\
  !*** ./src/app/pages/ui-kit/modules/components/progress-bars/progress-bars.component.scss ***!
  \********************************************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = "\n/*# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IiIsImZpbGUiOiJzcmMvYXBwL3BhZ2VzL3VpLWtpdC9tb2R1bGVzL2NvbXBvbmVudHMvcHJvZ3Jlc3MtYmFycy9wcm9ncmVzcy1iYXJzLmNvbXBvbmVudC5zY3NzIn0= */"

/***/ }),

/***/ "./src/app/pages/ui-kit/modules/components/progress-bars/progress-bars.component.ts":
/*!******************************************************************************************!*\
  !*** ./src/app/pages/ui-kit/modules/components/progress-bars/progress-bars.component.ts ***!
  \******************************************************************************************/
/*! exports provided: ProgressBarsComponent */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "ProgressBarsComponent", function() { return ProgressBarsComponent; });
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @angular/core */ "./node_modules/@angular/core/fesm5/core.js");
var __decorate = (undefined && undefined.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (undefined && undefined.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};

var ProgressBarsComponent = /** @class */ (function () {
    function ProgressBarsComponent() {
    }
    ProgressBarsComponent.prototype.ngOnInit = function () {
    };
    ProgressBarsComponent = __decorate([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_0__["Component"])({
            selector: 'app-progress-bars',
            template: __webpack_require__(/*! ./progress-bars.component.html */ "./src/app/pages/ui-kit/modules/components/progress-bars/progress-bars.component.html"),
            styles: [__webpack_require__(/*! ./progress-bars.component.scss */ "./src/app/pages/ui-kit/modules/components/progress-bars/progress-bars.component.scss")]
        }),
        __metadata("design:paramtypes", [])
    ], ProgressBarsComponent);
    return ProgressBarsComponent;
}());



/***/ }),

/***/ "./src/app/pages/ui-kit/modules/components/wallets/wallets.component.html":
/*!********************************************************************************!*\
  !*** ./src/app/pages/ui-kit/modules/components/wallets/wallets.component.html ***!
  \********************************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = "<form class=\"mb-2 flex flex__direction-column\">\n    <app-checkbox class=\"mb-1\"\n                  label=\"classWalletActive\"\n                  [value]=\"classWalletActive\"\n                  (emitChange)=\"classWalletActive = !classWalletActive\"></app-checkbox>\n    <app-checkbox class=\"mb-1\"\n                  label=\"classWalletAuditable\"\n                  [value]=\"classWalletAuditable\"\n                  (emitChange)=\"classWalletAuditable = !classWalletAuditable\"></app-checkbox>\n    <app-checkbox class=\"mb-1\"\n                  label=\"classWalletWatchOnly\"\n                  [value]=\"classWalletWatchOnly\"\n                  (emitChange)=\"classWalletWatchOnly = !classWalletWatchOnly\"></app-checkbox>\n    <app-checkbox class=\"mb-1\"\n                  label=\"showIndicator\"\n                  [value]=\"showIndicator\"\n                  (emitChange)=\"showIndicator = !showIndicator\"></app-checkbox>\n    <app-checkbox class=\"mb-1\"\n                  label=\"showPrice\"\n                  [value]=\"showPrice\"\n                  (emitChange)=\"showPrice = !showPrice\"></app-checkbox>\n    <app-checkbox class=\"mb-1\"\n                  label=\"percentRed\"\n                  [value]=\"percentRed\"\n                  (emitChange)=\"percentRed = !percentRed\"></app-checkbox>\n    <app-checkbox class=\"mb-1\"\n                  label=\"showStaking\"\n                  [value]=\"showStaking\"\n                  (emitChange)=\"showStaking = !showStaking\"></app-checkbox>\n    <app-checkbox class=\"mb-1\"\n                  label=\"showProgressBar\"\n                  [value]=\"showProgressBar\"\n                  (emitChange)=\"showProgressBar = !showProgressBar\"></app-checkbox>\n</form>\n\n<div class=\"wallet\"\n     cdkDrag\n     vsDragScroll\n     [class.active]=\"classWalletActive\"\n     [class.auditable]=\"classWalletAuditable\"\n     [class.watch-only]=\"classWalletWatchOnly\">\n\n    <div class=\"header\">\n        <div class=\"left\">\n            <div class=\"name text-ellipsis\">\n                            <span class=\"indicator\"\n                                  *ngIf=\"showIndicator\">\n                                12\n                            </span>\n\n                <span class=\"name\">test</span>\n            </div>\n        </div>\n        <div class=\"right\">\n            <button type=\"button\">\n                <i class=\"icon close\"></i>\n            </button>\n        </div>\n    </div>\n\n    <div class=\"balance\">\n        <span class=\"text-ellipsis mr-1\">9999</span>\n        <span>ZANO</span>\n    </div>\n\n    <ng-container *ngIf=\"showPrice\">\n        <h4 class=\"price\">\n            $999\n\n            <span class=\"percent\"\n                  [class.red]=\"percentRed\">20%</span>\n        </h4>\n    </ng-container>\n\n    <ng-container *ngIf=\"showStaking\">\n        <div class=\"staking\">\n            <span class=\"text\">{{ 'SIDEBAR.ACCOUNT.STAKING' | translate }}</span>\n            <app-switch></app-switch>\n        </div>\n    </ng-container>\n\n    <div class=\"account-synchronization\"\n         *ngIf=\"showProgressBar\">\n        <div class=\"progress-bar\">\n            <div class=\"fill\"\n                 [style.width]=\"33 + '%'\"></div>\n        </div>\n        <div class=\"progress-percent\">33%</div>\n    </div>\n</div>\n"

/***/ }),

/***/ "./src/app/pages/ui-kit/modules/components/wallets/wallets.component.scss":
/*!********************************************************************************!*\
  !*** ./src/app/pages/ui-kit/modules/components/wallets/wallets.component.scss ***!
  \********************************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = "\n/*# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IiIsImZpbGUiOiJzcmMvYXBwL3BhZ2VzL3VpLWtpdC9tb2R1bGVzL2NvbXBvbmVudHMvd2FsbGV0cy93YWxsZXRzLmNvbXBvbmVudC5zY3NzIn0= */"

/***/ }),

/***/ "./src/app/pages/ui-kit/modules/components/wallets/wallets.component.ts":
/*!******************************************************************************!*\
  !*** ./src/app/pages/ui-kit/modules/components/wallets/wallets.component.ts ***!
  \******************************************************************************/
/*! exports provided: WalletsComponent */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "WalletsComponent", function() { return WalletsComponent; });
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @angular/core */ "./node_modules/@angular/core/fesm5/core.js");
var __decorate = (undefined && undefined.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (undefined && undefined.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};

var WalletsComponent = /** @class */ (function () {
    function WalletsComponent() {
        this.classWalletActive = true;
        this.classWalletAuditable = false;
        this.classWalletWatchOnly = false;
        this.showIndicator = false;
        this.showPrice = true;
        this.percentRed = false;
        this.showStaking = true;
        this.showProgressBar = false;
    }
    WalletsComponent.prototype.ngOnInit = function () {
    };
    WalletsComponent = __decorate([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_0__["Component"])({
            selector: 'app-wallets',
            template: __webpack_require__(/*! ./wallets.component.html */ "./src/app/pages/ui-kit/modules/components/wallets/wallets.component.html"),
            styles: [__webpack_require__(/*! ./wallets.component.scss */ "./src/app/pages/ui-kit/modules/components/wallets/wallets.component.scss")]
        }),
        __metadata("design:paramtypes", [])
    ], WalletsComponent);
    return WalletsComponent;
}());



/***/ }),

/***/ "./src/app/pages/ui-kit/modules/form/components/checkboxs/checkboxs.component.html":
/*!*****************************************************************************************!*\
  !*** ./src/app/pages/ui-kit/modules/form/components/checkboxs/checkboxs.component.html ***!
  \*****************************************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = "<h3 class=\"mb-2\">Disabled = true</h3>\r\n<app-checkbox class=\"mb-1 max-w-50-rem w-100\" [disabled]=\"true\" label=\"LabelLabelLabelLabelLabelLabelLabelLabelLabelLabelLabelLabelLabelLabelLabelLabelLabelLabelLabelLabelLabelLabelLabelLabelLabelLabelLabelLabelLabelLabelLabelLabelLabelLabelLabelLabelLabelLabelLabelLabelLabelLabelLabelLabelLabel\" ></app-checkbox>\r\n\r\n<h3 class=\"mb-2\">Default</h3>\r\n<app-checkbox class=\"mb-1 max-w-50-rem w-100\" label=\"Label\"></app-checkbox>\r\n"

/***/ }),

/***/ "./src/app/pages/ui-kit/modules/form/components/checkboxs/checkboxs.component.scss":
/*!*****************************************************************************************!*\
  !*** ./src/app/pages/ui-kit/modules/form/components/checkboxs/checkboxs.component.scss ***!
  \*****************************************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = "\n/*# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IiIsImZpbGUiOiJzcmMvYXBwL3BhZ2VzL3VpLWtpdC9tb2R1bGVzL2Zvcm0vY29tcG9uZW50cy9jaGVja2JveHMvY2hlY2tib3hzLmNvbXBvbmVudC5zY3NzIn0= */"

/***/ }),

/***/ "./src/app/pages/ui-kit/modules/form/components/checkboxs/checkboxs.component.ts":
/*!***************************************************************************************!*\
  !*** ./src/app/pages/ui-kit/modules/form/components/checkboxs/checkboxs.component.ts ***!
  \***************************************************************************************/
/*! exports provided: CheckboxsComponent */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "CheckboxsComponent", function() { return CheckboxsComponent; });
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @angular/core */ "./node_modules/@angular/core/fesm5/core.js");
var __decorate = (undefined && undefined.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (undefined && undefined.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};

var CheckboxsComponent = /** @class */ (function () {
    function CheckboxsComponent() {
    }
    CheckboxsComponent.prototype.ngOnInit = function () {
    };
    CheckboxsComponent = __decorate([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_0__["Component"])({
            selector: 'app-checkboxs',
            template: __webpack_require__(/*! ./checkboxs.component.html */ "./src/app/pages/ui-kit/modules/form/components/checkboxs/checkboxs.component.html"),
            styles: [__webpack_require__(/*! ./checkboxs.component.scss */ "./src/app/pages/ui-kit/modules/form/components/checkboxs/checkboxs.component.scss")]
        }),
        __metadata("design:paramtypes", [])
    ], CheckboxsComponent);
    return CheckboxsComponent;
}());



/***/ }),

/***/ "./src/app/pages/ui-kit/modules/form/components/index.ts":
/*!***************************************************************!*\
  !*** ./src/app/pages/ui-kit/modules/form/components/index.ts ***!
  \***************************************************************/
/*! exports provided: CheckboxsComponent, InputsComponent, SelectsComponent, SwitchesComponent */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _checkboxs_checkboxs_component__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./checkboxs/checkboxs.component */ "./src/app/pages/ui-kit/modules/form/components/checkboxs/checkboxs.component.ts");
/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "CheckboxsComponent", function() { return _checkboxs_checkboxs_component__WEBPACK_IMPORTED_MODULE_0__["CheckboxsComponent"]; });

/* harmony import */ var _inputs_inputs_component__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./inputs/inputs.component */ "./src/app/pages/ui-kit/modules/form/components/inputs/inputs.component.ts");
/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "InputsComponent", function() { return _inputs_inputs_component__WEBPACK_IMPORTED_MODULE_1__["InputsComponent"]; });

/* harmony import */ var _selects_selects_component__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./selects/selects.component */ "./src/app/pages/ui-kit/modules/form/components/selects/selects.component.ts");
/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "SelectsComponent", function() { return _selects_selects_component__WEBPACK_IMPORTED_MODULE_2__["SelectsComponent"]; });

/* harmony import */ var _switches_switches_component__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./switches/switches.component */ "./src/app/pages/ui-kit/modules/form/components/switches/switches.component.ts");
/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "SwitchesComponent", function() { return _switches_switches_component__WEBPACK_IMPORTED_MODULE_3__["SwitchesComponent"]; });







/***/ }),

/***/ "./src/app/pages/ui-kit/modules/form/components/inputs/inputs.component.html":
/*!***********************************************************************************!*\
  !*** ./src/app/pages/ui-kit/modules/form/components/inputs/inputs.component.html ***!
  \***********************************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = "<h3 class=\"mb-3\">Input type=\"text\"</h3>\r\n\r\n<h4 class=\"mb-2\">Disabled = true</h4>\r\n\r\n<div class=\"form__field\">\r\n    <label for=\"test-id1\">Label</label>\r\n    <input class=\"form__field--input\" type=\"text\" id=\"test-id1\" name=\"test1\" placeholder=\"Enter a name here\" disabled>\r\n</div>\r\n\r\n<h4 class=\"mb-3\">Without label</h4>\r\n\r\n<div class=\"form__field\">\r\n    <input class=\"form__field--input\" type=\"text\" name=\"test1\" placeholder=\"Enter a name here\">\r\n</div>\r\n\r\n<div class=\"form__field\">\r\n    <input class=\"form__field--input\" type=\"text\" value=\"Name\" name=\"test1\" placeholder=\"Enter a name here\">\r\n</div>\r\n\r\n<h3 class=\"mb-3\">Input type=\"password\"</h3>\r\n\r\n<h4 class=\"mb-2\">Disabled = true</h4>\r\n\r\n<div class=\"form__field\">\r\n    <label for=\"test-id4\">Label</label>\r\n    <input class=\"form__field--input\" type=\"password\" id=\"test-id4\" value=\"Name\" name=\"test1\" placeholder=\"Enter a name here\" disabled>\r\n</div>\r\n\r\n<h4 class=\"mb-3\">Without label</h4>\r\n\r\n<div class=\"form__field\">\r\n    <input class=\"form__field--input\" type=\"password\" value=\"Name\" name=\"1234567890\" placeholder=\"Enter a name here\">\r\n</div>\r\n\r\n<h4 class=\"mb-3\">With error</h4>\r\n\r\n<div class=\"form__field\">\r\n    <input class=\"form__field--input invalid\" type=\"password\" value=\"Name\" name=\"1234567890\" placeholder=\"Enter a name here\">\r\n    <div class=\"error\">\r\n        Error text\r\n    </div>\r\n</div>\r\n\r\n<h4 class=\"mb-3\">With success</h4>\r\n\r\n<div class=\"form__field\">\r\n    <input class=\"form__field--input\" type=\"password\" value=\"Name\" name=\"1234567890\" placeholder=\"Enter a name here\">\r\n    <div class=\"success\">\r\n        Success text\r\n    </div>\r\n</div>\r\n\r\n"

/***/ }),

/***/ "./src/app/pages/ui-kit/modules/form/components/inputs/inputs.component.scss":
/*!***********************************************************************************!*\
  !*** ./src/app/pages/ui-kit/modules/form/components/inputs/inputs.component.scss ***!
  \***********************************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = "\n/*# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IiIsImZpbGUiOiJzcmMvYXBwL3BhZ2VzL3VpLWtpdC9tb2R1bGVzL2Zvcm0vY29tcG9uZW50cy9pbnB1dHMvaW5wdXRzLmNvbXBvbmVudC5zY3NzIn0= */"

/***/ }),

/***/ "./src/app/pages/ui-kit/modules/form/components/inputs/inputs.component.ts":
/*!*********************************************************************************!*\
  !*** ./src/app/pages/ui-kit/modules/form/components/inputs/inputs.component.ts ***!
  \*********************************************************************************/
/*! exports provided: InputsComponent */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "InputsComponent", function() { return InputsComponent; });
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @angular/core */ "./node_modules/@angular/core/fesm5/core.js");
var __decorate = (undefined && undefined.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (undefined && undefined.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};

var InputsComponent = /** @class */ (function () {
    function InputsComponent() {
    }
    InputsComponent.prototype.ngOnInit = function () {
    };
    InputsComponent = __decorate([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_0__["Component"])({
            selector: 'app-inputs',
            template: __webpack_require__(/*! ./inputs.component.html */ "./src/app/pages/ui-kit/modules/form/components/inputs/inputs.component.html"),
            styles: [__webpack_require__(/*! ./inputs.component.scss */ "./src/app/pages/ui-kit/modules/form/components/inputs/inputs.component.scss")]
        }),
        __metadata("design:paramtypes", [])
    ], InputsComponent);
    return InputsComponent;
}());



/***/ }),

/***/ "./src/app/pages/ui-kit/modules/form/components/selects/selects.component.html":
/*!*************************************************************************************!*\
  !*** ./src/app/pages/ui-kit/modules/form/components/selects/selects.component.html ***!
  \*************************************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = "<div class=\"form__field mb-2\">\r\n    <label>Default</label>\r\n    <ng-select [items]=\"scaleItems\"\r\n               bindValue=\"value\"\r\n               bindLabel=\"name\"\r\n               [clearable]=\"false\"\r\n               [searchable]=\"false\">\r\n        <ng-template ng-label-tmp let-item=\"item\">\r\n            {{item.name | translate}}\r\n        </ng-template>\r\n        <ng-template ng-option-tmp let-item=\"item\" let-index=\"index\">\r\n            {{item.name | translate}}\r\n        </ng-template>\r\n    </ng-select>\r\n</div>\r\n\r\n<div class=\"form__field\">\r\n    <label>With circle</label>\r\n    <ng-select [items]=\"scaleItems\"\r\n               class=\"with-circle\"\r\n               bindValue=\"value\"\r\n               bindLabel=\"name\"\r\n               [clearable]=\"false\"\r\n               [searchable]=\"false\">\r\n        <ng-template ng-label-tmp let-item=\"item\">\r\n            {{item.name | translate}}\r\n        </ng-template>\r\n        <ng-template ng-option-tmp let-item=\"item\" let-index=\"index\">\r\n            {{item.name | translate}}\r\n        </ng-template>\r\n    </ng-select>\r\n</div>\r\n"

/***/ }),

/***/ "./src/app/pages/ui-kit/modules/form/components/selects/selects.component.scss":
/*!*************************************************************************************!*\
  !*** ./src/app/pages/ui-kit/modules/form/components/selects/selects.component.scss ***!
  \*************************************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = "\n/*# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IiIsImZpbGUiOiJzcmMvYXBwL3BhZ2VzL3VpLWtpdC9tb2R1bGVzL2Zvcm0vY29tcG9uZW50cy9zZWxlY3RzL3NlbGVjdHMuY29tcG9uZW50LnNjc3MifQ== */"

/***/ }),

/***/ "./src/app/pages/ui-kit/modules/form/components/selects/selects.component.ts":
/*!***********************************************************************************!*\
  !*** ./src/app/pages/ui-kit/modules/form/components/selects/selects.component.ts ***!
  \***********************************************************************************/
/*! exports provided: SelectsComponent */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "SelectsComponent", function() { return SelectsComponent; });
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @angular/core */ "./node_modules/@angular/core/fesm5/core.js");
/* harmony import */ var src_app_helpers_data_scale_items__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! src/app/_helpers/data/scale-items */ "./src/app/_helpers/data/scale-items.ts");
var __decorate = (undefined && undefined.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (undefined && undefined.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};


var SelectsComponent = /** @class */ (function () {
    function SelectsComponent() {
        this.scaleItems = src_app_helpers_data_scale_items__WEBPACK_IMPORTED_MODULE_1__["scaleItems"].slice();
    }
    SelectsComponent.prototype.ngOnInit = function () {
    };
    SelectsComponent = __decorate([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_0__["Component"])({
            selector: 'app-selects',
            template: __webpack_require__(/*! ./selects.component.html */ "./src/app/pages/ui-kit/modules/form/components/selects/selects.component.html"),
            styles: [__webpack_require__(/*! ./selects.component.scss */ "./src/app/pages/ui-kit/modules/form/components/selects/selects.component.scss")]
        }),
        __metadata("design:paramtypes", [])
    ], SelectsComponent);
    return SelectsComponent;
}());



/***/ }),

/***/ "./src/app/pages/ui-kit/modules/form/components/switches/switches.component.html":
/*!***************************************************************************************!*\
  !*** ./src/app/pages/ui-kit/modules/form/components/switches/switches.component.html ***!
  \***************************************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = "<h3 class=\"mb-1\">Switch default</h3>\r\n<app-switch class=\"mb-1\"></app-switch>\r\n\r\n<h3 class=\"mb-1\">value = true</h3>\r\n<app-switch class=\"mb-1\" [value]=\"true\"></app-switch>\r\n\r\n<h3 class=\"mb-1\">value = true, disabled = true</h3>\r\n<app-switch class=\"mb-1\" [value]=\"true\" [disabled]=\"true\"></app-switch>\r\n"

/***/ }),

/***/ "./src/app/pages/ui-kit/modules/form/components/switches/switches.component.scss":
/*!***************************************************************************************!*\
  !*** ./src/app/pages/ui-kit/modules/form/components/switches/switches.component.scss ***!
  \***************************************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = "\n/*# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IiIsImZpbGUiOiJzcmMvYXBwL3BhZ2VzL3VpLWtpdC9tb2R1bGVzL2Zvcm0vY29tcG9uZW50cy9zd2l0Y2hlcy9zd2l0Y2hlcy5jb21wb25lbnQuc2NzcyJ9 */"

/***/ }),

/***/ "./src/app/pages/ui-kit/modules/form/components/switches/switches.component.ts":
/*!*************************************************************************************!*\
  !*** ./src/app/pages/ui-kit/modules/form/components/switches/switches.component.ts ***!
  \*************************************************************************************/
/*! exports provided: SwitchesComponent */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "SwitchesComponent", function() { return SwitchesComponent; });
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @angular/core */ "./node_modules/@angular/core/fesm5/core.js");
var __decorate = (undefined && undefined.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (undefined && undefined.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};

var SwitchesComponent = /** @class */ (function () {
    function SwitchesComponent() {
    }
    SwitchesComponent.prototype.ngOnInit = function () {
    };
    SwitchesComponent = __decorate([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_0__["Component"])({
            selector: 'app-switches',
            template: __webpack_require__(/*! ./switches.component.html */ "./src/app/pages/ui-kit/modules/form/components/switches/switches.component.html"),
            styles: [__webpack_require__(/*! ./switches.component.scss */ "./src/app/pages/ui-kit/modules/form/components/switches/switches.component.scss")]
        }),
        __metadata("design:paramtypes", [])
    ], SwitchesComponent);
    return SwitchesComponent;
}());



/***/ }),

/***/ "./src/app/pages/ui-kit/modules/form/form.component.html":
/*!***************************************************************!*\
  !*** ./src/app/pages/ui-kit/modules/form/form.component.html ***!
  \***************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = "<div class=\"mb-2\">\r\n    <h2 class=\"mb-1\">Inputs</h2>\r\n    <app-inputs></app-inputs>\r\n</div>\r\n\r\n<div class=\"mb-2\">\r\n    <h2 class=\"mb-1\">Selects</h2>\r\n    <app-selects></app-selects>\r\n</div>\r\n\r\n<div class=\"mb-2\">\r\n    <h2 class=\"mb-1\">Checkbox</h2>\r\n    <app-checkboxs></app-checkboxs>\r\n</div>\r\n\r\n<div class=\"mb-2\">\r\n    <h2 class=\"mb-1\">Switches</h2>\r\n    <app-switches></app-switches>\r\n</div>\r\n"

/***/ }),

/***/ "./src/app/pages/ui-kit/modules/form/form.component.scss":
/*!***************************************************************!*\
  !*** ./src/app/pages/ui-kit/modules/form/form.component.scss ***!
  \***************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = "\n/*# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IiIsImZpbGUiOiJzcmMvYXBwL3BhZ2VzL3VpLWtpdC9tb2R1bGVzL2Zvcm0vZm9ybS5jb21wb25lbnQuc2NzcyJ9 */"

/***/ }),

/***/ "./src/app/pages/ui-kit/modules/form/form.component.ts":
/*!*************************************************************!*\
  !*** ./src/app/pages/ui-kit/modules/form/form.component.ts ***!
  \*************************************************************/
/*! exports provided: FormComponent */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "FormComponent", function() { return FormComponent; });
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @angular/core */ "./node_modules/@angular/core/fesm5/core.js");
var __decorate = (undefined && undefined.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (undefined && undefined.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};

var FormComponent = /** @class */ (function () {
    function FormComponent() {
    }
    FormComponent.prototype.ngOnInit = function () {
    };
    FormComponent = __decorate([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_0__["Component"])({
            selector: 'app-form',
            template: __webpack_require__(/*! ./form.component.html */ "./src/app/pages/ui-kit/modules/form/form.component.html"),
            styles: [__webpack_require__(/*! ./form.component.scss */ "./src/app/pages/ui-kit/modules/form/form.component.scss")]
        }),
        __metadata("design:paramtypes", [])
    ], FormComponent);
    return FormComponent;
}());



/***/ }),

/***/ "./src/app/pages/ui-kit/modules/form/form.module.ts":
/*!**********************************************************!*\
  !*** ./src/app/pages/ui-kit/modules/form/form.module.ts ***!
  \**********************************************************/
/*! exports provided: FormModule */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "FormModule", function() { return FormModule; });
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @angular/core */ "./node_modules/@angular/core/fesm5/core.js");
/* harmony import */ var _angular_common__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @angular/common */ "./node_modules/@angular/common/fesm5/common.js");
/* harmony import */ var _form_component__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./form.component */ "./src/app/pages/ui-kit/modules/form/form.component.ts");
/* harmony import */ var _components__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./components */ "./src/app/pages/ui-kit/modules/form/components/index.ts");
/* harmony import */ var src_app_shared_shared_module__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! src/app/_shared/shared.module */ "./src/app/_shared/shared.module.ts");
/* harmony import */ var _ng_select_ng_select__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! @ng-select/ng-select */ "./node_modules/@ng-select/ng-select/fesm5/ng-select.js");
/* harmony import */ var _ngx_translate_core__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! @ngx-translate/core */ "./node_modules/@ngx-translate/core/fesm5/ngx-translate-core.js");
var __decorate = (undefined && undefined.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};







var FormModule = /** @class */ (function () {
    function FormModule() {
    }
    FormModule = __decorate([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_0__["NgModule"])({
            declarations: [_form_component__WEBPACK_IMPORTED_MODULE_2__["FormComponent"], _components__WEBPACK_IMPORTED_MODULE_3__["InputsComponent"], _components__WEBPACK_IMPORTED_MODULE_3__["SelectsComponent"], _components__WEBPACK_IMPORTED_MODULE_3__["CheckboxsComponent"], _components__WEBPACK_IMPORTED_MODULE_3__["SwitchesComponent"]],
            imports: [
                _angular_common__WEBPACK_IMPORTED_MODULE_1__["CommonModule"],
                src_app_shared_shared_module__WEBPACK_IMPORTED_MODULE_4__["SharedModule"],
                _ng_select_ng_select__WEBPACK_IMPORTED_MODULE_5__["NgSelectModule"],
                _ngx_translate_core__WEBPACK_IMPORTED_MODULE_6__["TranslateModule"],
            ],
            exports: [_form_component__WEBPACK_IMPORTED_MODULE_2__["FormComponent"], _components__WEBPACK_IMPORTED_MODULE_3__["InputsComponent"], _components__WEBPACK_IMPORTED_MODULE_3__["SelectsComponent"], _components__WEBPACK_IMPORTED_MODULE_3__["CheckboxsComponent"], _components__WEBPACK_IMPORTED_MODULE_3__["SwitchesComponent"]]
        })
    ], FormModule);
    return FormModule;
}());



/***/ }),

/***/ "./src/app/pages/ui-kit/modules/index.ts":
/*!***********************************************!*\
  !*** ./src/app/pages/ui-kit/modules/index.ts ***!
  \***********************************************/
/*! exports provided: FormModule, ComponentsModule */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _form_form_module__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./form/form.module */ "./src/app/pages/ui-kit/modules/form/form.module.ts");
/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "FormModule", function() { return _form_form_module__WEBPACK_IMPORTED_MODULE_0__["FormModule"]; });

/* harmony import */ var _components_components_module__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./components/components.module */ "./src/app/pages/ui-kit/modules/components/components.module.ts");
/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "ComponentsModule", function() { return _components_components_module__WEBPACK_IMPORTED_MODULE_1__["ComponentsModule"]; });





/***/ }),

/***/ "./src/app/pages/ui-kit/ui-kit-routing.module.ts":
/*!*******************************************************!*\
  !*** ./src/app/pages/ui-kit/ui-kit-routing.module.ts ***!
  \*******************************************************/
/*! exports provided: UiKitRoutingModule */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "UiKitRoutingModule", function() { return UiKitRoutingModule; });
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @angular/core */ "./node_modules/@angular/core/fesm5/core.js");
/* harmony import */ var _angular_router__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @angular/router */ "./node_modules/@angular/router/fesm5/router.js");
/* harmony import */ var _ui_kit_component__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./ui-kit.component */ "./src/app/pages/ui-kit/ui-kit.component.ts");
var __decorate = (undefined && undefined.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};



var routes = [
    { path: '', component: _ui_kit_component__WEBPACK_IMPORTED_MODULE_2__["UiKitComponent"] },
];
var UiKitRoutingModule = /** @class */ (function () {
    function UiKitRoutingModule() {
    }
    UiKitRoutingModule = __decorate([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_0__["NgModule"])({
            imports: [_angular_router__WEBPACK_IMPORTED_MODULE_1__["RouterModule"].forChild(routes)],
            exports: [_angular_router__WEBPACK_IMPORTED_MODULE_1__["RouterModule"]]
        })
    ], UiKitRoutingModule);
    return UiKitRoutingModule;
}());



/***/ }),

/***/ "./src/app/pages/ui-kit/ui-kit.component.html":
/*!****************************************************!*\
  !*** ./src/app/pages/ui-kit/ui-kit.component.html ***!
  \****************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = "<div class=\"flex flex__direction-column max-w-50-rem w-100\">\r\n    <div class=\"mb-2\">\r\n        <h2 class=\"mb-1\">Buttons</h2>\r\n        <app-buttons></app-buttons>\r\n    </div>\r\n\r\n    <div class=\"mb-2\">\r\n        <h2 class=\"mb-1\">Form</h2>\r\n        <app-form></app-form>\r\n    </div>\r\n\r\n    <div class=\"mb-2\">\r\n        <h2 class=\"mb-1\">Breadcrumbs</h2>\r\n        <app-breadcrumbs></app-breadcrumbs>\r\n    </div>\r\n\r\n    <div class=\"mb-2\">\r\n        <h2 class=\"mb-1\">Progress bars</h2>\r\n        <app-progress-bars></app-progress-bars>\r\n    </div>\r\n\r\n    <div class=\"mb-2\">\r\n        <h2 class=\"mb-1\">Wallets</h2>\r\n        <app-wallets></app-wallets>\r\n    </div>\r\n\r\n\r\n</div>\r\n"

/***/ }),

/***/ "./src/app/pages/ui-kit/ui-kit.component.scss":
/*!****************************************************!*\
  !*** ./src/app/pages/ui-kit/ui-kit.component.scss ***!
  \****************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = "\n/*# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IiIsImZpbGUiOiJzcmMvYXBwL3BhZ2VzL3VpLWtpdC91aS1raXQuY29tcG9uZW50LnNjc3MifQ== */"

/***/ }),

/***/ "./src/app/pages/ui-kit/ui-kit.component.ts":
/*!**************************************************!*\
  !*** ./src/app/pages/ui-kit/ui-kit.component.ts ***!
  \**************************************************/
/*! exports provided: UiKitComponent */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "UiKitComponent", function() { return UiKitComponent; });
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @angular/core */ "./node_modules/@angular/core/fesm5/core.js");
var __decorate = (undefined && undefined.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (undefined && undefined.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};

var UiKitComponent = /** @class */ (function () {
    function UiKitComponent() {
    }
    UiKitComponent.prototype.ngOnInit = function () {
    };
    UiKitComponent = __decorate([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_0__["Component"])({
            selector: 'app-ui-kit',
            template: __webpack_require__(/*! ./ui-kit.component.html */ "./src/app/pages/ui-kit/ui-kit.component.html"),
            styles: [__webpack_require__(/*! ./ui-kit.component.scss */ "./src/app/pages/ui-kit/ui-kit.component.scss")]
        }),
        __metadata("design:paramtypes", [])
    ], UiKitComponent);
    return UiKitComponent;
}());



/***/ }),

/***/ "./src/app/pages/ui-kit/ui-kit.module.ts":
/*!***********************************************!*\
  !*** ./src/app/pages/ui-kit/ui-kit.module.ts ***!
  \***********************************************/
/*! exports provided: UiKitModule */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "UiKitModule", function() { return UiKitModule; });
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @angular/core */ "./node_modules/@angular/core/fesm5/core.js");
/* harmony import */ var _angular_common__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @angular/common */ "./node_modules/@angular/common/fesm5/common.js");
/* harmony import */ var _ui_kit_component__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./ui-kit.component */ "./src/app/pages/ui-kit/ui-kit.component.ts");
/* harmony import */ var _ui_kit_routing_module__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./ui-kit-routing.module */ "./src/app/pages/ui-kit/ui-kit-routing.module.ts");
/* harmony import */ var _modules__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./modules */ "./src/app/pages/ui-kit/modules/index.ts");
var __decorate = (undefined && undefined.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};





var UiKitModule = /** @class */ (function () {
    function UiKitModule() {
    }
    UiKitModule = __decorate([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_0__["NgModule"])({
            declarations: [_ui_kit_component__WEBPACK_IMPORTED_MODULE_2__["UiKitComponent"]],
            imports: [
                _angular_common__WEBPACK_IMPORTED_MODULE_1__["CommonModule"],
                _modules__WEBPACK_IMPORTED_MODULE_4__["FormModule"],
                _modules__WEBPACK_IMPORTED_MODULE_4__["ComponentsModule"],
                _ui_kit_routing_module__WEBPACK_IMPORTED_MODULE_3__["UiKitRoutingModule"]
            ]
        })
    ], UiKitModule);
    return UiKitModule;
}());



/***/ })

}]);
//# sourceMappingURL=pages-ui-kit-ui-kit-module.js.map