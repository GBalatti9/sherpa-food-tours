# Configuración de Google Sheets para Formulario de Contacto

## Paso 1: Crear un Google Cloud Project y Service Account

1. Ve a [Google Cloud Console](https://console.cloud.google.com/)
2. Crea un nuevo proyecto o selecciona uno existente
3. Habilita la **Google Sheets API**:
   - Ve a "APIs & Services" > "Library"
   - Busca "Google Sheets API"
   - Haz clic en "Enable"

## Paso 2: Crear Service Account

1. Ve a "APIs & Services" > "Credentials"
2. Haz clic en "Create Credentials" > "Service Account"
3. Dale un nombre (ej: "sheets-form-handler")
4. Haz clic en "Create and Continue"
5. Asigna el rol "Editor" (o un rol que permita escribir)
6. Haz clic en "Done"

## Paso 3: Crear y descargar la clave JSON

1. En la lista de Service Accounts, haz clic en el que acabas de crear
2. Ve a la pestaña "Keys"
3. Haz clic en "Add Key" > "Create new key"
4. Selecciona "JSON" y haz clic en "Create"
5. Se descargará un archivo JSON - **guárdalo de forma segura**

## Paso 4: Configurar Google Sheet

1. Crea una nueva Google Sheet en [Google Sheets](https://sheets.google.com)
2. Comparte la hoja con el email del Service Account (lo encontrarás en el JSON descargado, campo `client_email`)
3. Dale permisos de "Editor" al Service Account
4. Copia el ID de la hoja desde la URL:
   ```
   https://docs.google.com/spreadsheets/d/ESTE_ES_EL_SHEET_ID/edit
   ```
5. (Opcional) Renombra la primera hoja a "Sheet1" o el nombre que prefieras

## Paso 5: Configurar Variables de Entorno

Agrega estas variables a tu `.env.local` (local) o en Vercel (producción):

```env
GOOGLE_SHEET_ID=tu-sheet-id-aqui
GOOGLE_SERVICE_ACCOUNT_EMAIL=tu-service-account@proyecto.iam.gserviceaccount.com
GOOGLE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nTu clave privada aquí\n-----END PRIVATE KEY-----\n"
GOOGLE_SHEET_NAME=Sheet1
```

**Importante:** 
- Copia el `client_email` del JSON al `GOOGLE_SERVICE_ACCOUNT_EMAIL`
- Copia el `private_key` completo del JSON al `GOOGLE_PRIVATE_KEY` (mantén las comillas y los `\n`)
- El `GOOGLE_SHEET_NAME` es opcional, por defecto usa "Sheet1"

## Paso 6: Configurar Google Apps Script para Envío Automático de Emails

1. Abre tu Google Sheet
2. Ve a "Extensions" > "Apps Script"
3. Elimina el código por defecto y pega este:

```javascript
function onEdit(e) {
  // Solo ejecutar si es una edición en la columna A (primera columna después de headers)
  const sheet = e.source.getActiveSheet();
  const row = e.range.getRow();
  
  // Ignorar si es la fila de headers (fila 1)
  if (row === 1) return;
  
  // Ignorar si no es la última fila (para evitar múltiples envíos)
  const lastRow = sheet.getLastRow();
  if (row !== lastRow) return;
  
  // Obtener datos de la fila
  const fecha = sheet.getRange(row, 1).getValue();
  const nombre = sheet.getRange(row, 2).getValue();
  const apellido = sheet.getRange(row, 3).getValue();
  const email = sheet.getRange(row, 4).getValue();
  const telefono = sheet.getRange(row, 5).getValue();
  const mensaje = sheet.getRange(row, 6).getValue();
  const urlOrigen = sheet.getRange(row, 7).getValue(); // URL de origen (columna 7)
  
  // Email donde recibir las notificaciones
  const emailDestino = 'tu-email@ejemplo.com'; // ⬅️ CAMBIAR ESTO
  
  // Configurar el email
  const asunto = `Nuevo mensaje de contacto: ${nombre} ${apellido}`;
  const cuerpo = `
    <h2>Nuevo mensaje de contacto</h2>
    <p><strong>Fecha:</strong> ${fecha}</p>
    <p><strong>Nombre:</strong> ${nombre} ${apellido}</p>
    <p><strong>Email:</strong> <a href="mailto:${email}">${email}</a></p>
    <p><strong>Teléfono:</strong> ${telefono}</p>
    <p><strong>Mensaje:</strong></p>
    <p>${mensaje.replace(/\n/g, '<br>')}</p>
    <p><strong>URL de origen:</strong> <a href="${urlOrigen || 'N/A'}">${urlOrigen || 'N/A'}</a></p>
  `;
  
  // Enviar el email
  MailApp.sendEmail({
    to: emailDestino,
    subject: asunto,
    htmlBody: cuerpo,
    replyTo: email // Para responder directamente al usuario
  });
}
```

4. **Configurar el Trigger:**
   - En Apps Script, haz clic en el ícono de reloj (Triggers) en el menú izquierdo
   - Haz clic en "Add Trigger"
   - Selecciona:
     - Function: `onEdit`
     - Event source: `From spreadsheet`
     - Event type: `On edit`
   - Haz clic en "Save"
   - Si te pide autorización, acepta los permisos

5. **Cambiar el email destino** en el código donde dice `tu-email@ejemplo.com`

## Estructura de la Hoja

La hoja se creará automáticamente con estas columnas:
- Fecha
- Nombre
- Apellido
- Email
- Teléfono
- Mensaje
- URL de Origen (se agrega automáticamente desde donde viene el formulario)

## Notas Importantes

- El trigger `onEdit` se ejecuta cuando se edita cualquier celda. El script verifica que sea la última fila para evitar envíos duplicados.
- Si quieres más control, puedes usar un trigger de tiempo (cada 1 minuto) y revisar nuevas filas, pero `onEdit` es más inmediato.
- El Service Account debe tener permisos de escritura en la hoja.
- Mantén las credenciales del JSON seguras y nunca las subas a Git.

## Troubleshooting

**Error: "The caller does not have permission"**
- Verifica que compartiste la hoja con el email del Service Account
- Verifica que le diste permisos de "Editor"

**Error: "Invalid credentials"**
- Verifica que el `GOOGLE_PRIVATE_KEY` tenga las comillas y los `\n`
- Copia exactamente el `private_key` del JSON

**Los emails no se envían**
- Verifica que el trigger esté configurado correctamente
- Verifica que autorizaste los permisos en Apps Script
- Revisa los logs en Apps Script (View > Execution log)

