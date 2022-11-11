"use strict";
(self["webpackChunkzano"] = self["webpackChunkzano"] || []).push([["src_app_pages_auth_auth_module_ts"],{

/***/ 20794:
/*!***************************************************!*\
  !*** ./src/app/pages/auth/auth-routing.module.ts ***!
  \***************************************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "AuthRoutingModule": function() { return /* binding */ AuthRoutingModule; }
/* harmony export */ });
/* harmony import */ var _angular_router__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @angular/router */ 71258);
/* harmony import */ var _paths__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../../paths */ 22869);
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @angular/core */ 2316);




var routes = [
    {
        path: _paths__WEBPACK_IMPORTED_MODULE_0__.pathsChildrenAuth.noWallet,
        loadChildren: function () { return Promise.resolve(/*! import() */).then(__webpack_require__.bind(__webpack_require__, /*! ./no-wallet/no-wallet.module */ 7579)).then(function (m) { return m.NoWalletModule; }); },
    }
];
var AuthRoutingModule = /** @class */ (function () {
    function AuthRoutingModule() {
    }
    AuthRoutingModule.ɵfac = function AuthRoutingModule_Factory(t) { return new (t || AuthRoutingModule)(); };
    AuthRoutingModule.ɵmod = /*@__PURE__*/ _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵdefineNgModule"]({ type: AuthRoutingModule });
    AuthRoutingModule.ɵinj = /*@__PURE__*/ _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵdefineInjector"]({ imports: [[_angular_router__WEBPACK_IMPORTED_MODULE_2__.RouterModule.forChild(routes)], _angular_router__WEBPACK_IMPORTED_MODULE_2__.RouterModule] });
    return AuthRoutingModule;
}());

(function () { (typeof ngJitMode === "undefined" || ngJitMode) && _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵsetNgModuleScope"](AuthRoutingModule, { imports: [_angular_router__WEBPACK_IMPORTED_MODULE_2__.RouterModule], exports: [_angular_router__WEBPACK_IMPORTED_MODULE_2__.RouterModule] }); })();


/***/ }),

/***/ 6621:
/*!*******************************************!*\
  !*** ./src/app/pages/auth/auth.module.ts ***!
  \*******************************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "AuthModule": function() { return /* binding */ AuthModule; }
/* harmony export */ });
/* harmony import */ var _angular_common__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @angular/common */ 54364);
/* harmony import */ var _no_wallet_no_wallet_module__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./no-wallet/no-wallet.module */ 7579);
/* harmony import */ var _auth_routing_module__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./auth-routing.module */ 20794);
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @angular/core */ 2316);




var AuthModule = /** @class */ (function () {
    function AuthModule() {
    }
    AuthModule.ɵfac = function AuthModule_Factory(t) { return new (t || AuthModule)(); };
    AuthModule.ɵmod = /*@__PURE__*/ _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵdefineNgModule"]({ type: AuthModule });
    AuthModule.ɵinj = /*@__PURE__*/ _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵdefineInjector"]({ imports: [[
                _angular_common__WEBPACK_IMPORTED_MODULE_3__.CommonModule,
                _auth_routing_module__WEBPACK_IMPORTED_MODULE_1__.AuthRoutingModule,
                _no_wallet_no_wallet_module__WEBPACK_IMPORTED_MODULE_0__.NoWalletModule
            ]] });
    return AuthModule;
}());

(function () { (typeof ngJitMode === "undefined" || ngJitMode) && _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵsetNgModuleScope"](AuthModule, { imports: [_angular_common__WEBPACK_IMPORTED_MODULE_3__.CommonModule,
        _auth_routing_module__WEBPACK_IMPORTED_MODULE_1__.AuthRoutingModule,
        _no_wallet_no_wallet_module__WEBPACK_IMPORTED_MODULE_0__.NoWalletModule] }); })();


/***/ }),

/***/ 1611:
/*!******************************************************************!*\
  !*** ./src/app/pages/auth/no-wallet/no-wallet-routing.module.ts ***!
  \******************************************************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "NoWalletRoutingModule": function() { return /* binding */ NoWalletRoutingModule; }
/* harmony export */ });
/* harmony import */ var _angular_router__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @angular/router */ 71258);
/* harmony import */ var _no_wallet_component__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./no-wallet.component */ 49421);
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @angular/core */ 2316);




