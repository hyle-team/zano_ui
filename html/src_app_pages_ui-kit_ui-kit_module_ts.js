"use strict";
(self["webpackChunkzano"] = self["webpackChunkzano"] || []).push([["src_app_pages_ui-kit_ui-kit_module_ts"],{

/***/ 9416:
/*!**************************************************************************************!*\
  !*** ./src/app/pages/ui-kit/modules/components/breadcrumbs/breadcrumbs.component.ts ***!
  \**************************************************************************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "BreadcrumbsComponent": function() { return /* binding */ BreadcrumbsComponent; }
/* harmony export */ });
/* harmony import */ var D_Work_zano_ui_html_source_node_modules_babel_runtime_helpers_esm_classCallCheck_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./node_modules/@babel/runtime/helpers/esm/classCallCheck.js */ 8069);
/* harmony import */ var D_Work_zano_ui_html_source_node_modules_babel_runtime_helpers_esm_createClass_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./node_modules/@babel/runtime/helpers/esm/createClass.js */ 8047);
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @angular/core */ 3184);



var BreadcrumbsComponent = /*#__PURE__*/function () {
  function BreadcrumbsComponent() {
    (0,D_Work_zano_ui_html_source_node_modules_babel_runtime_helpers_esm_classCallCheck_js__WEBPACK_IMPORTED_MODULE_0__["default"])(this, BreadcrumbsComponent);
  }

  (0,D_Work_zano_ui_html_source_node_modules_babel_runtime_helpers_esm_createClass_js__WEBPACK_IMPORTED_MODULE_1__["default"])(BreadcrumbsComponent, [{
    key: "ngOnInit",
    value: function ngOnInit() {}
  }]);

  return BreadcrumbsComponent;
}();

BreadcrumbsComponent.ɵfac = function BreadcrumbsComponent_Factory(t) {
  return new (t || BreadcrumbsComponent)();
};

BreadcrumbsComponent.ɵcmp = /*@__PURE__*/_angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵdefineComponent"]({
  type: BreadcrumbsComponent,
  selectors: [["app-breadcrumbs"]],
  decls: 66,
  vars: 0,
  consts: [[1, "breadcrumbs", "mb-2"], [1, "breadcrumb"], [1, "breadcrumbs", "scrolled", "mb-2"]],
  template: function BreadcrumbsComponent_Template(rf, ctx) {
    if (rf & 1) {
      _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementStart"](0, "h3");
      _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵtext"](1, "Default");
      _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementEnd"]();
      _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementStart"](2, "div", 0)(3, "div", 1)(4, "a");
      _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵtext"](5, "test 1 (link)");
      _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementEnd"]()();
      _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementStart"](6, "div", 1)(7, "span");
      _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵtext"](8, "test 2 (text)");
      _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementEnd"]()();
      _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementStart"](9, "div", 1)(10, "a");
      _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵtext"](11, "test 3 (link)");
      _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementEnd"]()();
      _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementStart"](12, "div", 1)(13, "span");
      _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵtext"](14, "test 4 (text)");
      _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementEnd"]()();
      _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementStart"](15, "div", 1)(16, "a");
      _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵtext"](17, "test 5 (link)");
      _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementEnd"]()();
      _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementStart"](18, "div", 1)(19, "a");
      _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵtext"](20, "test 6 (link)");
      _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementEnd"]()();
      _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementStart"](21, "div", 1)(22, "span");
      _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵtext"](23, "last item (text)");
      _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementEnd"]()()();
      _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementStart"](24, "h3");
      _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵtext"](25, "With scroll");
      _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementEnd"]();
      _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementStart"](26, "div", 2)(27, "div", 1)(28, "a");
      _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵtext"](29, "test 1 (link)");
      _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementEnd"]()();
      _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementStart"](30, "div", 1)(31, "span");
      _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵtext"](32, "test 2 (text)");
      _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementEnd"]()();
      _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementStart"](33, "div", 1)(34, "a");
      _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵtext"](35, "test 3 (link)");
      _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementEnd"]()();
      _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementStart"](36, "div", 1)(37, "span");
      _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵtext"](38, "test 4 (text)");
      _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementEnd"]()();
      _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementStart"](39, "div", 1)(40, "a");
      _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵtext"](41, "test 5 (link)");
      _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementEnd"]()();
      _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementStart"](42, "div", 1)(43, "a");
      _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵtext"](44, "test 6 (link)");
      _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementEnd"]()();
      _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementStart"](45, "div", 1)(46, "a");
      _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵtext"](47, "test 7 (link)");
      _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementEnd"]()();
      _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementStart"](48, "div", 1)(49, "span");
      _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵtext"](50, "test 8 (text)");
      _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementEnd"]()();
      _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementStart"](51, "div", 1)(52, "a");
      _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵtext"](53, "test 9 (link)");
      _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementEnd"]()();
      _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementStart"](54, "div", 1)(55, "span");
      _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵtext"](56, "test 10 (text)");
      _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementEnd"]()();
      _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementStart"](57, "div", 1)(58, "a");
      _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵtext"](59, "test 11 (link)");
      _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementEnd"]()();
      _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementStart"](60, "div", 1)(61, "a");
      _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵtext"](62, "test 12 (link)");
      _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementEnd"]()();
      _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementStart"](63, "div", 1)(64, "span");
      _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵtext"](65, "last item (text)");
      _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementEnd"]()()();
    }
  },
  styles: ["\n/*# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IiIsImZpbGUiOiJicmVhZGNydW1icy5jb21wb25lbnQuc2NzcyJ9 */"]
});

/***/ }),

/***/ 8065:
/*!******************************************************************************!*\
  !*** ./src/app/pages/ui-kit/modules/components/buttons/buttons.component.ts ***!
  \******************************************************************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "ButtonsComponent": function() { return /* binding */ ButtonsComponent; }
/* harmony export */ });
/* harmony import */ var D_Work_zano_ui_html_source_node_modules_babel_runtime_helpers_esm_classCallCheck_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./node_modules/@babel/runtime/helpers/esm/classCallCheck.js */ 8069);
/* harmony import */ var D_Work_zano_ui_html_source_node_modules_babel_runtime_helpers_esm_createClass_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./node_modules/@babel/runtime/helpers/esm/createClass.js */ 8047);
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @angular/core */ 3184);



var ButtonsComponent = /*#__PURE__*/function () {
  function ButtonsComponent() {
    (0,D_Work_zano_ui_html_source_node_modules_babel_runtime_helpers_esm_classCallCheck_js__WEBPACK_IMPORTED_MODULE_0__["default"])(this, ButtonsComponent);
  }

  (0,D_Work_zano_ui_html_source_node_modules_babel_runtime_helpers_esm_createClass_js__WEBPACK_IMPORTED_MODULE_1__["default"])(ButtonsComponent, [{
    key: "ngOnInit",
    value: function ngOnInit() {}
  }]);

  return ButtonsComponent;
}();

ButtonsComponent.ɵfac = function ButtonsComponent_Factory(t) {
  return new (t || ButtonsComponent)();
};

ButtonsComponent.ɵcmp = /*@__PURE__*/_angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵdefineComponent"]({
  type: ButtonsComponent,
  selectors: [["app-buttons"]],
  decls: 25,
  vars: 0,
  consts: [[1, "mb-1"], [1, "m-1", "primary", "small"], [1, "m-1", "primary", "big"], ["disabled", "", 1, "m-1", "primary", "big"], [1, "m-1", "outline", "small"], [1, "icon", "plus", "mr-1"], [1, "m-1", "outline", "big"], ["disabled", "", 1, "m-1", "outline", "big"], [1, "m-1", "btn-icon", "circle", "small", "mr-2"], [1, "icon", "dropdown-arrow-left"], [1, "m-1", "btn-icon", "circle", "big", "mr-2"], ["disabled", "", 1, "m-1", "btn-icon", "circle", "big", "mr-2"]],
  template: function ButtonsComponent_Template(rf, ctx) {
    if (rf & 1) {
      _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementStart"](0, "h3", 0);
      _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵtext"](1, "Primary");
      _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementEnd"]();
      _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementStart"](2, "button", 1);
      _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵtext"](3, "Add Wallet");
      _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementEnd"]();
      _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementStart"](4, "button", 2);
      _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵtext"](5, "Add / Save");
      _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementEnd"]();
      _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementStart"](6, "button", 3);
      _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵtext"](7, "Add / Save\n");
      _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementEnd"]();
      _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementStart"](8, "h3", 0);
      _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵtext"](9, "Outline");
      _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementEnd"]();
      _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementStart"](10, "button", 4);
      _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelement"](11, "i", 5);
      _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵtext"](12, "Add Wallet");
      _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementEnd"]();
      _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementStart"](13, "button", 6);
      _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵtext"](14, "Add / Save");
      _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementEnd"]();
      _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementStart"](15, "button", 7);
      _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵtext"](16, "Add / Save\n");
      _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementEnd"]();
      _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementStart"](17, "h3", 0);
      _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵtext"](18, "Circle");
      _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementEnd"]();
      _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementStart"](19, "button", 8);
      _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelement"](20, "i", 9);
      _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementEnd"]();
      _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementStart"](21, "button", 10);
      _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelement"](22, "i", 9);
      _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementEnd"]();
      _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementStart"](23, "button", 11);
      _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelement"](24, "i", 9);
      _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementEnd"]();
    }
  },
  styles: ["\n/*# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IiIsImZpbGUiOiJidXR0b25zLmNvbXBvbmVudC5zY3NzIn0= */"]
});

