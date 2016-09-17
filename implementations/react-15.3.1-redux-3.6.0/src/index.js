import React from 'react'
import { render } from 'react-dom'
import { createStore, combineReducers } from 'redux'
import { Provider, connect } from 'react-redux'
import 'todomvc-app-css/index.css'

// Reducers
const todo = (state, action) => {
  switch (action.type) {
    case 'ADD_TODO':
      return {
        id: action.id,
        text: action.text,
        completed: false
      };
    case 'TOGGLE_TODO':
      return (state.id !== action.id) ?
        state : {...state,  completed: !state.completed};
    default:
      return state;
  }
};
const byId = (state = {}, action) => {
  switch (action.type) {
    case 'ADD_TODO':
    case 'TOGGLE_TODO':
      return {
        ...state,
        [action.id]: todo(state[action.id], action)
      }
    default:
      return state;
  }
};
const allIds = (state = [], action) => {
  switch (action.type) {
    case 'ADD_TODO':
      return [...state, action.id];
    case 'DELETE_TODO':
      return state.filter(id => id !== action.id);
    default:
      return state;
  }
};
const visibilityFilter = (state = 'SHOW_ALL', action) => {
  switch (action.type) {
    case 'SET_VISIBILITY_FILTER':
      return action.filter;
    default:
      return state;
  }
};
const todoApp = combineReducers({
  byId,
  allIds,
  visibilityFilter
});

// Action creators
let nextTodoId = 0;
const addTodo = (text) => ({ type: 'ADD_TODO', id: nextTodoId++, text });
const toggleTodo = (id) => ({ type: 'TOGGLE_TODO', id });
const deleteTodo = (id) => ({ type: 'DELETE_TODO', id });
const setVisibilityFilter = (filter) => ({ type: 'SET_VISIBILITY_FILTER', filter });

// Components
const Link = ({ active, children, onClick }) => {
  const clickLink = e => {
    e.preventDefault()
    onClick()
  }
  const dummyLink = e => {
    e.preventDefault()
  }
  return (
    <li>
      <a
        href='#'
        className={ active ? "selected" : ""}
        onClick={ active ? dummyLink : clickLink }
      >
      { children }
      </a>
    </li>
  )
};

// FilterLink container component
const FilterLink = connect(
  (state, ownProps) => ({ // mapStateToProps
    active: ownProps.filter === state.visibilityFilter
  }),
  (dispatch, ownProps) => ({ // mapDispatchToProps
    onClick: () => {
      dispatch(setVisibilityFilter(ownProps.filter));
    }
  })
)(Link);

const Footer = () => (
  <footer className="footer">
    <ul className="filters">
      <FilterLink filter='SHOW_ALL'>All</FilterLink>
      <FilterLink filter='SHOW_ACTIVE'>Active</FilterLink>
      <FilterLink filter='SHOW_COMPLETED'>Completed</FilterLink>
    </ul>
  </footer>
);

const Todo = ({ onClick, completed, text, onDelete }) => (
  <li className={ completed ? 'completed' : '' } >
    <div className="view">
      <input
        onClick={ onClick }
        className="toggle"
        type="checkbox"
        checked={completed}/>
      <label>{text}</label>
      <button className="destroy"
              onClick={ onDelete } />
    </div>
  </li>
);

const TodoList = ({todos, onTodoClick, onDeleteTodo}) => (
  <section className="main">
    <input className="toggle-all" type="checkbox" />
    <ul className="todo-list">
      {
        todos.map( todo =>
        <Todo
          key={todo.id}
          onClick={() => onTodoClick(todo.id)}
          onDelete={() => onDeleteTodo(todo.id)}
          {...todo}
        />)
      }
    </ul>
  </section>
);

let AddTodo = ({dispatch}) => {
  const keyUpHandler = (evt) => {
    const ENTER = 13
    if (evt.which === ENTER && input.value) {
      // hit enter, create new item if field isn't empty
      dispatch(addTodo(input.value))
      input.value = ''
    }
  }
  let input;
  return (
    <header className="header">
      <h1>todos</h1>
      <input
        autofocus
        className="new-todo"
        placeholder="What needs to be done?"
        ref = {node=>{input=node;}}
        onKeyDown={keyUpHandler}
      />
    </header>
  );
};
AddTodo = connect()(AddTodo);

const getAllTodos = (state) =>
  state.allIds.map(id => state.byId[id]);

const getVisibleTodos = (state, filter) => {
  const allTodos = getAllTodos(state);
  switch (filter) {
    case 'SHOW_ALL':
      return allTodos;
    case 'SHOW_COMPLETED':
      return allTodos.filter(t => t.completed);
    case 'SHOW_ACTIVE':
      return allTodos.filter(t => !t.completed);
  }
}
const VisibleTodoList = connect(
  // mapStateToProps
  (state) => ({
    todos: getVisibleTodos( state, state.visibilityFilter )
  }),
  // mapDispatchToProps
  (dispatch) => ({
      onTodoClick: id => { dispatch(toggleTodo(id)) },
      onDeleteTodo: id => { dispatch(deleteTodo(id)) }
  })
)(TodoList);

const TodoApp = () => (
  <section className="todoapp">
    <AddTodo/>
    <VisibleTodoList/>
    <Footer/>
  </section>
);

render((
  <Provider store={ createStore(todoApp) }>
    <TodoApp/>
  </Provider>
  ), document.getElementById('root')
);
