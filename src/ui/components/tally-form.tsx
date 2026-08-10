'use client'

import { useEffect, useState } from 'react'

export default function TallyForm() {
    const [src, setSrc] = useState('')

    useEffect(() => {
        // Pasar el pathname actual a Tally como hidden field 'from',
        // sin modificar la URL del navegador
        const from = encodeURIComponent(window.location.pathname)

        const tallyUrl = `https://tally.so/embed/dWEerD?hideTitle=1&transparentBackground=1&dynamicHeight=1&from=${from}`
        setSrc(tallyUrl)

        // Esperar un momento para que React actualice el DOM antes de cargar el script
        setTimeout(() => {
            const script = document.createElement('script')
            script.src = 'https://tally.so/widgets/embed.js'
            script.async = true
            document.body.appendChild(script)
        }, 100)

        return () => {
            // Limpiar el script al desmontar
            const scripts = document.querySelectorAll('script[src="https://tally.so/widgets/embed.js"]')
            scripts.forEach(script => script.remove())
        }
    }, [])

    if (!src) return null

    return (
        <iframe
            data-tally-src={src}
            loading="lazy"
            width="100%"
            frameBorder="0"
            title="Formulario"
        />
    )
}