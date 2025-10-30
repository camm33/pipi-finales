import React from 'react';
import './Footer.css'; 

function Footer() {
  return (
    <footer className="footer-container">
      <div className="footer-content">
        {/* Sección izquierda - Newsletter y redes sociales */}
        <div className="footer-left">
          <div className="footer-logo">
            <h3>Double Π</h3>
            <p>&copy; {new Date().getFullYear()}</p>
            
          </div>
          
          <div className="social-connect">
            <p>Conecta con nosotros</p>
            <div className="social-icons">
              <a href="https://x.com/DDOUBLE_PPP" target="_blank" rel="noopener noreferrer" className="social-icon">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M18.901 1.153h3.68l-8.04 9.19L24 22.846h-7.406l-5.8-7.584-6.638 7.584H.474l8.6-9.83L0 1.154h7.594l5.243 6.932ZM17.61 20.644h2.039L6.486 3.24H4.298Z"/>
                </svg>
              </a>
              <a href="https://m.facebook.com/DDOUBLEPP/" target="_blank" rel="noopener noreferrer" className="social-icon">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                </svg>
              </a>
              <a href="https://www.instagram.com/ddouble__pi?igsh=YTY1bDAzaDAzMjhx&utm_source=qr" target="_blank" rel="noopener noreferrer" className="social-icon">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                </svg>
              </a>
              <a href="https://pin.it/5yW7QgyGE" target="_blank" rel="noopener noreferrer" className="social-icon">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 0C5.374 0 0 5.374 0 12s5.374 12 12 12 12-5.374 12-12S18.626 0 12 0zm5.568 8.16c-.169 1.858-.896 3.175-1.84 4.12-.944.944-2.405 1.669-4.263 1.84-.927.085-1.816.016-2.448-.188 1.509-.784 2.051-1.49 2.287-2.688-.328-.066-.66-.175-.962-.328-1.564-.789-2.372-2.163-2.372-3.748 0-1.313.522-2.432 1.434-3.136.912-.703 2.101-1.042 3.329-1.042 1.369 0 2.4.466 3.073 1.371.673.905.832 2.071.762 3.199z"/>
                </svg>
              </a>
            </div>
          </div>
        </div>

        {/* Secciones del centro - Enlaces */}
        <div className="footer-center">
          <div className="footer-column">
            <h4>El Proyecto</h4>
            <ul>
              <li><a href="/catalogo">Catálogo</a></li>
              <li><a href="/register">Registro</a></li>
              <li><a href="/home">Inicio</a></li>
              <li><a href="/mi-perfil">Mi Perfil</a></li>
            </ul>
          </div>

          <div className="footer-column">
            <h4>Aprende Más</h4>
            <ul>
              <li><a href="/preguntas-frecuentes">Preguntas Frecuentes</a></li>
              <li><a href="/politicas">Políticas</a></li>
              <li><a href="/configuracion">Configuración</a></li>
              <li><a href="/chat">Chat</a></li>
            </ul>
          </div>

          <div className="footer-column">
            <h4>Soporte</h4>
            <ul>
              <li><a href="/contacto">Contacto</a></li>
              <li><a href="/ayuda">Centro de Ayuda</a></li>
              <li><a href="/reportes">Reportes</a></li>
              <li><a href="/terminos">Términos de Uso</a></li>
            </ul>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;