/***/ }),

/***/ 8242:
/*!**********************************************************************!*\
  !*** ./src/app/pages/ui-kit/modules/components/components.module.ts ***!
  \**********************************************************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "ComponentsModule": function() { return /* binding */ ComponentsModule; }
/* harmony export */ });
/* harmony import */ var D_Work_zano_ui_html_source_node_modules_babel_runtime_helpers_esm_createClass_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./node_modules/@babel/runtime/helpers/esm/createClass.js */ 8047);
/* harmony import */ var D_Work_zano_ui_html_source_node_modules_babel_runtime_helpers_esm_classCallCheck_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./node_modules/@babel/runtime/helpers/esm/classCallCheck.js */ 8069);
/* harmony import */ var _angular_common__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! @angular/common */ 6362);
/* harmony import */ var ___WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./ */ 4384);
/* harmony import */ var _breadcrumbs_breadcrumbs_component__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./breadcrumbs/breadcrumbs.component */ 9416);
/* harmony import */ var _ngx_translate_core__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! @ngx-translate/core */ 3935);
/* harmony import */ var _wallets_wallets_component__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./wallets/wallets.component */ 1957);
/* harmony import */ var _shared_shared_module__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ../../../../_shared/shared.module */ 8855);
/* harmony import */ var _angular_flex_layout__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! @angular/flex-layout */ 1378);
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! @angular/core */ 3184);










var ComponentsModule = /*#__PURE__*/(0,D_Work_zano_ui_html_source_node_modules_babel_runtime_helpers_esm_createClass_js__WEBPACK_IMPORTED_MODULE_0__["default"])(function ComponentsModule() {
  (0,D_Work_zano_ui_html_source_node_modules_babel_runtime_helpers_esm_classCallCheck_js__WEBPACK_IMPORTED_MODULE_1__["default"])(this, ComponentsModule);
});

ComponentsModule.ɵfac = function ComponentsModule_Factory(t) {
  return new (t || ComponentsModule)();
};

ComponentsModule.ɵmod = /*@__PURE__*/_angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵdefineNgModule"]({
  type: ComponentsModule
});
ComponentsModule.ɵinj = /*@__PURE__*/_angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵdefineInjector"]({
  imports: [[_angular_common__WEBPACK_IMPORTED_MODULE_7__.CommonModule, _ngx_translate_core__WEBPACK_IMPORTED_MODULE_8__.TranslateModule, ___WEBPACK_IMPORTED_MODULE_2__.FormModule, _angular_flex_layout__WEBPACK_IMPORTED_MODULE_9__.FlexLayoutModule, _shared_shared_module__WEBPACK_IMPORTED_MODULE_5__.SharedModule], ___WEBPACK_IMPORTED_MODULE_2__.FormModule]
});

(function () {
  (typeof ngJitMode === "undefined" || ngJitMode) && _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵsetNgModuleScope"](ComponentsModule, {
    declarations: [___WEBPACK_IMPORTED_MODULE_2__.ButtonsComponent, ___WEBPACK_IMPORTED_MODULE_2__.ProgressBarsComponent, _breadcrumbs_breadcrumbs_component__WEBPACK_IMPORTED_MODULE_3__.BreadcrumbsComponent, _wallets_wallets_component__WEBPACK_IMPORTED_MODULE_4__.WalletsComponent],
    imports: [_angular_common__WEBPACK_IMPORTED_MODULE_7__.CommonModule, _ngx_translate_core__WEBPACK_IMPORTED_MODULE_8__.TranslateModule, ___WEBPACK_IMPORTED_MODULE_2__.FormModule, _angular_flex_layout__WEBPACK_IMPORTED_MODULE_9__.FlexLayoutModule, _shared_shared_module__WEBPACK_IMPORTED_MODULE_5__.SharedModule],
    exports: [___WEBPACK_IMPORTED_MODULE_2__.ButtonsComponent, ___WEBPACK_IMPORTED_MODULE_2__.ProgressBarsComponent, _breadcrumbs_breadcrumbs_component__WEBPACK_IMPORTED_MODULE_3__.BreadcrumbsComponent, _wallets_wallets_component__WEBPACK_IMPORTED_MODULE_4__.WalletsComponent, ___WEBPACK_IMPORTED_MODULE_2__.FormModule]
  });
})();

/***/ }),

/***/ 3551:
/*!**************************************************************************************************!*\
  !*** ./src/app/pages/ui-kit/modules/components/form/components/checkboxs/checkboxs.component.ts ***!
  \**************************************************************************************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "CheckboxsComponent": function() { return /* binding */ CheckboxsComponent; }
/* harmony export */ });
/* harmony import */ var D_Work_zano_ui_html_source_node_modules_babel_runtime_helpers_esm_classCallCheck_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./node_modules/@babel/runtime/helpers/esm/classCallCheck.js */ 8069);
/* harmony import */ var D_Work_zano_ui_html_source_node_modules_babel_runtime_helpers_esm_createClass_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./node_modules/@babel/runtime/helpers/esm/createClass.js */ 8047);
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @angular/core */ 3184);
/* harmony import */ var _shared_components_checkbox_checkbox_component__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../../../../../../../_shared/components/checkbox/checkbox.component */ 2519);




var CheckboxsComponent = /*#__PURE__*/function () {
  function CheckboxsComponent() {
    (0,D_Work_zano_ui_html_source_node_modules_babel_runtime_helpers_esm_classCallCheck_js__WEBPACK_IMPORTED_MODULE_0__["default"])(this, CheckboxsComponent);
  }

  (0,D_Work_zano_ui_html_source_node_modules_babel_runtime_helpers_esm_createClass_js__WEBPACK_IMPORTED_MODULE_1__["default"])(CheckboxsComponent, [{
    key: "ngOnInit",
    value: function ngOnInit() {}
  }]);

  return CheckboxsComponent;
}();

CheckboxsComponent.ɵfac = function CheckboxsComponent_Factory(t) {
  return new (t || CheckboxsComponent)();
};

CheckboxsComponent.ɵcmp = /*@__PURE__*/_angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵdefineComponent"]({
  type: CheckboxsComponent,
  selectors: [["app-checkboxs"]],
  decls: 6,
  vars: 1,
  consts: [[1, "mb-2"], ["label", "LabelLabelLabelLabelLabelLabelLabelLabelLabelLabelLabelLabelLabelLabelLabelLabelLabelLabelLabelLabelLabelLabelLabelLabelLabelLabelLabelLabelLabelLabelLabelLabelLabelLabelLabelLabelLabelLabelLabelLabelLabelLabelLabelLabelLabel", 1, "mb-1", "max-w-50-rem", "w-100", 3, "disabled"], ["label", "Label", 1, "mb-1", "max-w-50-rem", "w-100"]],
  template: function CheckboxsComponent_Template(rf, ctx) {
    if (rf & 1) {
      _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementStart"](0, "h3", 0);
      _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵtext"](1, "Disabled = true");
      _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementEnd"]();
      _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelement"](2, "app-checkbox", 1);
      _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementStart"](3, "h3", 0);
      _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵtext"](4, "Default");
      _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementEnd"]();
      _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelement"](5, "app-checkbox", 2);
    }

    if (rf & 2) {
      _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵadvance"](2);
      _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵproperty"]("disabled", true);
    }
  },
  directives: [_shared_components_checkbox_checkbox_component__WEBPACK_IMPORTED_MODULE_2__.CheckboxComponent],
  styles: ["\n/*# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IiIsImZpbGUiOiJjaGVja2JveHMuY29tcG9uZW50LnNjc3MifQ== */"]
});

/***/ }),

/***/ 3253:
/*!**************************************************************************!*\
  !*** ./src/app/pages/ui-kit/modules/components/form/components/index.ts ***!
  \**************************************************************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "CheckboxsComponent": function() { return /* reexport safe */ _checkboxs_checkboxs_component__WEBPACK_IMPORTED_MODULE_0__.CheckboxsComponent; },
/* harmony export */   "InputsComponent": function() { return /* reexport safe */ _inputs_inputs_component__WEBPACK_IMPORTED_MODULE_1__.InputsComponent; },
/* harmony export */   "SelectsComponent": function() { return /* reexport safe */ _selects_selects_component__WEBPACK_IMPORTED_MODULE_2__.SelectsComponent; },
/* harmony export */   "SwitchesComponent": function() { return /* reexport safe */ _switches_switches_component__WEBPACK_IMPORTED_MODULE_3__.SwitchesComponent; }
/* harmony export */ });
/* harmony import */ var _checkboxs_checkboxs_component__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./checkboxs/checkboxs.component */ 3551);
/* harmony import */ var _inputs_inputs_component__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./inputs/inputs.component */ 9706);
/* harmony import */ var _selects_selects_component__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./selects/selects.component */ 4597);
/* harmony import */ var _switches_switches_component__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./switches/switches.component */ 4033);





/***/ }),

