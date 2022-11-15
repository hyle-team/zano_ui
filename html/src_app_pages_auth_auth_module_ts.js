"use strict";
(self["webpackChunkzano"] = self["webpackChunkzano"] || []).push([["src_app_pages_auth_auth_module_ts"],{

/***/ 794:
/*!***************************************************!*\
  !*** ./src/app/pages/auth/auth-routing.module.ts ***!
  \***************************************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "AuthRoutingModule": function() { return /* binding */ AuthRoutingModule; }
/* harmony export */ });
/* harmony import */ var D_Work_zano_ui_html_source_node_modules_babel_runtime_helpers_esm_createClass_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./node_modules/@babel/runtime/helpers/esm/createClass.js */ 8047);
/* harmony import */ var D_Work_zano_ui_html_source_node_modules_babel_runtime_helpers_esm_classCallCheck_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./node_modules/@babel/runtime/helpers/esm/classCallCheck.js */ 8069);
/* harmony import */ var _angular_router__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! @angular/router */ 2816);
/* harmony import */ var _paths__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../../paths */ 2869);
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @angular/core */ 3184);






var routes = [{
  path: _paths__WEBPACK_IMPORTED_MODULE_2__.pathsChildrenAuth.noWallet,
  loadChildren: function loadChildren() {
    return Promise.resolve(/*! import() */).then(__webpack_require__.bind(__webpack_require__, /*! ./no-wallet/no-wallet.module */ 7579)).then(function (m) {
      return m.NoWalletModule;
    });
  }
}];
var AuthRoutingModule = /*#__PURE__*/(0,D_Work_zano_ui_html_source_node_modules_babel_runtime_helpers_esm_createClass_js__WEBPACK_IMPORTED_MODULE_0__["default"])(function AuthRoutingModule() {
  (0,D_Work_zano_ui_html_source_node_modules_babel_runtime_helpers_esm_classCallCheck_js__WEBPACK_IMPORTED_MODULE_1__["default"])(this, AuthRoutingModule);
});

AuthRoutingModule.ɵfac = function AuthRoutingModule_Factory(t) {
  return new (t || AuthRoutingModule)();
};

AuthRoutingModule.ɵmod = /*@__PURE__*/_angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵdefineNgModule"]({
  type: AuthRoutingModule
});
AuthRoutingModule.ɵinj = /*@__PURE__*/_angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵdefineInjector"]({
  imports: [[_angular_router__WEBPACK_IMPORTED_MODULE_4__.RouterModule.forChild(routes)], _angular_router__WEBPACK_IMPORTED_MODULE_4__.RouterModule]
});

(function () {
  (typeof ngJitMode === "undefined" || ngJitMode) && _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵsetNgModuleScope"](AuthRoutingModule, {
    imports: [_angular_router__WEBPACK_IMPORTED_MODULE_4__.RouterModule],
    exports: [_angular_router__WEBPACK_IMPORTED_MODULE_4__.RouterModule]
  });
})();

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
/* harmony import */ var D_Work_zano_ui_html_source_node_modules_babel_runtime_helpers_esm_createClass_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./node_modules/@babel/runtime/helpers/esm/createClass.js */ 8047);
/* harmony import */ var D_Work_zano_ui_html_source_node_modules_babel_runtime_helpers_esm_classCallCheck_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./node_modules/@babel/runtime/helpers/esm/classCallCheck.js */ 8069);
/* harmony import */ var _angular_common__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! @angular/common */ 6362);
/* harmony import */ var _no_wallet_no_wallet_module__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./no-wallet/no-wallet.module */ 7579);
/* harmony import */ var _auth_routing_module__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./auth-routing.module */ 794);
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! @angular/core */ 3184);






var AuthModule = /*#__PURE__*/(0,D_Work_zano_ui_html_source_node_modules_babel_runtime_helpers_esm_createClass_js__WEBPACK_IMPORTED_MODULE_0__["default"])(function AuthModule() {
  (0,D_Work_zano_ui_html_source_node_modules_babel_runtime_helpers_esm_classCallCheck_js__WEBPACK_IMPORTED_MODULE_1__["default"])(this, AuthModule);
});

