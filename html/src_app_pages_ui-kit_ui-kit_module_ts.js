"use strict";
(self["webpackChunkzano"] = self["webpackChunkzano"] || []).push([["src_app_pages_ui-kit_ui-kit_module_ts"],{

/***/ 50116:
/*!**************************************************************************************!*\
  !*** ./src/app/pages/ui-kit/modules/components/breadcrumbs/breadcrumbs.component.ts ***!
  \**************************************************************************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "BreadcrumbsComponent": function() { return /* binding */ BreadcrumbsComponent; }
/* harmony export */ });
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @angular/core */ 2316);

var BreadcrumbsComponent = /** @class */ (function () {
    function BreadcrumbsComponent() {
    }
    BreadcrumbsComponent.prototype.ngOnInit = function () {
    };
    BreadcrumbsComponent.ɵfac = function BreadcrumbsComponent_Factory(t) { return new (t || BreadcrumbsComponent)(); };
    BreadcrumbsComponent.ɵcmp = /*@__PURE__*/ _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵdefineComponent"]({ type: BreadcrumbsComponent, selectors: [["app-breadcrumbs"]], decls: 66, vars: 0, consts: [[1, "breadcrumbs", "mb-2"], [1, "breadcrumb"], [1, "breadcrumbs", "scrolled", "mb-2"]], template: function BreadcrumbsComponent_Template(rf, ctx) { if (rf & 1) {
            _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](0, "h3");
            _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](1, "Default");
            _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
            _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](2, "div", 0);
            _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](3, "div", 1);
            _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](4, "a");
            _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](5, "test 1 (link)");
            _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
            _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
            _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](6, "div", 1);
            _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](7, "span");
            _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](8, "test 2 (text)");
            _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
            _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
            _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](9, "div", 1);
            _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](10, "a");
            _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](11, "test 3 (link)");
            _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
            _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
            _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](12, "div", 1);
            _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](13, "span");
            _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](14, "test 4 (text)");
            _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
            _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
            _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](15, "div", 1);
            _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](16, "a");
            _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](17, "test 5 (link)");
            _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
            _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
            _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](18, "div", 1);
            _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](19, "a");
            _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](20, "test 6 (link)");
            _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
            _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
            _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](21, "div", 1);
            _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](22, "span");
            _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](23, "last item (text)");
            _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
            _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
            _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
            _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](24, "h3");
            _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](25, "With scroll");
            _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
            _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](26, "div", 2);
            _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](27, "div", 1);
            _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](28, "a");
            _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](29, "test 1 (link)");
            _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
            _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
            _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](30, "div", 1);
            _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](31, "span");
            _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](32, "test 2 (text)");
            _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
            _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
            _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](33, "div", 1);
            _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](34, "a");
            _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](35, "test 3 (link)");
            _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
            _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
            _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](36, "div", 1);
            _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](37, "span");
            _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](38, "test 4 (text)");
            _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
            _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
            _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](39, "div", 1);
            _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](40, "a");
            _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](41, "test 5 (link)");
            _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
            _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
            _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](42, "div", 1);
            _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](43, "a");
            _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](44, "test 6 (link)");
            _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
            _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
            _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](45, "div", 1);
            _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](46, "a");
            _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](47, "test 7 (link)");
            _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
            _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
            _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](48, "div", 1);
            _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](49, "span");
            _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](50, "test 8 (text)");
            _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
            _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
            _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](51, "div", 1);
            _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](52, "a");
            _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](53, "test 9 (link)");
            _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
            _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
            _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](54, "div", 1);
            _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](55, "span");
            _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](56, "test 10 (text)");
            _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
            _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
            _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](57, "div", 1);
            _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](58, "a");
            _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](59, "test 11 (link)");
            _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
            _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
            _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](60, "div", 1);
            _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](61, "a");
            _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](62, "test 12 (link)");
            _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
            _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
            _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](63, "div", 1);
            _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](64, "span");
            _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](65, "last item (text)");
            _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
            _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
            _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        } }, styles: ["\n/*# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IiIsImZpbGUiOiJicmVhZGNydW1icy5jb21wb25lbnQuc2NzcyJ9 */"] });
    return BreadcrumbsComponent;
}());



/***/ }),

/***/ 68065:
/*!******************************************************************************!*\
  !*** ./src/app/pages/ui-kit/modules/components/buttons/buttons.component.ts ***!
  \******************************************************************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "ButtonsComponent": function() { return /* binding */ ButtonsComponent; }
/* harmony export */ });
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @angular/core */ 2316);

var ButtonsComponent = /** @class */ (function () {
    function ButtonsComponent() {
    }
    ButtonsComponent.prototype.ngOnInit = function () {
    };
    ButtonsComponent.ɵfac = function ButtonsComponent_Factory(t) { return new (t || ButtonsComponent)(); };
    ButtonsComponent.ɵcmp = /*@__PURE__*/ _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵdefineComponent"]({ type: ButtonsComponent, selectors: [["app-buttons"]], decls: 25, vars: 0, consts: [[1, "mb-1"], [1, "m-1", "primary", "small"], [1, "m-1", "primary", "big"], ["disabled", "", 1, "m-1", "primary", "big"], [1, "m-1", "outline", "small"], [1, "icon", "plus", "mr-1"], [1, "m-1", "outline", "big"], ["disabled", "", 1, "m-1", "outline", "big"], [1, "m-1", "btn-icon", "circle", "small", "mr-2"], [1, "icon", "dropdown-arrow-left"], [1, "m-1", "btn-icon", "circle", "big", "mr-2"], ["disabled", "", 1, "m-1", "btn-icon", "circle", "big", "mr-2"]], template: function ButtonsComponent_Template(rf, ctx) { if (rf & 1) {
            _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](0, "h3", 0);
            _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](1, "Primary");
            _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
            _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](2, "button", 1);
            _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](3, "Add Wallet");
            _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
            _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](4, "button", 2);
            _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](5, "Add / Save");
            _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
            _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](6, "button", 3);
            _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](7, "Add / Save\n");
            _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
            _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](8, "h3", 0);
            _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](9, "Outline");
            _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
            _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](10, "button", 4);
            _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelement"](11, "i", 5);
            _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](12, "Add Wallet");
            _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
            _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](13, "button", 6);
            _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](14, "Add / Save");
            _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
            _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](15, "button", 7);
            _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](16, "Add / Save\n");
            _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
            _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](17, "h3", 0);
            _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](18, "Circle");
            _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
            _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](19, "button", 8);
            _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelement"](20, "i", 9);
            _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
            _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](21, "button", 10);
            _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelement"](22, "i", 9);
            _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
            _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](23, "button", 11);
            _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelement"](24, "i", 9);
            _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        } }, styles: ["\n/*# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IiIsImZpbGUiOiJidXR0b25zLmNvbXBvbmVudC5zY3NzIn0= */"] });
    return ButtonsComponent;
}());



/***/ }),

/***/ 48242:
/*!**********************************************************************!*\
  !*** ./src/app/pages/ui-kit/modules/components/components.module.ts ***!
  \**********************************************************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "ComponentsModule": function() { return /* binding */ ComponentsModule; }