/***/ 9706:
/*!********************************************************************************************!*\
  !*** ./src/app/pages/ui-kit/modules/components/form/components/inputs/inputs.component.ts ***!
  \********************************************************************************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "InputsComponent": function() { return /* binding */ InputsComponent; }
/* harmony export */ });
/* harmony import */ var D_Work_zano_ui_html_source_node_modules_babel_runtime_helpers_esm_classCallCheck_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./node_modules/@babel/runtime/helpers/esm/classCallCheck.js */ 8069);
/* harmony import */ var D_Work_zano_ui_html_source_node_modules_babel_runtime_helpers_esm_createClass_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./node_modules/@babel/runtime/helpers/esm/createClass.js */ 8047);
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @angular/core */ 3184);



var InputsComponent = /*#__PURE__*/function () {
  function InputsComponent() {
    (0,D_Work_zano_ui_html_source_node_modules_babel_runtime_helpers_esm_classCallCheck_js__WEBPACK_IMPORTED_MODULE_0__["default"])(this, InputsComponent);
  }

  (0,D_Work_zano_ui_html_source_node_modules_babel_runtime_helpers_esm_createClass_js__WEBPACK_IMPORTED_MODULE_1__["default"])(InputsComponent, [{
    key: "ngOnInit",
    value: function ngOnInit() {}
  }]);

  return InputsComponent;
}();

InputsComponent.ɵfac = function InputsComponent_Factory(t) {
  return new (t || InputsComponent)();
};

InputsComponent.ɵcmp = /*@__PURE__*/_angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵdefineComponent"]({
  type: InputsComponent,
  selectors: [["app-inputs"]],
  decls: 38,
  vars: 0,
  consts: [[1, "mb-3"], [1, "mb-2"], [1, "form__field"], ["for", "test-id1"], ["disabled", "", "id", "test-id1", "name", "test1", "placeholder", "Enter a name here", "type", "text", 1, "form__field--input"], ["name", "test1", "placeholder", "Enter a name here", "type", "text", 1, "form__field--input"], ["name", "test1", "placeholder", "Enter a name here", "type", "text", "value", "Name", 1, "form__field--input"], ["for", "test-id4"], ["disabled", "", "id", "test-id4", "name", "test1", "placeholder", "Enter a name here", "type", "password", "value", "Name", 1, "form__field--input"], ["name", "1234567890", "placeholder", "Enter a name here", "type", "password", "value", "Name", 1, "form__field--input"], ["name", "1234567890", "placeholder", "Enter a name here", "type", "password", "value", "Name", 1, "form__field--input", "invalid"], [1, "error"], [1, "success"]],
  template: function InputsComponent_Template(rf, ctx) {
    if (rf & 1) {
      _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementStart"](0, "h3", 0);
      _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵtext"](1, "Input type=\"text\"");
      _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementEnd"]();
      _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementStart"](2, "h4", 1);
      _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵtext"](3, "Disabled = true");
      _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementEnd"]();
      _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementStart"](4, "div", 2)(5, "label", 3);
      _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵtext"](6, "Label");
      _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementEnd"]();
      _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelement"](7, "input", 4);
      _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementEnd"]();
      _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementStart"](8, "h4", 0);
      _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵtext"](9, "Without label");
      _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementEnd"]();
      _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementStart"](10, "div", 2);
      _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelement"](11, "input", 5);
      _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementEnd"]();
      _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementStart"](12, "div", 2);
      _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelement"](13, "input", 6);
      _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementEnd"]();
      _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementStart"](14, "h3", 0);
      _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵtext"](15, "Input type=\"password\"");
      _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementEnd"]();
      _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementStart"](16, "h4", 1);
      _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵtext"](17, "Disabled = true");
      _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementEnd"]();
      _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementStart"](18, "div", 2)(19, "label", 7);
      _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵtext"](20, "Label");
      _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementEnd"]();
      _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelement"](21, "input", 8);
      _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementEnd"]();
      _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementStart"](22, "h4", 0);
      _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵtext"](23, "Without label");
      _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementEnd"]();
      _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementStart"](24, "div", 2);
      _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelement"](25, "input", 9);
      _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementEnd"]();
      _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementStart"](26, "h4", 0);
      _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵtext"](27, "With error");
      _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementEnd"]();
      _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementStart"](28, "div", 2);
      _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelement"](29, "input", 10);
      _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementStart"](30, "div", 11);
      _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵtext"](31, " Error text ");
      _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementEnd"]()();
      _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementStart"](32, "h4", 0);
      _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵtext"](33, "With success");
      _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementEnd"]();
      _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementStart"](34, "div", 2);
      _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelement"](35, "input", 9);
      _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementStart"](36, "div", 12);
      _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵtext"](37, " Success text ");
      _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementEnd"]()();
    }
  },
  styles: ["\n/*# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IiIsImZpbGUiOiJpbnB1dHMuY29tcG9uZW50LnNjc3MifQ== */"]
});

/***/ }),

/***/ 4597:
/*!**********************************************************************************************!*\
  !*** ./src/app/pages/ui-kit/modules/components/form/components/selects/selects.component.ts ***!
  \**********************************************************************************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "SelectsComponent": function() { return /* binding */ SelectsComponent; }
/* harmony export */ });
/* harmony import */ var D_Work_zano_ui_html_source_node_modules_babel_runtime_helpers_esm_toConsumableArray_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./node_modules/@babel/runtime/helpers/esm/toConsumableArray.js */ 8277);
/* harmony import */ var D_Work_zano_ui_html_source_node_modules_babel_runtime_helpers_esm_classCallCheck_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./node_modules/@babel/runtime/helpers/esm/classCallCheck.js */ 8069);
/* harmony import */ var D_Work_zano_ui_html_source_node_modules_babel_runtime_helpers_esm_createClass_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./node_modules/@babel/runtime/helpers/esm/createClass.js */ 8047);
/* harmony import */ var src_app_helpers_data_scale_items__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! src/app/_helpers/data/scale-items */ 8671);
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! @angular/core */ 3184);
/* harmony import */ var _ng_select_ng_select__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! @ng-select/ng-select */ 413);
/* harmony import */ var _ngx_translate_core__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! @ngx-translate/core */ 3935);








function SelectsComponent_ng_template_4_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵtext"](0);
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵpipe"](1, "translate");
  }

  if (rf & 2) {
    var item_r6 = ctx.item;
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵtextInterpolate1"](" ", _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵpipeBind1"](1, 1, item_r6.name), " ");
  }
}

function SelectsComponent_ng_template_5_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵtext"](0);
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵpipe"](1, "translate");
  }

  if (rf & 2) {
    var item_r8 = ctx.item;
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵtextInterpolate1"](" ", _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵpipeBind1"](1, 1, item_r8.name), " ");
  }
}

function SelectsComponent_ng_template_10_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵtext"](0);
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵpipe"](1, "translate");
  }

  if (rf & 2) {
    var item_r9 = ctx.item;
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵtextInterpolate1"](" ", _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵpipeBind1"](1, 1, item_r9.name), " ");
  }
}

function SelectsComponent_ng_template_11_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵtext"](0);
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵpipe"](1, "translate");
  }

  if (rf & 2) {
    var item_r11 = ctx.item;
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵtextInterpolate1"](" ", _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵpipeBind1"](1, 1, item_r11.name), " ");
  }
}

function SelectsComponent_ng_template_18_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵtext"](0);
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵpipe"](1, "translate");
  }

  if (rf & 2) {
    var item_r12 = ctx.item;
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵtextInterpolate1"](" ", _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵpipeBind1"](1, 1, item_r12.name), " ");
  }
}

function SelectsComponent_ng_template_19_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵtext"](0);
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵpipe"](1, "translate");
  }

  if (rf & 2) {
    var item_r14 = ctx.item;
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵtextInterpolate1"](" ", _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵpipeBind1"](1, 1, item_r14.name), " ");
  }
}

var SelectsComponent = /*#__PURE__*/function () {
  function SelectsComponent() {
    (0,D_Work_zano_ui_html_source_node_modules_babel_runtime_helpers_esm_classCallCheck_js__WEBPACK_IMPORTED_MODULE_1__["default"])(this, SelectsComponent);

    this.scaleItems = (0,D_Work_zano_ui_html_source_node_modules_babel_runtime_helpers_esm_toConsumableArray_js__WEBPACK_IMPORTED_MODULE_0__["default"])(src_app_helpers_data_scale_items__WEBPACK_IMPORTED_MODULE_3__.scaleItems);
  }

  (0,D_Work_zano_ui_html_source_node_modules_babel_runtime_helpers_esm_createClass_js__WEBPACK_IMPORTED_MODULE_2__["default"])(SelectsComponent, [{
    key: "ngOnInit",
    value: function ngOnInit() {}
  }]);

  return SelectsComponent;
}();

SelectsComponent.ɵfac = function SelectsComponent_Factory(t) {
  return new (t || SelectsComponent)();
};