AuthModule.ɵfac = function AuthModule_Factory(t) {
  return new (t || AuthModule)();
};

AuthModule.ɵmod = /*@__PURE__*/_angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵdefineNgModule"]({
  type: AuthModule
});
AuthModule.ɵinj = /*@__PURE__*/_angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵdefineInjector"]({
  imports: [[_angular_common__WEBPACK_IMPORTED_MODULE_5__.CommonModule, _auth_routing_module__WEBPACK_IMPORTED_MODULE_3__.AuthRoutingModule, _no_wallet_no_wallet_module__WEBPACK_IMPORTED_MODULE_2__.NoWalletModule]]
});

(function () {
  (typeof ngJitMode === "undefined" || ngJitMode) && _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵsetNgModuleScope"](AuthModule, {
    imports: [_angular_common__WEBPACK_IMPORTED_MODULE_5__.CommonModule, _auth_routing_module__WEBPACK_IMPORTED_MODULE_3__.AuthRoutingModule, _no_wallet_no_wallet_module__WEBPACK_IMPORTED_MODULE_2__.NoWalletModule]
  });
})();

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
/* harmony import */ var D_Work_zano_ui_html_source_node_modules_babel_runtime_helpers_esm_createClass_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./node_modules/@babel/runtime/helpers/esm/createClass.js */ 8047);
/* harmony import */ var D_Work_zano_ui_html_source_node_modules_babel_runtime_helpers_esm_classCallCheck_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./node_modules/@babel/runtime/helpers/esm/classCallCheck.js */ 8069);
/* harmony import */ var _angular_router__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! @angular/router */ 2816);
/* harmony import */ var _no_wallet_component__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./no-wallet.component */ 9421);
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @angular/core */ 3184);






var routes = [{
  path: '',
  component: _no_wallet_component__WEBPACK_IMPORTED_MODULE_2__.NoWalletComponent
}];
var NoWalletRoutingModule = /*#__PURE__*/(0,D_Work_zano_ui_html_source_node_modules_babel_runtime_helpers_esm_createClass_js__WEBPACK_IMPORTED_MODULE_0__["default"])(function NoWalletRoutingModule() {
  (0,D_Work_zano_ui_html_source_node_modules_babel_runtime_helpers_esm_classCallCheck_js__WEBPACK_IMPORTED_MODULE_1__["default"])(this, NoWalletRoutingModule);
});

NoWalletRoutingModule.ɵfac = function NoWalletRoutingModule_Factory(t) {
  return new (t || NoWalletRoutingModule)();
};

NoWalletRoutingModule.ɵmod = /*@__PURE__*/_angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵdefineNgModule"]({
  type: NoWalletRoutingModule
});
NoWalletRoutingModule.ɵinj = /*@__PURE__*/_angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵdefineInjector"]({
  imports: [[_angular_router__WEBPACK_IMPORTED_MODULE_4__.RouterModule.forChild(routes)], _angular_router__WEBPACK_IMPORTED_MODULE_4__.RouterModule]
});

(function () {
  (typeof ngJitMode === "undefined" || ngJitMode) && _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵsetNgModuleScope"](NoWalletRoutingModule, {
    imports: [_angular_router__WEBPACK_IMPORTED_MODULE_4__.RouterModule],
    exports: [_angular_router__WEBPACK_IMPORTED_MODULE_4__.RouterModule]
  });
})();

/***/ }),

/***/ 9421:
/*!*************************************************************!*\
  !*** ./src/app/pages/auth/no-wallet/no-wallet.component.ts ***!
  \*************************************************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "NoWalletComponent": function() { return /* binding */ NoWalletComponent; }
