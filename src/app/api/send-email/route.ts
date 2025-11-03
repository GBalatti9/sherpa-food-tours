import { NextRequest, NextResponse } from 'next/server';
import { GoogleSpreadsheet } from 'google-spreadsheet';
import { JWT } from 'google-auth-library';

export async function POST(request: NextRequest) {
  try {
    const { name, lastName, email, phone, message, sourceUrl } = await request.json();

    // Validar que todos los campos requeridos estén presentes
    if (!name || !lastName || !email || !phone || !message) {
      return NextResponse.json(
        { error: 'Todos los campos son requeridos' },
        { status: 400 }
      );
    }

    // Validar que las variables de entorno estén configuradas
    if (!process.env.GOOGLE_SHEET_ID || !process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL || !process.env.GOOGLE_PRIVATE_KEY) {
      console.error('Variables de Google Sheets no están configuradas');
      return NextResponse.json(
        { error: 'Configuración de Google Sheets no disponible' },
        { status: 500 }
      );
    }

    // Configurar autenticación con Service Account
    const serviceAccountAuth = new JWT({
      email: process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL,
      key: process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
      scopes: [
        'https://www.googleapis.com/auth/spreadsheets',
      ],
    });

    // Inicializar y autenticar el documento de Google Sheets
    const doc = new GoogleSpreadsheet(process.env.GOOGLE_SHEET_ID, serviceAccountAuth);
    await doc.loadInfo();

    // Obtener la primera hoja (o la hoja especificada)
    const sheetName = process.env.GOOGLE_SHEET_NAME || 'Sheet1';
    let sheet = doc.sheetsByTitle[sheetName];
    
    // Si no existe la hoja, crear una nueva
    if (!sheet) {
      sheet = await doc.addSheet({ title: sheetName });
      // Agregar headers si es la primera vez
      await sheet.setHeaderRow(['fecha', 'nombre', 'apellido', 'email', 'telefono', 'mensaje', 'asunto']);
    } else {
      // Asegurarse de que los headers estén configurados (por si la hoja está vacía)
      await sheet.loadHeaderRow().catch(async () => {
        await sheet.setHeaderRow(['fecha', 'nombre', 'apellido', 'email', 'telefono', 'mensaje', 'asunto']);
      });
    }

    // Agregar la nueva fila con los datos del formulario
    const timestamp = new Date().toLocaleString('es-AR', { 
      timeZone: 'America/Argentina/Buenos_Aires',
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    });

    await sheet.addRow({
      'fecha': timestamp,
      'nombre': name,
      'apellido': lastName,
      'email': email,
      'telefono': phone,
      'mensaje': message,
      'asunto': sourceUrl || 'N/A'
    });

    return NextResponse.json(
      { message: 'Formulario guardado correctamente en Google Sheets' },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error guardando en Google Sheets:', error);
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    );
  }
}