/* harmony export */ });
/* harmony import */ var _angular_common__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! @angular/common */ 54364);
/* harmony import */ var ___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./ */ 4384);
/* harmony import */ var _breadcrumbs_breadcrumbs_component__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./breadcrumbs/breadcrumbs.component */ 50116);
/* harmony import */ var _ngx_translate_core__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! @ngx-translate/core */ 70325);
/* harmony import */ var _wallets_wallets_component__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./wallets/wallets.component */ 21957);
/* harmony import */ var _shared_shared_module__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../../../../_shared/shared.module */ 28855);
/* harmony import */ var _angular_flex_layout__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! @angular/flex-layout */ 78662);
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! @angular/core */ 2316);








var ComponentsModule = /** @class */ (function () {
    function ComponentsModule() {
    }
    ComponentsModule.ɵfac = function ComponentsModule_Factory(t) { return new (t || ComponentsModule)(); };
    ComponentsModule.ɵmod = /*@__PURE__*/ _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵdefineNgModule"]({ type: ComponentsModule });
    ComponentsModule.ɵinj = /*@__PURE__*/ _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵdefineInjector"]({ imports: [[
                _angular_common__WEBPACK_IMPORTED_MODULE_5__.CommonModule,
                _ngx_translate_core__WEBPACK_IMPORTED_MODULE_6__.TranslateModule,
                ___WEBPACK_IMPORTED_MODULE_0__.FormModule,
                _angular_flex_layout__WEBPACK_IMPORTED_MODULE_7__.FlexLayoutModule,
                _shared_shared_module__WEBPACK_IMPORTED_MODULE_3__.SharedModule
            ], ___WEBPACK_IMPORTED_MODULE_0__.FormModule] });
    return ComponentsModule;
}());

(function () { (typeof ngJitMode === "undefined" || ngJitMode) && _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵsetNgModuleScope"](ComponentsModule, { declarations: [___WEBPACK_IMPORTED_MODULE_0__.ButtonsComponent, ___WEBPACK_IMPORTED_MODULE_0__.ProgressBarsComponent, _breadcrumbs_breadcrumbs_component__WEBPACK_IMPORTED_MODULE_1__.BreadcrumbsComponent, _wallets_wallets_component__WEBPACK_IMPORTED_MODULE_2__.WalletsComponent], imports: [_angular_common__WEBPACK_IMPORTED_MODULE_5__.CommonModule,
        _ngx_translate_core__WEBPACK_IMPORTED_MODULE_6__.TranslateModule,
        ___WEBPACK_IMPORTED_MODULE_0__.FormModule,
        _angular_flex_layout__WEBPACK_IMPORTED_MODULE_7__.FlexLayoutModule,
        _shared_shared_module__WEBPACK_IMPORTED_MODULE_3__.SharedModule], exports: [___WEBPACK_IMPORTED_MODULE_0__.ButtonsComponent, ___WEBPACK_IMPORTED_MODULE_0__.ProgressBarsComponent, _breadcrumbs_breadcrumbs_component__WEBPACK_IMPORTED_MODULE_1__.BreadcrumbsComponent, _wallets_wallets_component__WEBPACK_IMPORTED_MODULE_2__.WalletsComponent, ___WEBPACK_IMPORTED_MODULE_0__.FormModule] }); })();


/***/ }),

/***/ 93551:
/*!**************************************************************************************************!*\
  !*** ./src/app/pages/ui-kit/modules/components/form/components/checkboxs/checkboxs.component.ts ***!
  \**************************************************************************************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "CheckboxsComponent": function() { return /* binding */ CheckboxsComponent; }
/* harmony export */ });
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @angular/core */ 2316);
/* harmony import */ var _shared_components_checkbox_checkbox_component__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../../../../../../../_shared/components/checkbox/checkbox.component */ 2519);


var CheckboxsComponent = /** @class */ (function () {
    function CheckboxsComponent() {
    }
    CheckboxsComponent.prototype.ngOnInit = function () {
    };
    CheckboxsComponent.ɵfac = function CheckboxsComponent_Factory(t) { return new (t || CheckboxsComponent)(); };
    CheckboxsComponent.ɵcmp = /*@__PURE__*/ _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵdefineComponent"]({ type: CheckboxsComponent, selectors: [["app-checkboxs"]], decls: 6, vars: 1, consts: [[1, "mb-2"], ["label", "LabelLabelLabelLabelLabelLabelLabelLabelLabelLabelLabelLabelLabelLabelLabelLabelLabelLabelLabelLabelLabelLabelLabelLabelLabelLabelLabelLabelLabelLabelLabelLabelLabelLabelLabelLabelLabelLabelLabelLabelLabelLabelLabelLabelLabel", 1, "mb-1", "max-w-50-rem", "w-100", 3, "disabled"], ["label", "Label", 1, "mb-1", "max-w-50-rem", "w-100"]], template: function CheckboxsComponent_Template(rf, ctx) { if (rf & 1) {
            _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](0, "h3", 0);
            _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtext"](1, "Disabled = true");
            _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]();
            _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelement"](2, "app-checkbox", 1);
            _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](3, "h3", 0);
            _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtext"](4, "Default");
            _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]();
            _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelement"](5, "app-checkbox", 2);
        } if (rf & 2) {
            _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵadvance"](2);
            _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵproperty"]("disabled", true);
        } }, directives: [_shared_components_checkbox_checkbox_component__WEBPACK_IMPORTED_MODULE_0__.CheckboxComponent], styles: ["\n/*# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IiIsImZpbGUiOiJjaGVja2JveHMuY29tcG9uZW50LnNjc3MifQ== */"] });
    return CheckboxsComponent;
}());



/***/ }),

/***/ 23253:
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
/* harmony import */ var _checkboxs_checkboxs_component__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./checkboxs/checkboxs.component */ 93551);
/* harmony import */ var _inputs_inputs_component__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./inputs/inputs.component */ 9706);
/* harmony import */ var _selects_selects_component__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./selects/selects.component */ 64597);
/* harmony import */ var _switches_switches_component__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./switches/switches.component */ 94033);






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
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @angular/core */ 2316);