/* harmony export */ });
/* harmony import */ var D_Work_zano_ui_html_source_node_modules_babel_runtime_helpers_esm_classCallCheck_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./node_modules/@babel/runtime/helpers/esm/classCallCheck.js */ 8069);
/* harmony import */ var D_Work_zano_ui_html_source_node_modules_babel_runtime_helpers_esm_createClass_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./node_modules/@babel/runtime/helpers/esm/createClass.js */ 8047);
/* harmony import */ var _shared_constants__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../../../_shared/constants */ 8303);
/* harmony import */ var _paths__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../../../paths */ 2869);
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! @angular/core */ 3184);
/* harmony import */ var _helpers_services_variables_service__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../../../_helpers/services/variables.service */ 7027);
/* harmony import */ var _angular_router__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! @angular/router */ 2816);
/* harmony import */ var _helpers_services_backend_service__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ../../../_helpers/services/backend.service */ 4047);
/* harmony import */ var _ngx_translate_core__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! @ngx-translate/core */ 3935);
/* harmony import */ var _angular_flex_layout_flex__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(/*! @angular/flex-layout/flex */ 8281);
/* harmony import */ var _synchronization_status_synchronization_status_component__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ../../../synchronization-status/synchronization-status.component */ 2853);












var _c0 = function _c0(a0) {
  return [a0];
};

var NoWalletComponent = /*#__PURE__*/function () {
  function NoWalletComponent(variablesService, router, backend, ngZone, translate) {
    (0,D_Work_zano_ui_html_source_node_modules_babel_runtime_helpers_esm_classCallCheck_js__WEBPACK_IMPORTED_MODULE_0__["default"])(this, NoWalletComponent);

    this.variablesService = variablesService;
    this.router = router;
    this.backend = backend;
    this.ngZone = ngZone;
    this.translate = translate;
    this.paths = _paths__WEBPACK_IMPORTED_MODULE_3__.paths;
  }

  (0,D_Work_zano_ui_html_source_node_modules_babel_runtime_helpers_esm_createClass_js__WEBPACK_IMPORTED_MODULE_1__["default"])(NoWalletComponent, [{
    key: "openWallet",
    value: function openWallet() {
      var _this = this;

      this.backend.openFileDialog(this.translate.instant('MAIN.CHOOSE_PATH'), '*', this.variablesService.settings.default_path, function (file_status, file_data) {
        if (file_status) {
          _this.variablesService.settings.default_path = file_data.path.substr(0, file_data.path.lastIndexOf('/'));

          _this.ngZone.run(function () {
            _this.router.navigate(['/' + _paths__WEBPACK_IMPORTED_MODULE_3__.paths.open], {
              queryParams: {
                path: file_data.path
              }
            }).then();
          });
        } else {
          console.log(file_data['error_code']);
        }
      });
    }
  }, {
    key: "openInBrowser",
    value: function openInBrowser() {
      this.backend.openUrlInBrowser(_shared_constants__WEBPACK_IMPORTED_MODULE_2__.CREATE_NEW_WALLET_HELP_PAGE);
    }
  }]);

  return NoWalletComponent;
}();

NoWalletComponent.ɵfac = function NoWalletComponent_Factory(t) {
  return new (t || NoWalletComponent)(_angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵdirectiveInject"](_helpers_services_variables_service__WEBPACK_IMPORTED_MODULE_4__.VariablesService), _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵdirectiveInject"](_angular_router__WEBPACK_IMPORTED_MODULE_8__.Router), _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵdirectiveInject"](_helpers_services_backend_service__WEBPACK_IMPORTED_MODULE_5__.BackendService), _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵdirectiveInject"](_angular_core__WEBPACK_IMPORTED_MODULE_7__.NgZone), _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵdirectiveInject"](_ngx_translate_core__WEBPACK_IMPORTED_MODULE_9__.TranslateService));
};

