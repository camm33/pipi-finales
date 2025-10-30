#!/usr/bin/env python3

"""
Script para probar el endpoint de publicaciones directamente
"""

import requests
import json

def test_endpoint():
    """Prueba el endpoint /api/publicaciones"""
    
    try:
        # Probar el endpoint
        response = requests.get("http://localhost:5000/api/publicaciones")
        
        print(f"Status Code: {response.status_code}")
        print(f"Headers: {dict(response.headers)}")
        
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
    test_endpoint()