var InputsComponent = /** @class */ (function () {
    function InputsComponent() {
    }
    InputsComponent.prototype.ngOnInit = function () {
    };
    InputsComponent.ɵfac = function InputsComponent_Factory(t) { return new (t || InputsComponent)(); };
    InputsComponent.ɵcmp = /*@__PURE__*/ _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵdefineComponent"]({ type: InputsComponent, selectors: [["app-inputs"]], decls: 38, vars: 0, consts: [[1, "mb-3"], [1, "mb-2"], [1, "form__field"], ["for", "test-id1"], ["disabled", "", "id", "test-id1", "name", "test1", "placeholder", "Enter a name here", "type", "text", 1, "form__field--input"], ["name", "test1", "placeholder", "Enter a name here", "type", "text", 1, "form__field--input"], ["name", "test1", "placeholder", "Enter a name here", "type", "text", "value", "Name", 1, "form__field--input"], ["for", "test-id4"], ["disabled", "", "id", "test-id4", "name", "test1", "placeholder", "Enter a name here", "type", "password", "value", "Name", 1, "form__field--input"], ["name", "1234567890", "placeholder", "Enter a name here", "type", "password", "value", "Name", 1, "form__field--input"], ["name", "1234567890", "placeholder", "Enter a name here", "type", "password", "value", "Name", 1, "form__field--input", "invalid"], [1, "error"], [1, "success"]], template: function InputsComponent_Template(rf, ctx) { if (rf & 1) {
            _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](0, "h3", 0);
            _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](1, "Input type=\"text\"");
            _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
            _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](2, "h4", 1);
            _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](3, "Disabled = true");
            _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
            _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](4, "div", 2);
            _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](5, "label", 3);
            _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](6, "Label");
            _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
            _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelement"](7, "input", 4);
            _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
            _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](8, "h4", 0);
            _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](9, "Without label");
            _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
            _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](10, "div", 2);
            _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelement"](11, "input", 5);
            _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
            _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](12, "div", 2);
            _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelement"](13, "input", 6);
            _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
            _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](14, "h3", 0);
            _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](15, "Input type=\"password\"");
            _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
            _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](16, "h4", 1);
            _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](17, "Disabled = true");
            _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
            _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](18, "div", 2);
            _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](19, "label", 7);
            _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](20, "Label");
            _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
            _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelement"](21, "input", 8);
            _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
            _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](22, "h4", 0);
            _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](23, "Without label");
            _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
            _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](24, "div", 2);
            _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelement"](25, "input", 9);
            _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
            _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](26, "h4", 0);
            _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](27, "With error");
            _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
            _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](28, "div", 2);
            _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelement"](29, "input", 10);
            _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](30, "div", 11);
            _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](31, " Error text ");
            _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
            _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
            _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](32, "h4", 0);
            _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](33, "With success");
            _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
            _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](34, "div", 2);
            _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelement"](35, "input", 9);
            _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](36, "div", 12);
            _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](37, " Success text ");
            _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
            _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        } }, styles: ["\n/*# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IiIsImZpbGUiOiJpbnB1dHMuY29tcG9uZW50LnNjc3MifQ== */"] });
    return InputsComponent;
}());



/***/ }),

/***/ 64597:
/*!**********************************************************************************************!*\
  !*** ./src/app/pages/ui-kit/modules/components/form/components/selects/selects.component.ts ***!
  \**********************************************************************************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "SelectsComponent": function() { return /* binding */ SelectsComponent; }
/* harmony export */ });
/* harmony import */ var src_app_helpers_data_scale_items__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! src/app/_helpers/data/scale-items */ 48671);
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @angular/core */ 2316);
/* harmony import */ var _ng_select_ng_select__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @ng-select/ng-select */ 36868);
/* harmony import */ var _ngx_translate_core__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @ngx-translate/core */ 70325);
var __spreadArray = (undefined && undefined.__spreadArray) || function (to, from) {
    for (var i = 0, il = from.length, j = to.length; i < il; i++, j++)
        to[j] = from[i];
    return to;
};




function SelectsComponent_ng_template_4_Template(rf, ctx) { if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtext"](0);
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵpipe"](1, "translate");
} if (rf & 2) {
    var item_r6 = ctx.item;
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtextInterpolate1"](" ", _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵpipeBind1"](1, 1, item_r6.name), " ");
} }
function SelectsComponent_ng_template_5_Template(rf, ctx) { if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtext"](0);
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵpipe"](1, "translate");
} if (rf & 2) {
    var item_r8 = ctx.item;
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtextInterpolate1"](" ", _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵpipeBind1"](1, 1, item_r8.name), " ");
} }
function SelectsComponent_ng_template_10_Template(rf, ctx) { if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtext"](0);
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵpipe"](1, "translate");
} if (rf & 2) {
    var item_r9 = ctx.item;
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtextInterpolate1"](" ", _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵpipeBind1"](1, 1, item_r9.name), " ");
} }
function SelectsComponent_ng_template_11_Template(rf, ctx) { if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtext"](0);
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵpipe"](1, "translate");
} if (rf & 2) {
    var item_r11 = ctx.item;
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtextInterpolate1"](" ", _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵpipeBind1"](1, 1, item_r11.name), " ");
} }
function SelectsComponent_ng_template_18_Template(rf, ctx) { if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtext"](0);
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵpipe"](1, "translate");
} if (rf & 2) {
    var item_r12 = ctx.item;
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtextInterpolate1"](" ", _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵpipeBind1"](1, 1, item_r12.name), " ");
} }
function SelectsComponent_ng_template_19_Template(rf, ctx) { if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtext"](0);
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵpipe"](1, "translate");
} if (rf & 2) {
    var item_r14 = ctx.item;
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtextInterpolate1"](" ", _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵpipeBind1"](1, 1, item_r14.name), " ");
} }
var SelectsComponent = /** @class */ (function () {
    function SelectsComponent() {
        this.scaleItems = __spreadArray([], src_app_helpers_data_scale_items__WEBPACK_IMPORTED_MODULE_0__.scaleItems);
    }
    SelectsComponent.prototype.ngOnInit = function () {
    };
    SelectsComponent.ɵfac = function SelectsComponent_Factory(t) { return new (t || SelectsComponent)(); };
    SelectsComponent.ɵcmp = /*@__PURE__*/ _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵdefineComponent"]({ type: SelectsComponent, selectors: [["app-selects"]], decls: 20, vars: 9, consts: [[1, "form__field", "mb-2"], ["bindLabel", "name", "bindValue", "value", 3, "clearable", "items", "searchable"], ["ng-label-tmp", ""], ["ng-option-tmp", ""], [1, "form__field"], ["bindLabel", "name", "bindValue", "value", 1, "with-circle", 3, "clearable", "items", "searchable"], [1, "mb-1"], ["bindLabel", "name", "bindValue", "value", 1, "with-circle", "invalid", 3, "clearable", "items", "searchable"]], template: function SelectsComponent_Template(rf, ctx) { if (rf & 1) {
            _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](0, "div", 0);
            _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](1, "label");
            _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtext"](2, "Default");
            _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]();
            _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](3, "ng-select", 1);
            _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtemplate"](4, SelectsComponent_ng_template_4_Template, 2, 3, "ng-template", 2);
            _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtemplate"](5, SelectsComponent_ng_template_5_Template, 2, 3, "ng-template", 3);
            _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]();
            _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]();
            _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](6, "div", 4);
            _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](7, "label");
            _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtext"](8, "With circle");
            _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]();
            _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](9, "ng-select", 5);
            _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtemplate"](10, SelectsComponent_ng_template_10_Template, 2, 3, "ng-template", 2);
            _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtemplate"](11, SelectsComponent_ng_template_11_Template, 2, 3, "ng-template", 3);
            _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]();
            _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]();
            _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](12, "h3", 6);
            _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtext"](13, "if you use formControlName class ng-invalid set red border if select ng-touched");
            _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]();
            _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](14, "div", 4);
            _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](15, "label");
            _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtext"](16, "With error");
            _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]();
            _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](17, "ng-select", 7);
            _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtemplate"](18, SelectsComponent_ng_template_18_Template, 2, 3, "ng-template", 2);
            _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtemplate"](19, SelectsComponent_ng_template_19_Template, 2, 3, "ng-template", 3);
            _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]();
            _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]();
        } if (rf & 2) {
            _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵadvance"](3);
            _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵproperty"]("clearable", false)("items", ctx.scaleItems)("searchable", false);
            _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵadvance"](6);
            _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵproperty"]("clearable", false)("items", ctx.scaleItems)("searchable", false);
            _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵadvance"](8);
            _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵproperty"]("clearable", false)("items", ctx.scaleItems)("searchable", false);
        } }, directives: [_ng_select_ng_select__WEBPACK_IMPORTED_MODULE_2__.NgSelectComponent, _ng_select_ng_select__WEBPACK_IMPORTED_MODULE_2__["ɵh"], _ng_select_ng_select__WEBPACK_IMPORTED_MODULE_2__["ɵf"]], pipes: [_ngx_translate_core__WEBPACK_IMPORTED_MODULE_3__.TranslatePipe], styles: ["\n/*# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IiIsImZpbGUiOiJzZWxlY3RzLmNvbXBvbmVudC5zY3NzIn0= */"] });
    return SelectsComponent;
}());



