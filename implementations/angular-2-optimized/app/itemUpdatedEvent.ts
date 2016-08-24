import {Todo} from './services/store';

interface ItemUpdatedEvent {
    item: Todo;
    newItem: Todo;
}

export default ItemUpdatedEvent;