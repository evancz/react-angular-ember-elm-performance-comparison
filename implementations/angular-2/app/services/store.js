"use strict";
var Todo = (function () {
    function Todo(title) {
        this.completed = false;
        this.editing = false;
        this.title = title.trim();
    }
    Object.defineProperty(Todo.prototype, "title", {
        get: function () {
            return this._title;
        },
        set: function (value) {
            this._title = value.trim();
        },
        enumerable: true,
        configurable: true
    });
    return Todo;
}());
exports.Todo = Todo;
var TodoStore = (function () {
    function TodoStore() {
        this.todos = [];
    }
    TodoStore.prototype.getWithCompleted = function (completed) {
        return this.todos.filter(function (todo) { return todo.completed === completed; });
    };
    TodoStore.prototype.allCompleted = function () {
        return this.todos.length === this.getCompleted().length;
    };
    TodoStore.prototype.setAllTo = function (completed) {
        this.todos.forEach(function (t) { return t.completed = completed; });
    };
    TodoStore.prototype.removeCompleted = function () {
        this.todos = this.getWithCompleted(false);
    };
    TodoStore.prototype.getRemaining = function () {
        return this.getWithCompleted(false);
    };
    TodoStore.prototype.getCompleted = function () {
        return this.getWithCompleted(true);
    };
    TodoStore.prototype.toggleCompletion = function (todo) {
        todo.completed = !todo.completed;
    };
    TodoStore.prototype.remove = function (todo) {
        this.todos.splice(this.todos.indexOf(todo), 1);
    };
    TodoStore.prototype.add = function (title) {
        this.todos.push(new Todo(title));
    };
    return TodoStore;
}());
exports.TodoStore = TodoStore;
