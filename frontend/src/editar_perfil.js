import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./EditarPerfil.css";

function EditarPerfil() {
  const navigate = useNavigate();
  const [primerNombre, setPrimerNombre] = useState("");
  const [segundoNombre, setSegundoNombre] = useState("");
  const [primerApellido, setPrimerApellido] = useState("");
  const [segundoApellido, setSegundoApellido] = useState("");
  const [email, setEmail] = useState("");
  const [fechaNacimiento, setFechaNacimiento] = useState("");
  const [talla, setTalla] = useState("");
  const [contrasena, setContrasena] = useState("");
  const [foto, setFoto] = useState(null);
  const [mensaje, setMensaje] = useState("");
  const [cargando, setCargando] = useState(true);

  const BACKEND_URL = "http://localhost:5000";

  useEffect(() => {
    fetch(`${BACKEND_URL}/api/mi_perfil`, {
      credentials: "include",
    })
      .then((res) => {
        if (!res.ok) throw new Error("Error al cargar perfil");
        return res.json();
      })
      .then((data) => {
        console.log("Datos del perfil para editar:", data);
        if (data.perfil) {
          const perfil = data.perfil;
          setPrimerNombre(perfil.PrimerNombre || "");
          setSegundoNombre(perfil.SegundoNombre || "");
          setPrimerApellido(perfil.PrimerApellido || "");
          setSegundoApellido(perfil.SegundoApellido || "");
          setEmail(perfil.email_usuario || "");
          setFechaNacimiento(perfil.fecha_nacimiento ? perfil.fecha_nacimiento.split('T')[0] : "");
          setTalla(perfil.talla_usuario || "");
        }
        setCargando(false);
      })
      .catch((err) => {
        console.error("Error al cargar perfil:", err);
        setMensaje("❌ Error al cargar perfil");
        setCargando(false);
      });
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMensaje("");

    const formData = new FormData();

    // Agregar todos los campos si tienen contenido
    if (primerNombre.trim() !== "") {
      formData.append("primer_nombre", primerNombre.trim());
    }
    if (segundoNombre.trim() !== "") {
      formData.append("segundo_nombre", segundoNombre.trim());
    }
    if (primerApellido.trim() !== "") {
      formData.append("primer_apellido", primerApellido.trim());
    }
    if (segundoApellido.trim() !== "") {
      formData.append("segundo_apellido", segundoApellido.trim());
    }
    if (email.trim() !== "") {
      formData.append("email", email.trim());
    }
    if (fechaNacimiento.trim() !== "") {
      formData.append("fecha_nacimiento", fechaNacimiento.trim());
    }
    if (talla.trim() !== "") {
      formData.append("talla", talla.trim());
    }
    // Contraseña si tiene contenido
    if (contrasena.trim() !== "") {
      formData.append("contrasena", contrasena.trim());
    }
    // Foto si está seleccionada
    if (foto) {
      formData.append("foto", foto);
    }

    try {
      const res = await fetch(`${BACKEND_URL}/api/perfil`, {
        method: "POST",
        body: formData,
        credentials: "include",
      });

      const data = await res.json();

      if (res.ok) {
        setMensaje("✅ Perfil actualizado correctamente");
        setContrasena(""); // limpiar contraseña
      } else {
        setMensaje("❌ Error al actualizar: " + (data.error || "Intenta de nuevo"));
      }
    } catch (error) {
      console.error("❌ Error en envío:", error);
      setMensaje("❌ No se pudo conectar con el servidor");
    }
  };

  if (cargando) return <p className="cargando">Cargando perfil...</p>;

  return (
    <div className="editar-perfil">
      <div className="perfil-card">
        <h3>Editar Perfil</h3>

        <form
          onSubmit={handleSubmit}
          encType="multipart/form-data"
          autoComplete="off"
        >
          {/* Inputs ocultos para evitar autocompletado indeseado */}
          <input
            type="text"
            name="fakeuser"
            style={{ display: "none" }}
            autoComplete="username"
          />
          <input
            type="password"
            name="fakepass"
            style={{ display: "none" }}
            autoComplete="new-password"
          />

          <div className="form-group">
            <label>Primer Nombre:</label>
            <input
              type="text"
              name="primer_nombre"
              value={primerNombre}
              onChange={(e) => setPrimerNombre(e.target.value)}
              autoComplete="off"
              placeholder="Primer nombre"
            />
          </div>

          <div className="form-group">
            <label>Segundo Nombre (Opcional):</label>
            <input
              type="text"
              name="segundo_nombre"
              value={segundoNombre}
              onChange={(e) => setSegundoNombre(e.target.value)}
              autoComplete="off"
              placeholder="Segundo nombre (opcional)"
            />
          </div>

          <div className="form-group">
            <label>Primer Apellido:</label>
            <input
              type="text"
              name="primer_apellido"
              value={primerApellido}
              onChange={(e) => setPrimerApellido(e.target.value)}
              autoComplete="off"
              placeholder="Primer apellido"
            />
          </div>

          <div className="form-group">
            <label>Segundo Apellido (Opcional):</label>
            <input
              type="text"
              name="segundo_apellido"
              value={segundoApellido}
              onChange={(e) => setSegundoApellido(e.target.value)}
              autoComplete="off"
              placeholder="Segundo apellido (opcional)"
            />
          </div>

          <div className="form-group">
            <label>Email:</label>
            <input
              type="email"
              name="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              autoComplete="off"
              placeholder="Correo electrónico"
            />
          </div>

          <div className="form-group">
            <label>Fecha de Nacimiento:</label>
            <input
              type="date"
              name="fecha_nacimiento"
              value={fechaNacimiento}
              onChange={(e) => setFechaNacimiento(e.target.value)}
              autoComplete="off"
            />
          </div>

          <div className="form-group">
            <label>Talla:</label>
            <input
              type="text"
              name="talla"
              value={talla}
              onChange={(e) => setTalla(e.target.value)}
              autoComplete="off"
              placeholder="Talla"
            />
          </div>

          <div className="form-group">
            <label>Contraseña nueva:</label>
            <input
              type="password"
              name="contrasena"
              value={contrasena}
              onChange={(e) => setContrasena(e.target.value)}
              placeholder="Deja vacío si no quieres cambiarla"
              autoComplete="new-password"
            />
          </div>

          <div className="form-group">
            <label>Foto de perfil:</label>
            <input
              type="file"
              name="foto"
              onChange={(e) => setFoto(e.target.files[0])}
              accept="image/*"
            />
          </div>

          <button type="submit" className="boton-guardar">
            GUARDAR
          </button>

          <button
            type="button"
            className="volver-btn"
            style={{
              position: "fixed",
              bottom: "30px",
              right: "30px",
              padding: "6px 10px",
              background: "#7c5e2c",
              color: "white",
              border: "none",
              borderRadius: "50%",
              fontSize: "20px",
              cursor: "pointer",
              boxShadow: "0 2px 6px rgba(0,0,0,0.15)",
            }}
            title="Volver al Catálogo"
            onClick={() => navigate("/catalogo")}
          >
            ←
          </button>
        </form>

        {mensaje && <p className="mensaje">{mensaje}</p>}
      </div>
    </div>
  );
}

export default EditarPerfil;
