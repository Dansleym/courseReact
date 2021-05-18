import React, { Component } from 'react';

const todos = [
  { id: 1, name: 'Learn React' },
  { id: 2, name: 'Make awesome website' },
  { id: 3, name: 'Find good job' },
  { id: 4, name: 'Well Done' },
];

const getTodos = async () =>
  new Promise(resolve => {
    setTimeout(() => {
      resolve(todos);
    }, 500);
  });

const ListItem = ({ id, text, clickHandler }) => {
  return (
    <li>
      {text} <button onClick={() => clickHandler(id)}>del</button>
    </li>
  );
};

const List = ({ items, clickHandler }) => {
  return (
    <>
      {items.map(({ id, name }) => (
        <ListItem key={id} id={id} text={name} clickHandler={clickHandler} />
      ))}
    </>
  );
};

export default class App extends Component {
  constructor() {
    super();

    this.state = {
      todos: null,
      mainTodo: null,
      hasError: false,
    };
  }

  componentDidMount() {
    getTodos()
      .then(todos => {
        console.log(todos);

        this.setState({
          todos,
          mainTodo: todos,
        });
      })
      .catch(error => {
        console.log('eer');
        this.setState({
          hasError: true,
        });
      });
  }

  deleteHandler = id => {
    const newTodos = this.state.todos.filter(({ id: itemId }) => id !== itemId);
    const newmainTodos = this.state.mainTodo.filter(({ id: itemId }) => id !== itemId);

    this.setState({
      todos: newTodos,
      mainTodo: newmainTodos
    });
  };

  searchHandler = () => {
    const { mainTodo } = this.state;
    const searchTerm = document.getElementById('search').value;


    if(searchTerm.length >= 0) {
      const newTodos = mainTodo.filter((item) => {
        if(searchTerm === "") {
          return item;
        } else if (item.name.toLowerCase().includes(searchTerm.toLowerCase())) {
          console.log(item);
          return item;
        }
      });
      if(searchTerm.length >= 3) {
        this.setState({
          todos: newTodos,
        });
      } else {
        this.setState({
          todos: mainTodo,
        });
      }
    }
  }

  addHandler = () => {
    const { todos } = this.state;
    const txt = document.getElementById('newTodo');

    if (txt.value !== '') {
      const newId = todos[todos.length - 1].id + 1;
      this.setState({
        todos: [
          ...todos,
          {
            id: newId,
            name: txt.value,
          },
        ],
        mainTodo: [
          ...todos,
          {
            id: newId,
            name: txt.value,
          },
        ],
      });
      txt.value = '';
    }
  };

  //TODO: 
  // 1. ADD filter for todo items (start filtering when search key length >= 3)

  render() {
    const { deleteHandler, addHandler, searchHandler } = this;
    const { todos, hasError } = this.state;

    if (hasError && todos === null) return <p>Server ERROR</p>;
    if (todos === null) return <p>Loading...</p>;

    return (
      <div>
        <input id='search' type='text' onChange={searchHandler} placeholder={"Search..."}/>
        <h1>Todo LIST</h1>
        <List items={todos} clickHandler={deleteHandler} />
        <br />
        Enter new todo:
        <input id='newTodo' type='text' />
        <button onClick={addHandler}>Add</button>
      </div>
    );
  }
}
