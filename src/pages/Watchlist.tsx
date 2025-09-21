import React, { useState, useEffect, useMemo } from "react";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import type { User } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import {
    getSavedMovies,
    deleteMovie,
    updateMovie,
    type SavedMovie,
} from "../services/apiService";
import app from "../../firebaseConfig"; // Adjust the path if your firebaseConfig is elsewhere

const Watchlist: React.FC = () => {
    const [movies, setMovies] = useState<SavedMovie[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [user, setUser] = useState<User | null>(null);
    const navigate = useNavigate();
    const auth = getAuth(app);

    // First, listen for the authentication state to get the current user
    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
            if (currentUser) {
                setUser(currentUser);
            } else {
                // If no user is logged in, redirect them to the login page
                navigate("/login");
            }
        });
        // Cleanup the listener when the component unmounts
        return () => unsubscribe();
    }, [auth, navigate]);

    // Fetch movies only after the user has been authenticated
    useEffect(() => {
        // Don't run if the user hasn't been identified yet
        if (!user) return;

        const fetchMovies = async () => {
            try {
                setIsLoading(true);
                setError(null);
                // The apiService needs to be updated to send the user's token
                const fetchedMovies = await getSavedMovies();
                setMovies(fetchedMovies);
            } catch (err) {
                setError(
                    "Failed to fetch your watchlist. Please try again later."
                );
                console.error(err);
            } finally {
                setIsLoading(false);
            }
        };

        fetchMovies();
    }, [user]); // This effect now depends on the user state

    // Handler to delete a movie from the watchlist
    const handleDeleteMovie = async (id: string) => {
        const originalMovies = [...movies];
        setMovies(movies.filter((movie) => movie.imdbID !== id));
        try {
            await deleteMovie(id);
        } catch (err) {
            setError("Failed to delete the movie. Please try again.");
            setMovies(originalMovies);
        }
    };

    // Handler to toggle the 'watched' status of a movie
    const handleToggleWatched = async (movieToUpdate: SavedMovie) => {
        const originalMovies = [...movies];
        setMovies(
            movies.map((m) =>
                m.imdbID === movieToUpdate.imdbID
                    ? { ...m, watched: !m.watched }
                    : m
            )
        );
        try {
            await updateMovie(movieToUpdate.imdbID, {
                watched: !movieToUpdate.watched,
            });
        } catch (err) {
            setError("Failed to update the movie status. Please try again.");
            setMovies(originalMovies);
        }
    };

    const sortedMovies = useMemo(() => {
        return [...movies].sort((a, b) => {
            if (a.watched === b.watched) return 0;
            return a.watched ? 1 : -1;
        });
    }, [movies]);

    if (isLoading || !user) {
        return (
            <div className="flex justify-center items-center text-center text-2xl mx-auto bg-white text-primary font-bold font-rubik w-full min-h-screen">
                Loading your watchlist...
            </div>
        );
    }

    return (
        <div className="p-4 md:p-8 bg-white min-h-screen w-full">
            <h1 className="text-4xl font-bold text-center mb-8 font-rubik text-primary">
                My Watchlist
            </h1>

            {error && (
                <p className="text-center text-red-500 bg-red-100 p-3 rounded-lg max-w-xl mx-auto mb-6">
                    {error}
                </p>
            )}

            {sortedMovies.length === 0 ? (
                <p className="text-center text-gray-500 text-lg">
                    Your watchlist is empty. Go to the search page to add some
                    movies!
                </p>
            ) : (
                <div className="overflow-x-auto mx-auto relative shadow-md sm:rounded-lg w-full">
                    <table className="w-full text-md text-left text-gray-500 font-rubik">
                        <thead className="text-xs text-primary uppercase bg-accent ">
                            <tr>
                                <th scope="col" className="py-3 px-6 w-24">
                                    Poster
                                </th>
                                <th scope="col" className="py-3 px-6">
                                    Title
                                </th>
                                <th scope="col" className="py-3 px-6">
                                    Year
                                </th>
                                <th
                                    scope="col"
                                    className="py-3 px-6 text-center"
                                >
                                    Watched
                                </th>
                                <th
                                    scope="col"
                                    className="py-3 px-6 text-center"
                                >
                                    Actions
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            {sortedMovies.map((movie) => (
                                <tr
                                    key={movie.imdbID}
                                    className={`bg-white shadow-lg border-b hover:bg-gray-50 transition-colors duration-200 ${
                                        movie.watched
                                            ? "opacity-60 bg-gray-50"
                                            : ""
                                    }`}
                                >
                                    <td className="py-4 px-6">
                                        <img
                                            src={
                                                movie.Poster &&
                                                movie.Poster !== "N/A"
                                                    ? movie.Poster
                                                    : "https://placehold.co/50x75/1a202c/ffffff?text=N/A"
                                            }
                                            alt={`Poster for ${movie.Title}`}
                                            className="w-12 h-18 object-cover rounded"
                                        />
                                    </td>
                                    <td className="py-4 px-6 font-medium text-primary">
                                        {movie.Title}
                                    </td>
                                    <td className="py-4 px-6">{movie.Year}</td>
                                    <td className="py-4 px-6 text-center">
                                        <input
                                            type="checkbox"
                                            checked={!!movie.watched}
                                            onChange={() =>
                                                handleToggleWatched(movie)
                                            }
                                            className="w-5 h-5 text-blue-600 bg-gray-100 rounded border-gray-300 focus:ring-blue-500 cursor-pointer"
                                            title={
                                                movie.watched
                                                    ? "Mark as unwatched"
                                                    : "Mark as watched"
                                            }
                                        />
                                    </td>
                                    <td className="py-4 px-6 text-center">
                                        <button
                                            onClick={() =>
                                                handleDeleteMovie(movie.imdbID)
                                            }
                                            className="font-medium text-red-600 hover:underline"
                                            title={`Delete ${movie.Title}`}
                                        >
                                            Delete
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
};

export default Watchlist;
