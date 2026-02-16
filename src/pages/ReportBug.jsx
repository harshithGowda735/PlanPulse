import React, { useState } from "react";
import { ArrowLeft, Bug, Send } from "lucide-react";

export default function ReportBug() {
  const [bugTitle, setBugTitle] = useState("");
  const [bugDescription, setBugDescription] = useState("");
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);

  // Handle submit
  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!bugTitle.trim() || !bugDescription.trim()) {
      alert("Please fill in both title and description");
      return;
    }

    // Here you would typically send the bug report to your backend/email service
    console.log({
      title: bugTitle,
      description: bugDescription,
      email: email,
      timestamp: new Date().toISOString()
    });

    // Show success message
    setSubmitted(true);

    // Reset form after 3 seconds
    setTimeout(() => {
      setBugTitle("");
      setBugDescription("");
      setEmail("");
      setSubmitted(false);
    }, 3000);
  };

  // Go back
  const goBack = () => {
    window.history.back();
  };

  return (
    <div className="min-h-screen bg-gray-800 p-3 sm:p-4 md:p-8">
      <div className="max-w-2xl mx-auto">
        {/* Header with Back Arrow */}
        <div className="mb-6 flex items-center gap-3">
          <button
            onClick={goBack}
            className="p-2 rounded-full bg-blue-200 hover:bg-blue-300 shadow transition flex-shrink-0"
          >
            <ArrowLeft size={20} className="text-gray-700 p-0 " />
          </button>
          <div className="flex items-center gap-2 flex-1 min-w-0">
            <Bug size={24} className="text-red-500 flex-shrink-0" />
            <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-50 truncate">
              Report a Bug
            </h1>
          </div>
        </div>

        {/* Success Message */}
        {submitted && (
          <div className="mb-4 p-3 bg-green-100 border-2 border-green-500 rounded-lg">
            <p className="text-green-700 font-semibold text-center text-sm sm:text-base">
              ✓ Thank you! Your bug report has been submitted successfully.
            </p>
          </div>
        )}

        {/* Bug Report Form */}
        <div className="bg-purple-100 rounded-xl shadow border p-4 sm:p-6">
          <p className="text-gray-800 mb-4 text-sm sm:text-base">
            Found a bug? Let us know and we'll fix it as soon as possible!
          </p>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Bug Title */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Bug Title <span className="text-red-600">*</span>
              </label>
              <input
                type="text"
                value={bugTitle}
                onChange={(e) => setBugTitle(e.target.value)}
                placeholder="e.g., App crashes when clicking submit"
                className="w-full border-2 p-2.5 sm:p-3 rounded-lg text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500"
                required
              />
            </div>

            {/* Bug Description */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Description <span className="text-red-500">*</span>
              </label>
              <textarea
                value={bugDescription}
                onChange={(e) => setBugDescription(e.target.value)}
                placeholder="Please describe the bug in detail. What happened? What were you trying to do?"
                rows="5"
                className="w-full border-2 p-2.5 sm:p-3 rounded-lg text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500 resize-none"
                required
              />
            </div>

            {/* Email (Optional) */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Email (Optional)
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="your.email@example.com"
                className="w-full border-2 p-2.5 sm:p-3 rounded-lg text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500"
              />
              <p className="text-xs text-gray-500 mt-1">
                We'll contact you if we need more information
              </p>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              className="w-full bg-red-500 text-white py-3 sm:py-4 rounded-xl font-semibold hover:bg-red-600 transition flex items-center justify-center gap-2 text-sm sm:text-base"
            >
              <Send size={18} />
              Submit Bug Report
            </button>
          </form>
        </div>

        {/* Additional Info */}
        <div className="mt-4 sm:mt-6 p-3 sm:p-4 bg-blue-100 border border-blue-200 rounded-xl">
          <p className="text-sm font-semibold text-blue-900 mb-2">
            Tips for a good bug report:
          </p>
          <ul className="text-xs sm:text-sm text-blue-700 space-y-1 ml-4">
            <li>• Be specific about what happened</li>
            <li>• Include steps to reproduce the bug</li>
            <li>• Mention which device/browser you're using</li>
            <li>• Add screenshots if possible</li>
          </ul>
        </div>
      </div>
    </div>
  );
}