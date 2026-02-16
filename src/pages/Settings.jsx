import React, { useState, useEffect } from "react";
import { ArrowLeft, Edit2, Check } from "lucide-react";

export default function Settings() {
  const [requiredAttendance, setRequiredAttendance] = useState(75);
  const [isEditing, setIsEditing] = useState(false);
  const [tempValue, setTempValue] = useState(75);

  // Load from localStorage
  useEffect(() => {
    const savedAttendance = localStorage.getItem("requiredAttendance");
    
    if (savedAttendance) {
      setRequiredAttendance(parseInt(savedAttendance));
      setTempValue(parseInt(savedAttendance));
    }
  }, []);

  // Save required attendance
  const saveAttendance = () => {
    if (tempValue >= 0 && tempValue <= 100) {
      setRequiredAttendance(tempValue);
      localStorage.setItem("requiredAttendance", tempValue.toString());
      setIsEditing(false);
    } else {
      alert("Please enter a value between 0 and 100");
    }
  };

  // Go back
  const goBack = () => {
    window.history.back();
  };

  return (
    <div className="min-h-screen bg-gray-800 p-4 md:p-8">
      <div className="max-w-2xl mx-auto">
        {/* Header with Back Arrow */}
        <div className="mb-8 flex items-center gap-4">
          <button
            onClick={goBack}
            className="p-2 rounded-full bg-blue-200 hover:bg-blue-300 shadow transition"
          >
            <ArrowLeft size={24} className="text-gray-700" />
          </button>
          <h1 className="text-3xl font-bold text-gray-800">Settings</h1>
        </div>

        {/* Required Attendance Card */}
        <div className="bg-blue-200 border-gray-200 rounded-xl shadow border p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="text-5xl font-bold text-blue-400">%</div>
              <h2 className="text-xl font-semibold text-gray-800">
                Required Attendance
              </h2>
            </div>
            
            {!isEditing ? (
              <button
                onClick={() => setIsEditing(true)}
                className="p-2 rounded-lg bg-blue-100 hover:bg-blue-200 transition"
              >
                <Edit2 size={20} className="text-gray-800" />
              </button>
            ) : (
              <button
                onClick={saveAttendance}
                className="p-2 rounded-lg bg-green-500 hover:bg-green-600 transition"
              >
                <Check size={20} className="text-white" />
              </button>
            )}
          </div>

          {/* Percentage Display/Input */}
          <div className="mt-4">
            {!isEditing ? (
              <div className="text-center p-6 rounded-full bg-blue-300">
                <p className="text-6xl font-bold text-gray-600">
                  {requiredAttendance}%
                </p>
              </div>
            ) : (
              <div className="flex items-center gap-3">
                <input
                  type="number"
                  value={tempValue}
                  onChange={(e) => setTempValue(parseInt(e.target.value) || 0)}
                  min="0"
                  max="100"
                  className="flex-1 text-center text-4xl font-bold p-4 rounded-lg border-2 bg-blue-100 border-gray-300 text-gray-800 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
                <span className="text-4xl font-bold text-gray-700">%</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}