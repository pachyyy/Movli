import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Test from "./pages/test";
import NavBar from "./components/NavBar";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Watchlist from "./pages/Watchlist";
import UserDashboard from "./pages/UserDashboard";
import UserLayout from "./layout/UserLayout";
import Search from "./pages/SearchMovie";

const AppRoutes = () => {
    return (
        <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/test" element={<Test />} />
            <Route path="/nav" element={<NavBar />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />

            <Route path="/user" element={<UserLayout />}>
                <Route index element={<UserDashboard />} />
                <Route path="watchlist" element={<Watchlist />} />
                <Route path="search" element={<Search />} />
                {/* <Route path="settings" element={<Settings />} /> */}
            </Route>
            {/* Add all future routes here */}
        </Routes>
    );
};

export default AppRoutes;
