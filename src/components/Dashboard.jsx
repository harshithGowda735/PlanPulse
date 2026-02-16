import React, { useState } from 'react';
import Main from './Main';
import logo from "./logo.png";
import { useNavigate } from "react-router-dom";

const Dashboard = () => {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();
  
  return (
    <div className="relative min-h-screen bg-gray-800">
      
      {/* HEADER: Logo on Left, Hamburger on Right */}
      <header className="flex justify-between items-center p-3 bg-blue-300">
        {/* Main Logo on the Left */}
        <div className="text-lg w-10">
          <img src={logo} alt="" />
        </div>
        <div className="text-xl text-black">
          {new Date().toLocaleDateString("en-US", {
            weekday: "long",
            month: "long",
            day: "numeric",
          })}
        </div>

        {/* Hamburger Button: Hidden when menu is open */}
        {!isOpen && (
          <button 
            onClick={() => setIsOpen(true)} 
            className="z-50 flex flex-col justify-between w-8 h-5 cursor-pointer"
          >
            <span className="h-1 w-full bg-gray-700 rounded-lg"></span>
            <span className="h-1 w-full bg-gray-700 rounded-lg"></span>
            <span className="h-1 w-full bg-gray-700 rounded-lg"></span>
          </button>
        )}
      </header>

      {/* SIDE MENU OVERLAY */}
      <div className={`
        fixed top-0 right-0 h-full w-60 bg-gray-800 shadow-2xl transform transition-transform duration-300 ease-in-out z-40
        ${isOpen ? 'translate-x-0' : 'translate-x-full'}
      `}>
        <div className='p-20 pt-8 pb-5 bg-blue-300'>
          <img src={logo} alt="" />
          <div className='mt-5'><p className='text-2xl'>PlanPulse v3.0</p></div>
        </div>
        <div className='flex flex-col gap-6 pt-10 pr-10 text-right'>
          
          <section
            onClick={() => { navigate("/overall"); setIsOpen(false); }}
            className='text-xl text-gray-100 hover:text-gray-500 cursor-pointer'
          >
            Overall Attendance
          </section>
          
          <section 
            onClick={() => { navigate("/Manage"); setIsOpen(false); }}
            className='text-xl text-gray-100 hover:text-gray-500 cursor-pointer'
          >
            Manage Subjects
          </section>
          
          <section 
            onClick={() => { navigate("/Allsubjects"); setIsOpen(false); }}
            className='text-xl text-gray-100 hover:text-gray-500 cursor-pointer'
          >
            All Subjects
          </section>
          
          <section 
            onClick={() => { navigate("/Setting"); setIsOpen(false); }}
            className='text-xl text-gray-100 hover:text-gray-500 cursor-pointer'
          >
            Settings
          </section>
          
          <section 
            onClick={() => { navigate("/Rate"); setIsOpen(false); }}
            className='text-xl text-gray-100 hover:text-gray-500 cursor-pointer'
          >
            Rate App
          </section>
          
          <section 
            onClick={() => { navigate("/Report"); setIsOpen(false); }}
            className='text-xl text-gray-100 hover:text-gray-500 cursor-pointer'
          >
            Report Bug
          </section>
          
          <section 
            onClick={() => { navigate("/Suggestion"); setIsOpen(false); }}
            className='text-xl text-gray-100 hover:text-gray-500 cursor-pointer'
          >
            Suggestion
          </section>
          
          <section className='text-xl text-gray-100 hover:text-gray-500 cursor-pointer'>
            About App
          </section>
        </div>
      </div>

      {/* CLICK TO CLOSE OVERLAY */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/30 backdrop-blur-sm z-30 transition-opacity"
          onClick={() => setIsOpen(false)} 
        />
      )}

      <Main />
    </div>
  );
}

export default Dashboard;