from flask import Blueprint, request, jsonify, current_app
from flask_mail import Message
import secrets
import datetime
import bcrypt

# Crear Blueprint
recuperar_bp = Blueprint('recuperar', __name__)

@recuperar_bp.route('/recuperar-contrasena', methods=['POST'])
def recuperar_contrasena():
    try:
        # Importar dentro de la función para evitar importación circular
        from app import mail, mysql
        
        data = request.get_json()
        email = data.get('email')
        
        if not email:
            return jsonify({
                'success': False,
                'mensaje': 'El correo electrónico es requerido'
            }), 400
        
        # Verificar si el usuario existe
        cursor = mysql.connection.cursor()
        cursor.execute("SELECT id_usuario, primer_nombre FROM usuario WHERE email = %s", (email,))
        usuario = cursor.fetchone()
        
        if not usuario:
            return jsonify({
                'success': False,
                'mensaje': 'No existe una cuenta asociada a este correo electrónico'
            }), 404
        
        # Generar token de recuperación
        token = secrets.token_urlsafe(32)
        expiracion = datetime.datetime.now() + datetime.timedelta(hours=1)  # Token válido por 1 hora
        
        # Guardar token en la base de datos
        cursor.execute("""
            INSERT INTO tokens_recuperacion (id_usuario, token, expiracion, usado) 
            VALUES (%s, %s, %s, %s)
            ON DUPLICATE KEY UPDATE 
            token = VALUES(token), 
            expiracion = VALUES(expiracion), 
            usado = 0
        """, (usuario[0], token, expiracion, False))
        mysql.connection.commit()
        cursor.close()
        
        # Enviar correo
        try:
            msg = Message(
                'Recuperación de contraseña - Double P',
                recipients=[email]
            )
            
            # URL de recuperación (en un entorno real sería tu dominio)
            recovery_url = f"http://localhost:3000/restablecer-contrasena?token={token}"
            
            msg.html = f"""
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                <h2 style="color: #9A7738;">Recuperación de contraseña</h2>
                <p>Hola {usuario[1]},</p>
                <p>Recibimos una solicitud para restablecer la contraseña de tu cuenta en Double P.</p>
                <p>Haz clic en el siguiente enlace para restablecer tu contraseña:</p>
                <div style="text-align: center; margin: 30px 0;">
                    <a href="{recovery_url}" 
                       style="background-color: #9A7738; color: white; padding: 15px 30px; 
                              text-decoration: none; border-radius: 8px; display: inline-block; 
                              font-weight: bold; font-size: 16px;">
                        Restablecer contraseña
                    </a>
                </div>
                <p>O copia y pega este enlace en tu navegador:</p>
                <p style="word-break: break-all; background: #f5f5f5; padding: 10px; border-radius: 4px;">
                    {recovery_url}
                </p>
                <p><strong>Este enlace es válido por 1 hora.</strong></p>
                <p>Si no solicitaste este cambio, puedes ignorar este correo.</p>
                <hr style="margin: 30px 0; border: 1px solid #eee;">
                <p style="font-size: 12px; color: #666;">
                    Este es un correo automático, por favor no respondas a este mensaje.
                </p>
            </div>
            """
            
            mail.send(msg)
            
            return jsonify({
                'success': True,
                'mensaje': 'Se ha enviado un enlace de recuperación a tu correo electrónico'
            }), 200
            
        except Exception as e:
            print(f"Error enviando correo: {e}")
            return jsonify({
                'success': False,
                'mensaje': 'Error al enviar el correo. Inténtalo más tarde.'
            }), 500
            
    except Exception as e:
        print(f"Error en recuperar contraseña: {e}")
        return jsonify({
            'success': False,
            'mensaje': 'Error interno del servidor'
        }), 500

@recuperar_bp.route('/restablecer-contrasena', methods=['POST'])
def restablecer_contrasena():
    try:
        # Importar dentro de la función para evitar importación circular
        from app import mysql
        
        data = request.get_json()
        token = data.get('token')
        nueva_contrasena = data.get('nueva_contrasena')
        
        if not token or not nueva_contrasena:
            return jsonify({
                'success': False,
                'mensaje': 'Token y nueva contraseña son requeridos'
            }), 400
        
        # Verificar token
        cursor = mysql.connection.cursor()
        cursor.execute("""
            SELECT tr.id_usuario, u.email 
            FROM tokens_recuperacion tr 
            JOIN usuario u ON tr.id_usuario = u.id_usuario 
            WHERE tr.token = %s AND tr.expiracion > NOW() AND tr.usado = 0
        """, (token,))
        resultado = cursor.fetchone()
        
        if not resultado:
            return jsonify({
                'success': False,
                'mensaje': 'Token inválido o expirado'
            }), 400
        
        id_usuario = resultado[0]
        
        # Hashear la nueva contraseña antes de guardar
        hashed_password = bcrypt.hashpw(nueva_contrasena.encode('utf-8'), bcrypt.gensalt()).decode('utf-8')
        
        # Actualizar contraseña
        cursor.execute("""
            UPDATE usuario SET contrasena = %s WHERE id_usuario = %s
        """, (hashed_password, id_usuario))
        
        # Marcar token como usado
        cursor.execute("""
            UPDATE tokens_recuperacion SET usado = 1 WHERE token = %s
        """, (token,))
        
        mysql.connection.commit()
        cursor.close()
        
        return jsonify({
            'success': True,
            'mensaje': 'Contraseña actualizada correctamente'
        }), 200
        
    except Exception as e:
        print(f"Error en restablecer contraseña: {e}")
        return jsonify({
            'success': False,
            'mensaje': 'Error interno del servidor'
        }), 500