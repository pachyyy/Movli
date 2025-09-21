import React, { useState, useEffect } from "react";
import axios from "axios";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import type { User } from "firebase/auth";
import { saveMovie, type Movie } from "../services/apiService";
import app from "../../firebaseConfig"; // Assuming firebase config is at the root

// --- Reusable Movie Card Component ---
interface MovieCardProps {
    movie: Movie;
    user: User | null; // Pass the user state to the card
}

const MovieCard: React.FC<MovieCardProps> = ({ movie, user }) => {
    const handleSaveMovie = async () => {
        if (!user) {
            alert("You must be logged in to save a movie.");
            return;
        }
        if (!movie.poster_path) {
            alert("Cannot save an item with no poster.");
            return;
        }
        try {
            const saved = await saveMovie(movie);
            console.log("Movie saved successfully!", saved);
            alert(`'${movie.title}' was saved to your list!`);
        } catch (error: any) {
            console.error("Failed to save movie:", error);
            // Provide more specific feedback if the movie is a duplicate
            const errorMessage =
                error.response?.status === 409
                    ? "This movie is already in your list."
                    : "Could not save the movie. Please try again.";
            alert(errorMessage);
        }
    };

    const posterBaseUrl = "https://image.tmdb.org/t/p/w500";

    return (
        <div className="w-full">
            <div className="rounded-lg shadow-lg overflow-hidden transform transition-transform duration-300 bg-white">
                <img
                    src={
                        movie.poster_path
                            ? `${posterBaseUrl}${movie.poster_path}`
                            : "https://placehold.co/500x750/1a202c/ffffff?text=No+Image"
                    }
                    alt={`Poster for ${movie.title}`}
                    className="w-full h-90 object-cover"
                />
                <div className="p-4">
                    <h3
                        className="font-bold text-lg truncate text-black"
                        title={movie.title}
                    >
                        {movie.title}
                    </h3>
                    <p className="text-gray-500">
                        {movie.release_date
                            ? movie.release_date.substring(0, 4)
                            : "N/A"}
                    </p>
                    {/* Only show the save button if a user is logged in */}
                    {user && (
                        <button
                            onClick={handleSaveMovie}
                            className="mt-4 w-full bg-primary text-white py-2 rounded-lg hover:bg-secondary font-rubik cursor-pointer transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-blue-500 text-md"
                        >
                            Save to List
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
};

// --- Main Search Page Component ---
const SearchMovie: React.FC = () => {
    const [query, setQuery] = useState("");
    const [movies, setMovies] = useState<Movie[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [user, setUser] = useState<User | null>(null);
    const auth = getAuth(app);

    // Listen for auth state changes to determine if a user is logged in
    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
            setUser(currentUser);
        });
        // Cleanup listener on component unmount
        return () => unsubscribe();
    }, [auth]);

    // IMPORTANT: Replace this with your actual TMDB API key
    const TMDB_API_KEY = "a86a31aa9b577dc4a98500da1cd5afbc";

    const handleSearch = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!query) {
            setError("Please enter a movie title to search.");
            return;
        }

        setIsLoading(true);
        setError(null);
        setMovies([]);

        try {
            const url = `https://api.themoviedb.org/3/search/movie?api_key=${TMDB_API_KEY}&query=${encodeURIComponent(
                query
            )}`;
            const response = await axios.get(url);

            if (response.data && response.data.results) {
                if (response.data.results.length === 0) {
                    setError("No movies found for your query.");
                } else {
                    setMovies(response.data.results);
                }
            } else {
                setError("No movies found.");
            }
        } catch (err) {
            console.error("Error fetching from TMDB:", err);
            setError(
                "Failed to fetch movies. Please check the console for details."
            );
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="container mx-auto p-4 md:p-8 bg-gray-50 h-screen w-screen overflow-y-auto">
            <h1 className="text-4xl font-bold text-center mb-8 text-primary">
                Find Movies
            </h1>
            <form
                onSubmit={handleSearch}
                className="max-w-xl mx-auto mb-8 flex gap-3"
            >
                <input
                    type="text"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder="Search your next favorite movies..."
                    className="text-black flex-grow p-3 border border-gray-300 font-rubik font-medium rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <button
                    type="submit"
                    disabled={isLoading}
                    className="bg-primary text-white px-6 py-3 rounded-lg hover:bg-secondary transition-colors duration-200 font-rubik cursor-pointer disabled:bg-gray-400"
                >
                    {isLoading ? "Searching..." : "Search"}
                </button>
            </form>

            {error && (
                <p className="text-center text-red-500 bg-red-100 p-3 rounded-lg max-w-xl mx-auto">
                    {error}
                </p>
            )}

            {movies.length > 0 && (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
                    {movies.map((movie) => (
                        <MovieCard key={movie.id} movie={movie} user={user} />
                    ))}
                </div>
            )}
        </div>
    );
};

export default SearchMovie;