/***/ }),

/***/ 94033:
/*!************************************************************************************************!*\
  !*** ./src/app/pages/ui-kit/modules/components/form/components/switches/switches.component.ts ***!
  \************************************************************************************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "SwitchesComponent": function() { return /* binding */ SwitchesComponent; }
/* harmony export */ });
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @angular/core */ 2316);
/* harmony import */ var _shared_components_switch_switch_component__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../../../../../../../_shared/components/switch/switch.component */ 7291);


var SwitchesComponent = /** @class */ (function () {
    function SwitchesComponent() {
    }
    SwitchesComponent.prototype.ngOnInit = function () {
    };
    SwitchesComponent.ɵfac = function SwitchesComponent_Factory(t) { return new (t || SwitchesComponent)(); };
    SwitchesComponent.ɵcmp = /*@__PURE__*/ _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵdefineComponent"]({ type: SwitchesComponent, selectors: [["app-switches"]], decls: 9, vars: 3, consts: [[1, "mb-1"], [1, "mb-1", 3, "value"], [1, "mb-1", 3, "disabled", "value"]], template: function SwitchesComponent_Template(rf, ctx) { if (rf & 1) {
            _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](0, "h3", 0);
            _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtext"](1, "Switch default");
            _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]();
            _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelement"](2, "app-switch", 0);
            _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](3, "h3", 0);
            _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtext"](4, "value = true");
            _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]();
            _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelement"](5, "app-switch", 1);
            _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](6, "h3", 0);
            _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtext"](7, "value = true, disabled = true");
            _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]();
            _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelement"](8, "app-switch", 2);
        } if (rf & 2) {
            _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵadvance"](5);
            _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵproperty"]("value", true);
            _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵadvance"](3);
            _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵproperty"]("disabled", true)("value", true);
        } }, directives: [_shared_components_switch_switch_component__WEBPACK_IMPORTED_MODULE_0__.SwitchComponent], styles: ["\n/*# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IiIsImZpbGUiOiJzd2l0Y2hlcy5jb21wb25lbnQuc2NzcyJ9 */"] });
    return SwitchesComponent;
}());



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
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! @angular/core */ 2316);
/* harmony import */ var _components_inputs_inputs_component__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./components/inputs/inputs.component */ 9706);
/* harmony import */ var _components_selects_selects_component__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./components/selects/selects.component */ 64597);
/* harmony import */ var _components_checkboxs_checkboxs_component__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./components/checkboxs/checkboxs.component */ 93551);
/* harmony import */ var _components_switches_switches_component__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./components/switches/switches.component */ 94033);





var FormComponent = /** @class */ (function () {
    function FormComponent() {
    }
    FormComponent.prototype.ngOnInit = function () {
    };
    FormComponent.ɵfac = function FormComponent_Factory(t) { return new (t || FormComponent)(); };
    FormComponent.ɵcmp = /*@__PURE__*/ _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵdefineComponent"]({ type: FormComponent, selectors: [["app-form"]], decls: 16, vars: 0, consts: [[1, "mb-2"], [1, "mb-1"]], template: function FormComponent_Template(rf, ctx) { if (rf & 1) {
            _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementStart"](0, "div", 0);
            _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementStart"](1, "h2", 1);
            _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵtext"](2, "Inputs");
            _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementEnd"]();
            _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelement"](3, "app-inputs");
            _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementEnd"]();
            _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementStart"](4, "div", 0);
            _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementStart"](5, "h2", 1);
            _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵtext"](6, "Selects");
            _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementEnd"]();
            _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelement"](7, "app-selects");
            _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementEnd"]();
            _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementStart"](8, "div", 0);
            _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementStart"](9, "h2", 1);
            _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵtext"](10, "Checkbox");
            _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementEnd"]();
            _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelement"](11, "app-checkboxs");
            _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementEnd"]();
            _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementStart"](12, "div", 0);
            _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementStart"](13, "h2", 1);
            _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵtext"](14, "Switches");
            _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementEnd"]();
            _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelement"](15, "app-switches");
            _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementEnd"]();
        } }, directives: [_components_inputs_inputs_component__WEBPACK_IMPORTED_MODULE_0__.InputsComponent, _components_selects_selects_component__WEBPACK_IMPORTED_MODULE_1__.SelectsComponent, _components_checkboxs_checkboxs_component__WEBPACK_IMPORTED_MODULE_2__.CheckboxsComponent, _components_switches_switches_component__WEBPACK_IMPORTED_MODULE_3__.SwitchesComponent], styles: ["\n/*# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IiIsImZpbGUiOiJmb3JtLmNvbXBvbmVudC5zY3NzIn0= */"] });
    return FormComponent;
}());



/***/ }),

/***/ 18875:
/*!*********************************************************************!*\
  !*** ./src/app/pages/ui-kit/modules/components/form/form.module.ts ***!
  \*********************************************************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "FormModule": function() { return /* binding */ FormModule; }
/* harmony export */ });
/* harmony import */ var _angular_common__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! @angular/common */ 54364);
/* harmony import */ var _form_component__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./form.component */ 1116);
/* harmony import */ var _components__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./components */ 23253);
/* harmony import */ var src_app_shared_shared_module__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! src/app/_shared/shared.module */ 28855);
/* harmony import */ var _ng_select_ng_select__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! @ng-select/ng-select */ 36868);
/* harmony import */ var _ngx_translate_core__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! @ngx-translate/core */ 70325);
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @angular/core */ 2316);







var FormModule = /** @class */ (function () {
    function FormModule() {
    }
    FormModule.ɵfac = function FormModule_Factory(t) { return new (t || FormModule)(); };
    FormModule.ɵmod = /*@__PURE__*/ _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵdefineNgModule"]({ type: FormModule });
    FormModule.ɵinj = /*@__PURE__*/ _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵdefineInjector"]({ imports: [[
                _angular_common__WEBPACK_IMPORTED_MODULE_4__.CommonModule,
                src_app_shared_shared_module__WEBPACK_IMPORTED_MODULE_2__.SharedModule,
                _ng_select_ng_select__WEBPACK_IMPORTED_MODULE_5__.NgSelectModule,
                _ngx_translate_core__WEBPACK_IMPORTED_MODULE_6__.TranslateModule,
            ]] });
    return FormModule;
}());

