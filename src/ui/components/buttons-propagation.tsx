
"use client";

import AskForIt from "./ask-for-it";
import BookNowButton from "./book-now";

interface Props {
    is_private: boolean;
    link: string;
    isButton?: boolean;
}

export const ButtonsPropagations = ({ is_private, link, isButton = false }: Props) => {
    return (
        <div onClick={(e) => e.stopPropagation()}>
            {is_private
                ? (<AskForIt isButton={isButton} />)
                : (<BookNowButton link={link} />)}
        </div>
    );
};