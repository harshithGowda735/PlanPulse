import React, { useState, useEffect } from "react";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import { ArrowLeft, HelpCircle, Plus } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function AllSubjects() {
  const navigate = useNavigate();
  const [subjects, setSubjects] = useState([]);
  const [selectedSubjectId, setSelectedSubjectId] = useState(null);
  const [attendance, setAttendance] = useState({});
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [showAttendanceModal, setShowAttendanceModal] = useState(false);
  const [goal, setGoal] = useState(75);

  const weekdays = [
    { id: 0, name: "Sunday" }, { id: 1, name: "Monday" }, { id: 2, name: "Tuesday" },
    { id: 3, name: "Wednesday" }, { id: 4, name: "Thursday" }, { id: 5, name: "Friday" }, { id: 6, name: "Saturday" },
  ];

  const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

  const loadAllData = () => {
    try {
      const savedSubjects = JSON.parse(localStorage.getItem("subjects")) || [];
      const savedAttendance = JSON.parse(localStorage.getItem("attendance")) || {};
      const savedGoal = localStorage.getItem("requiredAttendance");
      setSubjects(savedSubjects);
      setAttendance(savedAttendance);
      if (savedGoal) setGoal(parseInt(savedGoal));
    } catch (e) {
      console.error("Failed to load data", e);
    }
  };

  useEffect(() => {
    loadAllData();
    window.addEventListener('storage', loadAllData);
    window.addEventListener('focus', loadAllData);
    return () => {
      window.removeEventListener('storage', loadAllData);
      window.removeEventListener('focus', loadAllData);
    };
  }, []);

  const calculateStats = (id) => {
    const subject = subjects.find(s => String(s.id) === String(id));
    if (!subject) return { present: 0, absent: 0, total: 0, percentage: 0 };
    const subjectAttendance = attendance[id] || {};
    const logPresent = Object.values(subjectAttendance).filter(status => status === "Present").length;
    const logAbsent = Object.values(subjectAttendance).filter(status => status === "Absent").length;
    const totalPresent = logPresent + (Number(subject.alreadyPresent) || 0);
    const totalAbsent = logAbsent + (Number(subject.alreadyAbsent) || 0);
    const total = totalPresent + totalAbsent;
    const percentage = total > 0 ? Math.round((totalPresent / total) * 100) : 0;
    return { present: totalPresent, absent: totalAbsent, total, percentage };
  };

  const getAttendanceMessage = (percentage, stats) => {
    if (percentage >= goal) return { message: "You are on track!", color: "text-green-600" };
    const targetMultiplier = goal / 100;
    if (targetMultiplier >= 1) return { message: "Goal set to 100%", color: "text-red-600" };
    const needed = Math.ceil((targetMultiplier * stats.total - stats.present) / (1 - targetMultiplier));
    return { message: `Attend ${needed > 0 ? needed : 0} more classes for ${goal}%`, color: "text-red-600" };
  };

  const updateAttendance = (status) => {
    const dateKey = selectedDate.toDateString();
    const newAttendance = { ...attendance };
    if (!newAttendance[selectedSubjectId]) newAttendance[selectedSubjectId] = {};
    if (status === "Reset") delete newAttendance[selectedSubjectId][dateKey];
    else newAttendance[selectedSubjectId][dateKey] = status;
    setAttendance(newAttendance);
    localStorage.setItem("attendance", JSON.stringify(newAttendance));
    setShowAttendanceModal(false);
  };

  const getDateDisplay = (date) => ({
    dayName: weekdays[date.getDay()].name.slice(0, 3),
    monthName: monthNames[date.getMonth()]
  });

  const CircleProgress = ({ percentage, size = "large" }) => {
    const radius = size === "large" ? 70 : 45;
    const circumference = 2 * Math.PI * radius;
    const offset = circumference - (percentage / 100) * circumference;
    const isSafe = percentage >= goal;
    const strokeColor = isSafe ? "#10b981" : "#ef4444";

    return (
      <div className="relative inline-flex items-center justify-center">
        <svg width={size === "large" ? 160 : 100} height={size === "large" ? 160 : 100}>
          <circle cx={size === "large" ? 80 : 50} cy={size === "large" ? 80 : 50} r={radius} stroke="#e5e7eb" strokeWidth={size === "large" ? 12 : 8} fill="none" />
          <circle cx={size === "large" ? 80 : 50} cy={size === "large" ? 80 : 50} r={radius} stroke={strokeColor} strokeWidth={size === "large" ? 12 : 8} fill="none" strokeDasharray={circumference} strokeDashoffset={offset} strokeLinecap="round" transform={`rotate(-90 ${size === "large" ? 80 : 50} ${size === "large" ? 80 : 50})`} style={{ transition: "stroke-dashoffset 0.5s ease" }} />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center">
          <span className={`font-bold ${size === "large" ? "text-3xl" : "text-lg"}`} style={{ color: strokeColor }}>{percentage}%</span>
        </div>
      </div>
    );
  };

  // --- SUBJECT LIST VIEW ---
  if (selectedSubjectId === null) {
    return (
      <div className="min-h-screen bg-gray-900 pb-28">
        {/* FULL WIDTH HEADER */}
        <div className="w-full bg-blue-300  pb-2 shadow-md mb-7">
          <div className="max-w-2xl mx-auto px-4 py-3 flex items-center justify-between relative">
            <button onClick={() => navigate('/')} className="p-3 rounded-full bg-blue-200  hover:bg-blue-400 transition z-10">
              <ArrowLeft size={22} className="text-gray-700" />
            </button>
            <h1 className="absolute left-1/2 -translate-x-1/2 text-2xl font-bold text-gray-800 whitespace-nowrap">
              All Subjects
            </h1>
            <div className="w-10" /> {/* Spacer */}
          </div>
        </div>

        {/* CONSTRAINED CONTENT */}
        <div className="max-w-2xl mx-auto px-4">
          {subjects.length === 0 ? (
            <p className="text-center text-gray-400 py-10">No subjects added yet</p>
          ) : (
            <div className="space-y-4">
              {subjects.map((subject) => {
                const stats = calculateStats(subject.id);
                return (
                  <div key={subject.id} onClick={() => setSelectedSubjectId(subject.id)} className="bg-blue-200 rounded-xl shadow p-4 md:p-5 cursor-pointer hover:scale-[1.01] transition-transform">
                    <div className="flex justify-between items-center gap-4">
                      <div className="flex-1 min-w-0">
                        <h3 className="text-lg font-semibold text-gray-800 mb-1 truncate">{subject.name}</h3>
                        <p className="text-sm text-gray-900 mb-3">Attendance: {stats.present}/{stats.total}</p>
                        <div className="space-y-2">
                          <div className="flex items-center gap-2">
                            <span className="text-[10px] font-bold text-gray-800 w-10 uppercase">Present</span>
                            <div className="flex-1 bg-green-100 rounded-full h-2 overflow-hidden">
                              <div className="bg-green-600 h-full transition-all" style={{ width: `${stats.total > 0 ? (stats.present / stats.total) * 100 : 0}%` }} />
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="text-[10px] font-bold text-gray-800 w-10 uppercase">Absent</span>
                            <div className="flex-1 bg-red-100 rounded-full h-2 overflow-hidden">
                              <div className="bg-red-600 h-full transition-all" style={{ width: `${stats.total > 0 ? (stats.absent / stats.total) * 100 : 0}%` }} />
                            </div>
                          </div>
                        </div>
                      </div>
                      <CircleProgress percentage={stats.percentage} size="small" />
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        <button onClick={() => navigate('/Manage')} className="fixed bottom-21 left-1/2 -translate-x-1/2 bg-blue-300 text-gray px-3 py-2 rounded-full shadow-2xl hover:bg-gray-700 transition-all z-50 flex items-center gap-2 font-bold">
          <Plus size={24} /> Add Subject
        </button>
      </div>
    );
  }
  // Calendar View
  const currentSubject = subjects.find(s => String(s.id) === String(selectedSubjectId));
  const stats = calculateStats(selectedSubjectId);
  const attendanceMsg = getAttendanceMessage(stats.percentage, stats);

  return (
    <div className="min-h-screen bg-gray-500 p-4 md:p-8">
      <div className="max-w-2xl mx-auto">
        <div className="mb-6 flex items-center gap-4">
          <button
            onClick={() => setSelectedSubjectId(null)}
            className="p-2 rounded-full bg-blue-200 shadow hover:bg-blue-300 transition"
          >
            <ArrowLeft size={24} className="text-gray-700" />
          </button>
          <h1 className="text-2xl font-bold text-gray-100">
            {currentSubject?.name}
          </h1>
        </div>

        <div className="bg-blue-200 rounded-xl shadow border p-6 mb-6">
          <div className="flex items-center gap-8">
            <div>
              <CircleProgress percentage={stats.percentage} size="large" />
            </div>
            <div className="flex-1 space-y-3">
              <div>
                <p className="text-sm text-gray-900">Present</p>
                <p className="text-2xl font-bold text-green-600">{stats.present}</p>
              </div>
              <div>
                <p className="text-sm text-gray-900">Absent</p>
                <p className="text-2xl font-bold text-red-600">{stats.absent}</p>
              </div>
              <div>
                <p className="text-sm text-gray-900">Total</p>
                <p className="text-2xl font-bold text-gray-800">{stats.total}</p>
              </div>
            </div>
          </div>
          <div className={`mt-6 p-4 rounded-lg bg-blue-100 ${attendanceMsg.color}`}>
            <p className="font-semibold text-center">{attendanceMsg.message}</p>
          </div>
        </div>

        <div className="bg-blue-50 rounded-xl shadow border p-4">
          <Calendar
            onClickDay={(date) => { setSelectedDate(date); setShowAttendanceModal(true); }}
            value={selectedDate}
            className="w-full border-none bg-blue-300"
            tileContent={({ date }) => {
              const key = date.toDateString();
              const status = attendance[selectedSubjectId]?.[key];
              if (!status) return null;
              return (
                <div className={`text-[10px] mt-1  font-bold rounded-full ${
                  status === "Present" ? "text-green-600 " : "text-red-600"
                }`}>
                  {status === "Present" ? "P" : "A"}
                </div>
              );
            }}
          />
        </div>
      </div>

      {showAttendanceModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-blue-200 rounded-2xl shadow-2xl max-w-sm w-full p-6">
            <div className="text-center mb-6">
              <h2 className="text-2xl font-bold text-gray-800">
                {getDateDisplay(selectedDate).dayName}, {getDateDisplay(selectedDate).monthName} {selectedDate.getDate()}
              </h2>
            </div>
            <div className="flex items-center justify-center gap-2 mb-6">
              <h3 className="text-sm font-semibold text-gray-700">Set/Reset Attendance</h3>
              <button className="text-gray-400 hover:text-gray-600">
                <HelpCircle size={18} />
              </button>
            </div>
            <div className="text-center mb-6">
              <p className="text-md font-medium text-indigo-600">
                {currentSubject?.name}
              </p>
            </div>
            <div className="flex gap-3">
              <button
                onClick={() => updateAttendance("Present")}
                className="flex-1 bg-green-600 text-white  px-2 rounded-full font-semibold hover:bg-green-600 transition"
              >
                Present
              </button>
              <button
                onClick={() => updateAttendance("Absent")}
                className="flex-1 bg-red-600 text-white px-2 rounded-full font-semibold hover:bg-red-600 transition"
              >
                Absent
              </button>
              <button
                onClick={() => updateAttendance("Reset")}
                className="flex-1 bg-gray-300 text-gray-700 py-2 rounded-full font-semibold hover:bg-gray-400 transition"
              >
                Reset
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}