import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";

import Home from "./Home";
import Iniciar from "./IniciarSesion";
import Agregar from "./AgregarPublicacion";
import Editar from "./editar_perfil";
import Register from "./register";
import MiPerfil from "./MiPerfil";
import DetallePrenda from "./DetallePrenda";
import VerPrenda from "./VerPrenda";
import AdminDashboard from "./AdminDashboard";
import ListaDeDeseos from "./ListaDeDeseos";
import AppPerfiles from "./perfiles";
import GestionarPrenda from "./GestionPublicaciones";
import Configuracion from "./Configuracion";
import Verificar from "./Verificar";
import MensajeAdmin from "./MensajeAdmin";
import RecuperarContrasena from "./RecuperarContrasena";
import RestablecerContrasena from "./RestablecerContrasena";
import Chat from "./Chat";
import ChatList from "./ChatList";
import FloatingChatButton from "./FloatingChatButton";

import Header from "./Header";
import HeaderAdmin from "./HeaderAdmin";
import Footer from "./Footer";
import PublicHeader from "./PublicHeader";

// Rutas privadas
function PrivateRoute({ isLoggedIn, children }) {
  console.log("🔒 PrivateRoute - isLoggedIn:", isLoggedIn);
  console.log("🔒 PrivateRoute - token en localStorage:", localStorage.getItem("token"));
  console.log("🔒 PrivateRoute - user en localStorage:", localStorage.getItem("user"));
  
  if (!isLoggedIn) {
    console.log("❌ PrivateRoute: Usuario no logueado, redirigiendo a /iniciar");
    return <Navigate to="/iniciar" />;
  }
  
  console.log("✅ PrivateRoute: Usuario logueado, permitiendo acceso");
  return children;
}

// Rutas públicas
function PublicRoute({ isLoggedIn, children, redirectTo = "/" }) {
  return !isLoggedIn ? children : <Navigate to={redirectTo} />;
}

// Rutas para Admin
function AdminRoute({ isLoggedIn, children }) {
  const idRol = localStorage.getItem("id_rol");
  return isLoggedIn && (idRol === "1" || idRol === 1)
    ? children
    : <Navigate to="/iniciar" />;
}

// 🔹 Nueva ruta para usuarios normales (evita que admin acceda a catálogo)
function UserRoute({ isLoggedIn, children }) {
  const idRol = localStorage.getItem("id_rol");
  return isLoggedIn && (idRol === "2" || idRol === 2) // asumo que el rol 2 = usuario normal
    ? children
    : <Navigate to="/" />;
}

// Layout
function Layout({ header, children }) {
  return (
    <>
      {header}
      {children}
      <FloatingChatButton />
      <Footer />
    </>
  );
}