SelectsComponent.ɵcmp = /*@__PURE__*/_angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵdefineComponent"]({
  type: SelectsComponent,
  selectors: [["app-selects"]],
  decls: 20,
  vars: 9,
  consts: [[1, "form__field", "mb-2"], ["bindLabel", "name", "bindValue", "value", 3, "clearable", "items", "searchable"], ["ng-label-tmp", ""], ["ng-option-tmp", ""], [1, "form__field"], ["bindLabel", "name", "bindValue", "value", 1, "with-circle", 3, "clearable", "items", "searchable"], [1, "mb-1"], ["bindLabel", "name", "bindValue", "value", 1, "with-circle", "invalid", 3, "clearable", "items", "searchable"]],
  template: function SelectsComponent_Template(rf, ctx) {
    if (rf & 1) {
      _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementStart"](0, "div", 0)(1, "label");
      _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵtext"](2, "Default");
      _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementEnd"]();
      _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementStart"](3, "ng-select", 1);
      _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵtemplate"](4, SelectsComponent_ng_template_4_Template, 2, 3, "ng-template", 2);
      _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵtemplate"](5, SelectsComponent_ng_template_5_Template, 2, 3, "ng-template", 3);
      _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementEnd"]()();
      _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementStart"](6, "div", 4)(7, "label");
      _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵtext"](8, "With circle");
      _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementEnd"]();
      _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementStart"](9, "ng-select", 5);
      _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵtemplate"](10, SelectsComponent_ng_template_10_Template, 2, 3, "ng-template", 2);
      _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵtemplate"](11, SelectsComponent_ng_template_11_Template, 2, 3, "ng-template", 3);
      _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementEnd"]()();
      _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementStart"](12, "h3", 6);
      _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵtext"](13, "if you use formControlName class ng-invalid set red border if select ng-touched");
      _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementEnd"]();
      _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementStart"](14, "div", 4)(15, "label");
      _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵtext"](16, "With error");
      _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementEnd"]();
      _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementStart"](17, "ng-select", 7);
      _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵtemplate"](18, SelectsComponent_ng_template_18_Template, 2, 3, "ng-template", 2);
      _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵtemplate"](19, SelectsComponent_ng_template_19_Template, 2, 3, "ng-template", 3);
      _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementEnd"]()();
    }

    if (rf & 2) {
      _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵadvance"](3);
      _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵproperty"]("clearable", false)("items", ctx.scaleItems)("searchable", false);
      _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵadvance"](6);
      _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵproperty"]("clearable", false)("items", ctx.scaleItems)("searchable", false);
      _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵadvance"](8);
      _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵproperty"]("clearable", false)("items", ctx.scaleItems)("searchable", false);
    }
  },
  directives: [_ng_select_ng_select__WEBPACK_IMPORTED_MODULE_5__.NgSelectComponent, _ng_select_ng_select__WEBPACK_IMPORTED_MODULE_5__["ɵh"], _ng_select_ng_select__WEBPACK_IMPORTED_MODULE_5__["ɵf"]],
  pipes: [_ngx_translate_core__WEBPACK_IMPORTED_MODULE_6__.TranslatePipe],
  styles: ["\n/*# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IiIsImZpbGUiOiJzZWxlY3RzLmNvbXBvbmVudC5zY3NzIn0= */"]
});

/***/ }),

/***/ 4033:
/*!************************************************************************************************!*\
  !*** ./src/app/pages/ui-kit/modules/components/form/components/switches/switches.component.ts ***!
  \************************************************************************************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "SwitchesComponent": function() { return /* binding */ SwitchesComponent; }
/* harmony export */ });
/* harmony import */ var D_Work_zano_ui_html_source_node_modules_babel_runtime_helpers_esm_classCallCheck_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./node_modules/@babel/runtime/helpers/esm/classCallCheck.js */ 8069);
/* harmony import */ var D_Work_zano_ui_html_source_node_modules_babel_runtime_helpers_esm_createClass_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./node_modules/@babel/runtime/helpers/esm/createClass.js */ 8047);
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @angular/core */ 3184);
/* harmony import */ var _shared_components_switch_switch_component__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../../../../../../../_shared/components/switch/switch.component */ 7291);




var SwitchesComponent = /*#__PURE__*/function () {
  function SwitchesComponent() {
    (0,D_Work_zano_ui_html_source_node_modules_babel_runtime_helpers_esm_classCallCheck_js__WEBPACK_IMPORTED_MODULE_0__["default"])(this, SwitchesComponent);
  }

  (0,D_Work_zano_ui_html_source_node_modules_babel_runtime_helpers_esm_createClass_js__WEBPACK_IMPORTED_MODULE_1__["default"])(SwitchesComponent, [{
    key: "ngOnInit",
    value: function ngOnInit() {}
  }]);

  return SwitchesComponent;
}();

SwitchesComponent.ɵfac = function SwitchesComponent_Factory(t) {
  return new (t || SwitchesComponent)();
};

SwitchesComponent.ɵcmp = /*@__PURE__*/_angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵdefineComponent"]({
  type: SwitchesComponent,
  selectors: [["app-switches"]],
  decls: 9,
  vars: 3,
  consts: [[1, "mb-1"], [1, "mb-1", 3, "value"], [1, "mb-1", 3, "disabled", "value"]],
  template: function SwitchesComponent_Template(rf, ctx) {
    if (rf & 1) {
      _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementStart"](0, "h3", 0);
      _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵtext"](1, "Switch default");
      _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementEnd"]();
      _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelement"](2, "app-switch", 0);
      _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementStart"](3, "h3", 0);
      _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵtext"](4, "value = true");
      _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementEnd"]();
      _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelement"](5, "app-switch", 1);
      _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementStart"](6, "h3", 0);
      _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵtext"](7, "value = true, disabled = true");
      _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementEnd"]();
      _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelement"](8, "app-switch", 2);
    }

    if (rf & 2) {
      _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵadvance"](5);
      _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵproperty"]("value", true);
      _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵadvance"](3);
      _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵproperty"]("disabled", true)("value", true);
    }
  },
  directives: [_shared_components_switch_switch_component__WEBPACK_IMPORTED_MODULE_2__.SwitchComponent],
  styles: ["\n/*# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IiIsImZpbGUiOiJzd2l0Y2hlcy5jb21wb25lbnQuc2NzcyJ9 */"]
});

/***/ }),

/***/ 1116:
/*!************************************************************************!*\
  !*** ./src/app/pages/ui-kit/modules/components/form/form.component.ts ***!
  \************************************************************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "FormComponent": function() { return /* binding */ FormComponent; }
/* harmony export */ });
/* harmony import */ var D_Work_zano_ui_html_source_node_modules_babel_runtime_helpers_esm_classCallCheck_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./node_modules/@babel/runtime/helpers/esm/classCallCheck.js */ 8069);
/* harmony import */ var D_Work_zano_ui_html_source_node_modules_babel_runtime_helpers_esm_createClass_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./node_modules/@babel/runtime/helpers/esm/createClass.js */ 8047);
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! @angular/core */ 3184);
/* harmony import */ var _components_inputs_inputs_component__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./components/inputs/inputs.component */ 9706);
/* harmony import */ var _components_selects_selects_component__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./components/selects/selects.component */ 4597);
/* harmony import */ var _components_checkboxs_checkboxs_component__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./components/checkboxs/checkboxs.component */ 3551);
/* harmony import */ var _components_switches_switches_component__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./components/switches/switches.component */ 4033);







var FormComponent = /*#__PURE__*/function () {
  function FormComponent() {
    (0,D_Work_zano_ui_html_source_node_modules_babel_runtime_helpers_esm_classCallCheck_js__WEBPACK_IMPORTED_MODULE_0__["default"])(this, FormComponent);
  }

  (0,D_Work_zano_ui_html_source_node_modules_babel_runtime_helpers_esm_createClass_js__WEBPACK_IMPORTED_MODULE_1__["default"])(FormComponent, [{
    key: "ngOnInit",
    value: function ngOnInit() {}
  }]);

  return FormComponent;
}();

FormComponent.ɵfac = function FormComponent_Factory(t) {
  return new (t || FormComponent)();
};

FormComponent.ɵcmp = /*@__PURE__*/_angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵdefineComponent"]({
  type: FormComponent,
  selectors: [["app-form"]],
  decls: 16,
  vars: 0,
  consts: [[1, "mb-2"], [1, "mb-1"]],
  template: function FormComponent_Template(rf, ctx) {
    if (rf & 1) {
      _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵelementStart"](0, "div", 0)(1, "h2", 1);
      _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵtext"](2, "Inputs");
      _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵelementEnd"]();
      _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵelement"](3, "app-inputs");
      _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵelementEnd"]();
      _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵelementStart"](4, "div", 0)(5, "h2", 1);
      _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵtext"](6, "Selects");
      _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵelementEnd"]();
      _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵelement"](7, "app-selects");
      _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵelementEnd"]();
      _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵelementStart"](8, "div", 0)(9, "h2", 1);
      _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵtext"](10, "Checkbox");
      _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵelementEnd"]();
      _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵelement"](11, "app-checkboxs");
      _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵelementEnd"]();
      _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵelementStart"](12, "div", 0)(13, "h2", 1);
      _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵtext"](14, "Switches");
      _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵelementEnd"]();
      _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵelement"](15, "app-switches");
      _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵelementEnd"]();
    }
  },
  directives: [_components_inputs_inputs_component__WEBPACK_IMPORTED_MODULE_2__.InputsComponent, _components_selects_selects_component__WEBPACK_IMPORTED_MODULE_3__.SelectsComponent, _components_checkboxs_checkboxs_component__WEBPACK_IMPORTED_MODULE_4__.CheckboxsComponent, _components_switches_switches_component__WEBPACK_IMPORTED_MODULE_5__.SwitchesComponent],
  styles: ["\n/*# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IiIsImZpbGUiOiJmb3JtLmNvbXBvbmVudC5zY3NzIn0= */"]
});

