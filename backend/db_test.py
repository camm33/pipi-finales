"""
Script de prueba para la conexión a MySQL usando las variables de entorno.
Ejecuta desde PowerShell con el virtualenv activado:

.\.venv\Scripts\Activate.ps1
python backend\db_test.py

"""
import os
import sys

MYSQL_HOST = os.environ.get('MYSQL_HOST', 'localhost')
MYSQL_USER = os.environ.get('MYSQL_USER', 'root')
MYSQL_PASSWORD = os.environ.get('MYSQL_PASSWORD', '3107')
MYSQL_DB = os.environ.get('MYSQL_DB', 'Double_P')

print(f"Probando conexión a MySQL en {MYSQL_HOST} con usuario '{MYSQL_USER}' para DB '{MYSQL_DB}'...")

try:
    import pymysql
except Exception as e:
    print("Error: pymysql no está instalado. Ejecuta: python -m pip install pymysql")
    sys.exit(1)

try:
    conn = pymysql.connect(host=MYSQL_HOST, user=MYSQL_USER, password=MYSQL_PASSWORD, db=MYSQL_DB)
    cur = conn.cursor()
    cur.execute('SELECT 1')
    print("Conexión exitosa. La consulta SELECT 1 devolvió:", cur.fetchone())
    conn.close()
    sys.exit(0)
except Exception as e:
    print("Fallo al conectar a MySQL:")
    print(repr(e))
    # Mostrar consejos rápidos para 1045
    if hasattr(e, 'args') and e.args:
        msg = str(e.args[0])
        if '1045' in msg or 'Access denied' in msg:
            print('\nPosibles soluciones:')
            print(" - Verifica que MYSQL_USER y MYSQL_PASSWORD en tu .env o variables de entorno sean correctas.")
            print(" - Si usas 'root' y no conoces la contraseña usa el cliente de MySQL para cambiarla, o crea un usuario para la app:")
            print("     CREATE USER 'doublep'@'localhost' IDENTIFIED BY 'tu_password_segura';")
            print("     GRANT ALL PRIVILEGES ON Double_P.* TO 'doublep'@'localhost';")
            print("     FLUSH PRIVILEGES;")
    sys.exit(2)