(function () { (typeof ngJitMode === "undefined" || ngJitMode) && _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵsetNgModuleScope"](FormModule, { declarations: [_form_component__WEBPACK_IMPORTED_MODULE_0__.FormComponent, _components__WEBPACK_IMPORTED_MODULE_1__.InputsComponent, _components__WEBPACK_IMPORTED_MODULE_1__.SelectsComponent, _components__WEBPACK_IMPORTED_MODULE_1__.CheckboxsComponent, _components__WEBPACK_IMPORTED_MODULE_1__.SwitchesComponent], imports: [_angular_common__WEBPACK_IMPORTED_MODULE_4__.CommonModule,
        src_app_shared_shared_module__WEBPACK_IMPORTED_MODULE_2__.SharedModule,
        _ng_select_ng_select__WEBPACK_IMPORTED_MODULE_5__.NgSelectModule,
        _ngx_translate_core__WEBPACK_IMPORTED_MODULE_6__.TranslateModule], exports: [_form_component__WEBPACK_IMPORTED_MODULE_0__.FormComponent, _components__WEBPACK_IMPORTED_MODULE_1__.InputsComponent, _components__WEBPACK_IMPORTED_MODULE_1__.SelectsComponent, _components__WEBPACK_IMPORTED_MODULE_1__.CheckboxsComponent, _components__WEBPACK_IMPORTED_MODULE_1__.SwitchesComponent] }); })();


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
/* harmony export */   "FormModule": function() { return /* reexport safe */ _form_form_module__WEBPACK_IMPORTED_MODULE_2__.FormModule; },
/* harmony export */   "FormComponent": function() { return /* reexport safe */ _form_form_component__WEBPACK_IMPORTED_MODULE_3__.FormComponent; },
/* harmony export */   "ProgressBarsComponent": function() { return /* reexport safe */ _progress_bars_progress_bars_component__WEBPACK_IMPORTED_MODULE_4__.ProgressBarsComponent; },
/* harmony export */   "WalletsComponent": function() { return /* reexport safe */ _wallets_wallets_component__WEBPACK_IMPORTED_MODULE_5__.WalletsComponent; }
/* harmony export */ });
/* harmony import */ var _breadcrumbs_breadcrumbs_component__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./breadcrumbs/breadcrumbs.component */ 50116);
/* harmony import */ var _buttons_buttons_component__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./buttons/buttons.component */ 68065);
/* harmony import */ var _form_form_module__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./form/form.module */ 18875);
/* harmony import */ var _form_form_component__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./form/form.component */ 1116);
/* harmony import */ var _progress_bars_progress_bars_component__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./progress-bars/progress-bars.component */ 45242);
/* harmony import */ var _wallets_wallets_component__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./wallets/wallets.component */ 21957);








/***/ }),

/***/ 45242:
/*!******************************************************************************************!*\
  !*** ./src/app/pages/ui-kit/modules/components/progress-bars/progress-bars.component.ts ***!
  \******************************************************************************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "ProgressBarsComponent": function() { return /* binding */ ProgressBarsComponent; }
/* harmony export */ });
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @angular/core */ 2316);
/* harmony import */ var _angular_flex_layout_flex__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @angular/flex-layout/flex */ 30582);
/* harmony import */ var _ngx_translate_core__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @ngx-translate/core */ 70325);



var ProgressBarsComponent = /** @class */ (function () {
    function ProgressBarsComponent() {
    }
    ProgressBarsComponent.prototype.ngOnInit = function () {
    };
    ProgressBarsComponent.ɵfac = function ProgressBarsComponent_Factory(t) { return new (t || ProgressBarsComponent)(); };
    ProgressBarsComponent.ɵcmp = /*@__PURE__*/ _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵdefineComponent"]({ type: ProgressBarsComponent, selectors: [["app-progress-bars"]], decls: 68, vars: 62, consts: [["fxLayout", "column", "fxLayoutAlign", "start stretch", 1, "synchronization-status"], [1, "status-container"], [1, "offline", "mb-0_5"], [1, "syncing", "text-ellipsis", "mb-0_5"], [1, "online", "mb-0_5"], [1, "loading", "mb-0_5"], [1, "progress-bar-container", "mb-1"], [1, "syncing"], [1, "progress-bar"], [1, "fill"], [1, "loading"], [1, "syncing", "downloading"], [1, "update-container"], [1, "update-text", "standard", "mb-0_5"], [1, "icon", "update", "standard"], [1, "update-text", "important"], [2, "font-size", "1rem"], [1, "icon", "update", "important"], [1, "update-text", "critical"], [1, "icon", "update", "critical"], [1, "update-text", "time-orange"], [1, "icon", "time-orange"]], template: function ProgressBarsComponent_Template(rf, ctx) { if (rf & 1) {
            _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](0, "div", 0);
            _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](1, "div", 1);
            _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](2, "div", 2);
            _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](3, "span");
            _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](4);
            _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵpipe"](5, "translate");
            _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
            _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
            _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](6, "div", 3);
            _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](7);
            _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵpipe"](8, "translate");
            _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵpipe"](9, "translate");
            _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
            _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](10, "div", 4);
            _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](11, "span");
            _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](12);
            _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵpipe"](13, "translate");
            _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
            _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
            _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](14, "div", 5);
            _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](15);
            _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵpipe"](16, "translate");
            _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
            _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](17, "div", 2);
            _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](18);
            _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵpipe"](19, "translate");
            _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
            _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](20, "div", 4);
            _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](21);
            _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵpipe"](22, "translate");
            _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
            _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](23, "div", 3);
            _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](24);
            _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵpipe"](25, "translate");
            _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵpipe"](26, "translate");
            _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵpipe"](27, "translate");
            _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
            _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](28, "div", 6);
            _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](29, "div", 7);
            _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](30, "div", 8);
            _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelement"](31, "div", 9);
            _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
            _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
            _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
            _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](32, "div", 6);
            _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelement"](33, "div", 10);
            _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
            _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](34, "div", 6);
            _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](35, "div", 11);
            _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](36, "div", 8);
            _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelement"](37, "div", 9);
            _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
            _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
            _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
            _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
            _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](38, "div", 12);
            _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](39, "div", 13);
            _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](40, "span");
            _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](41);
            _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵpipe"](42, "translate");
            _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
            _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
            _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelement"](43, "i", 14);
            _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
            _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](44, "div", 12);
            _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](45, "div", 15);
            _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](46, "span");
            _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](47);
            _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵpipe"](48, "translate");
            _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
            _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](49, "span", 16);
            _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](50);
            _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵpipe"](51, "translate");
            _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
            _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
            _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelement"](52, "i", 17);
            _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
            _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](53, "div", 12);
            _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](54, "div", 18);
            _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](55, "span");
            _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](56);
            _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵpipe"](57, "translate");
            _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
            _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](58, "span", 16);
            _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](59);
            _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵpipe"](60, "translate");
            _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
            _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
            _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelement"](61, "i", 19);
            _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
            _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](62, "div", 12);
            _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](63, "div", 20);
            _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](64, "span");
            _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](65);
            _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵpipe"](66, "translate");
            _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
            _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
            _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelement"](67, "i", 21);
            _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
            _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        } if (rf & 2) {
            _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵadvance"](4);
            _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtextInterpolate"](_angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵpipeBind1"](5, 30, "SIDEBAR.SYNCHRONIZATION.OFFLINE"));
            _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵadvance"](3);
            _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtextInterpolate4"](" ", _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵpipeBind1"](8, 32, "SIDEBAR.SYNCHRONIZATION.SYNCING"), " ", 100, "", _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵpipeBind1"](9, 34, "SIDEBAR.SYNCHRONIZATION.SLASH"), "", 20000, " ");
            _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵadvance"](5);
            _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtextInterpolate"](_angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵpipeBind1"](13, 36, "SIDEBAR.SYNCHRONIZATION.ONLINE"));
            _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵadvance"](3);
            _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtextInterpolate1"](" ", _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵpipeBind1"](16, 38, "SIDEBAR.SYNCHRONIZATION.LOADING"), " ");
            _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵadvance"](3);
            _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtextInterpolate1"](" ", _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵpipeBind1"](19, 40, "SIDEBAR.SYNCHRONIZATION.ERROR"), " ");
            _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵadvance"](3);
            _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtextInterpolate1"](" ", _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵpipeBind1"](22, 42, "SIDEBAR.SYNCHRONIZATION.COMPLETE"), " ");
            _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵadvance"](3);
            _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtextInterpolate5"](" ", _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵpipeBind1"](25, 44, "SIDEBAR.SYNCHRONIZATION.DOWNLOADING"), " ", 2345, " ", _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵpipeBind1"](26, 46, "SIDEBAR.SYNCHRONIZATION.SLASH"), " ", 18000, "", _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵpipeBind1"](27, 48, "SIDEBAR.SYNCHRONIZATION.MB"), " ");
            _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵadvance"](7);
            _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵstyleProp"]("width", 50 + "%");
            _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵadvance"](6);
            _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵstyleProp"]("width", 44 + "%");
            _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵadvance"](3);
            _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵstyleProp"]("cursor", "pointer");
            _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵadvance"](1);
            _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtextInterpolate"](_angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵpipeBind1"](42, 50, "SIDEBAR.UPDATE.STANDARD"));
            _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵadvance"](5);
            _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵstyleProp"]("cursor", "pointer");
            _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵadvance"](1);
            _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtextInterpolate"](_angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵpipeBind1"](48, 52, "SIDEBAR.UPDATE.IMPORTANT"));
            _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵadvance"](3);
            _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtextInterpolate"](_angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵpipeBind1"](51, 54, "SIDEBAR.UPDATE.IMPORTANT_HINT"));
            _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵadvance"](5);
            _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵstyleProp"]("cursor", "pointer");
            _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵadvance"](1);
            _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtextInterpolate"](_angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵpipeBind1"](57, 56, "SIDEBAR.UPDATE.CRITICAL"));
            _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵadvance"](3);
            _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtextInterpolate"](_angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵpipeBind1"](60, 58, "SIDEBAR.UPDATE.IMPORTANT_HINT"));
            _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵadvance"](6);
            _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtextInterpolate"](_angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵpipeBind1"](66, 60, "SIDEBAR.UPDATE.TIME"));
        } }, directives: [_angular_flex_layout_flex__WEBPACK_IMPORTED_MODULE_1__.DefaultLayoutDirective, _angular_flex_layout_flex__WEBPACK_IMPORTED_MODULE_1__.DefaultLayoutAlignDirective], pipes: [_ngx_translate_core__WEBPACK_IMPORTED_MODULE_2__.TranslatePipe], styles: ["\n/*# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IiIsImZpbGUiOiJwcm9ncmVzcy1iYXJzLmNvbXBvbmVudC5zY3NzIn0= */"] });
    return ProgressBarsComponent;
}());



