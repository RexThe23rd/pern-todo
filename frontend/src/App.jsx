import { use, useEffect, useState } from "react";
import axios from "axios";
import { MdModeEditOutline, MdOutlineDone } from 'react-icons/md';
import { FaTrash } from 'react-icons/fa6'
import { IoClose } from 'react-icons/io5'

function App() {

  const [description, setDescription] = useState("");
  const [todos, setTodos] = useState([]);
  const [editingTodo, setEditingTodo] = useState(null);
  const [editedText, setEditedText] = useState("");

  //functionality (boring stuff)
  //getting the todos
  const getTodos = async () => {
    try {
      const res = await axios.get("http://localhost:5000/todos");
      setTodos(res.data);
    } catch (err) {
      console.log(err.message)
    }
  }

  //making the get todos function run on every load
  useEffect(() => {
    getTodos();
  }, []);

  //submitting the form
  const onSubmitForm = async (e) => {
    e.preventDefault();
    try {
      await axios.post("http://localhost:5000/todos", {
        description, completed: false
      });
      setDescription("");
      getTodos()
    } catch (err) {
      console.log(err.message);
    }
  };

  const saveEdit = async (id) => {
    try {
      await axios.put(`http://localhost:5000/todos/${id}`, {
        description: editedText,
      });
      setEditingTodo(null);
      setEditedText("");
      getTodos();
    } catch (err) {
      console.log(err.message);
    }
  }

  const deleteTodo = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/todos/${id}`);
      setTodos(todos.filter((todo) => todo.todo_id !== id));
    } catch (err) {
      console.log(err.message);
    }
  }

  const toggleCompleted = async (id) => {
    try {
      const todo = todos.find((todo) => todo.todo_id === id);
      await axios.put(`http://localhost:5000/todos/${id}`, {
        description: todo.description,
        completed: !todo.completed,
      });
      setTodos(todos.map((todo) => (todo.todo_id === id ? {...todo, completed: !todo.completed} : todo)));
    } catch (err) {
      console.log(err.message);
      
    }
  }

  //WARNING! THE FOLLOWING CODE LOOKS REALLY MESSY. DONT JUDGE
  //the app (todo form, displaying the todos, the title, everything basically):
  return (
    <div className="min-h-screen bg-gray-800 flex justify-center items-center p-4">
      <div className="bg-gray-50 rounded-2xl shadow-xl w-full max-w-lg p-8">
        <h1 className="text-4xl font-bold text-gray-800 mb-8">PERN TODO APP</h1>
        <form onSubmit={onSubmitForm} className="flex items-center gap-2 shadow-sm border p-2 rounded-lg mb-6">
          <input
            className="flex-1 outline-none px-3 py-2 text-gray-700 placeholder-gray-400"
            type="text"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="What do you need to do?"
            required
          />
          <button className="bg-blue-500 transition ease-in-out duration-300 hover:bg-blue-600 text-white px-4 py-2 rounded-md font-medium cursor-pointer">Add Todo</button>
        </form>
        <div>
          {todos === 0 ? (
            <p className="text-gray-600">Nothing here yet!</p>
          ) : (
            <div className="flex flex-col gap-y-4 bg-blue-50 p-2 rounded-lg">
              {todos.map((todo) => (
                <div key={todo.todo_id} className="pb-4">
                  {editingTodo === todo.todo_id ? (
                    <div className="flex items-center gap-x-3">
                      <input className="flex-1 p-3 border-3 rounded-lg border-blue-200 outline-none focus:ring-2 focus:ring-blue-300 text-gray-700 shadow-inner" type="text" value={editedText} onChange={(e) => setEditedText(e.target.value)} />
                      <div className="flex justify-end items-center">
                        <button onClick={() => saveEdit(todo.todo_id)} className="px-4 py-2 bg-green-500 text-white rounded-lg mr-2 transition ease-in-out duration-300 hover:bg-green-600"><MdOutlineDone /></button>
                        <button onClick={() => setEditingTodo(null)} className="px-4 py-2 bg-red-500 text-white rounded-lg mr-2 transition ease-in-out duration-300 hover:bg-red-600"><IoClose /></button>
                      </div>
                    </div>
                  ) : (
                    <div className="flex justify-between items-center  bg-blue-100 rounded-lg p-1">
                      <div className="flex items-center gap-x-4 overflow-hidden">
                        <button onClick={() => toggleCompleted(todo.todo_id)} className={`shrink-0 h-6 w-6 border-2 rounded-full flex items-center justify-center ${todo.completed ? "transition ease-in-out duration-300 bg-green-500 border-green-500 text-white" : "border-gray-400 transition ease-in-out duration-300 hover:border-blue-400"}`}>
                          {todo.completed && <MdOutlineDone size={16} />}
                        </button>
                        <span>{todo.description}</span>
                      </div>
                      <div className="flex gap-x-2">
                        <button onClick={() => {
                          setEditingTodo(todo.todo_id);
                          setEditedText(todo.description);
                        }} className="p-2 text-blue-500 bg-blue-200 transition-colors ease-in duration-200 hover:text-blue-700 rounded-lg hover:bg-blue-300">
                          <MdModeEditOutline />
                        </button>
                        <button onClick={() => {deleteTodo(todo.todo_id)}} className="p-2 text-red-500 bg-red-200 transition-colors ease-in duration-200 hover:text-red-700 rounded-lg hover:bg-red-300">
                          <FaTrash />
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
} // what is this stack of divs
export default App
