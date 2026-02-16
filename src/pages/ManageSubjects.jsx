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

  // --- Integrated Saved Logic ---
  const handleBack = () => {
    if (window.history.length > 1) {
      window.history.back();
    } else {
      window.location.href = "/"; 
    }
  };

  useEffect(() => {
    const savedSubjects = JSON.parse(localStorage.getItem("subjects")) || [];
    setSubjects(savedSubjects);
    
    const shouldAutoOpen = sessionStorage.getItem("openAddForm");
    if (shouldAutoOpen === "true") {
      setIsAdding(true);
      sessionStorage.removeItem("openAddForm");
    }
  }, []);

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
      id: Date.now(),
      name: newSubject.trim(),
      weekdays: selectedWeekdays,
      alreadyPresent: Number(alreadyPresent),
      alreadyAbsent: Number(alreadyAbsent),
    };

    const updatedSubjects = [...subjects, newSubjectObj];
    setSubjects(updatedSubjects);
    localStorage.setItem("subjects", JSON.stringify(updatedSubjects));

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
      
      const savedAttendance = JSON.parse(localStorage.getItem("attendance")) || {};
      delete savedAttendance[id]; 
      localStorage.setItem("attendance", JSON.stringify(savedAttendance));
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 pb-24">
      {/* FULL WIDTH HEADER */}
      <div className="relative w-full p-4 mb-6 bg-blue-300 flex items-center justify-center shadow-md">
        <button
          onClick={handleBack}
          className="absolute left-4 p-3 rounded-full bg-blue-200 shadow hover:bg-blue-400 transition text-gray-800"
        >
          <ArrowLeft size={24} />
        </button>
        <h1 className="text-2xl md:text-3xl font-bold text-gray-700 text-center">
          Manage Subjects
        </h1>
      </div>

      {/* CONTENT CONTAINER */}
      <div className="max-w-2xl mx-auto px-4 md:px-8">
        {isAdding && (
          <div className="bg-blue-300 p-5 rounded-xl shadow mb-6 border animate-in fade-in zoom-in duration-200">
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
              <p className="text-sm font-semibold text-gray-800 mb-2">Select weekdays:</p>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {weekdays.map((day) => (
                  <button
                    key={day.id}
                    type="button"
                    onClick={() => toggleWeekday(day.id)}
                    className={`p-2 rounded-lg border text-sm transition font-medium ${
                      selectedWeekdays.includes(day.id)
                        ? "bg-blue-500 text-white border-blue-400"
                        : "bg-blue-200 text-gray-700 border-gray-300 hover:border-indigo-400"
                    }`}
                  >
                    {day.name.slice(0, 3)}
                  </button>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 mb-4">
              <div className="p-3 border-2 border-green-200 rounded-xl bg-green-50">
                <p className="text-xs font-bold text-green-600 mb-1">PRESENT</p>
                <input
                  type="number"
                  value={alreadyPresent}
                  onChange={(e) => setAlreadyPresent(e.target.value)}
                  className="w-full bg-transparent text-lg font-bold outline-none"
                />
              </div>
              <div className="p-3 border-2 border-red-200 rounded-xl bg-red-50">
                <p className="text-xs font-bold text-red-600 mb-1">ABSENT</p>
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
              className=" min-w-full bg-blue-100 text-gray-900 py-3 rounded-xl font-bold hover:bg-gray-300 transition"
            >
              Add Subject
            </button>
          </div>
        )}

        <div className="space-y-4">
          {subjects.length === 0 && !isAdding ? (
            <div className="text-center py-20 bg-blue-200 rounded-2xl border-2 border-dashed">
              <p className="text-gray-900">No subjects found. Tap + to start.</p>
            </div>
          ) : (
            subjects.map((subject) => (
              <div key={subject.id} className="bg-blue-200 rounded-xl shadow-sm border p-5 flex justify-between items-center">
                <div>
                  <h3 className="text-xl font-bold text-gray-800">{subject.name}</h3>
                  <div className="flex gap-1 mt-1">
                    {subject.weekdays.map((d) => (
                      <span key={d} className="text-[10px] bg-blue-00 px-1.5 py-0.5 rounded text-gray-800 uppercase font-bold">
                        {weekdays.find(w => w.id === d)?.name.slice(0, 3)}
                      </span>
                    ))}
                  </div>
                  <div className="flex gap-4 mt-3 text-sm font-bold">
                    <span className="text-green-600 ">Present: {subject.alreadyPresent}</span>
                    <span className="text-red-600">Absent: {subject.alreadyAbsent}</span>
                  </div>
                </div>
                <button
                  onClick={() => deleteSubject(subject.id)}
                  className="p-2 text-gray-900 hover:text-red-500 hover:bg-red-100 rounded-full transition"
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
        className={`fixed bottom-8 left-1/2 -translate-x-1/2 p-4 rounded-3xl shadow-lg transition-all ${
          isAdding ? "bg-gray-800 rotate-45" : "bg-gray-700 scale-110"
        } text-white`}
      >
        <Plus size={32} />
      </button>
    </div>
  );
}