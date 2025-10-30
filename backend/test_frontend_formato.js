// Simulación del frontend para verificar formateo
const formatearTiempo = (fechaStr) => {
  const fecha = new Date(fechaStr);
  const ahora = new Date();
  const diferencia = ahora - fecha;
  
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

// Test con diferentes fechas
console.log("=== PRUEBA DE FORMATEO FRONTEND ===");

const ahora = new Date();
const hace10seg = new Date(ahora.getTime() - 10000);
const hace5min = new Date(ahora.getTime() - 5 * 60 * 1000);
const hace2horas = new Date(ahora.getTime() - 2 * 60 * 60 * 1000);
const ayer = new Date(ahora.getTime() - 24 * 60 * 60 * 1000);

console.log(`Mensaje de hace 10 segundos: "${formatearTiempo(hace10seg.toISOString())}"`);
console.log(`Mensaje de hace 5 minutos: "${formatearTiempo(hace5min.toISOString())}"`);
console.log(`Mensaje de hace 2 horas: "${formatearTiempo(hace2horas.toISOString())}"`);
console.log(`Mensaje de ayer: "${formatearTiempo(ayer.toISOString())}"`);

// Formato como viene del backend
const fechaBackend = "2025-10-29 18:58:00";
console.log(`\nMensaje del backend (${fechaBackend}): "${formatearTiempo(fechaBackend)}"`);

console.log("\n=== PRUEBA COMPLETADA ===");