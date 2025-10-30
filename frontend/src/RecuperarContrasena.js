import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./RecuperarContrasena.css";

function RecuperarContrasena() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [mensaje, setMensaje] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [emailEnviado, setEmailEnviado] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setMensaje("");

    try {
      const response = await fetch("http://localhost:5000/recuperar-contrasena", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ email }),
      });

      const result = await response.json();

      if (response.ok && result.success) {
        setEmailEnviado(true);
        setMensaje("✅ " + result.mensaje);
      } else {
        setMensaje("⚠ " + (result.mensaje || "Error al enviar el correo."));
      }
    } catch (error) {
      console.error("❌ Error:", error);
      setMensaje("❌ Error en la conexión con el servidor.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="recuperar-container">
      <div className="recuperar-left">
        <button className="back-arrow" onClick={() => navigate('/iniciar')}>
          ⟵
        </button>
        <div className="recuperar-content">
          <h1 className="brand-title">Double_P</h1>
          <p className="recuperar-text">
            {!emailEnviado 
              ? "¿Olvidaste tu contraseña? No te preocupes, te ayudamos a recuperarla."
              : "¡Perfecto! Hemos enviado las instrucciones a tu correo."
            }
          </p>
          <div className={`recuperar-icon ${emailEnviado ? 'success' : ''}`}>
            {!emailEnviado ? (
              <svg viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-6h2v6zm0-8h-2V7h2v2z"/>
              </svg>
            ) : (
              <svg viewBox="0 0 24 24" fill="currentColor">
                <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/>
              </svg>
            )}
          </div>
        </div>
      </div>

      <div className="recuperar-right">
        <main className="recuperar-main">
          <h2>Recuperar Contraseña</h2>
          {!emailEnviado ? (
            <>
              <h3>Ingresa tu correo electrónico</h3>
              <p>
                Te enviaremos un enlace para restablecer tu contraseña.
              </p>

              {mensaje && (
                <div className="recuperar-mensaje">
                  {mensaje}
                </div>
              )}

              <form className="recuperar-form" onSubmit={handleSubmit}>
                <div>
                  <label htmlFor="email">Correo electrónico</label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    placeholder="Ingresa tu correo electrónico"
                  />
                </div>

                <button
                  type="submit"
                  className="recuperar-button"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? "Enviando..." : "Enviar enlace"}
                </button>
              </form>

              <div className="recuperar-links">
                <p>
                  ¿Recordaste tu contraseña?{" "}
                  <button 
                    type="button" 
                    className="link-button"
                    onClick={() => navigate('/iniciar')}
                  >
                    Iniciar sesión
                  </button>
                </p>
              </div>
            </>
          ) : (
            <div className="email-enviado">
              <h3>¡Correo enviado!</h3>
              <div className="email-info">
                <p>
                  Hemos enviado un enlace de recuperación a
                </p>
                <div className="email-address">
                  {email}
                </div>
                <p>
                  Revisa tu bandeja de entrada y sigue las instrucciones para restablecer tu contraseña.
                </p>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}

export default RecuperarContrasena;