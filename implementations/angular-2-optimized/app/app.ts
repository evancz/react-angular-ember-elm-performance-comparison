import {Component} from 'angular2/core';
import {TodoStore, Todo} from './services/store';
import {TodoItem} from './todoItem';
import ItemUpdatedEvent from './itemUpdatedEvent';

@Component({
	selector: 'todo-app',
	templateUrl: 'app/app.html',
	directives: [TodoItem]
})
export default class TodoApp {
	todoStore: TodoStore;
	newTodoText = '';

	constructor(todoStore: TodoStore) {
		this.todoStore = todoStore;
	}

	identify(index: number, item: Todo) {
		return index;
	}

	removeCompleted() {
		this.todoStore.removeCompleted();
	}

	toggleCompletion(todo: Todo) {
		this.todoStore.toggleCompletion(todo);
	}

	removeItem(todo: Todo){
		this.todoStore.remove(todo);
	}

	itemUpdated(event: ItemUpdatedEvent) {
		this.todoStore.updateItem(event);
	}

	addTodo() {
		if (this.newTodoText.trim().length) {
			this.todoStore.add(this.newTodoText);
			this.newTodoText = '';
		}
	}
}
