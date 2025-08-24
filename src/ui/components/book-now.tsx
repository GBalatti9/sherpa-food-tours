"use client";

export default function BookNowButton({ className }: { className?: string }) {

    function handleClick(){
        console.log("Click");
        
    }

    return (
        <button
            className="book-now-button"
            onClick={handleClick}
        >
            Book Now
        </button>
    );
}
