import { Dot, Star } from "lucide-react";
import "./css/comment.css"

interface Comment {
    stars: number;
    title: string;
    content: string;
    author: string;
    date: string;
}

export default function CommentElement({ comment }: { comment: Comment }) {
    return (
        <div className="comment-container">
            <div className="stars-container">
                {Array.from({ length: comment.stars }).map((_, i) => (
                    <Star key={i} fill="[#E7B53F]" />
                ))}
            </div>
            <div className="data-section">
                <h4>{comment.title}</h4>
                <p>{comment.content}</p>
            </div>
            <div className="author-section">
                <p>{comment.author}</p>
                <div className="date-element">
                    <Dot />
                    <p>{comment.date}</p>
                </div>
            </div>
        </div>
    )
}