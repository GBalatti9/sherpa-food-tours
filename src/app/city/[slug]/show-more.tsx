"use client";

import CommentElement from "@/ui/components/comment";
import { useState } from "react";

interface Comment {
    stars: number;
    title: string;
    content: string;
    author: string;
    date: string;
}


export default function ShowMoreBtn({ comments }: { comments: Comment[] }) {
    const [showMore, setShowMore] = useState(false);

    return (
        <>
            {(comments.length > 3 && !showMore) &&
                <button className="show-more-comments" onClick={() => setShowMore(true)}>Show more</button>
            }
            {showMore && (
                <div className="city-comments-section" style={{paddingBottom: "2rem"}}>
                    <div className="city-comments-container">
                        {comments.slice(3).map((comment, i) => (
                            <CommentElement key={i} comment={comment} />
                        ))}
                    </div>
                </div>
            )}
        </>
    )
}