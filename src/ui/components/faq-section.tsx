import React from "react";


export default function FaqSection({ faqs }: { faqs: { display_title: string, faqs: { question: string, answer: string }[] } }) {
    return (
            <div className="faq-accordion">
                <h5 className="faq-title">{faqs.display_title}</h5>
                <div className="faq-items">

                    {faqs.faqs.map((faq, i) => (
                        <React.Fragment key={i}>
                            <details className="faq-item">
                                <summary className="faq-question">
                                    <span>{faq.question}</span>
                                </summary>
                                <div className="faq-answer">
                                    <p>{faq.answer}</p>
                                </div>
                            </details>
                            <hr className="faq-separator" />
                        </React.Fragment>
                    ))}
                </div>
            </div>
    )
}