NoWalletComponent.ɵcmp = /*@__PURE__*/_angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵdefineComponent"]({
  type: NoWalletComponent,
  selectors: [["app-no-wallet"]],
  decls: 22,
  vars: 21,
  consts: [["fxFlexFill", "", "fxLayout", "row", "fxLayoutAlign", "center center", 1, "no-wallet-wrapper"], [1, "card", "max-w-42-rem", "max-h-100", "w-100", "p-2", "border-radius-0_8-rem", "bg-light-blue", "scrolled-content"], ["fxLayout", "row", "fxLayoutAlign", "center center", 1, "logo", "mb-3"], ["alt", "zano-logo", "src", "assets/icons/blue/zano-logo.svg"], [1, "mb-2", "text-align-center"], ["type", "button", 1, "primary", "big", "w-100", "mb-1", 3, "routerLink"], ["type", "button", 1, "primary", "big", "w-100", "mb-1", 3, "click"], ["type", "button", 1, "outline", "big", "w-100", "mb-2", 3, "routerLink"], ["fxLayout", "row", "fxLayoutAlign", "center center", 1, "text-align-center", "cursor-pointer", 3, "click"], [1, "icon", "question-circle", "mr-1"], [1, "color-primary"], [1, "max-w-19-rem"]],
  template: function NoWalletComponent_Template(rf, ctx) {
    if (rf & 1) {
      _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵelementStart"](0, "div", 0)(1, "div", 1)(2, "div", 2);
      _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵelement"](3, "img", 3);
      _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵelementEnd"]();
      _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵelementStart"](4, "h4", 4);
      _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵtext"](5);
      _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵpipe"](6, "translate");
      _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵelementEnd"]();
      _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵelementStart"](7, "button", 5);
      _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵtext"](8);
      _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵpipe"](9, "translate");
      _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵelementEnd"]();
      _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵelementStart"](10, "button", 6);
      _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵlistener"]("click", function NoWalletComponent_Template_button_click_10_listener() {
        return ctx.openWallet();
      });
      _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵtext"](11);
      _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵpipe"](12, "translate");
      _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵelementEnd"]();
      _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵelementStart"](13, "button", 7);
      _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵtext"](14);
      _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵpipe"](15, "translate");
      _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵelementEnd"]();
      _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵelementStart"](16, "p", 8);
      _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵlistener"]("click", function NoWalletComponent_Template_p_click_16_listener() {
        return ctx.openInBrowser();
      });
      _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵelement"](17, "i", 9);
      _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵelementStart"](18, "span", 10);
      _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵtext"](19);
      _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵpipe"](20, "translate");
      _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵelementEnd"]()()();
      _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵelement"](21, "app-synchronization-status", 11);
      _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵelementEnd"]();
    }

    if (rf & 2) {
      _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵadvance"](5);
      _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵtextInterpolate"](_angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵpipeBind1"](6, 7, "MAIN.TITLE"));
      _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵadvance"](2);
      _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵproperty"]("routerLink", _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵpureFunction1"](17, _c0, "/" + ctx.paths.create));
      _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵadvance"](1);
      _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵtextInterpolate1"](" ", _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵpipeBind1"](9, 9, "MAIN.BUTTON_NEW_WALLET"), " ");
      _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵadvance"](3);
      _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵtextInterpolate"](_angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵpipeBind1"](12, 11, "MAIN.BUTTON_OPEN_WALLET"));
      _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵadvance"](2);
      _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵproperty"]("routerLink", _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵpureFunction1"](19, _c0, "/" + ctx.paths.restore));
      _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵadvance"](1);
      _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵtextInterpolate"](_angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵpipeBind1"](15, 13, "MAIN.BUTTON_RESTORE_BACKUP"));
      _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵadvance"](5);
      _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵtextInterpolate"](_angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵpipeBind1"](20, 15, "MAIN.HELP"));
    }
  },
  directives: [_angular_flex_layout_flex__WEBPACK_IMPORTED_MODULE_10__.FlexFillDirective, _angular_flex_layout_flex__WEBPACK_IMPORTED_MODULE_10__.DefaultLayoutDirective, _angular_flex_layout_flex__WEBPACK_IMPORTED_MODULE_10__.DefaultLayoutAlignDirective, _angular_router__WEBPACK_IMPORTED_MODULE_8__.RouterLink, _synchronization_status_synchronization_status_component__WEBPACK_IMPORTED_MODULE_6__.SynchronizationStatusComponent],
  pipes: [_ngx_translate_core__WEBPACK_IMPORTED_MODULE_9__.TranslatePipe],
  styles: ["[_nghost-%COMP%] {\n  width: 100%;\n  height: 100%;\n  overflow: hidden;\n}\n/*# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vLXdhbGxldC5jb21wb25lbnQuc2NzcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtFQUNDLFdBQUE7RUFDQSxZQUFBO0VBQ0EsZ0JBQUE7QUFDRCIsImZpbGUiOiJuby13YWxsZXQuY29tcG9uZW50LnNjc3MiLCJzb3VyY2VzQ29udGVudCI6WyI6aG9zdCB7XHJcblx0d2lkdGg6IDEwMCU7XHJcblx0aGVpZ2h0OiAxMDAlO1xyXG5cdG92ZXJmbG93OiBoaWRkZW47XHJcbn1cclxuIl19 */"]
});

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
/* harmony import */ var D_Work_zano_ui_html_source_node_modules_babel_runtime_helpers_esm_createClass_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./node_modules/@babel/runtime/helpers/esm/createClass.js */ 8047);
/* harmony import */ var D_Work_zano_ui_html_source_node_modules_babel_runtime_helpers_esm_classCallCheck_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./node_modules/@babel/runtime/helpers/esm/classCallCheck.js */ 8069);
/* harmony import */ var _angular_common__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! @angular/common */ 6362);
/* harmony import */ var _no_wallet_component__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./no-wallet.component */ 9421);
/* harmony import */ var _no_wallet_routing_module__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./no-wallet-routing.module */ 1611);
/* harmony import */ var _ngx_translate_core__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! @ngx-translate/core */ 3935);
/* harmony import */ var _synchronization_status_synchronization_status_module__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../../../synchronization-status/synchronization-status.module */ 5143);
/* harmony import */ var _angular_flex_layout__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! @angular/flex-layout */ 1378);
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! @angular/core */ 3184);