var routes = [
    { path: '', component: _no_wallet_component__WEBPACK_IMPORTED_MODULE_0__.NoWalletComponent },
];
var NoWalletRoutingModule = /** @class */ (function () {
    function NoWalletRoutingModule() {
    }
    NoWalletRoutingModule.ɵfac = function NoWalletRoutingModule_Factory(t) { return new (t || NoWalletRoutingModule)(); };
    NoWalletRoutingModule.ɵmod = /*@__PURE__*/ _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵdefineNgModule"]({ type: NoWalletRoutingModule });
    NoWalletRoutingModule.ɵinj = /*@__PURE__*/ _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵdefineInjector"]({ imports: [[_angular_router__WEBPACK_IMPORTED_MODULE_2__.RouterModule.forChild(routes)], _angular_router__WEBPACK_IMPORTED_MODULE_2__.RouterModule] });
    return NoWalletRoutingModule;
}());

(function () { (typeof ngJitMode === "undefined" || ngJitMode) && _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵsetNgModuleScope"](NoWalletRoutingModule, { imports: [_angular_router__WEBPACK_IMPORTED_MODULE_2__.RouterModule], exports: [_angular_router__WEBPACK_IMPORTED_MODULE_2__.RouterModule] }); })();


/***/ }),

/***/ 49421:
/*!*************************************************************!*\
  !*** ./src/app/pages/auth/no-wallet/no-wallet.component.ts ***!
  \*************************************************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "NoWalletComponent": function() { return /* binding */ NoWalletComponent; }
/* harmony export */ });
/* harmony import */ var _shared_constants__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../../../_shared/constants */ 18303);
/* harmony import */ var _paths__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../../../paths */ 22869);
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! @angular/core */ 2316);
/* harmony import */ var _helpers_services_variables_service__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../../../_helpers/services/variables.service */ 67027);
/* harmony import */ var _angular_router__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! @angular/router */ 71258);
/* harmony import */ var _helpers_services_backend_service__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../../../_helpers/services/backend.service */ 14047);
/* harmony import */ var _ngx_translate_core__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! @ngx-translate/core */ 70325);
/* harmony import */ var _angular_flex_layout_flex__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! @angular/flex-layout/flex */ 30582);
/* harmony import */ var _synchronization_status_synchronization_status_component__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../../../synchronization-status/synchronization-status.component */ 12853);









