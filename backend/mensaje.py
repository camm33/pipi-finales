import smtplib
import pymysql
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
from bd import obtener_conexion
from flask import Blueprint, request, jsonify

mensaje_bp = Blueprint('mensaje_bp', __name__)


class Mensaje:
    # Configuración del correo
    EMAIL = "appdoublepp@gmail.com"
    PASSWORD = "ssun pbmt motb lmxx"

    def __init__(self):
        pass

    def enviar_correo(self, destinatarios, texto):
        """destinatarios: string o lista de correos"""
        if isinstance(destinatarios, str):
            destinatarios = [destinatarios]

        if not destinatarios:
            return "No hay destinatarios válidos."

        # === Plantilla HTML global ===
        plantilla_html = f"""
        <div style="font-family:'Libre Baskerville','Merriweather','Garamond',serif;
                    background-color:#fdf8f2; padding:25px; border-radius:12px;
                    border:1px solid #e0cba8; max-width:480px; margin:auto;">
            <h2 style="color:#b68c56; text-align:center;">📩 Notificación de <b>Double π</b></h2>
            <p style="font-size:16px; color:#333; line-height:1.6;">
                {texto}
            </p>
            <hr style="border:none; border-top:1px solid #e8d7b2; margin:20px 0;">
            <p style="text-align:center; color:#999; font-size:12px;">
                © 2025 <b>Double π</b> — Sin límites, sin barreras, más tallas, más de ti ✨
            </p>
        </div>
        """

        try:
            # Enviar correo a cada destinatario con HTML
            for recipient in destinatarios:
                msg = MIMEMultipart("alternative")
                msg["From"] = self.EMAIL
                msg["To"] = recipient
                msg["Subject"] = "Notificación - Double π"

                # Agregamos la versión HTML (esto asegura los estilos)
                parte_html = MIMEText(plantilla_html, "html", "utf-8")
                msg.attach(parte_html)

                # Enviar
                with smtplib.SMTP("smtp.gmail.com", 587) as enviar:
                    enviar.starttls()
                    enviar.login(self.EMAIL, self.PASSWORD)
                    enviar.send_message(msg)

            return f"✅ Correo enviado correctamente a {', '.join(destinatarios)}"

        except Exception as e:
            return f"❌ Error al enviar el correo: {e}"

    def enviar_a_todos(self, texto):
        """Enviar correo a todos los usuarios"""
        correos = self.obtener_todos_los_correos()
        if not correos:
            return "No hay usuarios con correo."
        return self.enviar_correo(correos, texto)

    def obtener_todos_los_correos(self):
        conexion = obtener_conexion()
        correos = []
        try:
            with conexion.cursor() as cursor:
                cursor.execute("SELECT email FROM usuario")
                resultados = cursor.fetchall()
                correos = [r[0] for r in resultados if r and r[0]]
        finally:
            conexion.close()
        return correos


# --- Rutas API ---
@mensaje_bp.route('/api/enviar_correo', methods=['POST'])
def api_enviar_correo():
    data = request.get_json() or {}
    correo = data.get('correo')
    mensaje_texto = data.get('mensaje')
    enviar_todos = data.get('enviar_todos', False)

    servicio = Mensaje()

    if enviar_todos:
        resultado = servicio.enviar_a_todos(mensaje_texto)
        return jsonify({'ok': True, 'resultado': resultado})

    if not correo:
        return jsonify({'ok': False, 'resultado': 'No se proporcionó correo'}), 400

    resultado = servicio.enviar_correo(correo, mensaje_texto)
    return jsonify({'ok': True, 'resultado': resultado})


@mensaje_bp.route('/api/usuarios_emails', methods=['GET'])
def api_usuarios_emails():
    servicio = Mensaje()
    correos = servicio.obtener_todos_los_correos()
    return jsonify({'ok': True, 'emails': correos})
