/**
 * Función compartida para enviar datos del formulario a la API
 * Se usa tanto en form-contact.tsx como en tally-form.tsx
 */

export interface FormData {
    name: string;
    lastName: string;
    email: string;
    phone: string;
    message: string;
    sourceUrl?: string;
}

export async function submitFormToAPI(formData: FormData): Promise<{ success: boolean; error?: string }> {
    try {
        const currentUrl = typeof window !== 'undefined' ? window.location.href : '';
        
        const response = await fetch('/api/send-email', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                ...formData,
                sourceUrl: formData.sourceUrl || currentUrl
            }),
        });

        if (response.ok) {
            return { success: true };
        } else {
            const errorData = await response.json().catch(() => ({}));
            return { 
                success: false, 
                error: errorData.error || 'Error al enviar el formulario' 
            };
        }
    } catch (error) {
        console.error('Error enviando formulario:', error);
        return { 
            success: false, 
            error: error instanceof Error ? error.message : 'Error desconocido' 
        };
    }
}
