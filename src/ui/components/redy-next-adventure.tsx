import "./css/next-adventure.css"

import BookNowButton from "./book-now";



export default function NextAdventure(){
    return (
        <div className="ready-next-adventure">
            <h6 className="title">Ready for your <br /> next adventure?</h6>
            <BookNowButton link="https://fareharbor.com/embeds/book/sherpafoodtours_argentina/?flow=1413860&ga4t=G-KJV962ZQ3V,1083513053.1749557566__1758810037;AW-16551382136,undefined__undefined;&language=en-us&full-items=yes&back=https://www.sherpafoodtours.com/&g4=yes" />
        </div>
    )
}