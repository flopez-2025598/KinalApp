const fs = require('fs').promises;

// URL de la API pública a consumir
const API_URL = 'https://jsonplaceholder.typicode.com/posts';
// Nombre del archivo de salida en el mismo directorio
const OUTPUT_FILE = 'resultado.json';

/**
 * Función principal que realiza la petición, procesa la respuesta,
 * guarda los datos en un archivo JSON y mide tiempos de ejecución.
 */
async function main() {
  // Medición de tiempo antes de iniciar la petición
  const inicioPeticion = performance.now();
  console.log('Inicio del proceso:', new Date().toISOString());

  try {
    // Realiza la petición usando la Fetch API nativa de Node 18+
    const respuesta = await fetch(API_URL);
    const despuesRespuesta = performance.now();

    // Verifica que el status HTTP sea 200
    if (respuesta.status !== 200) {
      throw new Error(`Código HTTP inválido: ${respuesta.status}`);
    }

    // Intenta parsear como JSON y validar la estructura
    const datosBrutos = await respuesta.json();
    const despuesParseo = performance.now();

    if (!Array.isArray(datosBrutos)) {
      throw new Error('Datos mal formados: se esperaba un arreglo');
    }

    // Extrae únicamente los campos relevantes de cada registro
    const datosProcesados = datosBrutos.map((item) => {
      if (typeof item !== 'object' || item === null) {
        throw new Error('Datos mal formados: registro inválido');
      }

      return {
        id: item.id,
        titulo: item.title,
        cuerpo: item.body,
      };
    });

    // Construye la estructura clara del archivo de salida
    const resultado = {
      fechaConsulta: new Date().toISOString(),
      totalRegistros: datosProcesados.length,
      datos: datosProcesados,
    };

    // Guardar el archivo JSON con los datos procesados
    await fs.writeFile(OUTPUT_FILE, JSON.stringify(resultado, null, 2), 'utf8');
    const despuesEscritura = performance.now();

    console.log('Archivo generado:', OUTPUT_FILE);
    console.log('Tiempos (ms):');
    console.log(`  - Antes de la petición: 0`);
    console.log(`  - Después de recibir respuesta: ${(despuesRespuesta - inicioPeticion).toFixed(2)}`);
    console.log(`  - Después de parsear la respuesta: ${(despuesParseo - inicioPeticion).toFixed(2)}`);
    console.log(`  - Después de guardar el archivo: ${(despuesEscritura - inicioPeticion).toFixed(2)}`);
    console.log(`Registros procesados: ${datosProcesados.length}`);
  } catch (error) {
    // Manejo centralizado de errores asincrónicos
    console.error('ERROR:', error.name || 'Error desconocido');
    console.error('Mensaje:', error.message || 'No hay mensaje disponible');

    if (error.code) {
      console.error('Código del error:', error.code);
    }

    process.exitCode = 1;
  }
}

// Ejecuta la función principal
main();
