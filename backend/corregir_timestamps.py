from mongodb import connectionBD
from datetime import datetime, timedelta

def corregir_timestamps():
    """Corrige timestamps que están en zona horaria incorrecta"""
    col = connectionBD()
    if col is None:
        print("❌ Error de conexión a MongoDB")
        return
    
    print("=== CORRECCIÓN DE TIMESTAMPS ===")
    
    # Obtener todos los mensajes
    mensajes = list(col.find().sort("fecha_envio", 1))
    print(f"Total mensajes: {len(mensajes)}")
    
    # Detectar mensajes con fechas futuras o inconsistentes
    ahora = datetime.now()
    problematicos = []
    
    for msg in mensajes:
        fecha_envio = msg.get('fecha_envio')
        if hasattr(fecha_envio, 'replace'):
            # Si la fecha está más de 1 hora en el futuro, es problemática
            if fecha_envio > ahora + timedelta(hours=1):
                diferencia = fecha_envio - ahora
                problematicos.append({
                    'id': msg['_id'],
                    'contenido': msg.get('contenido', 'Sin contenido')[:20],
                    'fecha_original': fecha_envio,
                    'diferencia_horas': diferencia.total_seconds() / 3600
                })
    
    print(f"Mensajes con timestamps problemáticos: {len(problematicos)}")
    
    if problematicos:
        print("\nMensajes problemáticos:")
        for p in problematicos:
            print(f"- '{p['contenido']}': {p['fecha_original']} (diferencia: {p['diferencia_horas']:.1f}h)")
        
        respuesta = input("\n¿Deseas corregir estos timestamps? (y/n): ")
        
        if respuesta.lower() == 'y':
            corregidos = 0
            for p in problematicos:
                # Restar 5 horas si la diferencia está entre 4 y 6 horas
                if 4 <= p['diferencia_horas'] <= 6:
                    nueva_fecha = p['fecha_original'] - timedelta(hours=5)
                    
                    result = col.update_one(
                        {"_id": p['id']},
                        {"$set": {"fecha_envio": nueva_fecha}}
                    )
                    
                    if result.modified_count > 0:
                        corregidos += 1
                        print(f"✅ Corregido: {p['fecha_original']} → {nueva_fecha}")
            
            print(f"\n🎉 Se corrigieron {corregidos} mensajes")
        else:
            print("❌ Corrección cancelada")
    else:
        print("✅ No se encontraron timestamps problemáticos")
    
    # Verificar orden final
    print("\n=== VERIFICACIÓN FINAL ===")
    mensajes_finales = list(col.find().sort("fecha_envio", 1))
    
    orden_correcto = True
    for i in range(1, len(mensajes_finales)):
        if mensajes_finales[i]['fecha_envio'] < mensajes_finales[i-1]['fecha_envio']:
            orden_correcto = False
            break
    
    if orden_correcto:
        print("✅ Todos los mensajes están en orden cronológico correcto")
    else:
        print("❌ Aún hay problemas de orden cronológico")

if __name__ == "__main__":
    corregir_timestamps()