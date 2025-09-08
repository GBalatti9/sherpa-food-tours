

export default function OurExperiencesSection({ title, content, src, alt }: { title: string, content: string, src: string, alt: string }) {
    console.log({content});
    
    return (
        <section className="our-experiences-section">
            <div className="our-experiences-section-first-part">
                <div className="title-section">
                    <h2>{title}</h2>
                </div>
                <div className="content-section" dangerouslySetInnerHTML={{ __html: content }}></div>
            </div>
            <div className="img-container">
                <img src={src} alt={alt} />
            </div>
            <div className="our-experiences-section-last-part">
                <button className="share-btn">Share</button>
                <hr />
                <button className="explore-btn">Explore</button>
            </div>
        </section>
    )

}