/***/ }),

/***/ 8875:
/*!*********************************************************************!*\
  !*** ./src/app/pages/ui-kit/modules/components/form/form.module.ts ***!
  \*********************************************************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "FormModule": function() { return /* binding */ FormModule; }
/* harmony export */ });
/* harmony import */ var D_Work_zano_ui_html_source_node_modules_babel_runtime_helpers_esm_createClass_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./node_modules/@babel/runtime/helpers/esm/createClass.js */ 8047);
/* harmony import */ var D_Work_zano_ui_html_source_node_modules_babel_runtime_helpers_esm_classCallCheck_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./node_modules/@babel/runtime/helpers/esm/classCallCheck.js */ 8069);
/* harmony import */ var _angular_common__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! @angular/common */ 6362);
/* harmony import */ var _form_component__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./form.component */ 1116);
/* harmony import */ var _components__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./components */ 3253);
/* harmony import */ var src_app_shared_shared_module__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! src/app/_shared/shared.module */ 8855);
/* harmony import */ var _ng_select_ng_select__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! @ng-select/ng-select */ 413);
/* harmony import */ var _ngx_translate_core__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! @ngx-translate/core */ 3935);
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! @angular/core */ 3184);









var FormModule = /*#__PURE__*/(0,D_Work_zano_ui_html_source_node_modules_babel_runtime_helpers_esm_createClass_js__WEBPACK_IMPORTED_MODULE_0__["default"])(function FormModule() {
  (0,D_Work_zano_ui_html_source_node_modules_babel_runtime_helpers_esm_classCallCheck_js__WEBPACK_IMPORTED_MODULE_1__["default"])(this, FormModule);
});

FormModule.ɵfac = function FormModule_Factory(t) {
  return new (t || FormModule)();
};

FormModule.ɵmod = /*@__PURE__*/_angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵdefineNgModule"]({
  type: FormModule
});
FormModule.ɵinj = /*@__PURE__*/_angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵdefineInjector"]({
  imports: [[_angular_common__WEBPACK_IMPORTED_MODULE_6__.CommonModule, src_app_shared_shared_module__WEBPACK_IMPORTED_MODULE_4__.SharedModule, _ng_select_ng_select__WEBPACK_IMPORTED_MODULE_7__.NgSelectModule, _ngx_translate_core__WEBPACK_IMPORTED_MODULE_8__.TranslateModule]]
});

(function () {
  (typeof ngJitMode === "undefined" || ngJitMode) && _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵsetNgModuleScope"](FormModule, {
    declarations: [_form_component__WEBPACK_IMPORTED_MODULE_2__.FormComponent, _components__WEBPACK_IMPORTED_MODULE_3__.InputsComponent, _components__WEBPACK_IMPORTED_MODULE_3__.SelectsComponent, _components__WEBPACK_IMPORTED_MODULE_3__.CheckboxsComponent, _components__WEBPACK_IMPORTED_MODULE_3__.SwitchesComponent],
    imports: [_angular_common__WEBPACK_IMPORTED_MODULE_6__.CommonModule, src_app_shared_shared_module__WEBPACK_IMPORTED_MODULE_4__.SharedModule, _ng_select_ng_select__WEBPACK_IMPORTED_MODULE_7__.NgSelectModule, _ngx_translate_core__WEBPACK_IMPORTED_MODULE_8__.TranslateModule],
    exports: [_form_component__WEBPACK_IMPORTED_MODULE_2__.FormComponent, _components__WEBPACK_IMPORTED_MODULE_3__.InputsComponent, _components__WEBPACK_IMPORTED_MODULE_3__.SelectsComponent, _components__WEBPACK_IMPORTED_MODULE_3__.CheckboxsComponent, _components__WEBPACK_IMPORTED_MODULE_3__.SwitchesComponent]
  });
})();

/***/ }),

/***/ 4384:
/*!**********************************************************!*\
  !*** ./src/app/pages/ui-kit/modules/components/index.ts ***!
  \**********************************************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "BreadcrumbsComponent": function() { return /* reexport safe */ _breadcrumbs_breadcrumbs_component__WEBPACK_IMPORTED_MODULE_0__.BreadcrumbsComponent; },
/* harmony export */   "ButtonsComponent": function() { return /* reexport safe */ _buttons_buttons_component__WEBPACK_IMPORTED_MODULE_1__.ButtonsComponent; },
/* harmony export */   "FormComponent": function() { return /* reexport safe */ _form_form_component__WEBPACK_IMPORTED_MODULE_3__.FormComponent; },
/* harmony export */   "FormModule": function() { return /* reexport safe */ _form_form_module__WEBPACK_IMPORTED_MODULE_2__.FormModule; },
/* harmony export */   "ProgressBarsComponent": function() { return /* reexport safe */ _progress_bars_progress_bars_component__WEBPACK_IMPORTED_MODULE_4__.ProgressBarsComponent; },
/* harmony export */   "WalletsComponent": function() { return /* reexport safe */ _wallets_wallets_component__WEBPACK_IMPORTED_MODULE_5__.WalletsComponent; }
/* harmony export */ });
/* harmony import */ var _breadcrumbs_breadcrumbs_component__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./breadcrumbs/breadcrumbs.component */ 9416);
/* harmony import */ var _buttons_buttons_component__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./buttons/buttons.component */ 8065);
/* harmony import */ var _form_form_module__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./form/form.module */ 8875);
/* harmony import */ var _form_form_component__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./form/form.component */ 1116);
/* harmony import */ var _progress_bars_progress_bars_component__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./progress-bars/progress-bars.component */ 5242);
/* harmony import */ var _wallets_wallets_component__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./wallets/wallets.component */ 1957);







/***/ }),

/***/ 5242:
/*!******************************************************************************************!*\
  !*** ./src/app/pages/ui-kit/modules/components/progress-bars/progress-bars.component.ts ***!
  \******************************************************************************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "ProgressBarsComponent": function() { return /* binding */ ProgressBarsComponent; }
/* harmony export */ });
/* harmony import */ var D_Work_zano_ui_html_source_node_modules_babel_runtime_helpers_esm_classCallCheck_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./node_modules/@babel/runtime/helpers/esm/classCallCheck.js */ 8069);
/* harmony import */ var D_Work_zano_ui_html_source_node_modules_babel_runtime_helpers_esm_createClass_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./node_modules/@babel/runtime/helpers/esm/createClass.js */ 8047);
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @angular/core */ 3184);
/* harmony import */ var _angular_flex_layout_flex__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @angular/flex-layout/flex */ 8281);
/* harmony import */ var _ngx_translate_core__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! @ngx-translate/core */ 3935);





var ProgressBarsComponent = /*#__PURE__*/function () {
  function ProgressBarsComponent() {
    (0,D_Work_zano_ui_html_source_node_modules_babel_runtime_helpers_esm_classCallCheck_js__WEBPACK_IMPORTED_MODULE_0__["default"])(this, ProgressBarsComponent);
  }

  (0,D_Work_zano_ui_html_source_node_modules_babel_runtime_helpers_esm_createClass_js__WEBPACK_IMPORTED_MODULE_1__["default"])(ProgressBarsComponent, [{
    key: "ngOnInit",
    value: function ngOnInit() {}
  }]);

  return ProgressBarsComponent;
}();

ProgressBarsComponent.ɵfac = function ProgressBarsComponent_Factory(t) {
  return new (t || ProgressBarsComponent)();
};

