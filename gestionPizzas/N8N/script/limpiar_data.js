// Obtiene el texto de entrada desde el nodo anterior (ajusta 'chatInput' si tu campo tiene otro nombre)
const inputTexto = $input.item.json.chatInput;

// Función auxiliar para extraer valores usando una etiqueta clave
function extraerDato(texto, regex) {
    const match = texto.match(regex);
    return match ? match[1].trim() : null;
}

// Extracción de cada campo mediante expresiones regulares seguras
const nombreCompleto = extraerDato(inputTexto, /Nombre completo:\s*([^\n]+)/i);
const run = extraerDato(inputTexto, /RUN\s*([0-9Kk\-]+)/i);
const telefono = extraerDato(inputTexto, /Teléfono de contacto\s*([0-9\s]+)/i);
const correo = extraerDato(inputTexto, /Correo electrónico:\s*([^\s]+)/i);

// Retorna el objeto JSON estructurado que n8n interpretará como un nuevo item
return [{
    json: {
        nombre: nombreCompleto,
        run: run,
        telefono: telefono ? telefono.replace(/\s+/g, '') : null,
        correo: correo,
        validar: null,
        chatInput: inputTexto
    }
}];
