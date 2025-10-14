"use client";

import { useState } from "react";

export default function TruncateP({ text, maxLength }: { text: string; maxLength: number }) {
    const [isExpanded, setIsExpanded] = useState(false);
    
    const shouldTruncate = text.length > maxLength;
    const displayText = isExpanded || !shouldTruncate ? text : text.slice(0, maxLength);
    
    return (
        <div>
            <p>
                {displayText}
                {shouldTruncate && !isExpanded && "..."}
            </p>
            {shouldTruncate && (
                <button 
                    onClick={() => setIsExpanded(!isExpanded)}
                    style={{
                        background: 'none',
                        border: 'none',
                        color: '#007bff',
                        cursor: 'pointer',
                        textDecoration: 'underline',
                        fontSize: 'inherit'
                    }}
                >
                    {isExpanded ? 'Ver menos' : 'Ver más'}
                </button>
            )}
        </div>
    );
}