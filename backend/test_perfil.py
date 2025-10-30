#!/usr/bin/env python3

"""
Script para probar el endpoint de perfil de otros usuarios
"""

import requests
import json

def test_perfil_endpoint():
    """Prueba el endpoint de perfil de otros usuarios"""
    
    # Probar con el usuario 21 (tu usuario)
    user_id = 21
    
    try:
        response = requests.get(f"http://localhost:5000/api/perfil_usuario/{user_id}")
        
        print(f"Testing: /api/perfil_usuario/{user_id}")
        print(f"Status Code: {response.status_code}")
        
        if response.status_code == 200:
            data = response.json()
            print(f"Response JSON: {json.dumps(data, indent=2, ensure_ascii=False)}")
        else:
            print(f"Error response: {response.text}")
            
    except requests.exceptions.ConnectionError:
        print("❌ Error: No se puede conectar al servidor Flask en http://localhost:5000")
        print("   ¿Está ejecutándose el backend?")
    except Exception as e:
        print(f"❌ Error: {e}")

if __name__ == "__main__":
    test_perfil_endpoint()