// App
function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  // Función para verificar autenticación
  const checkAuthentication = () => {
    const token = localStorage.getItem("token");
    const user = localStorage.getItem("user");
    const id_usuario = localStorage.getItem("id_usuario");
    
    const isAuthenticated = !!(token || user || id_usuario);
    
    console.log("🔍 Verificando autenticación:");
    console.log("- Token:", token);
    console.log("- User:", user);
    console.log("- ID Usuario:", id_usuario);
    console.log("- isAuthenticated:", isAuthenticated);
    
    setIsLoggedIn(isAuthenticated);
    return isAuthenticated;
  };

  useEffect(() => {
    // Verificar autenticación inicial
    checkAuthentication();

    // Listener para cambios en localStorage (para detectar login/logout)
    const handleStorageChange = (e) => {
      if (e.key === 'token' || e.key === 'user' || e.key === 'id_usuario') {
        console.log("👂 Detectado cambio en localStorage:", e.key, e.newValue);
        checkAuthentication();
      }
    };

    window.addEventListener('storage', handleStorageChange);

    // Cleanup
    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, []);

  // Función para refrescar el estado de autenticación (puede ser llamada por otros componentes)
  const refreshAuth = () => {
    return checkAuthentication();
  };

  return (
    <Router>
      <div className="App">
        <main>
          <Routes>

            <Route
              path="/"
              element={
                isLoggedIn ? (
                  localStorage.getItem("id_rol") === "1" ? (
                    <Navigate to="/AdminDashboard" />
                  ) : (
                    <Navigate to="/catalogo" />
                  )
                ) : (
                  <Layout header={<PublicHeader />}>
                    <Home />
                  </Layout>
                )
              }
            />

            {/* Catálogo → solo usuarios normales */}
            <Route
              path="/catalogo"
              element={
                <UserRoute isLoggedIn={isLoggedIn}>
                  <Layout header={<Header setIsLoggedIn={setIsLoggedIn} />}>
                    <Home />
                  </Layout>
                </UserRoute>
              }
            />

            {/* Registro */}
            <Route
              path="/register"
              element={
                <PublicRoute isLoggedIn={isLoggedIn}>
                  <Register setIsLoggedIn={setIsLoggedIn} />
                </PublicRoute>
              }
            />
             {/* Verificar */}
<Route
  path="/verificar"
  element={
    <PublicRoute isLoggedIn={isLoggedIn}>
      <Verificar />
    </PublicRoute>
  }
/>

            {/* Login */}
            <Route
              path="/iniciar"
              element={
                <PublicRoute isLoggedIn={isLoggedIn}>
                  <Iniciar setIsLoggedIn={setIsLoggedIn} />
                </PublicRoute>
              }
            />

            {/* Recuperar contraseña */}
            <Route
              path="/recuperar-contrasena"
              element={
                <PublicRoute isLoggedIn={isLoggedIn}>
                  <RecuperarContrasena />
                </PublicRoute>
              }
            />

            {/* Restablecer contraseña */}
            <Route
              path="/restablecer-contrasena"
              element={
                <PublicRoute isLoggedIn={isLoggedIn}>
                  <RestablecerContrasena />
                </PublicRoute>
              }
            />

            {/* Mi perfil */}
            <Route
              path="/MiPerfil"
              element={
                <PrivateRoute isLoggedIn={isLoggedIn}>
                  <Layout header={<Header setIsLoggedIn={setIsLoggedIn} />}>
                    <MiPerfil />
                  </Layout>
                </PrivateRoute>
              }
            />

            {/* Agregar publicación */}
            <Route
              path="/agregar"
              element={
                <PrivateRoute isLoggedIn={isLoggedIn}>
                  <Layout header={<Header setIsLoggedIn={setIsLoggedIn} />}>
                    <Agregar />
                  </Layout>
                </PrivateRoute>
              }
            />

            {/* Editar perfil */}
            <Route
              path="/editar"
              element={
                <PrivateRoute isLoggedIn={isLoggedIn}>
                  <Layout header={<Header setIsLoggedIn={setIsLoggedIn} />}>
                    <Editar />
                  </Layout>
                </PrivateRoute>
              }
            />

            {/* Detalle prenda */}
            <Route
              path="/detalle_prenda/:id"
              element={
                <PrivateRoute isLoggedIn={isLoggedIn}>
                  <Layout header={<Header setIsLoggedIn={setIsLoggedIn} />}>
                    <DetallePrenda />
                  </Layout>
                </PrivateRoute>
              }
            />

            {/* Lista de deseos */}
            <Route
              path="/lista_deseos"
              element={
                <PrivateRoute isLoggedIn={isLoggedIn}>
                  <Layout header={<Header setIsLoggedIn={setIsLoggedIn} />}>
                    <ListaDeDeseos />
                  </Layout>
                </PrivateRoute>
              }
            />

            <Route
              path="/configuracion"
              element={
                <PrivateRoute isLoggedIn={isLoggedIn}>
                  <Layout header={<Header setIsLoggedIn={setIsLoggedIn} />}>
                    <Configuracion />
                  </Layout>
                </PrivateRoute>
              }
            />

            {/* Ver perfil de otro usuario */}
            <Route
              path="/perfil/:id_usuario"
              element={
                <PrivateRoute isLoggedIn={isLoggedIn}>
                  <Layout header={<Header setIsLoggedIn={setIsLoggedIn} />}>
                    <AppPerfiles />
                  </Layout>
                </PrivateRoute>
              }
            />

            {/* Chat con usuario específico */}
            <Route
              path="/chat/:id_destinatario"
              element={
                <PrivateRoute isLoggedIn={isLoggedIn}>
                  <Layout header={<Header setIsLoggedIn={setIsLoggedIn} />}>
                    <Chat />
                  </Layout>
                </PrivateRoute>
              }
            />

            {/* Lista de chats - Messenger */}
            <Route
              path="/mensajes"
              element={
                <PrivateRoute isLoggedIn={isLoggedIn}>
                  <Layout header={<Header setIsLoggedIn={setIsLoggedIn} />}>
                    <ChatList />
                  </Layout>
                </PrivateRoute>
              }
            />

            {/* Dashboard de administrador */}
            <Route
              path="/AdminDashboard"
              element={
                <AdminRoute isLoggedIn={isLoggedIn}>
                  <Layout header={<HeaderAdmin setIsLoggedIn={setIsLoggedIn} />}>
                    <AdminDashboard />
                  </Layout>
                </AdminRoute>
              }
            />

              {/* Enviar mensaje (Admin) */}
              <Route
                path="/AdminDashboard/mensaje"
                element={
                  <AdminRoute isLoggedIn={isLoggedIn}>
                    <Layout header={<HeaderAdmin setIsLoggedIn={setIsLoggedIn} />}>
                      <MensajeAdmin />
                    </Layout>
                  </AdminRoute>
                }
              />

            <Route
              path="/gestion_prendas/:id"
              element={
                <PrivateRoute isLoggedIn={isLoggedIn}>
                  <Layout header={<Header setIsLoggedIn={setIsLoggedIn} />}>
                    <GestionarPrenda />
                  </Layout>
                </PrivateRoute>
              }
            />

            <Route
              path="/ver_prenda/:id"
              element={
                <PrivateRoute isLoggedIn={isLoggedIn}>
                  <Layout header={<Header setIsLoggedIn={setIsLoggedIn} />}>
                    <VerPrenda />
                  </Layout>
                </PrivateRoute>
              }
            />

            <Route
              path="/ver_prenda/:id"
              element={
                <Layout header={<Header setIsLoggedIn={setIsLoggedIn} />}>
                  <DetallePrenda />
                </Layout>
              }
            />

      

            {/* Redirección por defecto */}
            <Route path="*" element={<Navigate to="/" />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;
