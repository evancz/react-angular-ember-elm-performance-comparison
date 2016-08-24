import {Component, Input, Output, EventEmitter, ChangeDetectionStrategy} from 'angular2/core';
import {Todo} from './services/store';
import ItemUpdatedEvent from './itemUpdatedEvent';

@Component({
    selector: 'todo-item',
    templateUrl: 'app/todoItem.html',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class TodoItem {
    editMode = false;

    @Input() item: Todo;

    @Output() done = new EventEmitter<Todo>();
    
    @Output() itemUpdated = new EventEmitter<ItemUpdatedEvent>();


    cancelEditingTodo() {
        this.editMode = false;
    }

    updateEditingTodo(editedTitle: string) {
        editedTitle = editedTitle.trim();

        this.editMode = false;

        if (editedTitle.length === 0) {
            return this.remove();
        }

        this.itemUpdated.emit({
            item: this.item,
            newItem: new Todo (editedTitle, this.item.completed)
        });
    }

    editTodo() {
        this.editMode = true;
    }

    toggleCompletion() {
        this.itemUpdated.emit({
            item: this.item,
            newItem: new Todo (this.item.title, !this.item.completed)
        });
    }

    remove() {
        this.done.emit(this.item);
    }
}
