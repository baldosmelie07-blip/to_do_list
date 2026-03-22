import { useState } from "react";
import Header from "../components/Header";

function Home() {
  const [items, setItems] = useState([
    { id: 1, title: "Learn React" },
    { id: 2, title: "Study Tailwind" },
  ]);

  const [title, setTitle] = useState("");
  const [editId, setEditId] = useState(null);

  const handleAdd = () => {
    if (!title) return;

    if (editId) {
      setItems(
        items.map((item) =>
          item.id === editId ? { ...item, title } : item
        )
      );
      setEditId(null);
    } else {
      setItems([...items, { id: Date.now(), title }]);
    }

    setTitle("");
  };

  const handleEdit = (item) => {
    setTitle(item.title);
    setEditId(item.id);
  };

  const handleDelete = (id) => {
    setItems(items.filter((item) => item.id !== id));
  };

  return (
    <>
      <Header />

      <div className="p-6 max-w-3xl mx-auto">
        <h2 className="text-2xl font-bold mb-6">List Table</h2>

        {/* Add / Edit Input */}
        <div className="flex gap-2 mb-6">
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Enter title"
            className="border px-4 py-2 flex-1 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
          />
          <button
            onClick={handleAdd}
            className="bg-red-600 text-white px-6 rounded-lg hover:bg-red-700 transition"
          >
            {editId ? "Update" : "Add"}
          </button>
        </div>

        {/* List (NO TABLE BORDERS) */}
        <div className="space-y-3">
          {items.map((item) => (
            <div
              key={item.id}
              className="flex items-center justify-between bg-white p-4 rounded-xl shadow"
            >
              <span className="font-medium text-gray-700">
                {item.title}
              </span>

              <div className="space-x-2">
                <button
                  onClick={() => handleEdit(item)}
                  className="bg-blue-500 text-white px-3 py-1 rounded-lg hover:bg-blue-600"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(item.id)}
                  className="bg-red-500 text-white px-3 py-1 rounded-lg hover:bg-red-600"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}

export default Home;