/***/ }),

/***/ 21957:
/*!******************************************************************************!*\
  !*** ./src/app/pages/ui-kit/modules/components/wallets/wallets.component.ts ***!
  \******************************************************************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "WalletsComponent": function() { return /* binding */ WalletsComponent; }
/* harmony export */ });
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @angular/core */ 2316);
/* harmony import */ var _angular_flex_layout_flex__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @angular/flex-layout/flex */ 30582);
/* harmony import */ var _shared_components_checkbox_checkbox_component__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../../../../../_shared/components/checkbox/checkbox.component */ 2519);
/* harmony import */ var _angular_common__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! @angular/common */ 54364);
/* harmony import */ var _shared_components_switch_switch_component__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../../../../../_shared/components/switch/switch.component */ 7291);
/* harmony import */ var _ngx_translate_core__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! @ngx-translate/core */ 70325);






function WalletsComponent_span_13_Template(rf, ctx) { if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementStart"](0, "span", 22);
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵtext"](1, " 12 ");
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementEnd"]();
} }
function WalletsComponent_ng_container_24_Template(rf, ctx) { if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementContainerStart"](0);
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementStart"](1, "h4", 23);
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵtext"](2, " $999 ");
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementStart"](3, "span", 24);
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵtext"](4, "20%");
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementContainerEnd"]();
} if (rf & 2) {
    var ctx_r1 = _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵnextContext"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵadvance"](3);
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵclassProp"]("red", ctx_r1.percentRed);
} }
function WalletsComponent_ng_container_25_Template(rf, ctx) { if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementContainerStart"](0);
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementStart"](1, "div", 25);
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementStart"](2, "span", 26);
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵtext"](3);
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵpipe"](4, "translate");
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelement"](5, "app-switch");
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementContainerEnd"]();
} if (rf & 2) {
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵadvance"](3);
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵtextInterpolate"](_angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵpipeBind1"](4, 1, "SIDEBAR.ACCOUNT.STAKING"));
} }
function WalletsComponent_div_26_Template(rf, ctx) { if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementStart"](0, "div", 27);
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementStart"](1, "div", 28);
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelement"](2, "div", 29);
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementStart"](3, "div", 30);
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵtext"](4, "33%");
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementEnd"]();
} if (rf & 2) {
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵadvance"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵstyleProp"]("width", 33 + "%");
} }
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
    WalletsComponent.ɵfac = function WalletsComponent_Factory(t) { return new (t || WalletsComponent)(); };
    WalletsComponent.ɵcmp = /*@__PURE__*/ _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵdefineComponent"]({ type: WalletsComponent, selectors: [["app-wallets"]], decls: 27, vars: 18, consts: [["fxLayout", "column", "fxLayoutAlign", "start stretch", 1, "mb-2"], ["label", "classWalletActive", 1, "mb-1", 3, "value", "emitChange"], ["label", "classWalletAuditable", 1, "mb-1", 3, "value", "emitChange"], ["label", "classWalletWatchOnly", 1, "mb-1", 3, "value", "emitChange"], ["label", "showIndicator", 1, "mb-1", 3, "value", "emitChange"], ["label", "showPrice", 1, "mb-1", 3, "value", "emitChange"], ["label", "percentRed", 1, "mb-1", 3, "value", "emitChange"], ["label", "showStaking", 1, "mb-1", 3, "value", "emitChange"], ["label", "showProgressBar", 1, "mb-1", 3, "value", "emitChange"], ["cdkDrag", "", "vsDragScroll", "", 1, "wallet"], [1, "header"], [1, "left"], [1, "name", "text-ellipsis"], ["class", "indicator", 4, "ngIf"], [1, "name"], [1, "right"], ["type", "button"], [1, "icon", "close"], [1, "balance"], [1, "text-ellipsis", "mr-1"], [4, "ngIf"], ["class", "account-synchronization", 4, "ngIf"], [1, "indicator"], [1, "price"], [1, "percent"], [1, "staking"], [1, "text"], [1, "account-synchronization"], [1, "progress-bar"], [1, "fill"], [1, "progress-percent"]], template: function WalletsComponent_Template(rf, ctx) { if (rf & 1) {
            _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementStart"](0, "form", 0);
            _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementStart"](1, "app-checkbox", 1);
            _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵlistener"]("emitChange", function WalletsComponent_Template_app_checkbox_emitChange_1_listener() { return ctx.classWalletActive = !ctx.classWalletActive; });
            _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementEnd"]();
            _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementStart"](2, "app-checkbox", 2);
            _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵlistener"]("emitChange", function WalletsComponent_Template_app_checkbox_emitChange_2_listener() { return ctx.classWalletAuditable = !ctx.classWalletAuditable; });
            _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementEnd"]();
            _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementStart"](3, "app-checkbox", 3);
            _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵlistener"]("emitChange", function WalletsComponent_Template_app_checkbox_emitChange_3_listener() { return ctx.classWalletWatchOnly = !ctx.classWalletWatchOnly; });
            _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementEnd"]();
            _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementStart"](4, "app-checkbox", 4);
            _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵlistener"]("emitChange", function WalletsComponent_Template_app_checkbox_emitChange_4_listener() { return ctx.showIndicator = !ctx.showIndicator; });
            _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementEnd"]();
            _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementStart"](5, "app-checkbox", 5);
            _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵlistener"]("emitChange", function WalletsComponent_Template_app_checkbox_emitChange_5_listener() { return ctx.showPrice = !ctx.showPrice; });
            _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementEnd"]();
            _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementStart"](6, "app-checkbox", 6);
            _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵlistener"]("emitChange", function WalletsComponent_Template_app_checkbox_emitChange_6_listener() { return ctx.percentRed = !ctx.percentRed; });
            _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementEnd"]();
            _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementStart"](7, "app-checkbox", 7);
            _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵlistener"]("emitChange", function WalletsComponent_Template_app_checkbox_emitChange_7_listener() { return ctx.showStaking = !ctx.showStaking; });
            _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementEnd"]();
            _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementStart"](8, "app-checkbox", 8);
            _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵlistener"]("emitChange", function WalletsComponent_Template_app_checkbox_emitChange_8_listener() { return ctx.showProgressBar = !ctx.showProgressBar; });
            _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementEnd"]();
            _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementEnd"]();
            _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementStart"](9, "div", 9);
            _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementStart"](10, "div", 10);
            _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementStart"](11, "div", 11);
            _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementStart"](12, "div", 12);
            _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵtemplate"](13, WalletsComponent_span_13_Template, 2, 0, "span", 13);
            _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementStart"](14, "span", 14);
            _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵtext"](15, "test");
            _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementEnd"]();
            _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementEnd"]();
            _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementEnd"]();
            _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementStart"](16, "div", 15);
            _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementStart"](17, "button", 16);
            _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelement"](18, "i", 17);
            _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementEnd"]();
            _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementEnd"]();
            _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementEnd"]();
            _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementStart"](19, "div", 18);
            _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementStart"](20, "span", 19);
            _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵtext"](21, "9999");
            _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementEnd"]();
            _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementStart"](22, "span");
            _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵtext"](23, "ZANO");
            _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementEnd"]();
            _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementEnd"]();
            _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵtemplate"](24, WalletsComponent_ng_container_24_Template, 5, 2, "ng-container", 20);
            _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵtemplate"](25, WalletsComponent_ng_container_25_Template, 6, 3, "ng-container", 20);
            _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵtemplate"](26, WalletsComponent_div_26_Template, 5, 2, "div", 21);
            _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementEnd"]();
        } if (rf & 2) {
            _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵadvance"](1);
            _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵproperty"]("value", ctx.classWalletActive);
            _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵadvance"](1);
            _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵproperty"]("value", ctx.classWalletAuditable);
            _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵadvance"](1);
            _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵproperty"]("value", ctx.classWalletWatchOnly);
            _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵadvance"](1);
            _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵproperty"]("value", ctx.showIndicator);
            _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵadvance"](1);
            _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵproperty"]("value", ctx.showPrice);
            _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵadvance"](1);
            _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵproperty"]("value", ctx.percentRed);
            _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵadvance"](1);
            _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵproperty"]("value", ctx.showStaking);
            _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵadvance"](1);
            _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵproperty"]("value", ctx.showProgressBar);
            _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵadvance"](1);
            _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵclassProp"]("active", ctx.classWalletActive)("auditable", ctx.classWalletAuditable)("watch-only", ctx.classWalletWatchOnly);
            _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵadvance"](4);
            _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵproperty"]("ngIf", ctx.showIndicator);
            _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵadvance"](11);
            _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵproperty"]("ngIf", ctx.showPrice);
            _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵadvance"](1);
            _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵproperty"]("ngIf", ctx.showStaking);
            _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵadvance"](1);
            _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵproperty"]("ngIf", ctx.showProgressBar);
        } }, directives: [_angular_flex_layout_flex__WEBPACK_IMPORTED_MODULE_3__.DefaultLayoutDirective, _angular_flex_layout_flex__WEBPACK_IMPORTED_MODULE_3__.DefaultLayoutAlignDirective, _shared_components_checkbox_checkbox_component__WEBPACK_IMPORTED_MODULE_0__.CheckboxComponent, _angular_common__WEBPACK_IMPORTED_MODULE_4__.NgIf, _shared_components_switch_switch_component__WEBPACK_IMPORTED_MODULE_1__.SwitchComponent], pipes: [_ngx_translate_core__WEBPACK_IMPORTED_MODULE_5__.TranslatePipe], styles: ["\n/*# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IiIsImZpbGUiOiJ3YWxsZXRzLmNvbXBvbmVudC5zY3NzIn0= */"] });
    return WalletsComponent;
}());



