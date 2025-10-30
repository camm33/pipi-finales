// Simulación exacta del código del frontend
let tiempoActual = new Date();

const formatearTiempo = (fechaStr) => {
  const fecha = new Date(fechaStr);
  const ahora = tiempoActual;
  const diferencia = ahora - fecha;
  
  console.log(`Fecha mensaje: ${fecha}`);
  console.log(`Tiempo actual: ${ahora}`);
  console.log(`Diferencia en ms: ${diferencia}`);
  console.log(`Diferencia en segundos: ${Math.floor(diferencia / 1000)}`);
  
  // Solo mostrar "ahora" si el mensaje es de hace menos de 30 segundos
  if (diferencia < 30000) {
    return "ahora";
  }
  
  // Si es del mismo día, mostrar solo la hora
  if (fecha.toDateString() === ahora.toDateString()) {
    return fecha.toLocaleTimeString('es-ES', { 
      hour: '2-digit', 
      minute: '2-digit',
      second: '2-digit'
    });
  }
  
  // Si es de otro día, mostrar fecha y hora
  return fecha.toLocaleString('es-ES', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit'
  });
};

console.log("=== SIMULACIÓN DEL PROBLEMA ===\n");

// Simular un mensaje que se envió hace 2 minutos
const hace2min = new Date();
hace2min.setMinutes(hace2min.getMinutes() - 2);

console.log("Mensaje enviado hace 2 minutos:");
const resultado = formatearTiempo(hace2min.toISOString());
console.log(`Resultado: "${resultado}"`);

if (resultado === "ahora") {
  console.log("❌ PROBLEMA: Todavía muestra 'ahora' después de 2 minutos");
} else {
  console.log("✅ CORRECTO: Ya no muestra 'ahora'");
}

console.log("\n=== PRUEBA CON DIFERENTES TIEMPOS ===");

// Simular mensaje recién enviado
const ahoraReal = new Date();
console.log(`Mensaje enviado ahora: "${formatearTiempo(ahoraReal.toISOString())}"`);

// Mensaje hace 45 segundos
const hace45seg = new Date(ahoraReal.getTime() - 45000);
console.log(`Mensaje hace 45 segundos: "${formatearTiempo(hace45seg.toISOString())}"`);

// Mensaje hace 5 minutos
const hace5min = new Date(ahoraReal.getTime() - 5 * 60 * 1000);
console.log(`Mensaje hace 5 minutos: "${formatearTiempo(hace5min.toISOString())}"`);

console.log("\n=== FIN SIMULACIÓN ===");