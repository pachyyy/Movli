import Logo from "../components/Logo";

const NavBar = () => {
    return (
        <>
            <nav className="flex w-full align-items-center mx-auto justify-between py-2 px-4 fixed top-0 left-0 right-0 z-30 bg-[#90E0EF]">
                {/* Logo */}
                <Logo
                    color="#03045E"
                    iconSize={45}
                    href="/"
                    className="text-primary"
                />

                {/* Login n Signup Button */}
                <div className="flex gap-3 items-center">
                    <a
                        href="/login"
                        className="flex items-center bg-accent px-2 text-xl"
                    >
                        <p className="text-primary font-rubik hover:text-secondary transition ease-in-out duration-200">
                            Login
                        </p>
                    </a>
                    <a
                        href="/signup"
                        className="flex items-center bg-primary px-6 py-2 rounded-md hover:bg-secondary transition ease-in-out duration-200"
                    >
                        <p className="text-accent text-xl font-medium hover:text-light ">
                            Sign Up
                        </p>
                    </a>
                </div>
            </nav>
        </>
    );
};

export default NavBar;
