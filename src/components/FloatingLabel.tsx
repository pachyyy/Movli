import React from "react";
import type { InputHTMLAttributes } from "react";

// Define an interface for the component's props.
// This extends the standard HTML input attributes to accept props like `value`, `onChange`, etc.
interface FloatingLabelInputProps
    extends InputHTMLAttributes<HTMLInputElement> {
    id: string;
    label: string;
}

const FloatingLabelInput: React.FC<FloatingLabelInputProps> = ({
    id,
    label,
    type = "text",
    ...props
}) => {
    return (
        <div className="relative">
            <input
                id={id}
                type={type}
                // The "peer" class is the key to the animation
                className="block w-full px-3 py-3 font-rubik font-semibold text-base text-gray-900 bg-transparent border border-gray-500 rounded-lg appearance-none focus:outline-none focus:ring-1 focus:border-secondary peer"
                placeholder=" " // The empty placeholder is crucial
                {...props} // Spread the rest of the props (like value, onChange, required)
            />
            <label
                htmlFor={id}
                // These classes define the label's two states (initial and floated)
                className="absolute text-gray-500 duration-300 transform -translate-y-4 scale-75 top-2 z-10 origin-[0] bg-white px-2 peer-focus:px-2 peer-focus:text-blue-600 peer-placeholder-shown:scale-100 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:top-1/2 peer-focus:top-2 peer-focus:scale-75 peer-focus:-translate-y-4 start-3"
            >
                {label}
            </label>
        </div>
    );
};

export default FloatingLabelInput;