var _c0 = function (a0) { return [a0]; };
var NoWalletComponent = /** @class */ (function () {
    function NoWalletComponent(variablesService, router, backend, ngZone, translate) {
        this.variablesService = variablesService;
        this.router = router;
        this.backend = backend;
        this.ngZone = ngZone;
        this.translate = translate;
        this.paths = _paths__WEBPACK_IMPORTED_MODULE_1__.paths;
    }
    NoWalletComponent.prototype.openWallet = function () {
        var _this = this;
        this.backend.openFileDialog(this.translate.instant('MAIN.CHOOSE_PATH'), '*', this.variablesService.settings.default_path, function (file_status, file_data) {
            if (file_status) {
                _this.variablesService.settings.default_path = file_data.path.substr(0, file_data.path.lastIndexOf('/'));
                _this.ngZone.run(function () {
                    _this.router.navigate(['/' + _paths__WEBPACK_IMPORTED_MODULE_1__.paths.open], { queryParams: { path: file_data.path } }).then();
                });
            }
            else {
                console.log(file_data['error_code']);
            }
        });
    };
    NoWalletComponent.prototype.openInBrowser = function () {
        this.backend.openUrlInBrowser(_shared_constants__WEBPACK_IMPORTED_MODULE_0__.CREATE_NEW_WALLET_HELP_PAGE);
    };
    NoWalletComponent.ɵfac = function NoWalletComponent_Factory(t) { return new (t || NoWalletComponent)(_angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵdirectiveInject"](_helpers_services_variables_service__WEBPACK_IMPORTED_MODULE_2__.VariablesService), _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵdirectiveInject"](_angular_router__WEBPACK_IMPORTED_MODULE_6__.Router), _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵdirectiveInject"](_helpers_services_backend_service__WEBPACK_IMPORTED_MODULE_3__.BackendService), _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵdirectiveInject"](_angular_core__WEBPACK_IMPORTED_MODULE_5__.NgZone), _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵdirectiveInject"](_ngx_translate_core__WEBPACK_IMPORTED_MODULE_7__.TranslateService)); };
    NoWalletComponent.ɵcmp = /*@__PURE__*/ _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵdefineComponent"]({ type: NoWalletComponent, selectors: [["app-no-wallet"]], decls: 22, vars: 21, consts: [["fxFlexFill", "", "fxLayout", "row", "fxLayoutAlign", "center center", 1, "no-wallet-wrapper"], [1, "card", "max-w-42-rem", "max-h-100", "w-100", "p-2", "border-radius-0_8-rem", "bg-light-blue", "scrolled-content"], ["fxLayout", "row", "fxLayoutAlign", "center center", 1, "logo", "mb-3"], ["alt", "zano-logo", "src", "assets/icons/blue/zano-logo.svg"], [1, "mb-2", "text-align-center"], ["type", "button", 1, "primary", "big", "w-100", "mb-1", 3, "routerLink"], ["type", "button", 1, "primary", "big", "w-100", "mb-1", 3, "click"], ["type", "button", 1, "outline", "big", "w-100", "mb-2", 3, "routerLink"], ["fxLayout", "row", "fxLayoutAlign", "center center", 1, "text-align-center", "cursor-pointer", 3, "click"], [1, "icon", "question-circle", "mr-1"], [1, "color-primary"], [1, "max-w-19-rem"]], template: function NoWalletComponent_Template(rf, ctx) { if (rf & 1) {
            _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵelementStart"](0, "div", 0);
            _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵelementStart"](1, "div", 1);
            _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵelementStart"](2, "div", 2);
            _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵelement"](3, "img", 3);
            _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵelementEnd"]();
            _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵelementStart"](4, "h4", 4);
            _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵtext"](5);
            _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵpipe"](6, "translate");
            _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵelementEnd"]();
            _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵelementStart"](7, "button", 5);
            _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵtext"](8);
            _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵpipe"](9, "translate");
            _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵelementEnd"]();
            _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵelementStart"](10, "button", 6);
            _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵlistener"]("click", function NoWalletComponent_Template_button_click_10_listener() { return ctx.openWallet(); });
            _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵtext"](11);
            _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵpipe"](12, "translate");
            _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵelementEnd"]();
            _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵelementStart"](13, "button", 7);
            _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵtext"](14);
            _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵpipe"](15, "translate");
            _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵelementEnd"]();
            _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵelementStart"](16, "p", 8);
            _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵlistener"]("click", function NoWalletComponent_Template_p_click_16_listener() { return ctx.openInBrowser(); });
            _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵelement"](17, "i", 9);
            _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵelementStart"](18, "span", 10);
            _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵtext"](19);
            _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵpipe"](20, "translate");
            _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵelementEnd"]();
            _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵelementEnd"]();
            _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵelementEnd"]();
            _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵelement"](21, "app-synchronization-status", 11);
            _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵelementEnd"]();
        } if (rf & 2) {
            _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵadvance"](5);
            _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵtextInterpolate"](_angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵpipeBind1"](6, 7, "MAIN.TITLE"));
            _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵadvance"](2);
            _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵproperty"]("routerLink", _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵpureFunction1"](17, _c0, "/" + ctx.paths.create));
            _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵadvance"](1);
            _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵtextInterpolate1"](" ", _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵpipeBind1"](9, 9, "MAIN.BUTTON_NEW_WALLET"), " ");
            _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵadvance"](3);
            _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵtextInterpolate"](_angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵpipeBind1"](12, 11, "MAIN.BUTTON_OPEN_WALLET"));
            _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵadvance"](2);
            _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵproperty"]("routerLink", _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵpureFunction1"](19, _c0, "/" + ctx.paths.restore));
            _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵadvance"](1);
            _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵtextInterpolate"](_angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵpipeBind1"](15, 13, "MAIN.BUTTON_RESTORE_BACKUP"));
            _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵadvance"](5);
            _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵtextInterpolate"](_angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵpipeBind1"](20, 15, "MAIN.HELP"));
        } }, directives: [_angular_flex_layout_flex__WEBPACK_IMPORTED_MODULE_8__.FlexFillDirective, _angular_flex_layout_flex__WEBPACK_IMPORTED_MODULE_8__.DefaultLayoutDirective, _angular_flex_layout_flex__WEBPACK_IMPORTED_MODULE_8__.DefaultLayoutAlignDirective, _angular_router__WEBPACK_IMPORTED_MODULE_6__.RouterLink, _synchronization_status_synchronization_status_component__WEBPACK_IMPORTED_MODULE_4__.SynchronizationStatusComponent], pipes: [_ngx_translate_core__WEBPACK_IMPORTED_MODULE_7__.TranslatePipe], styles: ["[_nghost-%COMP%] {\n  width: 100%;\n  height: 100%;\n  overflow: hidden;\n}\n/*# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vLXdhbGxldC5jb21wb25lbnQuc2NzcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtFQUNDLFdBQUE7RUFDQSxZQUFBO0VBQ0EsZ0JBQUE7QUFDRCIsImZpbGUiOiJuby13YWxsZXQuY29tcG9uZW50LnNjc3MiLCJzb3VyY2VzQ29udGVudCI6WyI6aG9zdCB7XHJcblx0d2lkdGg6IDEwMCU7XHJcblx0aGVpZ2h0OiAxMDAlO1xyXG5cdG92ZXJmbG93OiBoaWRkZW47XHJcbn1cclxuIl19 */"] });
    return NoWalletComponent;
}());



