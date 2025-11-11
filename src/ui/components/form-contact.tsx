
"use client";

import { useState } from "react";
// import "./css/form-contact.css";

export const FormContact = () => {
    const [formData, setFormData] = useState({
        name: '',
        lastName: '',
        email: '',
        phone: '',
        message: ''
    });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        setSubmitStatus('idle');

        try {
            // Obtener la URL actual automáticamente
            const currentUrl = typeof window !== 'undefined' ? window.location.href : '';
            
            const response = await fetch('/api/send-email', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    ...formData,
                    sourceUrl: currentUrl // Agregar la URL de origen
                }),
            });

            if (response.ok) {
                setSubmitStatus('success');
                setFormData({
                    name: '',
                    lastName: '',
                    email: '',
                    phone: '',
                    message: ''
                });
            } else {
                setSubmitStatus('error');
            }
        } catch (error) {
            console.error('Error enviando formulario:', error);
            setSubmitStatus('error');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <form className="form-contact" id="askForIt" onSubmit={handleSubmit}>
            <div className="input-group">
                <input 
                    type="text" 
                    id="name" 
                    name="name" 
                    value={formData.name}
                    onChange={handleChange}
                    required 
                    placeholder="Name" 
                />
                <input 
                    type="text" 
                    id="lastName" 
                    name="lastName" 
                    value={formData.lastName}
                    onChange={handleChange}
                    required 
                    placeholder="LastName" 
                />
            </div>
            <div className="input-group">
                <input 
                    type="email" 
                    id="email" 
                    name="email" 
                    value={formData.email}
                    onChange={handleChange}
                    required 
                    placeholder="Email" 
                />
                <input 
                    type="tel" 
                    id="phone" 
                    name="phone" 
                    value={formData.phone}
                    onChange={handleChange}
                    required 
                    placeholder="Phone Number" 
                />
            </div>
            <textarea 
                id="message" 
                name="message" 
                rows={4} 
                value={formData.message}
                onChange={handleChange}
                required 
                placeholder="Write your message"
            ></textarea>
            
            {submitStatus === 'success' && (
                <div className="success-message">
                    ¡Mensaje enviado correctamente! Te contactaremos pronto.
                </div>
            )}
            
            {submitStatus === 'error' && (
                <div className="error-message">
                    Hubo un error al enviar el mensaje. Por favor, inténtalo de nuevo.
                </div>
            )}
            
            <button 
                type="submit" 
                className="submit-button" 
                disabled={isSubmitting}
            >
                {isSubmitting ? 'Enviando...' : 'Submit'}
            </button>
        </form>
    );
};