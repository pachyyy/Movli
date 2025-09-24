import React, { useState } from "react";
import { useNavigate } from "react-router-dom"; // For redirection
import {
    getAuth,
    signInWithEmailAndPassword, // Added for email login
    signInWithPopup,
    GoogleAuthProvider,
} from "firebase/auth";
import app from "../../firebaseConfig"; // Make sure this path points to your Firebase initialization
import FloatingLabelInput from "../components/FloatingLabel"; // Adjusted path for clarity
import Logo from "../components/Logo";
import leftImage from "../assets/login-left.svg";

// A simple SVG component for the Google icon
const GoogleIcon = () => (
    <svg className="w-5 h-5 mr-3" viewBox="0 0 48 48">
        <path
            fill="#FFC107"
            d="M43.611,20.083H42V20H24v8h11.303c-1.649,4.657-6.08,8-11.303,8c-6.627,0-12-5.373-12-12s5.373-12,12-12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C12.955,4,4,12.955,4,24s8.955,20,20,20s20-8.955,20-20C44,22.659,43.862,21.35,43.611,20.083z"
        ></path>
        <path
            fill="#FF3D00"
            d="M6.306,14.691l6.571,4.819C14.655,15.108,18.961,12,24,12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C16.318,4,9.656,8.337,6.306,14.691z"
        ></path>
        <path
            fill="#4CAF50"
            d="M24,44c5.166,0,9.86-1.977,13.409-5.192l-6.19-5.238C29.211,35.091,26.715,36,24,36c-5.202,0-9.619-3.317-11.283-7.946l-6.522,5.025C9.505,39.556,16.227,44,24,44z"
        ></path>
        <path
            fill="#1976D2"
            d="M43.611,20.083H42V20H24v8h11.303c-0.792,2.237-2.231,4.166-4.087,5.571l6.19,5.238C43.021,36.251,44,34,44,24C44,22.659,43.862,21.35,43.611,20.083z"
        ></path>
    </svg>
);

const Login = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const navigate = useNavigate();
    const auth = getAuth(app);
    const googleProvider = new GoogleAuthProvider();

    // --- Email & Password Login Handler ---
    const handleSubmit = async (event: React.FormEvent) => {
        event.preventDefault();
        setLoading(true);
        setError("");
        try {
            await signInWithEmailAndPassword(auth, email, password);
            navigate("/user"); // Redirect to watchlist on successful login
        } catch (error: any) {
            console.error("Failed to sign in:", error);
            setError(
                "Failed to sign in. Please check your email and password."
            );
        }
        setLoading(false);
    };

    // --- Google Sign-in Handler ---
    const handleGoogleSignIn = async () => {
        setLoading(true);
        setError("");
        try {
            await signInWithPopup(auth, googleProvider);
            navigate("/user"); // Redirect to watchlist on successful login
        } catch (error: any) {
            console.error("Error during Google sign-in:", error);
            setError("Failed to sign in with Google. Please try again.");
        }
        setLoading(false);
    };

    return (
        <>
            <Logo
                className="fixed top-0 left-0 right-0 z-30 "
                color="#90E0EF"
                href="/"
            />
            <div className="flex flex-row items-center h-screen w-screen bg-white">
                {/* left section */}
                <div>
                    <img
                        src={leftImage}
                        alt="A person sitting on a couch watching a movie"
                        className="h-screen object-contain"
                        title="Image by Denise Jans from Unsplash"
                        // https://unsplash.com/photos/photography-of-camera-reel-film-9lTUAlNB87M
                    />
                </div>
                {/* right section - login */}
                <div className="mx-auto flex flex-col items-center justify-center gap-3">
                    {/* Title */}
                    <div className="text-center">
                        <h1 className="text-black font-rubik font-bold text-3xl">
                            Welcome to Movli
                        </h1>
                        <p className="text-gray-400 text-md italic font-jakarta">
                            Find a movie you like using our built in AI
                        </p>
                    </div>

                    {/* Error Message */}
                    {error && (
                        <div className="w-full bg-red-100 text-red-700 p-3 rounded-lg text-center">
                            {error}
                        </div>
                    )}

                    {/* Login Form */}
                    <div className="w-full text-center">
                        <form
                            onSubmit={handleSubmit}
                            className="flex flex-col gap-5"
                        >
                            <FloatingLabelInput
                                id="email"
                                label="Email address"
                                type="email"
                                value={email}
                                onChange={(
                                    e: React.ChangeEvent<HTMLInputElement>
                                ) => setEmail(e.target.value)}
                                required
                            />
                            <FloatingLabelInput
                                id="password"
                                label="Password"
                                type="password"
                                value={password}
                                onChange={(
                                    e: React.ChangeEvent<HTMLInputElement>
                                ) => setPassword(e.target.value)}
                                required
                            />

                            <button
                                type="submit"
                                className="w-full py-3 mt-6 font-semibold text-white rounded-full bg-secondary hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:cursor-default cursor-pointer disabled:bg-gray-400"
                                disabled={!email || !password || loading}
                            >
                                {loading ? "Logging In..." : "Log In"}
                            </button>
                        </form>

                        {/* Divider */}
                        <div className="flex items-center my-6">
                            <div className="flex-grow border-t border-gray-300"></div>
                            <span className="mx-4 text-sm font-semibold text-gray-400">
                                OR
                            </span>
                            <div className="flex-grow border-t border-gray-300"></div>
                        </div>

                        {/* Google Sign-in Button */}
                        <button
                            onClick={handleGoogleSignIn}
                            type="button"
                            disabled={loading}
                            className="w-full flex items-center justify-center py-3 font-semibold text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all cursor-pointer disabled:opacity-50"
                        >
                            <GoogleIcon />
                            <p className="text-black font-rubik font-medium">
                                Sign in with Google
                            </p>
                        </button>
                    </div>
                    <div className="w-full text-center">
                        <p className="text-gray-400 font-rubik font-bold">
                            Don't have an account?{" "}
                            <a href="/signup">
                                <span className="font-rubik font-bold text-accent hover:text-secondary transition ease-in-out duration-200">
                                    Sign Up
                                </span>
                            </a>
                        </p>
                    </div>
                </div>
            </div>
        </>
    );
};

export default Login;
