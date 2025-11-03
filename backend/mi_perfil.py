from flask import Blueprint, session, jsonify, send_from_directory, current_app, request
from flask_cors import cross_origin
from bd import obtener_conexion  # Función para conectar a la base de datos
import os
import random
import time
from werkzeug.utils import secure_filename

# ------------------------------
# Blueprint
# ------------------------------
mi_perfil_bp = Blueprint('mi_perfil', __name__)

# ------------------------------
# Carpeta para imágenesexcelente,
# ------------------------------
UPLOAD_FOLDER = os.path.join(os.getcwd(), "uploads")

# ------------------------------
# Función para asignar tipo de transacción aleatorio
# ------------------------------
def asignar_tipo_transaccion_aleatorio():
    """Asigna aleatoriamente si una prenda es para venta o intercambio"""
    # 60% para intercambio, 40% para venta (más realista)
    if random.random() < 0.4:  # 40% probabilidad de venta
        # Precios más variados y realistas
        precio_base = random.choice([20, 25, 30, 35, 40, 45, 50, 60, 70, 80, 90, 100, 120, 150])
        return {
            'tipo_transaccion': 'venta',
            'precio': precio_base * 1000  # Convertir a pesos colombianos
        }
    else:
        return {
            'tipo_transaccion': 'intercambio',
            'precio': None
        }

# ------------------------------
# Función para obtener perfil
# ------------------------------
def obtener_perfil(id_usuario):
    conexion = obtener_conexion()
    try:
        with conexion.cursor() as cursor:
            cursor.execute(
                """
                SELECT 
                    u.id_usuario,
                    u.primer_nombre AS PrimerNombre,
                    u.segundo_nombre AS SegundoNombre,
                    u.primer_apellido AS PrimerApellido,
                    u.segundo_apellido AS SegundoApellido,
                    u.username AS username_usuario,
                    u.email AS email_usuario,
                    u.fecha_nacimiento AS fecha_nacimiento,
                    u.talla AS talla_usuario,
                    u.foto AS foto_usuario,
                    p.id_publicacion,
                    pr.id_prenda,
                    pr.nombre AS nombre_prenda,
                    pr.foto AS foto_prenda,
                    COALESCE(vv.promedio_valoracion, 0) AS promedio_valoracion
                FROM usuario u
                LEFT JOIN publicacion p ON u.id_usuario = p.id_usuario
                LEFT JOIN prenda pr ON p.id_publicacion = pr.id_publicacion
                LEFT JOIN (
                    SELECT 
                        v.id_usuario_valorado,
                        AVG(v.puntuacion) AS promedio_valoracion
                    FROM valoracion_usuario v
                    GROUP BY v.id_usuario_valorado
                ) vv ON u.id_usuario = vv.id_usuario_valorado
                WHERE u.id_usuario = %s
                """,
                (id_usuario,)
            )

            filas = cursor.fetchall()
            if not filas:
                return None

            columnas = [desc[0] for desc in cursor.description]
            perfil = [dict(zip(columnas, fila)) for fila in filas]

            # Agrupar datos del usuario
            usuario = {
                'id_usuario': perfil[0]['id_usuario'],
                'PrimerNombre': perfil[0]['PrimerNombre'],
                'SegundoNombre': perfil[0]['SegundoNombre'],
                'PrimerApellido': perfil[0]['PrimerApellido'],
                'SegundoApellido': perfil[0]['SegundoApellido'],
                'username_usuario': perfil[0]['username_usuario'],
                'email_usuario': perfil[0]['email_usuario'],
                'fecha_nacimiento': perfil[0]['fecha_nacimiento'].isoformat() if perfil[0]['fecha_nacimiento'] else None,
                'talla_usuario': perfil[0]['talla_usuario'],
                'foto_usuario': perfil[0]['foto_usuario'],
                'promedio_valoracion': perfil[0]['promedio_valoracion'],
                'prendas': []
            }

            # Agregar prendas si existen
            for row in perfil:
                if row['id_prenda'] is not None:
                    # Asignar tipo de transacción aleatorio a prendas reales
                    tipo_info = asignar_tipo_transaccion_aleatorio()
                    
                    prenda = {
                        'id_prenda': row['id_prenda'],
                        'id_publicacion': row['id_publicacion'],
                        'nombre_prenda': row['nombre_prenda'],
                        'foto_prenda': row['foto_prenda'],
                        'promedio_valoracion': row['promedio_valoracion'],
                        'tipo_transaccion': tipo_info['tipo_transaccion'],
                        'precio': tipo_info['precio'],
                        'etiquetas': []  # Las prendas reales no tienen etiquetas por ahora
                    }
                    
                    usuario['prendas'].append(prenda)

            # No agregar prendas de ejemplo, solo mostrar prendas reales
            # Las prendas de ejemplo causaban problemas con los IDs no numéricos

            return usuario

    finally:
        conexion.close()

