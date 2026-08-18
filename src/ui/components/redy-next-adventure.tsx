// import "./css/next-adventure.css"

import BookNowButton from "./book-now";



export default function NextAdventure(){
    return (
        <div className="ready-next-adventure">
            <h6 className="title">Ready for your <br /> next adventure?</h6>
            {/* Sin link: BookNowButton usa su URL por defecto, que era idéntica a la que
                estaba duplicada acá. Una sola definición, un solo lugar donde corregirla. */}
            <BookNowButton />
        </div>
    )
}