import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";

export default function OverallAttendance() {
  const navigate = useNavigate();

  const [subjects, setSubjects] = useState([]);
  const [attendance, setAttendance] = useState({});
  const [goal, setGoal] = useState(75); // Default to 75
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    try {
      const savedSubjects = JSON.parse(localStorage.getItem("subjects")) || [];
      const savedAttendance = JSON.parse(localStorage.getItem("attendance")) || {};
      
      // SYNC WITH SETTINGS: Using the key from your Settings file
      const savedGoal = localStorage.getItem("requiredAttendance");
      
      setSubjects(savedSubjects);
      setAttendance(savedAttendance);
      if (savedGoal) setGoal(parseInt(savedGoal));
    } catch (error) {
      console.error("Error loading data:", error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // ---- SAFE CALCULATIONS ----
  let present = 0;
  let absent = 0;

  if (Array.isArray(subjects)) {
    subjects.forEach((subject) => {
      present += Number(subject.alreadyPresent || 0);
      absent += Number(subject.alreadyAbsent || 0);
    });
  }

  if (attendance && typeof attendance === 'object') {
    Object.entries(attendance).forEach(([subjectId, dates]) => {
      const exists = subjects.some(s => String(s.id) === String(subjectId));
      if (exists && dates && typeof dates === 'object') {
        Object.values(dates).forEach((status) => {
          if (status === "Present") present++;
          if (status === "Absent") absent++;
        });
      }
    });
  }

  const total = present + absent;
  const percentage = total === 0 ? 0 : Math.round((present / total) * 100);
  const noSubjects = subjects.length === 0;

  // ---- GOAL LOGIC (Connected to Settings) ----
  let statusMessage = "";
  const targetMultiplier = goal / 100;

  if (total > 0) {
    if ((present / total) < targetMultiplier) {
      // Need classes to reach goal
      const needed = Math.ceil((targetMultiplier * total - present) / (1 - targetMultiplier));
      statusMessage = `Attend next ${needed} classes to reach ${goal}%`;
    } else {
      // Safe to miss classes
      const canMiss = Math.floor((present / targetMultiplier) - total);
      statusMessage = canMiss > 0 
        ? `You can miss ${canMiss} more classes` 
        : `You are exactly at ${goal}%. Don't miss!`;
    }
  }

  if (isLoading) return <div className="min-h-screen bg-gray-900" />;

  return (
    <>
      <style>
        {`
        @keyframes rotate {
          from { transform: translate(-50%, 0) rotate(0deg); }
          to { transform: translate(-50%, 0) rotate(360deg); }
        }
        .water-container {
          position: relative;
          width: 140px;
          height: 200px;
          background: #1f2937;
          border-radius: 5px 5px 20px 20px;
          overflow: hidden;
          box-shadow: inset 0 0 20px rgba(0,0,0,0.5);
        }
        .water-fill {
          position: absolute;
          bottom: 0;
          left: 0;
          width: 100%;
          background: #3b82f6;
          transition: height 1s ease-in-out;
        }
        .water-fill::before,
        .water-fill::after {
          content: "";
          position: absolute;
          width: 250px;
          height: 240px;
          top: -225px;
          left: 50%;
          background: rgba(31,41,55,1);
          border-radius: 40%;
          transform: translate(-50%, 0);
          animation: rotate 6s linear infinite;
        }
        .water-fill::after {
          background: rgba(31,41,55,0.5);
          border-radius: 35%;
          animation: rotate 10s linear infinite;
        }
        .percent-display {
          position: absolute;
          width: 100%;
          top: 50%;
          transform: translateY(-50%);
          text-align: center;
          color: white;
          font-weight: 800;
          font-size: 1.5rem;
          z-index: 30;
        }
        `}
      </style>

      {/* HEADER */}
      <div className="bg-blue-300 flex items-center px-2 h-3 pt-9 pb-10 relative">
        <button onClick={() => navigate("/")} className="p-1 pl-2 bg-blue-200 rounded-full hover:bg-blue-400">
          <i className="ri-arrow-left-long-fill text-4xl text-gray"></i>
        </button>
        <p className="absolute left-1/2 -translate-x-1/2 text-xl font-semibold text-gray">
          Overall Attendance
        </p>
      </div>

      <div className="min-h-screen bg-gray-900 flex flex-col items-center ">
        <div className={`w-full ${noSubjects ? "h-20" : "h-28"}`} />

        <div className="">
          <div className="water-container">
            <div className="water-fill" style={{ height: `${percentage}%` }}>
              <div className="percent-display">{percentage}%</div>
            </div>
          </div>
        </div>

        {noSubjects && (
          <p className="text-gray-400 mt-16 text-center px-4">
            No subjects added yet.<br />
            Go to Manage Subjects to start tracking.
          </p>
        )}

        {/* STATS */}
        <div className={`flex justify-center gap-4 px-6 w-full max-w-md ${noSubjects ? "mt-8" : "mt-12"}`}>
          <div className="flex-1 py-6 bg-gray-800 text-white rounded-2xl text-center shadow-xl">
            <p className="text-xs uppercase opacity-50 mb-1">Present</p>
            <p className="text-3xl font-bold">{present}</p>
          </div>
          <div className="flex-1 py-6 bg-gray-800 text-white rounded-2xl text-center shadow-xl">
            <p className="text-xs uppercase opacity-50 mb-1">Absent</p>
            <p className="text-3xl font-bold">{absent}</p>
          </div>
        </div>

        {/* TOTAL CARDS */}
        <div className="w-full max-w-xs mt-6 px-6">
          <div className="bg-gray-800/40 p-4 rounded-xl text-center">
            <p className="text-gray-400 text-sm">Total Classes (Goal: {goal}%)</p>
            <span className="text-white font-bold text-xl">{total}</span>
          </div>
        </div>

        {/* GOAL STATUS CARD */}
        {!noSubjects && statusMessage && (
          <div className="w-full max-w-xs mt-4 px-6 mb-10">
            <div className={`p-4 rounded-xl text-center border shadow-lg ${
              percentage < goal ? "bg-red-900/20 border-red-500/30" : "bg-green-900/20 border-green-500/30"
            }`}>
              <p className={`${percentage < goal ? "text-red-400" : "text-green-400"} font-medium text-sm`}>
                {statusMessage}
              </p>
            </div>
          </div>
        )}
      </div>
    </>
  );
}