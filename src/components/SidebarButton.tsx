const SidebarButton = ({ icon, text, href }) => {
    return (
        <a
            href={href}
            className="flex justify-start items-center gap-2 py-2 px-4 rounded-full cursor-pointer transition ease-in-out duration-200 text-primary hover:bg-gray-200"
        >
            <div className="text-primary">{icon}</div>
            <p className="font-rubik font-semibold text-lg text-primary">
                {text}
            </p>
        </a>
    );
};

export default SidebarButton;
