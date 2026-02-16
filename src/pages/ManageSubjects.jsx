import React, { useState, useEffect } from "react";
import { Plus, Trash2, ArrowLeft, Check, X } from "lucide-react";

export default function ManageSubjects() {
  const [subjects, setSubjects] = useState([]);
  const [newSubject, setNewSubject] = useState("");
  const [selectedWeekdays, setSelectedWeekdays] = useState([]);
  const [alreadyPresent, setAlreadyPresent] = useState(0);
  const [alreadyAbsent, setAlreadyAbsent] = useState(0);
  const [isAdding, setIsAdding] = useState(false);

  const weekdays = [
    { id: 0, name: "Sunday" },
    { id: 1, name: "Monday" },
    { id: 2, name: "Tuesday" },
    { id: 3, name: "Wednesday" },
    { id: 4, name: "Thursday" },
    { id: 5, name: "Friday" },
    { id: 6, name: "Saturday" },
  ];

  // Load from localStorage on mount
  useEffect(() => {
    const savedSubjects = JSON.parse(localStorage.getItem("subjects")) || [];
    setSubjects(savedSubjects);
    
    const shouldAutoOpen = sessionStorage.getItem("openAddForm");
    if (shouldAutoOpen === "true") {
      setIsAdding(true);
      sessionStorage.removeItem("openAddForm");
    }
  }, []);

  // Save to localStorage whenever subjects change
  useEffect(() => {
    if (subjects.length > 0) {
      localStorage.setItem("subjects", JSON.stringify(subjects));
    }
  }, [subjects]);

  const toggleWeekday = (dayId) => {
    setSelectedWeekdays((prev) =>
      prev.includes(dayId) ? prev.filter((d) => d !== dayId) : [...prev, dayId]
    );
  };

  const addSubject = () => {
    if (!newSubject.trim() || selectedWeekdays.length === 0) {
      alert("Please enter subject name and select at least one weekday");
      return;
    }

    const newSubjectObj = {
      id: Date.now(), // Unique ID instead of relying on array index
      name: newSubject.trim(),
      weekdays: selectedWeekdays,
      alreadyPresent: Number(alreadyPresent),
      alreadyAbsent: Number(alreadyAbsent),
    };

    const updatedSubjects = [...subjects, newSubjectObj];
    setSubjects(updatedSubjects);
    localStorage.setItem("subjects", JSON.stringify(updatedSubjects));

    // Reset Form
    setNewSubject("");
    setSelectedWeekdays([]);
    setAlreadyPresent(0);
    setAlreadyAbsent(0);
    setIsAdding(false);
  };

  const deleteSubject = (id) => {
    if (window.confirm("Are you sure you want to delete this subject?")) {
      const updatedSubjects = subjects.filter((s) => s.id !== id);
      setSubjects(updatedSubjects);
      localStorage.setItem("subjects", JSON.stringify(updatedSubjects));
      
      // Clean up associated attendance logs if you have them
      const savedAttendance = JSON.parse(localStorage.getItem("attendance")) || {};
      delete savedAttendance[id]; 
      localStorage.setItem("attendance", JSON.stringify(savedAttendance));
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-8 pb-24">
      <div className="max-w-2xl mx-auto">
        <div className="mb-8 flex items-center gap-4">
          <button
            onClick={() => window.history.back()}
            className="p-2 rounded-full bg-white shadow hover:bg-gray-100 transition"
          >
            <ArrowLeft size={24} className="text-gray-700" />
          </button>
          <h1 className="text-3xl font-bold text-gray-800">Manage Subjects</h1>
        </div>

        {isAdding && (
          <div className="bg-white p-5 rounded-xl shadow mb-6 border animate-in fade-in zoom-in duration-200">
            <div className="mb-4">
              <input
                autoFocus
                value={newSubject}
                onChange={(e) => setNewSubject(e.target.value)}
                placeholder="Enter subject name"
                className="w-full border p-3 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
              />
            </div>

            <div className="mb-4">
              <p className="text-sm font-semibold text-gray-700 mb-2">Select weekdays:</p>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {weekdays.map((day) => (
                  <button
                    key={day.id}
                    onClick={() => toggleWeekday(day.id)}
                    className={`p-2 rounded-lg border text-sm transition font-medium ${
                      selectedWeekdays.includes(day.id)
                        ? "bg-indigo-600 text-white border-indigo-600"
                        : "bg-white text-gray-700 border-gray-300 hover:border-indigo-400"
                    }`}
                  >
                    {day.name.slice(0, 3)}
                  </button>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 mb-4">
              <div className="p-3 border-2 border-green-200 rounded-xl bg-green-50">
                <p className="text-xs font-bold text-green-700 mb-1">PRESENT</p>
                <input
                  type="number"
                  value={alreadyPresent}
                  onChange={(e) => setAlreadyPresent(e.target.value)}
                  className="w-full bg-transparent text-lg font-bold outline-none"
                />
              </div>
              <div className="p-3 border-2 border-red-200 rounded-xl bg-red-50">
                <p className="text-xs font-bold text-red-700 mb-1">ABSENT</p>
                <input
                  type="number"
                  value={alreadyAbsent}
                  onChange={(e) => setAlreadyAbsent(e.target.value)}
                  className="w-full bg-transparent text-lg font-bold outline-none"
                />
              </div>
            </div>

            <button
              onClick={addSubject}
              className="w-full bg-indigo-600 text-white py-3 rounded-xl font-bold hover:bg-indigo-700 transition"
            >
              Add Subject
            </button>
          </div>
        )}

        <div className="space-y-4">
          {subjects.length === 0 && !isAdding ? (
            <div className="text-center py-20 bg-white rounded-2xl border-2 border-dashed">
              <p className="text-gray-400">No subjects found. Tap + to start.</p>
            </div>
          ) : (
            subjects.map((subject) => (
              <div key={subject.id} className="bg-white rounded-xl shadow-sm border p-5 flex justify-between items-center">
                <div>
                  <h3 className="text-xl font-bold text-gray-800">{subject.name}</h3>
                  <div className="flex gap-1 mt-1">
                    {subject.weekdays.map((d) => (
                      <span key={d} className="text-[10px] bg-gray-100 px-1.5 py-0.5 rounded text-gray-600 uppercase font-bold">
                        {weekdays.find(w => w.id === d)?.name.slice(0, 3)}
                      </span>
                    ))}
                  </div>
                  <div className="flex gap-4 mt-3 text-sm font-bold">
                    <span className="text-green-600">P: {subject.alreadyPresent}</span>
                    <span className="text-red-600">A: {subject.alreadyAbsent}</span>
                  </div>
                </div>
                <button
                  onClick={() => deleteSubject(subject.id)}
                  className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-full transition"
                >
                  <Trash2 size={20} />
                </button>
              </div>
            ))
          )}
        </div>
      </div>

      <button
        onClick={() => setIsAdding(!isAdding)}
        className={`fixed bottom-8 left-1/2 -translate-x-1/2 p-4 rounded-full shadow-lg transition-all ${
          isAdding ? "bg-gray-800 rotate-45" : "bg-indigo-600 scale-110"
        } text-white`}
      >
        <Plus size={32} />
      </button>
    </div>
  );
}