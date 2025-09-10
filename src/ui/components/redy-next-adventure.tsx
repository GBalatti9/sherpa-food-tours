import "./css/next-adventure.css"

import BookNowButton from "./book-now";



export default function NextAdventure(){
    return (
        <div className="ready-next-adventure">
            <h6 className="title">Ready for your <br /> next adventure?</h6>
            <BookNowButton />
        </div>
    )
}