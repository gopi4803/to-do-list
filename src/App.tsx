import React, { useState, useEffect } from "react";
import logo from "./logo.svg";
import "./App.css";
import InputField from "./components/InputField";
import { Todo } from "./model";
import TodoList from "./components/TodoList";
import { DragDropContext, DropResult } from "react-beautiful-dnd";

function App() {
  const [todo, setTodo] = useState<string>("");
  const [todos, setTodos] = useState<Todo[]>([]);
  const [completedTodos, setCompletedTodos] = useState<Todo[]>([]);

  // Retrieve todos and completedTodos from local storage on initial load
  useEffect(() => {
    const savedTodos = localStorage.getItem("todos");
    const savedCompletedTodos = localStorage.getItem("completedTodos");
    if (savedTodos) setTodos(JSON.parse(savedTodos));
    if (savedCompletedTodos) setCompletedTodos(JSON.parse(savedCompletedTodos));
  }, []);

  // Save todos and completedTodos to local storage whenever they change
  useEffect(() => {
    localStorage.setItem("todos", JSON.stringify(todos));
  }, [todos]);

  useEffect(() => {
    localStorage.setItem("completedTodos", JSON.stringify(completedTodos));
  }, [completedTodos]);

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (todo) {
      setTodos([...todos, { id: Date.now(), content: todo, isDone: false }]);
      setTodo("");
    }
  };

  const onDragEnd = (result: DropResult) => {
    const { source, destination } = result;
    if (!destination) return;
    if (source.droppableId === destination.droppableId && source.index === destination.index) return;

    let add,
      active = todos,
      done = completedTodos;
    
    // Remove item from source
    if (source.droppableId === "TodosList") {
      add = active[source.index];
      active.splice(source.index, 1);
    } else {
      add = done[source.index];
      done.splice(source.index, 1);
    }

    // Add item to destination
    if (destination.droppableId === "TodosList") {
      active.splice(destination.index, 0, add);
    } else {
      done.splice(destination.index, 0, add);
    }

    setCompletedTodos(done);
    setTodos(active);
  };

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <div className="App">
        <span className="heading">Taskify</span>
        <InputField todo={todo} setTodo={setTodo} handleAdd={handleAdd} />
        <TodoList
          todos={todos}
          setTodos={setTodos}
          completedTodos={completedTodos}
          setCompletedTodos={setCompletedTodos}
        />
      </div>
    </DragDropContext>
  );
}

export default App;
