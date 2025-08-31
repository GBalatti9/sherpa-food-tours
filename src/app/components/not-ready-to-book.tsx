import { FormattedWpPost } from "@/types/post";
import Link from "next/link"

interface NotReadyToBookTitles {
    title: string;
    content: string;
    featured_media: number;
}


export default function NotReadyToBook({titles, posts}: {titles: NotReadyToBookTitles, posts: FormattedWpPost[]}) {;
    return (
        <section className="home-fifth-section not-ready-to-book">
            <div className="title-section">
                <h4>{titles.title}</h4>
                <div className="subtitle" dangerouslySetInnerHTML={{ __html: titles.content }}></div>
            </div>
            <div className="preview-wrapper">
                {posts.map((post) => {
                    return (
                        <Link className="preview-item" key={post.id} href={`${process.env.NEXT_PUBLIC_BASE_URL}/travel-guide/${post.city_slug}/${post.slug}`}>
                            <div className="preview-image-container">
                                <img src={post.image.img} alt={post.image.alt} loading="eager" />
                                <p className="preview-city">{post.city}</p>
                            </div>
                            <div className="preview-data">
                                <span className="preview-key">{post.key}</span>
                                <h3>{post.title.rendered}</h3>
                                <div className="preview-author">
                                    <span>Por:</span> {post.author_name.name}
                                </div>
                            </div>
                        </Link>
                    )
                })}
                <Link href="/travel-guide" className="preview-read-all">Read The Travel Guide</Link>
            </div>
        </section>
    )
}