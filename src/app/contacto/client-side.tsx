
"use client";

export default function FormContact({content}: {content: string}) {
    return (
        <div className="form-contact" dangerouslySetInnerHTML={{__html: content}}>

        </div>
    )
}