ProgressBarsComponent.ɵcmp = /*@__PURE__*/_angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵdefineComponent"]({
  type: ProgressBarsComponent,
  selectors: [["app-progress-bars"]],
  decls: 68,
  vars: 62,
  consts: [["fxLayout", "column", "fxLayoutAlign", "start stretch", 1, "synchronization-status"], [1, "status-container"], [1, "offline", "mb-0_5"], [1, "syncing", "text-ellipsis", "mb-0_5"], [1, "online", "mb-0_5"], [1, "loading", "mb-0_5"], [1, "progress-bar-container", "mb-1"], [1, "syncing"], [1, "progress-bar"], [1, "fill"], [1, "loading"], [1, "syncing", "downloading"], [1, "update-container"], [1, "update-text", "standard", "mb-0_5"], [1, "icon", "update", "standard"], [1, "update-text", "important"], [2, "font-size", "1rem"], [1, "icon", "update", "important"], [1, "update-text", "critical"], [1, "icon", "update", "critical"], [1, "update-text", "time-orange"], [1, "icon", "time-orange"]],
  template: function ProgressBarsComponent_Template(rf, ctx) {
    if (rf & 1) {
      _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementStart"](0, "div", 0)(1, "div", 1)(2, "div", 2)(3, "span");
      _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵtext"](4);
      _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵpipe"](5, "translate");
      _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementEnd"]()();
      _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementStart"](6, "div", 3);
      _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵtext"](7);
      _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵpipe"](8, "translate");
      _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵpipe"](9, "translate");
      _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementEnd"]();
      _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementStart"](10, "div", 4)(11, "span");
      _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵtext"](12);
      _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵpipe"](13, "translate");
      _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementEnd"]()();
      _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementStart"](14, "div", 5);
      _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵtext"](15);
      _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵpipe"](16, "translate");
      _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementEnd"]();
      _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementStart"](17, "div", 2);
      _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵtext"](18);
      _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵpipe"](19, "translate");
      _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementEnd"]();
      _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementStart"](20, "div", 4);
      _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵtext"](21);
      _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵpipe"](22, "translate");
      _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementEnd"]();
      _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementStart"](23, "div", 3);
      _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵtext"](24);
      _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵpipe"](25, "translate");
      _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵpipe"](26, "translate");
      _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵpipe"](27, "translate");
      _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementEnd"]();
      _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementStart"](28, "div", 6)(29, "div", 7)(30, "div", 8);
      _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelement"](31, "div", 9);
      _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementEnd"]()()();
      _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementStart"](32, "div", 6);
      _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelement"](33, "div", 10);
      _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementEnd"]();
      _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementStart"](34, "div", 6)(35, "div", 11)(36, "div", 8);
      _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelement"](37, "div", 9);
      _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementEnd"]()()()();
      _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementStart"](38, "div", 12)(39, "div", 13)(40, "span");
      _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵtext"](41);
      _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵpipe"](42, "translate");
      _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementEnd"]()();
      _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelement"](43, "i", 14);
      _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementEnd"]();
      _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementStart"](44, "div", 12)(45, "div", 15)(46, "span");
      _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵtext"](47);
      _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵpipe"](48, "translate");
      _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementEnd"]();
      _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementStart"](49, "span", 16);
      _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵtext"](50);
      _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵpipe"](51, "translate");
      _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementEnd"]()();
      _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelement"](52, "i", 17);
      _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementEnd"]();
      _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementStart"](53, "div", 12)(54, "div", 18)(55, "span");
      _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵtext"](56);
      _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵpipe"](57, "translate");
      _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementEnd"]();
      _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementStart"](58, "span", 16);
      _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵtext"](59);
      _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵpipe"](60, "translate");
      _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementEnd"]()();
      _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelement"](61, "i", 19);
      _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementEnd"]();
      _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementStart"](62, "div", 12)(63, "div", 20)(64, "span");
      _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵtext"](65);
      _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵpipe"](66, "translate");
      _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementEnd"]()();
      _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelement"](67, "i", 21);
      _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementEnd"]()();
    }

    if (rf & 2) {
      _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵadvance"](4);
      _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵtextInterpolate"](_angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵpipeBind1"](5, 30, "SIDEBAR.SYNCHRONIZATION.OFFLINE"));
      _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵadvance"](3);
      _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵtextInterpolate4"](" ", _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵpipeBind1"](8, 32, "SIDEBAR.SYNCHRONIZATION.SYNCING"), " ", 100, "", _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵpipeBind1"](9, 34, "SIDEBAR.SYNCHRONIZATION.SLASH"), "", 20000, " ");
      _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵadvance"](5);
      _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵtextInterpolate"](_angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵpipeBind1"](13, 36, "SIDEBAR.SYNCHRONIZATION.ONLINE"));
      _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵadvance"](3);
      _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵtextInterpolate1"](" ", _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵpipeBind1"](16, 38, "SIDEBAR.SYNCHRONIZATION.LOADING"), " ");
      _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵadvance"](3);
      _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵtextInterpolate1"](" ", _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵpipeBind1"](19, 40, "SIDEBAR.SYNCHRONIZATION.ERROR"), " ");
      _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵadvance"](3);
      _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵtextInterpolate1"](" ", _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵpipeBind1"](22, 42, "SIDEBAR.SYNCHRONIZATION.COMPLETE"), " ");
      _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵadvance"](3);
      _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵtextInterpolate5"](" ", _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵpipeBind1"](25, 44, "SIDEBAR.SYNCHRONIZATION.DOWNLOADING"), " ", 2345, " ", _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵpipeBind1"](26, 46, "SIDEBAR.SYNCHRONIZATION.SLASH"), " ", 18000, "", _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵpipeBind1"](27, 48, "SIDEBAR.SYNCHRONIZATION.MB"), " ");
      _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵadvance"](7);
      _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵstyleProp"]("width", 50 + "%");
      _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵadvance"](6);
      _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵstyleProp"]("width", 44 + "%");
      _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵadvance"](3);
      _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵstyleProp"]("cursor", "pointer");
      _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵadvance"](1);
      _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵtextInterpolate"](_angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵpipeBind1"](42, 50, "SIDEBAR.UPDATE.STANDARD"));
      _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵadvance"](5);
      _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵstyleProp"]("cursor", "pointer");
      _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵadvance"](1);
      _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵtextInterpolate"](_angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵpipeBind1"](48, 52, "SIDEBAR.UPDATE.IMPORTANT"));
      _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵadvance"](3);
      _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵtextInterpolate"](_angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵpipeBind1"](51, 54, "SIDEBAR.UPDATE.IMPORTANT_HINT"));
      _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵadvance"](5);
      _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵstyleProp"]("cursor", "pointer");
      _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵadvance"](1);
      _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵtextInterpolate"](_angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵpipeBind1"](57, 56, "SIDEBAR.UPDATE.CRITICAL"));
      _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵadvance"](3);
      _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵtextInterpolate"](_angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵpipeBind1"](60, 58, "SIDEBAR.UPDATE.IMPORTANT_HINT"));
      _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵadvance"](6);
      _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵtextInterpolate"](_angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵpipeBind1"](66, 60, "SIDEBAR.UPDATE.TIME"));
    }
  },
  directives: [_angular_flex_layout_flex__WEBPACK_IMPORTED_MODULE_3__.DefaultLayoutDirective, _angular_flex_layout_flex__WEBPACK_IMPORTED_MODULE_3__.DefaultLayoutAlignDirective],
  pipes: [_ngx_translate_core__WEBPACK_IMPORTED_MODULE_4__.TranslatePipe],
  styles: ["\n/*# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IiIsImZpbGUiOiJwcm9ncmVzcy1iYXJzLmNvbXBvbmVudC5zY3NzIn0= */"]
});

/***/ }),

/***/ 1957:
/*!******************************************************************************!*\
  !*** ./src/app/pages/ui-kit/modules/components/wallets/wallets.component.ts ***!
  \******************************************************************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "WalletsComponent": function() { return /* binding */ WalletsComponent; }
/* harmony export */ });
/* harmony import */ var D_Work_zano_ui_html_source_node_modules_babel_runtime_helpers_esm_classCallCheck_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./node_modules/@babel/runtime/helpers/esm/classCallCheck.js */ 8069);
/* harmony import */ var D_Work_zano_ui_html_source_node_modules_babel_runtime_helpers_esm_createClass_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./node_modules/@babel/runtime/helpers/esm/createClass.js */ 8047);
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! @angular/core */ 3184);
/* harmony import */ var _angular_flex_layout_flex__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! @angular/flex-layout/flex */ 8281);
/* harmony import */ var _shared_components_checkbox_checkbox_component__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../../../../../_shared/components/checkbox/checkbox.component */ 2519);
/* harmony import */ var _angular_common__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! @angular/common */ 6362);
/* harmony import */ var _shared_components_switch_switch_component__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../../../../../_shared/components/switch/switch.component */ 7291);
/* harmony import */ var _ngx_translate_core__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! @ngx-translate/core */ 3935);









function WalletsComponent_span_13_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementStart"](0, "span", 22);
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵtext"](1, " 12 ");
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementEnd"]();
  }
}

function WalletsComponent_ng_container_24_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementContainerStart"](0);
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementStart"](1, "h4", 23);
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵtext"](2, " $999 ");
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementStart"](3, "span", 24);
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵtext"](4, "20%");
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementEnd"]()();
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementContainerEnd"]();
  }

  if (rf & 2) {
    var ctx_r1 = _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵnextContext"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵadvance"](3);
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵclassProp"]("red", ctx_r1.percentRed);
  }
}

function WalletsComponent_ng_container_25_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementContainerStart"](0);
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementStart"](1, "div", 25)(2, "span", 26);
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵtext"](3);
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵpipe"](4, "translate");
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelement"](5, "app-switch");
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementContainerEnd"]();
  }

  if (rf & 2) {
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵadvance"](3);
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵtextInterpolate"](_angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵpipeBind1"](4, 1, "SIDEBAR.ACCOUNT.STAKING"));
  }
}

function WalletsComponent_div_26_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementStart"](0, "div", 27)(1, "div", 28);
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelement"](2, "div", 29);
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementStart"](3, "div", 30);
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵtext"](4, "33%");
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementEnd"]()();
  }

  if (rf & 2) {
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵadvance"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵstyleProp"]("width", 33 + "%");
  }
}

var WalletsComponent = /*#__PURE__*/function () {
  function WalletsComponent() {
    (0,D_Work_zano_ui_html_source_node_modules_babel_runtime_helpers_esm_classCallCheck_js__WEBPACK_IMPORTED_MODULE_0__["default"])(this, WalletsComponent);

    this.classWalletActive = true;
    this.classWalletAuditable = false;
    this.classWalletWatchOnly = false;
    this.showIndicator = false;
    this.showPrice = true;
    this.percentRed = false;
    this.showStaking = true;
    this.showProgressBar = false;
  }

  (0,D_Work_zano_ui_html_source_node_modules_babel_runtime_helpers_esm_createClass_js__WEBPACK_IMPORTED_MODULE_1__["default"])(WalletsComponent, [{
    key: "ngOnInit",
    value: function ngOnInit() {}
  }]);

  return WalletsComponent;
}();