/***/ }),

/***/ 87370:
/*!***********************************************!*\
  !*** ./src/app/pages/ui-kit/modules/index.ts ***!
  \***********************************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "FormModule": function() { return /* reexport safe */ _components_form_form_module__WEBPACK_IMPORTED_MODULE_0__.FormModule; },
/* harmony export */   "ComponentsModule": function() { return /* reexport safe */ _components_components_module__WEBPACK_IMPORTED_MODULE_1__.ComponentsModule; }
/* harmony export */ });
/* harmony import */ var _components_form_form_module__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./components/form/form.module */ 18875);
/* harmony import */ var _components_components_module__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./components/components.module */ 48242);




/***/ }),

/***/ 14819:
/*!*******************************************************!*\
  !*** ./src/app/pages/ui-kit/ui-kit-routing.module.ts ***!
  \*******************************************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "UiKitRoutingModule": function() { return /* binding */ UiKitRoutingModule; }
/* harmony export */ });
/* harmony import */ var _angular_router__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @angular/router */ 71258);
/* harmony import */ var _ui_kit_component__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./ui-kit.component */ 73968);
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @angular/core */ 2316);




var routes = [
    { path: '', component: _ui_kit_component__WEBPACK_IMPORTED_MODULE_0__.UiKitComponent },
];
var UiKitRoutingModule = /** @class */ (function () {
    function UiKitRoutingModule() {
    }
    UiKitRoutingModule.ɵfac = function UiKitRoutingModule_Factory(t) { return new (t || UiKitRoutingModule)(); };
    UiKitRoutingModule.ɵmod = /*@__PURE__*/ _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵdefineNgModule"]({ type: UiKitRoutingModule });
    UiKitRoutingModule.ɵinj = /*@__PURE__*/ _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵdefineInjector"]({ imports: [[_angular_router__WEBPACK_IMPORTED_MODULE_2__.RouterModule.forChild(routes)], _angular_router__WEBPACK_IMPORTED_MODULE_2__.RouterModule] });
    return UiKitRoutingModule;
}());

