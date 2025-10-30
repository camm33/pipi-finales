from mongodb import connectionBD
from datetime import datetime, timedelta

def corregir_automatico():
    """Corrige timestamps automáticamente"""
    col = connectionBD()
    if col is None:
        print("❌ Error de conexión a MongoDB")
        return
    
    print("=== CORRECCIÓN AUTOMÁTICA DE TIMESTAMPS ===")
    
    # Obtener todos los mensajes
    mensajes = list(col.find().sort("fecha_envio", 1))
    print(f"Total mensajes: {len(mensajes)}")
    
    # Detectar mensajes con fechas futuras
    ahora = datetime.now()
    corregidos = 0
    
    for msg in mensajes:
        fecha_envio = msg.get('fecha_envio')
        if hasattr(fecha_envio, 'replace'):
            diferencia = fecha_envio - ahora
            diferencia_horas = diferencia.total_seconds() / 3600
            
            # Si la diferencia está entre 4 y 6 horas, corregir
            if 4 <= diferencia_horas <= 6:
                nueva_fecha = fecha_envio - timedelta(hours=5)
                
                result = col.update_one(
                    {"_id": msg['_id']},
                    {"$set": {"fecha_envio": nueva_fecha}}
                )
                
                if result.modified_count > 0:
                    corregidos += 1
                    contenido = msg.get('contenido', 'Sin contenido')[:20]
                    print(f"✅ '{contenido}': {fecha_envio} → {nueva_fecha}")
    
    print(f"\n🎉 Se corrigieron {corregidos} mensajes")
    
    # Verificar que ahora estén en orden correcto con tiempos locales
    print("\n=== MENSAJES RECIENTES CORREGIDOS ===")
    mensajes_recientes = list(col.find().sort("fecha_envio", -1).limit(5))
    
    for i, msg in enumerate(mensajes_recientes, 1):
        contenido = msg.get('contenido', 'Sin contenido')[:15]
        fecha = msg.get('fecha_envio')
        diferencia = ahora - fecha
        segundos = int(diferencia.total_seconds())
        
        print(f"{i}. '{contenido}' - {fecha}")
        print(f"   Hace {segundos} segundos ({'ahora' if segundos < 30 else 'hora exacta'})")

if __name__ == "__main__":
    corregir_automatico()