WalletsComponent.ɵfac = function WalletsComponent_Factory(t) {
  return new (t || WalletsComponent)();
};

WalletsComponent.ɵcmp = /*@__PURE__*/_angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵdefineComponent"]({
  type: WalletsComponent,
  selectors: [["app-wallets"]],
  decls: 27,
  vars: 18,
  consts: [["fxLayout", "column", "fxLayoutAlign", "start stretch", 1, "mb-2"], ["label", "classWalletActive", 1, "mb-1", 3, "value", "emitChange"], ["label", "classWalletAuditable", 1, "mb-1", 3, "value", "emitChange"], ["label", "classWalletWatchOnly", 1, "mb-1", 3, "value", "emitChange"], ["label", "showIndicator", 1, "mb-1", 3, "value", "emitChange"], ["label", "showPrice", 1, "mb-1", 3, "value", "emitChange"], ["label", "percentRed", 1, "mb-1", 3, "value", "emitChange"], ["label", "showStaking", 1, "mb-1", 3, "value", "emitChange"], ["label", "showProgressBar", 1, "mb-1", 3, "value", "emitChange"], ["cdkDrag", "", "vsDragScroll", "", 1, "wallet"], [1, "header"], [1, "left"], [1, "name", "text-ellipsis"], ["class", "indicator", 4, "ngIf"], [1, "name"], [1, "right"], ["type", "button"], [1, "icon", "close"], [1, "balance"], [1, "text-ellipsis", "mr-1"], [4, "ngIf"], ["class", "account-synchronization", 4, "ngIf"], [1, "indicator"], [1, "price"], [1, "percent"], [1, "staking"], [1, "text"], [1, "account-synchronization"], [1, "progress-bar"], [1, "fill"], [1, "progress-percent"]],
  template: function WalletsComponent_Template(rf, ctx) {
    if (rf & 1) {
      _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementStart"](0, "form", 0)(1, "app-checkbox", 1);
      _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵlistener"]("emitChange", function WalletsComponent_Template_app_checkbox_emitChange_1_listener() {
        return ctx.classWalletActive = !ctx.classWalletActive;
      });
      _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementEnd"]();
      _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementStart"](2, "app-checkbox", 2);
      _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵlistener"]("emitChange", function WalletsComponent_Template_app_checkbox_emitChange_2_listener() {
        return ctx.classWalletAuditable = !ctx.classWalletAuditable;
      });
      _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementEnd"]();
      _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementStart"](3, "app-checkbox", 3);
      _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵlistener"]("emitChange", function WalletsComponent_Template_app_checkbox_emitChange_3_listener() {
        return ctx.classWalletWatchOnly = !ctx.classWalletWatchOnly;
      });
      _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementEnd"]();
      _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementStart"](4, "app-checkbox", 4);
      _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵlistener"]("emitChange", function WalletsComponent_Template_app_checkbox_emitChange_4_listener() {
        return ctx.showIndicator = !ctx.showIndicator;
      });
      _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementEnd"]();
      _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementStart"](5, "app-checkbox", 5);
      _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵlistener"]("emitChange", function WalletsComponent_Template_app_checkbox_emitChange_5_listener() {
        return ctx.showPrice = !ctx.showPrice;
      });
      _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementEnd"]();
      _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementStart"](6, "app-checkbox", 6);
      _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵlistener"]("emitChange", function WalletsComponent_Template_app_checkbox_emitChange_6_listener() {
        return ctx.percentRed = !ctx.percentRed;
      });
      _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementEnd"]();
      _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementStart"](7, "app-checkbox", 7);
      _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵlistener"]("emitChange", function WalletsComponent_Template_app_checkbox_emitChange_7_listener() {
        return ctx.showStaking = !ctx.showStaking;
      });
      _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementEnd"]();
      _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementStart"](8, "app-checkbox", 8);
      _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵlistener"]("emitChange", function WalletsComponent_Template_app_checkbox_emitChange_8_listener() {
        return ctx.showProgressBar = !ctx.showProgressBar;
      });
      _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementEnd"]()();
      _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementStart"](9, "div", 9)(10, "div", 10)(11, "div", 11)(12, "div", 12);
      _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵtemplate"](13, WalletsComponent_span_13_Template, 2, 0, "span", 13);
      _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementStart"](14, "span", 14);
      _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵtext"](15, "test");
      _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementEnd"]()()();
      _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementStart"](16, "div", 15)(17, "button", 16);
      _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelement"](18, "i", 17);
      _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementEnd"]()()();
      _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementStart"](19, "div", 18)(20, "span", 19);
      _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵtext"](21, "9999");
      _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementEnd"]();
      _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementStart"](22, "span");
      _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵtext"](23, "ZANO");
      _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementEnd"]()();
      _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵtemplate"](24, WalletsComponent_ng_container_24_Template, 5, 2, "ng-container", 20);
      _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵtemplate"](25, WalletsComponent_ng_container_25_Template, 6, 3, "ng-container", 20);
      _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵtemplate"](26, WalletsComponent_div_26_Template, 5, 2, "div", 21);
      _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementEnd"]();
    }

    if (rf & 2) {
      _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵadvance"](1);
      _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵproperty"]("value", ctx.classWalletActive);
      _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵadvance"](1);
      _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵproperty"]("value", ctx.classWalletAuditable);
      _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵadvance"](1);
      _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵproperty"]("value", ctx.classWalletWatchOnly);
      _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵadvance"](1);
      _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵproperty"]("value", ctx.showIndicator);
      _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵadvance"](1);
      _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵproperty"]("value", ctx.showPrice);
      _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵadvance"](1);
      _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵproperty"]("value", ctx.percentRed);
      _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵadvance"](1);
      _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵproperty"]("value", ctx.showStaking);
      _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵadvance"](1);
      _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵproperty"]("value", ctx.showProgressBar);
      _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵadvance"](1);
      _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵclassProp"]("active", ctx.classWalletActive)("auditable", ctx.classWalletAuditable)("watch-only", ctx.classWalletWatchOnly);
      _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵadvance"](4);
      _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵproperty"]("ngIf", ctx.showIndicator);
      _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵadvance"](11);
      _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵproperty"]("ngIf", ctx.showPrice);
      _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵadvance"](1);
      _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵproperty"]("ngIf", ctx.showStaking);
      _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵadvance"](1);
      _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵproperty"]("ngIf", ctx.showProgressBar);
    }
  },
  directives: [_angular_flex_layout_flex__WEBPACK_IMPORTED_MODULE_5__.DefaultLayoutDirective, _angular_flex_layout_flex__WEBPACK_IMPORTED_MODULE_5__.DefaultLayoutAlignDirective, _shared_components_checkbox_checkbox_component__WEBPACK_IMPORTED_MODULE_2__.CheckboxComponent, _angular_common__WEBPACK_IMPORTED_MODULE_6__.NgIf, _shared_components_switch_switch_component__WEBPACK_IMPORTED_MODULE_3__.SwitchComponent],
  pipes: [_ngx_translate_core__WEBPACK_IMPORTED_MODULE_7__.TranslatePipe],
  styles: ["\n/*# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IiIsImZpbGUiOiJ3YWxsZXRzLmNvbXBvbmVudC5zY3NzIn0= */"]
});

/***/ }),

/***/ 7370:
/*!***********************************************!*\
  !*** ./src/app/pages/ui-kit/modules/index.ts ***!
  \***********************************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "ComponentsModule": function() { return /* reexport safe */ _components_components_module__WEBPACK_IMPORTED_MODULE_1__.ComponentsModule; },
/* harmony export */   "FormModule": function() { return /* reexport safe */ _components_form_form_module__WEBPACK_IMPORTED_MODULE_0__.FormModule; }
/* harmony export */ });
/* harmony import */ var _components_form_form_module__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./components/form/form.module */ 8875);
/* harmony import */ var _components_components_module__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./components/components.module */ 8242);



/***/ }),

/***/ 4819:
/*!*******************************************************!*\
  !*** ./src/app/pages/ui-kit/ui-kit-routing.module.ts ***!
  \*******************************************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "UiKitRoutingModule": function() { return /* binding */ UiKitRoutingModule; }
/* harmony export */ });
/* harmony import */ var D_Work_zano_ui_html_source_node_modules_babel_runtime_helpers_esm_createClass_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./node_modules/@babel/runtime/helpers/esm/createClass.js */ 8047);
/* harmony import */ var D_Work_zano_ui_html_source_node_modules_babel_runtime_helpers_esm_classCallCheck_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./node_modules/@babel/runtime/helpers/esm/classCallCheck.js */ 8069);
/* harmony import */ var _angular_router__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! @angular/router */ 2816);
/* harmony import */ var _ui_kit_component__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./ui-kit.component */ 3968);
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @angular/core */ 3184);






var routes = [{
  path: '',
  component: _ui_kit_component__WEBPACK_IMPORTED_MODULE_2__.UiKitComponent
}];
var UiKitRoutingModule = /*#__PURE__*/(0,D_Work_zano_ui_html_source_node_modules_babel_runtime_helpers_esm_createClass_js__WEBPACK_IMPORTED_MODULE_0__["default"])(function UiKitRoutingModule() {
  (0,D_Work_zano_ui_html_source_node_modules_babel_runtime_helpers_esm_classCallCheck_js__WEBPACK_IMPORTED_MODULE_1__["default"])(this, UiKitRoutingModule);
});

