#!/usr/bin/env python3
import requests
import json
import time

# Configuración
BASE_URL = "http://localhost:5000"
id_usuario_1 = 1
id_usuario_2 = 2

def test_flujo_completo():
    print("=== PRUEBA DE FLUJO COMPLETO DE CHAT ===\n")
    
    # 1. Verificar conteo inicial
    print("1. Conteo inicial de mensajes no leídos...")
    response = requests.get(f"{BASE_URL}/chat/no_leidos/{id_usuario_2}")
    if response.status_code == 200:
        data = response.json()
        print(f"   Usuario {id_usuario_2}: {data.get('mensajes_no_leidos', 0)} mensajes no leídos")
    
    # 2. Enviar mensaje
    print("\n2. Enviando mensaje...")
    mensaje_data = {
        "id_remitente": id_usuario_1,
        "id_destinatario": id_usuario_2,
        "mensaje": "Mensaje de prueba desde el test"
    }
    
    response = requests.post(f"{BASE_URL}/chat/mensajes", json=mensaje_data)
    if response.status_code == 200:
        data = response.json()
        print(f"   ✅ Mensaje enviado: {data.get('success', False)}")
    else:
        print(f"   ❌ Error al enviar: {response.status_code}")
        print(f"   Respuesta: {response.text}")
    
    # 3. Verificar conteo después del envío
    print("\n3. Verificar conteo después del envío...")
    response = requests.get(f"{BASE_URL}/chat/no_leidos/{id_usuario_2}")
    if response.status_code == 200:
        data = response.json()
        print(f"   Usuario {id_usuario_2}: {data.get('mensajes_no_leidos', 0)} mensajes no leídos")
    
    # 4. Obtener mensajes
    print("\n4. Obteniendo mensajes...")
    response = requests.get(f"{BASE_URL}/chat/mensajes?id_remitente={id_usuario_2}&id_destinatario={id_usuario_1}")
    if response.status_code == 200:
        mensajes = response.json()
        print(f"   📩 {len(mensajes)} mensajes en la conversación")
        if mensajes:
            ultimo = mensajes[-1]
            print(f"   Último mensaje: \"{ultimo.get('contenido', ultimo.get('mensaje', ''))}\"")
            print(f"   Leído: {ultimo.get('leido', False)} {'✓✓' if ultimo.get('leido') else '✓'}")
    
    # 5. Marcar como leídos
    print("\n5. Marcando mensajes como leídos...")
    marcar_data = {
        "id_usuario": id_usuario_2,
        "id_otro_usuario": id_usuario_1
    }
    
    response = requests.post(f"{BASE_URL}/chat/marcar_leidos", json=marcar_data)
    if response.status_code == 200:
        data = response.json()
        print(f"   ✅ Marcado como leído: {data.get('success', False)}")
    else:
        print(f"   ❌ Error al marcar: {response.status_code}")
        print(f"   Respuesta: {response.text}")
    
    # 6. Verificar conteo final
    print("\n6. Conteo final de mensajes no leídos...")
    response = requests.get(f"{BASE_URL}/chat/no_leidos/{id_usuario_2}")
    if response.status_code == 200:
        data = response.json()
        print(f"   Usuario {id_usuario_2}: {data.get('mensajes_no_leidos', 0)} mensajes no leídos")
    
    print("\n=== PRUEBA COMPLETADA ===")

if __name__ == "__main__":
    try:
        test_flujo_completo()
    except requests.exceptions.ConnectionError:
        print("❌ Error: No se puede conectar al servidor Flask.")
        print("   Asegúrate de que el servidor esté ejecutándose en http://localhost:5000")
    except Exception as e:
        print(f"❌ Error inesperado: {e}")