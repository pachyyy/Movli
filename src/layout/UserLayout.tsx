// in /layout/UserLayout.js
import { Outlet } from "react-router-dom";
import UserSidebar from "../components/UserSidebar";

const UserLayout = () => {
    return (
        <div className="flex min-h-screen w-screen">
            {/* You can add a shared navbar, sidebar, or header here */}
            <UserSidebar />

            <main className="flex-grow overflow-auto">
                {/* This is the crucial part 👇 */}
                {/* React Router will render the child routes here */}
                <Outlet />
            </main>

            {/* You could also add a shared footer */}
        </div>
    );
};

export default UserLayout;