(function () { (typeof ngJitMode === "undefined" || ngJitMode) && _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵsetNgModuleScope"](UiKitRoutingModule, { imports: [_angular_router__WEBPACK_IMPORTED_MODULE_2__.RouterModule], exports: [_angular_router__WEBPACK_IMPORTED_MODULE_2__.RouterModule] }); })();


/***/ }),

/***/ 73968:
/*!**************************************************!*\
  !*** ./src/app/pages/ui-kit/ui-kit.component.ts ***!
  \**************************************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "UiKitComponent": function() { return /* binding */ UiKitComponent; }
/* harmony export */ });
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! @angular/core */ 2316);
/* harmony import */ var _angular_flex_layout_flex__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! @angular/flex-layout/flex */ 30582);
/* harmony import */ var _modules_components_buttons_buttons_component__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./modules/components/buttons/buttons.component */ 68065);
/* harmony import */ var _modules_components_form_form_component__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./modules/components/form/form.component */ 1116);
/* harmony import */ var _modules_components_breadcrumbs_breadcrumbs_component__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./modules/components/breadcrumbs/breadcrumbs.component */ 50116);
/* harmony import */ var _modules_components_progress_bars_progress_bars_component__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./modules/components/progress-bars/progress-bars.component */ 45242);
/* harmony import */ var _modules_components_wallets_wallets_component__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./modules/components/wallets/wallets.component */ 21957);







var UiKitComponent = /** @class */ (function () {
    function UiKitComponent() {
    }
    UiKitComponent.prototype.ngOnInit = function () {
    };
    UiKitComponent.ɵfac = function UiKitComponent_Factory(t) { return new (t || UiKitComponent)(); };
    UiKitComponent.ɵcmp = /*@__PURE__*/ _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵdefineComponent"]({ type: UiKitComponent, selectors: [["app-ui-kit"]], decls: 21, vars: 0, consts: [["fxFlex", "0 1 50rem", "fxLayout", "column", "fxLayoutAlign", "start stretch"], [1, "mb-2"], [1, "mb-1"]], template: function UiKitComponent_Template(rf, ctx) { if (rf & 1) {
            _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵelementStart"](0, "div", 0);
            _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵelementStart"](1, "div", 1);
            _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵelementStart"](2, "h2", 2);
            _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵtext"](3, "Buttons");
            _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵelementEnd"]();
            _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵelement"](4, "app-buttons");
            _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵelementEnd"]();
            _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵelementStart"](5, "div", 1);
            _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵelementStart"](6, "h2", 2);
            _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵtext"](7, "Form");
            _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵelementEnd"]();
            _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵelement"](8, "app-form");
            _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵelementEnd"]();
            _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵelementStart"](9, "div", 1);
            _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵelementStart"](10, "h2", 2);
            _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵtext"](11, "Breadcrumbs");
            _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵelementEnd"]();
            _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵelement"](12, "app-breadcrumbs");
            _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵelementEnd"]();
            _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵelementStart"](13, "div", 1);
            _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵelementStart"](14, "h2", 2);
            _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵtext"](15, "Progress bars");
            _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵelementEnd"]();
            _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵelement"](16, "app-progress-bars");
            _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵelementEnd"]();
            _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵelementStart"](17, "div", 1);
            _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵelementStart"](18, "h2", 2);
            _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵtext"](19, "Wallets");
            _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵelementEnd"]();
            _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵelement"](20, "app-wallets");
            _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵelementEnd"]();
            _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵelementEnd"]();
        } }, directives: [_angular_flex_layout_flex__WEBPACK_IMPORTED_MODULE_6__.DefaultFlexDirective, _angular_flex_layout_flex__WEBPACK_IMPORTED_MODULE_6__.DefaultLayoutDirective, _angular_flex_layout_flex__WEBPACK_IMPORTED_MODULE_6__.DefaultLayoutAlignDirective, _modules_components_buttons_buttons_component__WEBPACK_IMPORTED_MODULE_0__.ButtonsComponent, _modules_components_form_form_component__WEBPACK_IMPORTED_MODULE_1__.FormComponent, _modules_components_breadcrumbs_breadcrumbs_component__WEBPACK_IMPORTED_MODULE_2__.BreadcrumbsComponent, _modules_components_progress_bars_progress_bars_component__WEBPACK_IMPORTED_MODULE_3__.ProgressBarsComponent, _modules_components_wallets_wallets_component__WEBPACK_IMPORTED_MODULE_4__.WalletsComponent], styles: ["\n/*# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IiIsImZpbGUiOiJ1aS1raXQuY29tcG9uZW50LnNjc3MifQ== */"] });
    return UiKitComponent;
}());



/***/ }),

/***/ 78188:
/*!***********************************************!*\
  !*** ./src/app/pages/ui-kit/ui-kit.module.ts ***!
  \***********************************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "UiKitModule": function() { return /* binding */ UiKitModule; }
/* harmony export */ });
/* harmony import */ var _angular_common__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! @angular/common */ 54364);
/* harmony import */ var _ui_kit_component__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./ui-kit.component */ 73968);
/* harmony import */ var _ui_kit_routing_module__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./ui-kit-routing.module */ 14819);
/* harmony import */ var _modules__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./modules */ 87370);
/* harmony import */ var _angular_flex_layout__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! @angular/flex-layout */ 78662);
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @angular/core */ 2316);






var UiKitModule = /** @class */ (function () {
    function UiKitModule() {
    }
    UiKitModule.ɵfac = function UiKitModule_Factory(t) { return new (t || UiKitModule)(); };
    UiKitModule.ɵmod = /*@__PURE__*/ _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵdefineNgModule"]({ type: UiKitModule });
    UiKitModule.ɵinj = /*@__PURE__*/ _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵdefineInjector"]({ imports: [[
                _angular_common__WEBPACK_IMPORTED_MODULE_4__.CommonModule,
                _modules__WEBPACK_IMPORTED_MODULE_2__.ComponentsModule,
                _ui_kit_routing_module__WEBPACK_IMPORTED_MODULE_1__.UiKitRoutingModule,
                _angular_flex_layout__WEBPACK_IMPORTED_MODULE_5__.FlexLayoutModule
            ]] });
    return UiKitModule;
}());

(function () { (typeof ngJitMode === "undefined" || ngJitMode) && _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵsetNgModuleScope"](UiKitModule, { declarations: [_ui_kit_component__WEBPACK_IMPORTED_MODULE_0__.UiKitComponent], imports: [_angular_common__WEBPACK_IMPORTED_MODULE_4__.CommonModule,
        _modules__WEBPACK_IMPORTED_MODULE_2__.ComponentsModule,
        _ui_kit_routing_module__WEBPACK_IMPORTED_MODULE_1__.UiKitRoutingModule,
        _angular_flex_layout__WEBPACK_IMPORTED_MODULE_5__.FlexLayoutModule] }); })();


/***/ })

}]);
//# sourceMappingURL=src_app_pages_ui-kit_ui-kit_module_ts.js.map