"use client";

export default function BookNowButton() {

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