UiKitRoutingModule.ɵfac = function UiKitRoutingModule_Factory(t) {
  return new (t || UiKitRoutingModule)();
};

UiKitRoutingModule.ɵmod = /*@__PURE__*/_angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵdefineNgModule"]({
  type: UiKitRoutingModule
});
UiKitRoutingModule.ɵinj = /*@__PURE__*/_angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵdefineInjector"]({
  imports: [[_angular_router__WEBPACK_IMPORTED_MODULE_4__.RouterModule.forChild(routes)], _angular_router__WEBPACK_IMPORTED_MODULE_4__.RouterModule]
});

(function () {
  (typeof ngJitMode === "undefined" || ngJitMode) && _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵsetNgModuleScope"](UiKitRoutingModule, {
    imports: [_angular_router__WEBPACK_IMPORTED_MODULE_4__.RouterModule],
    exports: [_angular_router__WEBPACK_IMPORTED_MODULE_4__.RouterModule]
  });
})();

/***/ }),

/***/ 3968:
/*!**************************************************!*\
  !*** ./src/app/pages/ui-kit/ui-kit.component.ts ***!
  \**************************************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "UiKitComponent": function() { return /* binding */ UiKitComponent; }
/* harmony export */ });
/* harmony import */ var D_Work_zano_ui_html_source_node_modules_babel_runtime_helpers_esm_classCallCheck_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./node_modules/@babel/runtime/helpers/esm/classCallCheck.js */ 8069);
/* harmony import */ var D_Work_zano_ui_html_source_node_modules_babel_runtime_helpers_esm_createClass_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./node_modules/@babel/runtime/helpers/esm/createClass.js */ 8047);
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! @angular/core */ 3184);
/* harmony import */ var _angular_flex_layout_flex__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! @angular/flex-layout/flex */ 8281);
/* harmony import */ var _modules_components_buttons_buttons_component__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./modules/components/buttons/buttons.component */ 8065);
/* harmony import */ var _modules_components_form_form_component__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./modules/components/form/form.component */ 1116);
/* harmony import */ var _modules_components_breadcrumbs_breadcrumbs_component__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./modules/components/breadcrumbs/breadcrumbs.component */ 9416);
/* harmony import */ var _modules_components_progress_bars_progress_bars_component__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./modules/components/progress-bars/progress-bars.component */ 5242);
/* harmony import */ var _modules_components_wallets_wallets_component__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ./modules/components/wallets/wallets.component */ 1957);









var UiKitComponent = /*#__PURE__*/function () {
  function UiKitComponent() {
    (0,D_Work_zano_ui_html_source_node_modules_babel_runtime_helpers_esm_classCallCheck_js__WEBPACK_IMPORTED_MODULE_0__["default"])(this, UiKitComponent);
  }

  (0,D_Work_zano_ui_html_source_node_modules_babel_runtime_helpers_esm_createClass_js__WEBPACK_IMPORTED_MODULE_1__["default"])(UiKitComponent, [{
    key: "ngOnInit",
    value: function ngOnInit() {}
  }]);

  return UiKitComponent;
}();

UiKitComponent.ɵfac = function UiKitComponent_Factory(t) {
  return new (t || UiKitComponent)();
};

UiKitComponent.ɵcmp = /*@__PURE__*/_angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵdefineComponent"]({
  type: UiKitComponent,
  selectors: [["app-ui-kit"]],
  decls: 21,
  vars: 0,
  consts: [["fxFlex", "0 1 50rem", "fxLayout", "column", "fxLayoutAlign", "start stretch"], [1, "mb-2"], [1, "mb-1"]],
  template: function UiKitComponent_Template(rf, ctx) {
    if (rf & 1) {
      _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵelementStart"](0, "div", 0)(1, "div", 1)(2, "h2", 2);
      _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵtext"](3, "Buttons");
      _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵelementEnd"]();
      _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵelement"](4, "app-buttons");
      _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵelementEnd"]();
      _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵelementStart"](5, "div", 1)(6, "h2", 2);
      _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵtext"](7, "Form");
      _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵelementEnd"]();
      _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵelement"](8, "app-form");
      _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵelementEnd"]();
      _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵelementStart"](9, "div", 1)(10, "h2", 2);
      _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵtext"](11, "Breadcrumbs");
      _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵelementEnd"]();
      _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵelement"](12, "app-breadcrumbs");
      _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵelementEnd"]();
      _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵelementStart"](13, "div", 1)(14, "h2", 2);
      _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵtext"](15, "Progress bars");
      _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵelementEnd"]();
      _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵelement"](16, "app-progress-bars");
      _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵelementEnd"]();
      _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵelementStart"](17, "div", 1)(18, "h2", 2);
      _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵtext"](19, "Wallets");
      _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵelementEnd"]();
      _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵelement"](20, "app-wallets");
      _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵelementEnd"]()();
    }
  },
  directives: [_angular_flex_layout_flex__WEBPACK_IMPORTED_MODULE_8__.DefaultFlexDirective, _angular_flex_layout_flex__WEBPACK_IMPORTED_MODULE_8__.DefaultLayoutDirective, _angular_flex_layout_flex__WEBPACK_IMPORTED_MODULE_8__.DefaultLayoutAlignDirective, _modules_components_buttons_buttons_component__WEBPACK_IMPORTED_MODULE_2__.ButtonsComponent, _modules_components_form_form_component__WEBPACK_IMPORTED_MODULE_3__.FormComponent, _modules_components_breadcrumbs_breadcrumbs_component__WEBPACK_IMPORTED_MODULE_4__.BreadcrumbsComponent, _modules_components_progress_bars_progress_bars_component__WEBPACK_IMPORTED_MODULE_5__.ProgressBarsComponent, _modules_components_wallets_wallets_component__WEBPACK_IMPORTED_MODULE_6__.WalletsComponent],
  styles: ["\n/*# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IiIsImZpbGUiOiJ1aS1raXQuY29tcG9uZW50LnNjc3MifQ== */"]
});

/***/ }),

/***/ 8188:
/*!***********************************************!*\
  !*** ./src/app/pages/ui-kit/ui-kit.module.ts ***!
  \***********************************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "UiKitModule": function() { return /* binding */ UiKitModule; }
/* harmony export */ });
/* harmony import */ var D_Work_zano_ui_html_source_node_modules_babel_runtime_helpers_esm_createClass_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./node_modules/@babel/runtime/helpers/esm/createClass.js */ 8047);
/* harmony import */ var D_Work_zano_ui_html_source_node_modules_babel_runtime_helpers_esm_classCallCheck_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./node_modules/@babel/runtime/helpers/esm/classCallCheck.js */ 8069);
/* harmony import */ var _angular_common__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! @angular/common */ 6362);
/* harmony import */ var _ui_kit_component__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./ui-kit.component */ 3968);
/* harmony import */ var _ui_kit_routing_module__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./ui-kit-routing.module */ 4819);
/* harmony import */ var _modules__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./modules */ 7370);
/* harmony import */ var _angular_flex_layout__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! @angular/flex-layout */ 1378);
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! @angular/core */ 3184);








var UiKitModule = /*#__PURE__*/(0,D_Work_zano_ui_html_source_node_modules_babel_runtime_helpers_esm_createClass_js__WEBPACK_IMPORTED_MODULE_0__["default"])(function UiKitModule() {
  (0,D_Work_zano_ui_html_source_node_modules_babel_runtime_helpers_esm_classCallCheck_js__WEBPACK_IMPORTED_MODULE_1__["default"])(this, UiKitModule);
});

UiKitModule.ɵfac = function UiKitModule_Factory(t) {
  return new (t || UiKitModule)();
};

UiKitModule.ɵmod = /*@__PURE__*/_angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵdefineNgModule"]({
  type: UiKitModule
});
UiKitModule.ɵinj = /*@__PURE__*/_angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵdefineInjector"]({
  imports: [[_angular_common__WEBPACK_IMPORTED_MODULE_6__.CommonModule, _modules__WEBPACK_IMPORTED_MODULE_4__.ComponentsModule, _ui_kit_routing_module__WEBPACK_IMPORTED_MODULE_3__.UiKitRoutingModule, _angular_flex_layout__WEBPACK_IMPORTED_MODULE_7__.FlexLayoutModule]]
});

(function () {
  (typeof ngJitMode === "undefined" || ngJitMode) && _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵsetNgModuleScope"](UiKitModule, {
    declarations: [_ui_kit_component__WEBPACK_IMPORTED_MODULE_2__.UiKitComponent],
    imports: [_angular_common__WEBPACK_IMPORTED_MODULE_6__.CommonModule, _modules__WEBPACK_IMPORTED_MODULE_4__.ComponentsModule, _ui_kit_routing_module__WEBPACK_IMPORTED_MODULE_3__.UiKitRoutingModule, _angular_flex_layout__WEBPACK_IMPORTED_MODULE_7__.FlexLayoutModule]
  });
})();

/***/ })

}]);
//# sourceMappingURL=src_app_pages_ui-kit_ui-kit_module_ts.js.map