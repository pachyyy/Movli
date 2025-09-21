// src/pages/UserDashboard.tsx

import React from "react";
import Chatbot from "../components/Chatbot"; // Adjust the import path if needed

const UserDashboard: React.FC = () => {
    return (
        <div className="container mx-auto p-4 md:p-6 text-white min-h-screen w-full bg-white">
            <h1 className="text-3xl font-bold mb-2 text-primary">Movli AI</h1>
            <p className="text-gray-400 mb-6">
                Welcome! Ask our AI anything about movies, actors, or just have
                a chat.
            </p>

            {/* Render the Chatbot Component */}
            <div className="flex justify-center ">
                <Chatbot />
            </div>

            {/* You can add other dashboard components here if you wish */}
        </div>
    );
};

export default UserDashboard;
