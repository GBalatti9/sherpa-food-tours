
"use client";

import AskForIt from "./ask-for-it";
import BookNowButton from "./book-now";

interface Props {
    is_private: boolean;
    link: string;
}

export const ButtonsPropagations = ({ is_private, link }: Props) => {
    return (
        <div onClick={(e) => e.stopPropagation()}>
            {is_private
                ? (<AskForIt />)
                : (<BookNowButton link={link} />)}
        </div>
    );
};