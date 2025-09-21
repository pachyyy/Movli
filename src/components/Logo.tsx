import { MdCamera } from "react-icons/md";

/**
 * A reusable logo component for the Movli application.
 * @param {object} props - The component props.
 * @param {string} [props.href='/'] - The navigation path for the link.
 * @param {string} [props.color='#03045E'] - The color for the icon and text.
 * @param {number} [props.iconSize=45] - The size of the camera icon.
 * @param {string} [props.className=''] - Additional class names for the container.
 * @returns {React.ReactElement} The rendered logo component.
 */
const Logo = ({
    href = "/",
    color = "#03045E",
    iconSize = 45,
    className = "",
}) => {
    return (
        // The main link element, using the href prop
        <a href={href} className={`inline-block ${className}`}>
            <div className="flex items-center gap-3 p-2">
                {/* The icon's color and size are now controlled by props */}
                <MdCamera color={color} size={iconSize} />

                {/* The text color is set using an inline style to apply the dynamic color prop */}
                <h1
                    className="font-rubik font-bold text-2xl" // Base styles
                    style={{ color: color }} // Dynamic color style
                >
                    Movli
                </h1>
            </div>
        </a>
    );
};

export default Logo;
