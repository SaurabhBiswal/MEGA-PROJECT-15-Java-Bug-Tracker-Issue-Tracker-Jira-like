import { useState } from "react";
import { X } from "lucide-react";
import api from "../config/api";

const CreateProjectModal = ({ isOpen, onClose, onCreated }) => {
    const [formData, setFormData] = useState({
        name: "",
        description: "",
        category: "",
        tags: [],
    });
    const [tagInput, setTagInput] = useState("");

    if (!isOpen) return null;

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await api.post("/api/projects", formData);
            onCreated(response.data);
            setFormData({ name: "", description: "", category: "", tags: [] });
            onClose();
        } catch (error) {
            console.error("Error creating project:", error);
        }
    };

    const addTag = () => {
        if (tagInput.trim() && !formData.tags.includes(tagInput.trim())) {
            setFormData({ ...formData, tags: [...formData.tags, tagInput.trim()] });
            setTagInput("");
        }
    };

    const removeTag = (tagToRemove) => {
        setFormData({
            ...formData,
            tags: formData.tags.filter((tag) => tag !== tagToRemove),
        });
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
            <div className="bg-slate-900 border border-slate-800 w-full max-w-lg rounded-2xl shadow-2xl">
                <div className="flex justify-between items-center p-6 border-b border-slate-800">
                    <h2 className="text-xl font-bold text-white">Create New Project</h2>
                    <button
                        onClick={onClose}
                        className="text-slate-400 hover:text-white transition-colors"
                    >
                        <X size={24} />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="p-6 space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-slate-400 mb-1">
                            Project Name
                        </label>
                        <input
                            required
                            type="text"
                            value={formData.name}
                            onChange={(e) =>
                                setFormData({ ...formData, name: e.target.value })
                            }
                            className="w-full px-4 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="My Awesome Project"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-slate-400 mb-1">
                            Description
                        </label>
                        <textarea
                            rows="3"
                            value={formData.description}
                            onChange={(e) =>
                                setFormData({ ...formData, description: e.target.value })
                            }
                            className="w-full px-4 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="What is this project about?"
                        ></textarea>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-slate-400 mb-1">
                            Category
                        </label>
                        <select
                            value={formData.category}
                            onChange={(e) =>
                                setFormData({ ...formData, category: e.target.value })
                            }
                            className="w-full px-4 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                            <option value="">Select Category</option>
                            <option value="Development">Development</option>
                            <option value="Design">Design</option>
                            <option value="Marketing">Marketing</option>
                            <option value="Research">Research</option>
                            <option value="Other">Other</option>
                        </select>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-slate-400 mb-1">
                            Tags
                        </label>
                        <div className="flex space-x-2">
                            <input
                                type="text"
                                value={tagInput}
                                onChange={(e) => setTagInput(e.target.value)}
                                onKeyPress={(e) => e.key === "Enter" && (e.preventDefault(), addTag())}
                                className="flex-1 px-4 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                                placeholder="Add a tag..."
                            />
                            <button
                                type="button"
                                onClick={addTag}
                                className="px-4 py-2 bg-slate-700 text-white rounded-lg hover:bg-slate-600 transition-colors"
                            >
                                Add
                            </button>
                        </div>
                        <div className="flex flex-wrap gap-2 mt-2">
                            {formData.tags.map((tag) => (
                                <span
                                    key={tag}
                                    className="px-3 py-1 bg-blue-500/10 text-blue-400 rounded-full text-sm flex items-center space-x-1"
                                >
                                    <span>{tag}</span>
                                    <button
                                        type="button"
                                        onClick={() => removeTag(tag)}
                                        className="hover:text-blue-300"
                                    >
                                        <X size={14} />
                                    </button>
                                </span>
                            ))}
                        </div>
                    </div>

                    <div className="pt-4 flex justify-end space-x-3">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-6 py-2 bg-slate-800 text-slate-300 rounded-lg hover:bg-slate-700 transition-colors"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-semibold transition-colors shadow-lg shadow-blue-600/20"
                        >
                            Create Project
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default CreateProjectModal;
