#!/usr/bin/env python3

"""
Script para probar el endpoint de perfil del usuario autenticado
"""

import requests
import json

def test_perfil_propio():
    """Prueba el endpoint de perfil del usuario autenticado"""
    
    try:
        # Crear una sesión para mantener las cookies
        session = requests.Session()
        
        # Simular login (necesario para tener una sesión activa)
        # En producción, el usuario ya estaría autenticado
        
        response = session.get("http://localhost:5000/api/perfil_usuario")
        
        print(f"Testing: /api/perfil_usuario (usuario autenticado)")
        print(f"Status Code: {response.status_code}")
        
        if response.status_code == 200:
            data = response.json()
            print(f"Response JSON: {json.dumps(data, indent=2, ensure_ascii=False)}")
        elif response.status_code == 401:
            print("❌ Usuario no autenticado - necesita iniciar sesión primero")
        else:
            print(f"Error response: {response.text}")
            
    except requests.exceptions.ConnectionError:
        print("❌ Error: No se puede conectar al servidor Flask en http://localhost:5000")
        print("   ¿Está ejecutándose el backend?")
    except Exception as e:
        print(f"❌ Error: {e}")

if __name__ == "__main__":
    test_perfil_propio()