"use client";

import clsx from "clsx";

export default function BookNowButton({ className }: { className?: string }) {

    function handleClick(){
        console.log("Click");
        
    }

    return (
        <button
            className={clsx(
                "bg-[#E84F1A] rounded py-1 px-4 sm:py-2 sm:px-6 text-white cursor-pointer hover:bg-[#cf4516] focus:outline-none focus-visible:ring-2 focus-visible:ring-white text-sm lg:text-base transition-all duration-300",
                className
            )}
            onClick={handleClick}
        >
            Book Now
        </button>
    );
}
