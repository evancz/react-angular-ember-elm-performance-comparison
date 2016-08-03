import {bootstrap} from 'angular2/platform/browser';
import TodoApp from './app'
import {TodoStore} from './services/store';
import {enableProdMode} from 'angular2/core';

enableProdMode();
bootstrap(TodoApp, [TodoStore]);
