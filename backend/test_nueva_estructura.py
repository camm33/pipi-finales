from funciones_chat import (
    procesar_form_chat, 
    lista_mensajes_chat, 
    marcar_mensajes_como_leidos,
    contar_mensajes_no_leidos,
    obtener_conversaciones_con_no_leidos
)

def test_nueva_estructura():
    print("=== PRUEBA DE LA NUEVA ESTRUCTURA ===\n")
    
    # Test 1: Enviar mensaje con nueva estructura
    print("1. Enviando mensaje de prueba...")
    emisor_id = 1
    receptor_id = 2
    contenido = "¡Mensaje de prueba con nueva estructura!"
    
    exito = procesar_form_chat(emisor_id, receptor_id, contenido)
    print(f"   Resultado: {'✅ Enviado' if exito else '❌ Error'}")
    
    # Test 2: Listar mensajes
    print("\n2. Listando mensajes...")
    mensajes = lista_mensajes_chat(emisor_id, receptor_id)
    print(f"   Mensajes encontrados: {len(mensajes)}")
    
    if mensajes:
        ultimo = mensajes[-1]
        print(f"   Último mensaje:")
        print(f"     emisor_id: {ultimo.get('emisor_id')}")
        print(f"     receptor_id: {ultimo.get('receptor_id')}")
        print(f"     contenido: \"{ultimo.get('contenido')}\"")
        print(f"     leido: {ultimo.get('leido')} {'✓✓' if ultimo.get('leido') else '✓'}")
    
    # Test 3: Contar no leídos
    print(f"\n3. Mensajes no leídos para usuario {receptor_id}:")
    no_leidos = contar_mensajes_no_leidos(receptor_id)
    print(f"   Total: {no_leidos} ✓")
    
    # Test 4: Marcar como leídos
    print(f"\n4. Marcando mensajes como leídos...")
    exito_lectura = marcar_mensajes_como_leidos(receptor_id, emisor_id)
    print(f"   Resultado: {'✅ Marcados' if exito_lectura else '❌ Error'}")
    
    # Test 5: Verificar cambio
    print(f"\n5. Verificando cambio...")
    no_leidos_despues = contar_mensajes_no_leidos(receptor_id)
    print(f"   Mensajes no leídos ahora: {no_leidos_despues} ✓")
    
    # Test 6: Conversaciones con no leídos
    print(f"\n6. Conversaciones del usuario {receptor_id}:")
    conversaciones = obtener_conversaciones_con_no_leidos(receptor_id)
    for conv in conversaciones:
        estado = f"{conv['mensajes_no_leidos']} ✓" if conv['mensajes_no_leidos'] > 0 else "✓✓"
        print(f"   Usuario {conv['_id']}: \"{conv['ultimo_mensaje']}\" ({estado})")
    
    print("\n=== PRUEBA COMPLETADA ===")

if __name__ == "__main__":
    test_nueva_estructura()