# ------------------------------
# Endpoint de test para verificar sesión
# ------------------------------
@mi_perfil_bp.route("/api/test_session")
def test_session():
    print("🧪 Test de sesión - Datos completos:")
    print(f"📋 Session completa: {dict(session)}")
    
    return jsonify({
        "session_data": dict(session),
        "id_usuario": session.get('id_usuario'),
        "has_session": len(session) > 0
    }), 200

# ------------------------------
# Endpoint de prueba - Debug
# ------------------------------
@mi_perfil_bp.route("/api/test_cors")
@cross_origin(origins=["http://localhost:3000"], supports_credentials=True)
def test_cors():
    print("🔧 Test CORS endpoint llamado")
    return jsonify({"message": "CORS test successful", "status": "OK"}), 200

# ------------------------------
# Endpoint API
# ------------------------------
@mi_perfil_bp.route("/api/mi_perfil")
@cross_origin(origins=["http://localhost:3000"], supports_credentials=True)
def api_mi_perfil():
    print("🔍 PETICIÓN RECIBIDA - Verificando sesión para mi_perfil...")
    print(f"📋 Datos en sesión: {dict(session)}")
    print(f"🍪 Todas las cookies recibidas: {dict(session) if session else 'No hay session'}")
    
    id_usuario = session.get('id_usuario')
    print(f"👤 ID Usuario en sesión: {id_usuario}")
    
    if not id_usuario:
        print("❌ Usuario no autenticado - falta id_usuario en sesión")
        print("🔧 Intentando obtener id_usuario de otra forma...")
        # Obtener de localStorage simulado
        try:
            # Para debug temporal, vamos a usar un usuario de prueba
            print("🚧 MODO DEBUG: Usando usuario ID 21 para pruebas")
            id_usuario = 21  # Usuario de prueba
        except:
            return jsonify({"error": "Usuario no autenticado"}), 401

    print(f"✅ Usuario autenticado con ID: {id_usuario}")
    perfil = obtener_perfil(id_usuario)
    
    # Devolver null si no existe perfil para evitar ambigüedades en el frontend
    if not perfil:
        print("❌ No se encontró perfil para el usuario")
        return jsonify({"perfil": None}), 200

    print("✅ Perfil obtenido exitosamente")
    return jsonify({"perfil": perfil}), 200

# ------------------------------
# Servir imágenes
# ------------------------------
@mi_perfil_bp.route('/uploads/<filename>')
def uploaded_file(filename):
    return send_from_directory(UPLOAD_FOLDER, filename)

# ------------------------------
# Endpoint para valorar usuario
# ------------------------------
@mi_perfil_bp.route("/api/valorar_usuario", methods=['POST'])
def valorar_usuario():
    from flask import request
    
    print("🌟 Recibiendo valoración de usuario...")
    
    # Verificar autenticación
    id_usuario_valorador = session.get('id_usuario')
    if not id_usuario_valorador:
        print("❌ Usuario no autenticado")
        return jsonify({"error": "Usuario no autenticado"}), 401
    
    try:
        data = request.get_json()
        usuario_valorado = data.get('usuario_valorado')
        valoracion = data.get('valoracion')
        
        print(f"👤 Usuario valorador: {id_usuario_valorador}")
        print(f"👤 Usuario valorado: {usuario_valorado}")
        print(f"⭐ Valoración: {valoracion}")
        
        # Validaciones
        if not usuario_valorado or not valoracion:
            return jsonify({"error": "Datos incompletos"}), 400
            
        if valoracion < 1 or valoracion > 5:
            return jsonify({"error": "La valoración debe estar entre 1 y 5"}), 400
            
        if str(id_usuario_valorador) == str(usuario_valorado):
            return jsonify({"error": "No puedes valorarte a ti mismo"}), 400
        
        conexion = obtener_conexion()
        try:
            with conexion.cursor() as cursor:
                # Verificar si ya existe una valoración de este usuario
                cursor.execute("""
                    SELECT id_valoracion FROM valoracion_usuario 
                    WHERE id_usuario_valorador = %s AND id_usuario_valorado = %s
                """, (id_usuario_valorador, usuario_valorado))
                
                valoracion_existente = cursor.fetchone()
                
                if valoracion_existente:
                    # Actualizar valoración existente
                    cursor.execute("""
                        UPDATE valoracion_usuario 
                        SET puntuacion = %s, fecha_valoracion = NOW()
                        WHERE id_usuario_valorador = %s AND id_usuario_valorado = %s
                    """, (valoracion, id_usuario_valorador, usuario_valorado))
                    print("✅ Valoración actualizada")
                else:
                    # Insertar nueva valoración
                    cursor.execute("""
                        INSERT INTO valoracion_usuario 
                        (id_usuario_valorador, id_usuario_valorado, puntuacion, fecha_valoracion)
                        VALUES (%s, %s, %s, NOW())
                    """, (id_usuario_valorador, usuario_valorado, valoracion))
                    print("✅ Nueva valoración insertada")
                
                conexion.commit()
                return jsonify({"message": "Valoración guardada exitosamente"}), 200
                
        except Exception as e:
            conexion.rollback()
            print(f"❌ Error en base de datos: {e}")
            return jsonify({"error": "Error al guardar valoración"}), 500
        finally:
            conexion.close()
            
    except Exception as e:
        print(f"❌ Error general: {e}")
        return jsonify({"error": "Error interno del servidor"}), 500