/***/ }),

/***/ 7579:
/*!**********************************************************!*\
  !*** ./src/app/pages/auth/no-wallet/no-wallet.module.ts ***!
  \**********************************************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "NoWalletModule": function() { return /* binding */ NoWalletModule; }
/* harmony export */ });
/* harmony import */ var _angular_common__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! @angular/common */ 54364);
/* harmony import */ var _no_wallet_component__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./no-wallet.component */ 49421);
/* harmony import */ var _no_wallet_routing_module__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./no-wallet-routing.module */ 1611);
/* harmony import */ var _ngx_translate_core__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! @ngx-translate/core */ 70325);
/* harmony import */ var _synchronization_status_synchronization_status_module__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../../../synchronization-status/synchronization-status.module */ 95143);
/* harmony import */ var _angular_flex_layout__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! @angular/flex-layout */ 78662);
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @angular/core */ 2316);







var NoWalletModule = /** @class */ (function () {
    function NoWalletModule() {
    }
    NoWalletModule.ɵfac = function NoWalletModule_Factory(t) { return new (t || NoWalletModule)(); };
    NoWalletModule.ɵmod = /*@__PURE__*/ _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵdefineNgModule"]({ type: NoWalletModule });
    NoWalletModule.ɵinj = /*@__PURE__*/ _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵdefineInjector"]({ imports: [[
                _angular_common__WEBPACK_IMPORTED_MODULE_4__.CommonModule,
                _no_wallet_routing_module__WEBPACK_IMPORTED_MODULE_1__.NoWalletRoutingModule,
                _ngx_translate_core__WEBPACK_IMPORTED_MODULE_5__.TranslateModule,
                _angular_flex_layout__WEBPACK_IMPORTED_MODULE_6__.FlexLayoutModule,
                _synchronization_status_synchronization_status_module__WEBPACK_IMPORTED_MODULE_2__.SynchronizationStatusModule
            ]] });
    return NoWalletModule;
}());

(function () { (typeof ngJitMode === "undefined" || ngJitMode) && _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵsetNgModuleScope"](NoWalletModule, { declarations: [_no_wallet_component__WEBPACK_IMPORTED_MODULE_0__.NoWalletComponent], imports: [_angular_common__WEBPACK_IMPORTED_MODULE_4__.CommonModule,
        _no_wallet_routing_module__WEBPACK_IMPORTED_MODULE_1__.NoWalletRoutingModule,
        _ngx_translate_core__WEBPACK_IMPORTED_MODULE_5__.TranslateModule,
        _angular_flex_layout__WEBPACK_IMPORTED_MODULE_6__.FlexLayoutModule,
        _synchronization_status_synchronization_status_module__WEBPACK_IMPORTED_MODULE_2__.SynchronizationStatusModule] }); })();


/***/ })

}]);
//# sourceMappingURL=src_app_pages_auth_auth_module_ts.js.map