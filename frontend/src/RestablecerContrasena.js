import React, { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import "./RestablecerContrasena.css";

function RestablecerContrasena() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [formData, setFormData] = useState({
    nueva_contrasena: "",
    confirmar_contrasena: ""
  });
  const [mensaje, setMensaje] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [tokenValido, setTokenValido] = useState(null);
  const [contrasenaRestablecida, setContrasenaRestablecida] = useState(false);
  const token = searchParams.get('token');

  useEffect(() => {
    if (!token) {
      setTokenValido(false);
      setMensaje("⚠ Token no válido o faltante");
    } else {
      setTokenValido(true);
    }
  }, [token]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setMensaje("");

    // Validar que las contraseñas coincidan
    if (formData.nueva_contrasena !== formData.confirmar_contrasena) {
      setMensaje("⚠ Las contraseñas no coinciden");
      setIsSubmitting(false);
      return;
    }

    // Validar longitud mínima
    if (formData.nueva_contrasena.length < 6) {
      setMensaje("⚠ La contraseña debe tener al menos 6 caracteres");
      setIsSubmitting(false);
      return;
    }

    try {
      const response = await fetch("http://localhost:5000/restablecer-contrasena", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          token: token,
          nueva_contrasena: formData.nueva_contrasena
        }),
      });

      const result = await response.json();

      if (response.ok && result.success) {
        setContrasenaRestablecida(true);
        setMensaje("✅ " + result.mensaje);
        setTimeout(() => {
          navigate("/iniciar");
        }, 2000);
      } else {
        setMensaje("⚠ " + (result.mensaje || "Error al restablecer la contraseña."));
      }
    } catch (error) {
      console.error("❌ Error:", error);
      setMensaje("❌ Error en la conexión con el servidor.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (tokenValido === false) {
    return (
      <div className="restablecer-container">
        <div className="restablecer-left">
          <button className="back-arrow" onClick={() => navigate('/iniciar')}>
            ⟵
          </button>
          <div className="restablecer-content">
            <h1 className="brand-title">Double_P</h1>
            <p className="restablecer-text">
              El enlace de recuperación no es válido o ha expirado.
            </p>
            <div className="restablecer-icon error">
              <svg viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z"/>
              </svg>
            </div>
          </div>
        </div>

        <div className="restablecer-right">
          <main className="restablecer-main">
            <h2>Enlace no válido</h2>
            <p>
              El enlace de recuperación no es válido o ha expirado.
              Solicita un nuevo enlace de recuperación.
            </p>
            <button
              type="button"
              className="restablecer-button"
              onClick={() => navigate('/recuperar-contrasena')}
            >
              Solicitar nuevo enlace
            </button>
          </main>
        </div>
      </div>
    );
  }

  return (
    <div className="restablecer-container">
      <div className="restablecer-left">
        <button className="back-arrow" onClick={() => navigate('/iniciar')}>
          ⟵
        </button>
        <div className="restablecer-content">
          <h1 className="brand-title">Double_P</h1>
          <p className="restablecer-text">
            Ingresa tu nueva contraseña para completar la recuperación.
          </p>
          <div className={`restablecer-icon ${contrasenaRestablecida ? 'success' : ''}`}>
            <svg viewBox="0 0 24 24" fill="currentColor">
              {contrasenaRestablecida ? (
                <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/>
              ) : (
                <path d="M18 8h-1V6c0-2.76-2.24-5-5-5S7 3.24 7 6v2H6c-1.1 0-2 .9-2 2v10c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V10c0-1.1-.9-2-2-2zM9 6c0-1.66 1.34-3 3-3s3 1.34 3 3v2H9V6zm9 14H6V10h12v10zm-6-3c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2z"/>
              )}
            </svg>
          </div>
        </div>
      </div>

      <div className="restablecer-right">
        <main className="restablecer-main">
          <h2>Nueva Contraseña</h2>
          <h3>Crear nueva contraseña</h3>
          <p>
            Ingresa una contraseña segura para tu cuenta.
          </p>

          {mensaje && (
            <div className="restablecer-mensaje">
              {mensaje}
            </div>
          )}

          <form className="restablecer-form" onSubmit={handleSubmit}>
            <div>
              <label htmlFor="nueva_contrasena">Nueva contraseña</label>
              <input
                type="password"
                id="nueva_contrasena"
                name="nueva_contrasena"
                value={formData.nueva_contrasena}
                onChange={handleChange}
                required
                minLength={6}
                placeholder="Ingresa tu nueva contraseña"
              />
            </div>

            <div>
              <label htmlFor="confirmar_contrasena">Confirmar contraseña</label>
              <input
                type="password"
                id="confirmar_contrasena"
                name="confirmar_contrasena"
                value={formData.confirmar_contrasena}
                onChange={handleChange}
                required
                minLength={6}
                placeholder="Confirma tu nueva contraseña"
              />
            </div>

            <button
              type="submit"
              className="restablecer-button"
              disabled={isSubmitting}
            >
              {isSubmitting ? "Actualizando..." : "Actualizar contraseña"}
            </button>
          </form>

          <div className="restablecer-links">
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
        </main>
      </div>
    </div>
  );
}

export default RestablecerContrasena;