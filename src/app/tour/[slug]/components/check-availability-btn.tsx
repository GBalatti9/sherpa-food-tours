"use client";

import BookNowButton from "@/ui/components/book-now";
import { useRef, useState } from "react";
import Calendar from "./calendar";


export default function CheckAvailabilityButton({ link, data_tour }: { link?: string; data_tour?: string }) {


    const svg = useRef<SVGSVGElement | null>(null);
    const [rotation, setRotation] = useState(0);
    const [open, setOpen] = useState(false);


    function handleClick() {
        const newRotation = rotation + 180;
        setRotation(newRotation);
        if (svg.current) {
            svg.current.style.transform = `rotate(${newRotation}deg)`;
        }
        setOpen(!open);
    }

    return (
        <div className="check-availaibity-component">
            <div className="availability-container">
                <button className="availability-btn" onClick={handleClick}>
                    Check availability
                    <svg xmlns="http://www.w3.org/2000/svg" width="21" height="21" viewBox="0 0 21 21" fill="none" ref={svg} style={{ transition: "transform 0.4s ease-in-out" }} >
                        <path d="M5.03125 13.1865L10.0313 8.18652L15.0313 13.1865" stroke="#017E80" strokeWidth="1.66667" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                </button>
                <BookNowButton
                    link={link ?? "https://fareharbor.com/embeds/book/sherpafoodtours_argentina/items/627977/?full-items=yes&flow=1385081"}
                    data_tour={data_tour ?? "627977"}
                />
            </div>
            <div className={`calendar-availability ${open ? "active" : "inactive"}`} >
                <Calendar />
            </div>
        </div>
    )
}