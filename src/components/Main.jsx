import React, { useState, useEffect, useRef } from 'react';
import logo1 from "./logo1.png";
import { useNavigate } from 'react-router-dom';

const Main = () => {
  const [isThere, setIsThere] = useState(false);
  const [subjects, setSubjects] = useState([]);
  const [todaySubjects, setTodaySubjects] = useState([]);
  const [selectedExtraSubjectId, setSelectedExtraSubjectId] = useState("");
  const [attendance, setAttendance] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const dropdownRef = useRef(null);
  const navigate = useNavigate();

  const weekdays = [
    { id: 0, name: "Sunday" },
    { id: 1, name: "Monday" },
    { id: 2, name: "Tuesday" },
    { id: 3, name: "Wednesday" },
    { id: 4, name: "Thursday" },
    { id: 5, name: "Friday" },
    { id: 6, name: "Saturday" },
  ];

  // Function to load data from localStorage
  const loadData = () => {
    const savedSubjects = JSON.parse(localStorage.getItem("subjects")) || [];
    const savedAttendance = JSON.parse(localStorage.getItem("attendance")) || {};
    
    setSubjects(savedSubjects);
    setAttendance(savedAttendance);

    const today = new Date().getDay();
    const filtered = savedSubjects.filter((subject) =>
      subject.weekdays && subject.weekdays.includes(today)
    );
    
    setTodaySubjects(filtered);
    setIsLoading(false);
  };

  useEffect(() => {
    loadData();

    const handleVisibilityChange = () => {
      if (!document.hidden) loadData();
    };

    const handleFocus = () => loadData();
    const handlePopState = () => loadData();

    document.addEventListener('visibilitychange', handleVisibilityChange);
    window.addEventListener('focus', handleFocus);
    window.addEventListener('popstate', handlePopState);
    
    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      window.removeEventListener('focus', handleFocus);
      window.removeEventListener('popstate', handlePopState);
    };
  }, []);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsThere(false);
      }
    };

    if (isThere) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isThere]);

  // Mark attendance using subject.id instead of index
  const markTodayAttendance = (subjectId, status) => {
    const today = new Date().toDateString();
    const currentAttendance = { ...attendance };
    
    if (!currentAttendance[subjectId]) {
      currentAttendance[subjectId] = {};
    }

    if (status === "No Class") {
      delete currentAttendance[subjectId][today];
    } else {
      currentAttendance[subjectId][today] = status;
    }

    setAttendance(currentAttendance);
    localStorage.setItem("attendance", JSON.stringify(currentAttendance));
  };

  const markExtraAttendance = (status) => {
    if (!selectedExtraSubjectId) {
      alert("Please select a subject");
      return;
    }

    markTodayAttendance(selectedExtraSubjectId, status);
    setIsThere(false);
    setSelectedExtraSubjectId("");
    loadData();
  };

  const getTodayStatus = (subjectId) => {
    const today = new Date().toDateString();
    return attendance[subjectId]?.[today] || null;
  };

  if (isLoading) {
    return (
      <main className="min-h-screen bg-gray-800 flex items-center justify-center">
        <p className="text-gray-300">Loading...</p>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-gray-800 overflow-hidden flex flex-col">
      
      {todaySubjects.length === 0 && (
        <div className='flex justify-center mt-20 mb-6'>
          <img src={logo1} alt="" className="h-32 sm:h-40" />
        </div>
      )}

      <div className="flex-1 overflow-y-auto pb-32 px-3 sm:px-4">
        
        {todaySubjects.length === 0 ? (
          <div>
            <p className='text-gray-300 text-sm sm:text-base text-center px-4'>
              No Classes for today! <br/>
              Go to Manage subjects to edit timetable <br/>
              OR <br/>
              Add an extra class
            </p>
          </div>
        ) : (
          <div className="max-w-2xl mx-auto pt-4">
            <h2 className="text-white text-lg sm:text-xl font-semibold mb-3 text-center">
              Today's Classes
            </h2>
            <div className="space-y-2">
              {todaySubjects.map((subject, idx) => {
                const status = getTodayStatus(subject.id);
                
                return (
                  <div key={subject.id} className="bg-gray-700 rounded-lg p-3 shadow-lg">
                    <h3 className="text-white font-semibold text-base sm:text-lg mb-2">
                      {subject.name}
                    </h3>
                    
                    {status && (
                      <div className={`text-xs sm:text-sm font-medium mb-2 ${
                        status === "Present" ? "text-green-400" : "text-red-400"
                      }`}>
                        Marked: {status}
                      </div>
                    )}

                    <div className="flex gap-1.5 sm:gap-2">
                      <button
                        onClick={() => markTodayAttendance(subject.id, "Present")}
                        className={`flex-1 py-1.5 sm:py-2 rounded-lg text-xs sm:text-sm font-semibold transition ${
                          status === "Present"
                            ? "bg-green-600 text-white"
                            : "bg-gray-600 text-gray-200 hover:bg-green-500"
                        }`}
                      >
                        Present
                      </button>
                      <button
                        onClick={() => markTodayAttendance(subject.id, "Absent")}
                        className={`flex-1 py-1.5 sm:py-2 rounded-lg text-xs sm:text-sm font-semibold transition ${
                          status === "Absent"
                            ? "bg-red-600 text-white"
                            : "bg-gray-600 text-gray-200 hover:bg-red-500"
                        }`}
                      >
                        Absent
                      </button>
                      <button
                        onClick={() => markTodayAttendance(subject.id, "No Class")}
                        className="flex-1 py-1.5 sm:py-2 rounded-lg text-xs sm:text-sm font-semibold bg-gray-600 text-gray-200 hover:bg-gray-500 transition"
                      >
                        No Class
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>

      <div className="fixed bottom-20 left-0 right-0 flex justify-center pointer-events-none">
        {!isThere && (
          <button
            onClick={() => setIsThere(true)}
            className="rounded-2xl px-4 sm:px-6 py-2.5 sm:py-3 bg-gray-700 text-gray-100 hover:bg-gray-600 cursor-pointer flex gap-2 items-center shadow-lg text-sm sm:text-base pointer-events-auto"
          >
            <i className="ri-add-line text-lg"></i>
            Add Extra Class
          </button>
        )}
      </div>

      <div
        ref={dropdownRef}
        className={`fixed bottom-0 left-0 w-full rounded-t-3xl bg-gray-900 shadow-2xl transform transition-transform duration-300 ease-in-out z-50 ${
          isThere ? 'translate-y-0' : 'translate-y-full'
        }`}
        style={{ height: '280px' }}
      >
        <div className='text-center mt-4 sm:mt-6'>
          <span className='text-gray-50 font-medium text-base sm:text-lg'>Add Extra Class</span>
        </div>

        <div className='mt-6 sm:mt-8 flex justify-center items-center px-4'> 
          <label className='text-amber-50 text-xs sm:text-sm flex items-center flex-wrap justify-center gap-2'> 
            <i className="ri-dropdown-list"></i>        
            <span>Select Subject</span>
            
            <select 
              value={selectedExtraSubjectId}
              onChange={(e) => setSelectedExtraSubjectId(e.target.value)}
              className='bg-transparent text-gray-50 border-b border-gray-400 px-2 py-1 focus:outline-none focus:border-amber-50 cursor-pointer text-sm'
            >
              <option value="" className='bg-gray-800'>-- Select --</option>
              {subjects.map((subject) => (
                <option key={subject.id} value={subject.id} className='bg-gray-800'>
                  {subject.name}
                </option>
              ))}
            </select>
          </label>
        </div>

        <div className="flex justify-center gap-3 sm:gap-4 mt-6 sm:mt-8 px-4">
          <button 
            onClick={() => markExtraAttendance("Present")}
            className='rounded-3xl bg-[#0FFA76] font-bold py-2.5 sm:py-3 px-6 sm:px-8 text-black active:scale-95 transition-transform shadow-lg text-sm sm:text-base'
          >
            Present
          </button>
          <button 
            onClick={() => markExtraAttendance("Absent")}
            className='rounded-3xl bg-[#FA2828] font-bold py-2.5 sm:py-3 px-6 sm:px-8 text-black active:scale-95 transition-transform shadow-lg text-sm sm:text-base'
          >
            Absent
          </button>
        </div>

        <div className="flex justify-center mt-3 sm:mt-4">
          <button
            onClick={() => setIsThere(false)}
            className="text-gray-400 hover:text-gray-200 text-xs sm:text-sm"
          >
            Cancel
          </button>
        </div>
      </div>
    </main>
  );
}

export default Main;