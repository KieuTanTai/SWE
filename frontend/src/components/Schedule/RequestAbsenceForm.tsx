"use client";

import React, { useState } from "react";
import { Calendar } from "lucide-react";
import ContentCard from "../ContentCard";

const RequestAbsenceForm: React.FC = () => {
  const [selectedDate, setSelectedDate] = useState("");
  const [reason, setReason] = useState("");

  const handleSubmit = () => {
    console.log("Date:", selectedDate, "Reason:", reason);
    alert("Absence request submitted!");
  };

  return (
    <ContentCard title="Request Absence">
      <p className="text-gray-600 text-sm mb-6">
        Notify the school if your child will be absent
      </p>

      <div className="space-y-4">
        {/* Date Picker */}
        <div>
          <label className="block text-sm font-semibold text-gray-900 mb-2">Date</label>
          <div className="relative">
            <input
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="w-full px-4 py-3 pr-10 bg-gray-50 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900"
            />
          </div>
        </div>

        {/* Reason Input */}
        <div>
          <label className="block text-sm font-semibold text-gray-900 mb-2">
            Reason (Optional)
          </label>
          <textarea
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            placeholder="Enter reason for absence..."
            rows={4}
            className="w-full px-4 py-3 bg-gray-50 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none text-gray-900 placeholder-gray-400"
          />
        </div>

        {/* Submit Button */}
        <button
          onClick={handleSubmit}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-4 rounded-lg transition-colors shadow-md hover:shadow-lg"
        >
          Submit Request
        </button>
      </div>
    </ContentCard>
  );
};

export default RequestAbsenceForm;
