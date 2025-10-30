from mongodb import connectionBD
from datetime import datetime

# Obtener todos los mensajes directamente de MongoDB
col = connectionBD()
if col is not None:
    # Obtener mensajes recientes ordenados por fecha
    mensajes = list(col.find().sort("fecha_envio", 1))
    
    print("=== VERIFICACIÓN DE ORDEN DE MENSAJES ===")
    print(f"Total mensajes en MongoDB: {len(mensajes)}")
    
    print("\nÚltimos 10 mensajes por orden de fecha:")
    for i, msg in enumerate(mensajes[-10:], 1):
        contenido = msg.get('contenido', 'Sin contenido')[:20]
        fecha_envio = msg.get('fecha_envio')
        emisor = msg.get('emisor_id')
        receptor = msg.get('receptor_id')
        
        print(f"{i:2d}. [{emisor}→{receptor}] '{contenido}' - {fecha_envio}")
    
    # Verificar si hay problemas de zona horaria
    print("\n=== ANÁLISIS DE FECHAS ===")
    fechas_problematicas = []
    
    for i in range(1, len(mensajes)):
        msg_anterior = mensajes[i-1]
        msg_actual = mensajes[i]
        
        fecha_anterior = msg_anterior.get('fecha_envio')
        fecha_actual = msg_actual.get('fecha_envio')
        
        if fecha_actual < fecha_anterior:
            fechas_problematicas.append((i-1, i, fecha_anterior, fecha_actual))
    
    if fechas_problematicas:
        print(f"❌ Encontrados {len(fechas_problematicas)} problemas de orden:")
        for idx_ant, idx_act, fecha_ant, fecha_act in fechas_problematicas:
            print(f"   Mensaje {idx_ant}: {fecha_ant}")
            print(f"   Mensaje {idx_act}: {fecha_act} (anterior!)")
    else:
        print("✅ Todas las fechas están en orden correcto")
    
    # Verificar mensajes entre usuarios específicos
    print("\n=== MENSAJES ENTRE USUARIOS 1 Y 2 ===")
    mensajes_chat = list(col.find({
        "$or": [
            {"emisor_id": 1, "receptor_id": 2},
            {"emisor_id": 2, "receptor_id": 1}
        ]
    }).sort("fecha_envio", 1))
    
    print(f"Mensajes en conversación: {len(mensajes_chat)}")
    for i, msg in enumerate(mensajes_chat[-5:], 1):
        contenido = msg.get('contenido', 'Sin contenido')
        fecha_envio = msg.get('fecha_envio')
        emisor = msg.get('emisor_id')
        receptor = msg.get('receptor_id')
        
        # Calcular diferencia con tiempo actual
        ahora = datetime.now()
        if hasattr(fecha_envio, 'replace'):
            diferencia = ahora - fecha_envio.replace(tzinfo=None)
        else:
            diferencia = ahora - datetime.strptime(str(fecha_envio), '%Y-%m-%d %H:%M:%S')
        
        segundos = int(diferencia.total_seconds())
        
        print(f"{i}. [{emisor}→{receptor}] '{contenido}' - {fecha_envio}")
        print(f"   Diferencia: {segundos} segundos ({'ahora' if segundos < 30 else 'hora exacta'})")

else:
    print("❌ Error de conexión a MongoDB")