# Integración Tally Form + Form Contact

## 📋 Descripción

Esta integración permite que cuando un usuario envía el formulario de Tally, los datos también se guarden automáticamente en nuestro sistema (Google Sheets + Email) como respaldo de seguridad.

## 🔧 Cómo Funciona

1. **Form Contact** (`form-contact.tsx`): Envía directamente a `/api/send-email`
2. **Tally Form** (`tally-form.tsx`): 
   - Escucha eventos `postMessage` de Tally cuando se envía el formulario
   - Extrae los datos del payload de Tally
   - También envía a `/api/send-email` en segundo plano

## ✅ Verificación

### 1. Verificar en la Consola del Navegador

Cuando se envía un formulario de Tally, deberías ver estos mensajes en la consola:

```
📝 Formulario Tally enviado, guardando también en nuestro sistema...
📤 Enviando datos a nuestro sistema: { email: "...", name: "...", hasMessage: true }
✅ Formulario también guardado exitosamente en nuestro sistema (Google Sheets + Email)
```

### 2. Verificar en Google Sheets

- Abre tu Google Sheet configurado
- Deberías ver una nueva fila con los datos del formulario
- Debería aparecer tanto cuando se envía desde `form-contact` como desde `tally-form`

### 3. Verificar Email

- Deberías recibir un email de notificación cada vez que se envía un formulario
- Esto funciona tanto para `form-contact` como para `tally-form`

## 🐛 Troubleshooting

### Si no ves los mensajes en la consola:

1. **Verifica que Tally esté emitiendo eventos:**
   - Abre DevTools → Console
   - Envía un formulario de Tally
   - Deberías ver mensajes de Tally

2. **Verifica el origen del mensaje:**
   - Los mensajes deben venir de `https://tally.so`
   - Si Tally cambia su dominio, actualiza la verificación en `tally-form.tsx`

3. **Verifica el formato de los datos:**
   - Los datos de Tally pueden variar según la configuración del formulario
   - Revisa la consola para ver el payload completo si hay problemas

### Si los datos no se mapean correctamente:

El mapeo intenta encontrar los campos con estos nombres posibles:

- **Nombre**: `name`, `firstName`, `first_name`, `nombre`, `fname`
- **Apellido**: `lastName`, `last_name`, `surname`, `apellido`, `lname`
- **Email**: `email`, `e-mail`, `mail`, `correo`
- **Teléfono**: `phone`, `telephone`, `tel`, `phoneNumber`, `telefono`
- **Mensaje**: `message`, `msg`, `comments`, `comment`, `mensaje`, `text`

Si tu formulario de Tally usa nombres diferentes, puedes:
1. Actualizar la función `mapTallyDataToFormData` en `tally-form.tsx`
2. O renombrar los campos en Tally para que coincidan

### Alternativa: Webhook de Tally

Si los eventos `postMessage` no funcionan correctamente, puedes configurar un webhook en Tally:

1. Ve a la configuración de tu formulario en Tally
2. Configura un webhook que apunte a: `https://tu-dominio.com/api/send-email`
3. Configura el método POST y el formato JSON
4. Mapea los campos de Tally a los campos esperados por la API

## 📝 Estructura de Datos Esperada

La API `/api/send-email` espera:

```json
{
  "name": "string",
  "lastName": "string",
  "email": "string",
  "phone": "string",
  "message": "string",
  "sourceUrl": "string (opcional)"
}
```

## 🔒 Seguridad

- Los datos se validan en el servidor antes de guardar
- Solo se aceptan mensajes de `https://tally.so`
- Los errores se loguean pero no se exponen al cliente

## 📊 Logs

En desarrollo, verás logs detallados en la consola. En producción, los errores se loguean en el servidor.

## 🚀 Próximos Pasos

Si necesitas más robustez, considera:
1. Configurar webhook de Tally como respaldo
2. Agregar retry logic si falla el envío
3. Agregar notificaciones si hay errores persistentes