var NoWalletModule = /*#__PURE__*/(0,D_Work_zano_ui_html_source_node_modules_babel_runtime_helpers_esm_createClass_js__WEBPACK_IMPORTED_MODULE_0__["default"])(function NoWalletModule() {
  (0,D_Work_zano_ui_html_source_node_modules_babel_runtime_helpers_esm_classCallCheck_js__WEBPACK_IMPORTED_MODULE_1__["default"])(this, NoWalletModule);
});

NoWalletModule.ɵfac = function NoWalletModule_Factory(t) {
  return new (t || NoWalletModule)();
};

NoWalletModule.ɵmod = /*@__PURE__*/_angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵdefineNgModule"]({
  type: NoWalletModule
});
NoWalletModule.ɵinj = /*@__PURE__*/_angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵdefineInjector"]({
  imports: [[_angular_common__WEBPACK_IMPORTED_MODULE_6__.CommonModule, _no_wallet_routing_module__WEBPACK_IMPORTED_MODULE_3__.NoWalletRoutingModule, _ngx_translate_core__WEBPACK_IMPORTED_MODULE_7__.TranslateModule, _angular_flex_layout__WEBPACK_IMPORTED_MODULE_8__.FlexLayoutModule, _synchronization_status_synchronization_status_module__WEBPACK_IMPORTED_MODULE_4__.SynchronizationStatusModule]]
});

(function () {
  (typeof ngJitMode === "undefined" || ngJitMode) && _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵsetNgModuleScope"](NoWalletModule, {
    declarations: [_no_wallet_component__WEBPACK_IMPORTED_MODULE_2__.NoWalletComponent],
    imports: [_angular_common__WEBPACK_IMPORTED_MODULE_6__.CommonModule, _no_wallet_routing_module__WEBPACK_IMPORTED_MODULE_3__.NoWalletRoutingModule, _ngx_translate_core__WEBPACK_IMPORTED_MODULE_7__.TranslateModule, _angular_flex_layout__WEBPACK_IMPORTED_MODULE_8__.FlexLayoutModule, _synchronization_status_synchronization_status_module__WEBPACK_IMPORTED_MODULE_4__.SynchronizationStatusModule]
  });
})();

/***/ })

}]);
//# sourceMappingURL=src_app_pages_auth_auth_module_ts.js.map