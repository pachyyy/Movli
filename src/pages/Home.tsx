import NavBar from "../components/NavBar";
import example from "../src/assets/code.svg";

const Home = () => {
    return (
        <>
            <NavBar />
            <div className="flex flex-row items-center justify-center min-h-screen w-screen bg-white pt-20">
                {/* Left Section */}
                <div className="w-[55%] text-center mx-auto flex flex-col items-center gap-3">
                    <h1 className="text-5xl font-bold mb-4 text-[#03045E]">
                        Discover your next cinematic gem with Movli
                    </h1>
                    <p className="text-xl text-center max-w-2xl text-[#03045E]">
                        A personalized movie suggestion platform that curates
                        films based on your preferences and lets you save them
                        to your very own watchlist
                    </p>
                    <a
                        href="/signup"
                        className="bg-primary px-6 py-3 rounded-md hover:bg-secondary transition ease-in-out duration-200"
                    >
                        <p className="text-light">Start for Free</p>
                    </a>
                </div>
                {/* Right Section */}
                <div>
                    <img
                        src={example}
                        alt="Movie Night"
                        className="w-[45rem] object-contain"
                    />
                </div>
            </div>
        </>
    );
};

export default Home;
