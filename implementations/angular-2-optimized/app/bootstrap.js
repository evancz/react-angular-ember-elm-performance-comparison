///<reference path="../node_modules/angular2/typings/browser.d.ts"/>
"use strict";
var browser_1 = require('angular2/platform/browser');
var app_1 = require('./app');
var store_1 = require('./services/store');
var core_1 = require('angular2/core');
core_1.enableProdMode();
browser_1.bootstrap(app_1.default, [store_1.TodoStore]);
