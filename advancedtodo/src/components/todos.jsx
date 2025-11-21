import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

function Todos() {
    const [dark, setdark] = useState(false);
    const [title, settitle] = useState("");
    const [description, setdescription] = useState("");
    const [todo, settodo] = useState([]);

    const [editId, setEditId] = useState(null);
    const [editTitle, setEditTitle] = useState("");
    const [editDesc, setEditDesc] = useState("");

    // Load saved todos
    useEffect(() => {
        const saved = localStorage.getItem("todos");
        if (saved) {
            settodo(JSON.parse(saved));
        }
    }, []);

    // Save todos when changed
    useEffect(() => {
        localStorage.setItem("todos", JSON.stringify(todo));
    }, [todo]);

    // Toggle modes
    let darkmode = () => setdark(true);
    let whitemode = () => setdark(false);

    // Add Todo
    let handlesubmit = (e) => {
        e.preventDefault();
        const newtodo = {
            id: Date.now(),
            title,
            description,
            done: false,
        };
        settodo([...todo, newtodo]);
        settitle("");
        setdescription("");
    };

    // Mark as done
    let donetodos = (id) => {
        settodo(
            todo.map((t) =>
                t.id === id ? { ...t, done: true } : t
            )
        );
    };

    // Undo done
    let undotodos = (id) => {
        settodo(
            todo.map((t) =>
                t.id === id ? { ...t, done: false } : t
            )
        );
    };

    // Delete
    let deletetodo = (id) => {
        settodo(todo.filter((t) => t.id !== id));
    };

    // Start editing
    let startedit = (t) => {
        setEditId(t.id);
        setEditTitle(t.title);
        setEditDesc(t.description);
    };

    // Submit edit
    let submitedit = (id) => {
        settodo(
            todo.map((t) =>
                t.id === id
                    ? { ...t, title: editTitle, description: editDesc }
                    : t
            )
        );

        setEditId(null);
        setEditTitle("");
        setEditDesc("");
    };

    return (
        <>
            <section
                className={
                    dark
                        ? "bg-black text-[#F6FF99] min-h-screen transition"
                        : "bg-white text-[#476EAE] min-h-screen transition"
                }
            >
                <nav>
                    <div className="flex justify-between items-center px-5 py-3">
                        <h1 className="text-2xl md:text-3xl font-extrabold">DO-IT</h1>

                        {dark ? (
                            <img
                                onClick={whitemode}
                                src="src/tools/contrast_5949098.png"
                                className="cursor-pointer w-8 h-8 md:w-10 md:h-10"
                            />
                        ) : (
                            <img
                                onClick={darkmode}
                                src="src/tools/moon_15014515.png"
                                className="cursor-pointer w-8 h-8 md:w-10 md:h-10"
                            />
                        )}
                    </div>
                    <hr className="border-gray-500" />
                </nav>

                {/* MAIN LAYOUT */}
                <div className="grid grid-cols-1 md:grid-cols-2 min-h-screen p-3 md:p-5 gap-10">

                    {/* CREATE TODO CARD */}
                    <div
                        className={`flex flex-col justify-center items-center shadow-2xl border border-gray-200 rounded-3xl p-10 transition h-fit 
                        ${dark ? "bg-[#0f0f0f]" : "bg-white"} w-full max-w-md mx-auto`}
                    >
                        <h1 className={`text-xl md:text-2xl font-semibold ${dark ? "text-[#F6FF99]" : "text-black"}`}>
                            Create Todo
                        </h1>

                        <form onSubmit={handlesubmit} className="flex flex-col items-center p-5 mt-3 gap-5 w-full">
                            <input
                                className="p-3 w-full rounded-xl border-2 border-[#476EAE] text-lg md:text-xl focus:outline-none"
                                value={title}
                                onChange={(e) => settitle(e.target.value)}
                                type="text"
                                placeholder="Title"
                            />

                            <input
                                className="p-3 w-full rounded-xl border-2 border-[#476EAE] text-lg md:text-xl focus:outline-none"
                                value={description}
                                onChange={(e) => setdescription(e.target.value)}
                                type="text"
                                placeholder="Description"
                                required
                            />

                            <button className=" cursor-pointer p-3 mt-3 bg-[#476EAE] rounded-xl text-[#F6FF99] w-40 font-semibold">
                                Add todo
                            </button>
                        </form>
                    </div>

                    {/* TODOS LIST */}
                    <div className="flex flex-col gap-5 p-2 md:p-5 overflow-y-auto max-h-[70vh]">
                        {todo.length === 0 && (
                            <p className="text-lg md:text-xl opacity-70 text-center">
                                No todos yet...
                            </p>
                        )}

                        <AnimatePresence>
                            {todo.map((t) => (
                                <motion.div
                                    key={t.id}
                                    initial={{ opacity: 0, y: 15 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, scale: 0.9 }}
                                    transition={{ duration: 0.2 }}
                                    whileHover={{ scale: 1.01 }}
                                    className={`p-5 border-4 border-[#476EAE] rounded-2xl w-full 
                                    ${t.done ? "border-green-600" : "border-black shadow-md"} 
                                    ${dark ? "bg-[#0f0f0f]" : ""} transition`}
                                >
                                    {/* EDIT MODE */}
                                    {editId === t.id ? (
                                        <motion.div 
                                            initial={{ scale: 0.95, opacity: 0 }}
                                            animate={{ scale: 1, opacity: 1 }}
                                            className="flex flex-col gap-3"
                                        >
                                            <input
                                                value={editTitle}
                                                onChange={(e) => setEditTitle(e.target.value)}
                                                className="p-2 border rounded"
                                            />
                                            <input
                                                value={editDesc}
                                                onChange={(e) => setEditDesc(e.target.value)}
                                                className="p-2 border rounded"
                                            />

                                            <button
                                                onClick={() => submitedit(t.id)}
                                                className="bg-blue-600 px-4 py-2 rounded text-white"
                                            >
                                                Save
                                            </button>
                                        </motion.div>
                                    ) : (
                                        <>
                                            {/* NORMAL DISPLAY */}
                                            <h1
                                                className={`text-lg md:text-xl font-bold ${
                                                    dark ? "text-[#F6FF99]" : "text-black"
                                                } ${t.done ? "line-through" : ""}`}
                                            >
                                                {t.title}
                                            </h1>

                                            <p
                                                className={`text-base md:text-lg mt-2 ${
                                                    dark ? "text-[#F6FF99]" : "text-black"
                                                } ${t.done ? "line-through" : ""}`}
                                            >
                                                {t.description}
                                            </p>

                                            <div className="flex flex-wrap gap-3 mt-4">

                                                {/* Done / Undo button */}
                                                {!t.done ? (
                                                    <button
                                                        onClick={() => donetodos(t.id)}
                                                        className="cursor-pointer bg-green-600 px-4 py-2 rounded text-white"
                                                    >
                                                        Done ✅
                                                    </button>
                                                ) : (
                                                    <button
                                                        onClick={() => undotodos(t.id)}
                                                        className="cursor-pointer bg-yellow-500 px-4 py-2 rounded text-white"
                                                    >
                                                        Undo ⤴️
                                                    </button>
                                                )}

                                                {/* Edit */}
                                                <button
                                                    onClick={() => startedit(t)}
                                                    className="cursor-pointer bg-blue-600 px-4 py-2 rounded text-white"
                                                >
                                                    Edit ✏️
                                                </button>

                                                {/* Delete */}
                                                <button
                                                    onClick={() => deletetodo(t.id)}
                                                    className="cursor-pointer bg-red-600 px-4 py-2 rounded text-white"
                                                >
                                                    Delete ❌
                                                </button>
                                            </div>
                                        </>
                                    )}
                                </motion.div>
                            ))}
                        </AnimatePresence>
                    </div>
                </div>
            </section>
        </>
    );
}

export default Todos;
