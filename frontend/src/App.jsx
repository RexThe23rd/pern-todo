import { use, useEffect, useState } from "react";
import axios from "axios";

function App() {

  const [description, setDescription] = useState("");
  const [todos, setTodos] = useState([]);
  const [editTodo, setEditTodo] = useState(null);
  const [editedText, setEditedText] = useState("");

//functionality (boring stuff)
  //getting the todos
  const getTodos = async () => {
    try {
      const res = await axios.get("http://localhost:5000/todos");
      setTodos(res.data);
      console.log(res.data)
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
          <button className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md font-medium cursor-pointer">Add Todo</button>
        </form>
        <div>
          {todos === 0 ? (
            <p className="text-gray-600">Nothing here yet!</p>
          ) : (
            <div>
              {todos.map((todo) => (
                <div >
                  <span>{todo.description}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default App
