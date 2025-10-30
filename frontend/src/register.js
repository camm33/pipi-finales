import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./register.css";

function Register() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    primer_nombre: "",
    segundo_nombre: "",
    primer_apellido: "",
    segundo_apellido: "",
    username: "",
    email: "",
    contrasena: "",
    talla: "",
    fecha_nacimiento: "",
    foto: null,
  });

  const [mensaje, setMensaje] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [previewImage, setPreviewImage] = useState(null);

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (files) {
      setFormData({ ...formData, [name]: files[0] });
      // Crear URL para previsualización de la imagen
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewImage(reader.result);
      };
      reader.readAsDataURL(files[0]);
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setMensaje("");

    try {
      const dataToSend = new FormData();
      Object.keys(formData).forEach((key) => {
        if (formData[key] !== null) {
          dataToSend.append(key, formData[key]);
        }
      });

      const response = await fetch("http://localhost:5000/register", {
        method: "POST",
        body: dataToSend,
        credentials: "include",
      });

      const result = await response.json();

      if (response.ok && result.success) {
        setMensaje("✅ " + result.mensaje);
        setTimeout(() => {
          navigate(`/verificar?email=${formData.email}`);
        }, 1500);
      } else {
        setMensaje("⚠ " + (result.mensaje || "Ocurrió un error en el registro."));
      }
    } catch (error) {
      console.error("❌ Error:", error);
      setMensaje("❌ Error en el servidor.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="register-container">
      {/* Sección izquierda */}
      <div className="register-left">
        <button className="back-arrow" onClick={() => navigate('/')}>
          ⟵
        </button>
        <div className="profile-content">
          <h1 className="brand-title">
            {formData.username || "Double Π"}
          </h1>
          <p className="welcome-text">
            ¡Bienvenido a Double Π! Tu destino para encontrar las mejores prendas de segunda mano.
          </p>
          <div 
            className={`circle-image ${previewImage ? 'has-image' : ''}`}
            onClick={() => document.getElementById('foto').click()}
          >
            {previewImage ? (
              <img 
                src={previewImage} 
                alt="Vista previa del perfil"
              />
            ) : (
              <div className="circle-image-placeholder">
                <svg viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zM12 5c1.66 0 3 1.34 3 3s-1.34 3-3 3-3-1.34-3-3 1.34-3 3-3zm0 14.2c-2.5 0-4.71-1.28-6-3.22.03-1.99 4-3.08 6-3.08 1.99 0 5.97 1.09 6 3.08-1.29 1.94-3.5 3.22-6 3.22z"/>
                </svg>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Sección derecha */}
      <div className="register-right">
        <main className="register-main">
          <h3>Crea una cuenta nueva</h3>
          <p>
            ¿Ya te has registrado?{" "}
            <Link to="/iniciar" className="login-link">
              Iniciar Sesión
            </Link>
          </p>

          {mensaje && (
            <p
              style={{
                textAlign: "center",
                color: mensaje.includes("✅") ? "green" : "red",
                fontWeight: "bold",
              }}
            >
              {mensaje}
            </p>
          )}

          <form className="register-form" onSubmit={handleSubmit}>
            <div>
              <label htmlFor="primer_nombre">* Primer nombre</label>
              <input
                type="text"
                id="primer_nombre"
                name="primer_nombre"
                value={formData.primer_nombre}
                onChange={handleChange}
                required
              />
            </div>

            <div>
              <label htmlFor="segundo_nombre">* Segundo nombre</label>
              <input
                type="text"
                id="segundo_nombre"
                name="segundo_nombre"
                value={formData.segundo_nombre}
                onChange={handleChange}
              />
            </div>

            <div>
              <label htmlFor="primer_apellido">* Primer apellido</label>
              <input
                type="text"
                id="primer_apellido"
                name="primer_apellido"
                value={formData.primer_apellido}
                onChange={handleChange}
                required
              />
            </div>

            <div>
              <label htmlFor="segundo_apellido">* Segundo apellido</label>
              <input
                type="text"
                id="segundo_apellido"
                name="segundo_apellido"
                value={formData.segundo_apellido}
                onChange={handleChange}
              />
            </div>

            <div>
              <label htmlFor="username">* Nombre de usuario</label>
              <input
                type="text"
                id="username"
                name="username"
                value={formData.username}
                onChange={handleChange}
                required
              />
            </div>

            <div>
              <label htmlFor="email">* Correo electrónico</label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
              />
            </div>

            <div>
              <label htmlFor="contrasena">* Contraseña</label>
              <input
                type="password"
                id="contrasena"
                name="contrasena"
                value={formData.contrasena}
                onChange={handleChange}
                required
                minLength={6}
              />
            </div>

            <div>
              <label htmlFor="talla">* Talla</label>
              <select
                id="talla"
                name="talla"
                value={formData.talla}
                onChange={handleChange}
                required
              >
                <option value="">Selecciona tu talla</option>
                <option value="XS">XS</option>
                <option value="S">S</option>
                <option value="M">M</option>
                <option value="L">L</option>
                <option value="XL">XL</option>
                <option value="XXL">XXL</option>
                <option value="Petite">Petite</option>
                <option value="Plus Size">Plus Size</option>
              </select>
            </div>

            <div>
              <label htmlFor="fecha_nacimiento">* Fecha de nacimiento</label>
              <input
                type="date"
                id="fecha_nacimiento"
                name="fecha_nacimiento"
                value={formData.fecha_nacimiento}
                onChange={handleChange}
                required
              />
            </div>

            <div>
              <label htmlFor="foto">* Foto de perfil</label>
              <input
                type="file"
                id="foto"
                name="foto"
                accept="image/*"
                onChange={handleChange}
                required
              />
            </div>

            <button
              type="submit"
              className="register-button"
              disabled={isSubmitting}
            >
              {isSubmitting ? "Registrando..." : "Registrarse"}
            </button>
          </form>
        </main>
      </div>
    </div>
  );
}

export default Register;
