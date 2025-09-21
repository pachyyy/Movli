import Logo from "../components/Logo";
import { MdLocalMovies } from "react-icons/md";
import { PiNotePencilBold } from "react-icons/pi";
import { FaGear, FaMagnifyingGlass } from "react-icons/fa6";
import { LuLogOut } from "react-icons/lu";
import SidebarButton from "../components/SidebarButton";
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import app from "../../firebaseConfig";
import { getAuth, onAuthStateChanged, signOut } from "firebase/auth";
import type { User } from "firebase/auth";

const UserSidebar = ({}) => {
    const [user, setUser] = useState<User | null>(null);
    const [userFirstName, setUserFirstName] = useState<string | null>(null);
    const navigate = useNavigate();
    const auth = getAuth(app);

    // Effect to listen for authentication state changes
    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
            if (currentUser) {
                setUser(currentUser);
                // Get the first name from the displayName
                const firstName = currentUser.displayName?.split(" ")[0];
                setUserFirstName(firstName || "User");
            } else {
                // If no user is logged in, you might want to redirect
                navigate("/login");
            }
        });

        // Cleanup subscription on component unmount
        return () => unsubscribe();
    }, [auth, navigate]);

    // Handler for the logout button
    const handleLogout = async () => {
        try {
            await signOut(auth);
            console.log("User signed out successfully");
            navigate("/"); // Redirect to login page after logout
        } catch (error) {
            console.error("Error signing out: ", error);
        }
    };

    return (
        <>
            <div className="w-60 h-screen flex-shrink-0 bg-white border-1 border-gray-300 shadow-xl px-4 flex flex-col items-start justify-between py-4">
                {/* Top section wrapper */}
                <div className="flex flex-col gap-2 w-full">
                    <div>
                        <Logo />
                    </div>

                    {/* Watchlist Button */}
                    <SidebarButton
                        icon={<MdLocalMovies size={35} />}
                        text="Watchlist"
                        href="/user/watchlist"
                    />

                    {/* New Chat Button */}
                    <SidebarButton
                        icon={<PiNotePencilBold size={35} />}
                        text="New Chat"
                        href="/user/"
                    />

                    {/* Search Button */}
                    <SidebarButton
                        icon={<FaMagnifyingGlass size={30} />}
                        text="Search Movie"
                        href="/user/search"
                    />

                    {/* Recent Activity */}
                    <div>
                        <p className="text-gray-400 font-rubik font-bold text-xl px-4 mt-4">
                            Recent
                        </p>
                    </div>
                </div>

                {/* Bottom section wrapper */}
                <div className="flex flex-col gap-2 w-full">
                    {/* Settings Button */}
                    <SidebarButton
                        icon={<FaGear size={30} />}
                        text="Settings"
                        href="/user/settings"
                    />

                    {/* Log Out Button */}
                    <button
                        onClick={handleLogout}
                        className="w-full flex items-center gap-4 p-3 rounded-lg text-gray-700 hover:bg-red-100 hover:text-red-600 transition-colors duration-200 cursor-pointer"
                    >
                        <LuLogOut size={30} />
                        <span className="font-rubik font-bold text-xl">
                            Log Out
                        </span>
                    </button>
                </div>
            </div>

            {/* Profile */}
            {user && (
                <div className="fixed top-6 right-8 bg-white border border-gray-200 shadow-md px-5 py-3 rounded-full flex items-center justify-center z-10 text-primary">
                    <h3 className="font-semibold text-gray-800">
                        Hello, {userFirstName}
                    </h3>
                </div>
            )}
        </>
    );
};

export default UserSidebar;
