import React, { useState, useEffect } from "react";
import type { InputHTMLAttributes } from "react";
import { useNavigate } from "react-router-dom";
import {
    getAuth,
    createUserWithEmailAndPassword,
    updateProfile,
    GoogleAuthProvider,
    signInWithPopup,
} from "firebase/auth";
// FIX: Corrected import path to point to the project's root directory.
import app from "../../firebaseConfig";

// --- START: Placeholder Components ---
// The following components are placeholders to resolve the import errors.
// You should replace these with your actual Logo and FloatingLabelInput components.

interface FloatingLabelInputProps
    extends InputHTMLAttributes<HTMLInputElement> {
    label: string;
    id: string;
}

const FloatingLabelInput: React.FC<FloatingLabelInputProps> = ({
    label,
    id,
    ...props
}) => (
    <div className="relative">
        <input
            id={id}
            className="w-full px-3 py-2 text-black bg-white border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 peer"
            placeholder=" "
            {...props}
        />
        <label
            htmlFor={id}
            className="absolute text-sm text-gray-500 duration-300 transform -translate-y-4 scale-75 top-2 z-10 origin-[0] bg-white px-2 left-1 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-4"
        >
            {label}
        </label>
    </div>
);

interface LogoProps {
    className?: string;
    color?: string;
    href?: string;
}

const Logo: React.FC<LogoProps> = ({
    className,
    color = "#000",
    href = "/",
}) => (
    <div className={className}>
        <a href={href} className="text-2xl font-bold" style={{ color: color }}>
            Movli
        </a>
    </div>
);
// --- END: Placeholder Components ---

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

const SignUp = () => {
    const [fullName, setFullName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [passwordMatch, setPasswordMatch] = useState(true);
    const [error, setError] = useState("");
    const navigate = useNavigate();
    const auth = getAuth(app);

    useEffect(() => {
        if (password && confirmPassword) {
            setPasswordMatch(password === confirmPassword);
        } else {
            setPasswordMatch(true);
        }
    }, [password, confirmPassword]);

    const handleSubmit = async (event: React.FormEvent) => {
        event.preventDefault();
        setError("");

        if (!passwordMatch) {
            setError("Passwords do not match.");
            return;
        }

        try {
            const userCredential = await createUserWithEmailAndPassword(
                auth,
                email,
                password
            );
            await updateProfile(userCredential.user, {
                displayName: fullName,
            });

            console.log("Successfully created user:", userCredential.user);
            navigate("/user");
        } catch (err) {
            let errorMessage = "An unknown error occurred.";
            if (err instanceof Error) {
                errorMessage = err.message;
            }
            setError(errorMessage);
            console.error("Error creating user:", err);
        }
    };

    const handleGoogleSignUp = async () => {
        setError("");
        const provider = new GoogleAuthProvider();
        try {
            const result = await signInWithPopup(auth, provider);
            console.log("Successfully signed up with Google:", result.user);
            navigate("/user");
        } catch (error: any) {
            const errorMessage = error.message || "An unknown error occurred.";
            console.error("Error during Google sign-up:", error);
            setError(errorMessage);
        }
    };

    return (
        <>
            <Logo
                className="fixed top-4 left-4 right-0 z-30 "
                color="#90E0EF"
                href="/"
            />
            <div className="flex flex-row items-center h-screen w-screen bg-white">
                {/* Left section - Image */}
                <div className="hidden md:block w-1/2 h-screen">
                    <img
                        src="https://placehold.co/1000x1200/0077b6/white?text=Movli&font=rubik"
                        alt="Sign up background"
                        className="w-full h-full object-cover"
                    />
                </div>

                {/* Right section - Sign-up Form */}
                <div className="w-full md:w-1/2 mx-auto flex flex-col items-center justify-center px-8">
                    <div className="w-full max-w-sm">
                        {/* Title */}
                        <div className="text-center ">
                            <h1 className="mx-auto text-2xl text-black font-bold font-rubik ">
                                Create your Account
                            </h1>
                            <p className="text-gray-500 text-md mt-2 font-jakarta italic py-2 ">
                                Join Movli and find a Movie
                            </p>
                        </div>

                        {/* Sign-up Form */}
                        <form
                            onSubmit={handleSubmit}
                            className="flex flex-col gap-5"
                        >
                            <FloatingLabelInput
                                id="fullName"
                                label="Full Name"
                                type="text"
                                value={fullName}
                                onChange={(
                                    e: React.ChangeEvent<HTMLInputElement>
                                ) => setFullName(e.target.value)}
                                required
                            />
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
                            <FloatingLabelInput
                                id="confirmPassword"
                                label="Confirm Password"
                                type="password"
                                value={confirmPassword}
                                onChange={(
                                    e: React.ChangeEvent<HTMLInputElement>
                                ) => setConfirmPassword(e.target.value)}
                                required
                            />

                            {/* Password Match Indicator */}
                            {confirmPassword && (
                                <p
                                    className={`text-sm mt-[-10px] ${
                                        passwordMatch
                                            ? "text-green-600"
                                            : "text-red-600"
                                    }`}
                                >
                                    {passwordMatch
                                        ? "✔ Passwords match"
                                        : "✖ Passwords do not match"}
                                </p>
                            )}

                            {/* General Error Message */}
                            {error && (
                                <p className="text-sm text-red-600">{error}</p>
                            )}

                            <button
                                type="submit"
                                className="w-full py-3 mt-2 font-semibold text-white rounded-lg bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:cursor-default cursor-pointer transition-colors"
                                disabled={
                                    !passwordMatch ||
                                    !fullName ||
                                    !email ||
                                    !password ||
                                    !confirmPassword
                                }
                            >
                                Create Account
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

                        {/* Google Sign-up Button */}
                        <button
                            onClick={handleGoogleSignUp}
                            type="button"
                            className="w-full flex items-center justify-center py-3 font-semibold text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all cursor-pointer"
                        >
                            <GoogleIcon />
                            <span className="font-rubik font-medium">
                                Sign up with Google
                            </span>
                        </button>
                    </div>
                    <div className="w-full max-w-sm text-center py-2 mt-4">
                        <p className="text-gray-400 font-rubik font-bold">
                            Have an account?{" "}
                            <a href="/login">
                                <span className="font-rubik font-bold text-accent hover:text-secondary transition ease-in-out duration-200">
                                    Login
                                </span>
                            </a>
                        </p>
                    </div>
                </div>
            </div>
        </>
    );
};

export default SignUp;