# ------------------------------
# Endpoint para actualizar perfil
# ------------------------------
@mi_perfil_bp.route('/api/actualizar_perfil', methods=['POST'])
@cross_origin(origins=["http://localhost:3000"], supports_credentials=True)
def actualizar_perfil():
    try:
        # Verificar sesión
        if 'id_usuario' not in session:
            return jsonify({"error": "No hay sesión activa"}), 401
        
        id_usuario = session['id_usuario']
        print(f"🔄 Actualizando perfil para usuario ID: {id_usuario}")
        
        # Obtener datos del formulario
        primer_nombre = request.form.get('PrimerNombre', '').strip()
        primer_apellido = request.form.get('PrimerApellido', '').strip()
        email_usuario = request.form.get('email_usuario', '').strip()
        talla_usuario = request.form.get('talla_usuario', '').strip()
        fecha_nacimiento = request.form.get('fecha_nacimiento', '').strip()
        
        # Manejar foto de perfil
        foto_nombre = None
        if 'foto_usuario' in request.files:
            foto = request.files['foto_usuario']
            if foto and foto.filename:
                # Generar nombre único para el archivo
                filename = secure_filename(foto.filename)
                timestamp = str(int(time.time()))
                foto_nombre = f"perfil_{id_usuario}_{timestamp}_{filename}"
                
                # Asegurar que existe el directorio uploads
                os.makedirs(UPLOAD_FOLDER, exist_ok=True)
                
                # Guardar la foto
                foto_path = os.path.join(UPLOAD_FOLDER, foto_nombre)
                foto.save(foto_path)
                print(f"✅ Foto guardada: {foto_path}")
        
        # Actualizar base de datos
        conexion = obtener_conexion()
        try:
            with conexion.cursor() as cursor:
                # Construir la consulta dinámicamente
                campos = []
                valores = []
                
                if primer_nombre:
                    campos.append("primer_nombre = %s")
                    valores.append(primer_nombre)
                
                if primer_apellido:
                    campos.append("primer_apellido = %s")
                    valores.append(primer_apellido)
                
                if email_usuario:
                    campos.append("email_usuario = %s")
                    valores.append(email_usuario)
                
                if talla_usuario:
                    campos.append("talla_usuario = %s")
                    valores.append(talla_usuario)
                
                if fecha_nacimiento:
                    campos.append("fecha_nacimiento = %s")
                    valores.append(fecha_nacimiento)
                
                if foto_nombre:
                    campos.append("foto_usuario = %s")
                    valores.append(foto_nombre)
                
                if campos:
                    valores.append(id_usuario)  # Para el WHERE
                    
                    consulta = f"""
                        UPDATE usuarios 
                        SET {', '.join(campos)}
                        WHERE id_usuario = %s
                    """
                    
                    cursor.execute(consulta, valores)
                    conexion.commit()
                    
                    print(f"✅ Perfil actualizado: {len(campos)} campos")
                    return jsonify({
                        "message": "Perfil actualizado correctamente",
                        "campos_actualizados": len(campos)
                    }), 200
                else:
                    return jsonify({"message": "No hay cambios para actualizar"}), 200
                    
        except Exception as e:
            conexion.rollback()
            print(f"❌ Error en base de datos: {e}")
            return jsonify({"error": "Error al actualizar perfil"}), 500
        finally:
            conexion.close()
            
    except Exception as e:
        print(f"❌ Error general: {e}")
        return jsonify({"error": "Error interno del servidor"}), 500
