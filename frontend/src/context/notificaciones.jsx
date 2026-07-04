"use client";
import React, { createContext, useContext, useEffect, useState } from 'react';
import { io } from 'socket.io-client';

// Función manual para decodificar JWT sin librerías externas
const parseJwt = (token) => {
  try {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(atob(base64).split('').map(function(c) {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
    }).join(''));
    return JSON.parse(jsonPayload);
  } catch (e) {
    return null;
  }
};

// Simulación del router de Next.js para evitar errores
const useRouter = () => ({
  push: (url) => console.log(`Redirigiendo a: ${url}`)
});

const NotificationContext = createContext();

export const useNotification = () => useContext(NotificationContext);

export const NotificationProvider = ({ children }) => {
  const [socket, setSocket] = useState(null);
  const [notifications, setNotifications] = useState([]);
  const [isOpen, setIsOpen] = useState(false); // Estado para abrir/cerrar el panel
  const router = useRouter();

  useEffect(() => {
    // obtener el token
    const token = typeof window !== 'undefined' ? localStorage.getItem('TOKENJWT') : null;
    
    if (token) {
      try {
        const decoded = parseJwt(token);
        const userId = decoded ? decoded.sub : 1; 

        // Inicializar conexión Socket.IO
        const socketInstance = io(process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:5000', {
          transports: ['websocket'],
          reconnectionAttempts: 5,
        });

        socketInstance.on('connect', () => {
          console.log('Conectado a WebSockets');
          socketInstance.emit('join_notifications', { user_id: userId });
        });

        socketInstance.on('new_notification', (data) => {
          console.log("Nueva notificación recibida:", data);
          const newNotif = { ...data, id: Date.now() };
          
          // Añadir notificación a la pila
          setNotifications((prev) => [newNotif, ...prev]);
          
        });

        setSocket(socketInstance);

        return () => {
          socketInstance.disconnect();
        };
      } catch (error) {
        console.error("Error decodificando token o conectando socket:", error);
      }
    }
  }, []);

  const removeNotification = (id) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
  };

  const clearAll = () => setNotifications([]);

  const unreadCount = notifications.length;

  return (
    <NotificationContext.Provider value={{ socket, notifications }}>
      {children}
      
      {/* Contenedor de la burbuja flotante en la esquina inferior derecha */}
      <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end">
        
        {/* Panel desplegable de notificaciones */}
        {isOpen && (
          <div className="mb-4 w-80 sm:w-96 bg-white/95 backdrop-blur-xl border border-gray-200 shadow-2xl rounded-2xl overflow-hidden animate-fade-in-up origin-bottom-right">
            <div className="p-4 bg-gray-50 border-b border-gray-100 flex justify-between items-center">
              <h3 className="font-bold text-gray-800">Notificaciones</h3>
              {unreadCount > 0 && (
                <button 
                  onClick={clearAll}
                  className="text-xs text-purple-600 hover:text-purple-800 font-semibold transition-colors"
                >
                  Limpiar todo
                </button>
              )}
            </div>
            
            <div className="max-h-96 overflow-y-auto p-2 custom-scrollbar">
              {notifications.length === 0 ? (
                <div className="p-8 text-center text-gray-500 flex flex-col items-center">
                  <span className="text-4xl mb-3 opacity-50"></span>
                  <p className="text-sm font-medium">No tienes notificaciones nuevas</p>
                </div>
              ) : (
                notifications.map((notif) => (
                  <div 
                    key={notif.id} 
                    className="p-3 mb-2 bg-white hover:bg-purple-50/50 rounded-xl transition-all border border-transparent hover:border-purple-100 relative group cursor-pointer"
                    onClick={() => {
                      router.push('/misreservas');
                      removeNotification(notif.id);
                      if (notifications.length === 1) setIsOpen(false); // Cierra si era la última
                    }}
                  >
                    <div className="flex gap-3 items-start">
                      {/* Icono miniatura */}
                      <div className="flex-shrink-0 mt-0.5">
                        {notif.type === 'new_request' ? (
                           <div className="w-10 h-10 rounded-full bg-purple-100 flex items-center justify-center overflow-hidden border border-purple-200">
                             {notif.pet_photo ? (
                               <img src={notif.pet_photo} alt="Pet" className="w-full h-full object-cover" />
                             ) : (
                               <span className="text-lg">🐾</span>
                             )}
                           </div>
                        ) : (
                           <div className={`w-10 h-10 rounded-full flex items-center justify-center text-lg ${notif.status === 'aceptado' ? 'bg-green-100 border border-green-200' : 'bg-red-100 border border-red-200'}`}>
                              {notif.status === 'aceptado' ? '✨' : '😞'}
                           </div>
                        )}
                      </div>
                      
                      {/* Textos */}
                      <div className="flex-1 min-w-0 pr-6">
                        <p className="text-sm font-bold text-gray-900 leading-tight">
                          {notif.title}
                        </p>
                        <p className="text-xs text-gray-600 mt-1 line-clamp-2">
                          {notif.message}
                        </p>
                      </div>
                    </div>

                    {/* Botón oculto para eliminar una sola notificación */}
                    <button 
                      onClick={(e) => {
                        e.stopPropagation(); // Evita que se dispare el onClick de toda la tarjeta
                        removeNotification(notif.id);
                      }}
                      className="absolute top-3 right-3 w-6 h-6 flex items-center justify-center rounded-full bg-gray-100 text-gray-400 hover:bg-gray-200 hover:text-gray-700 opacity-0 group-hover:opacity-100 transition-all"
                    >
                      ✕
                    </button>
                  </div>
                ))
              )}
            </div>
          </div>
        )}

        {/* Botón principal (Burbuja) */}
        <button 
          onClick={() => setIsOpen(!isOpen)}
          className="relative w-14 h-14 bg-purple-600 hover:bg-purple-700 text-white rounded-full shadow-[0_8px_30px_rgb(147,51,234,0.4)] flex items-center justify-center transition-transform duration-200 hover:scale-105 active:scale-95"
          aria-label={isOpen ? "Cerrar notificaciones" : "Abrir notificaciones"}
        >
          {isOpen ? (
            /* Icono de X para cerrar el panel */
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          ) : (
            /* Icono de Campana */
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"></path>
              <path d="M13.73 21a2 2 0 0 1-3.46 0"></path>
            </svg>
          )}
          
          {/* Badge de contador rojo */}
          {!isOpen && unreadCount > 0 && (
            <span className="absolute -top-1 -right-1 inline-flex items-center justify-center w-6 h-6 text-xs font-bold text-white bg-red-500 border-2 border-white rounded-full shadow-sm">
              {unreadCount > 9 ? '9+' : unreadCount}
            </span>
          )}
        </button>
      </div>
      
      {/* Estilos para animaciones y scrollbar */}
      <style dangerouslySetInnerHTML={{__html: `
        @keyframes fade-in-up {
          0% { opacity: 0; transform: translateY(20px) scale(0.95); }
          100% { opacity: 1; transform: translateY(0) scale(1); }
        }
        .animate-fade-in-up {
          animation: fade-in-up 0.25s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }
        /* Personalización sutil del scrollbar para el panel */
        .custom-scrollbar::-webkit-scrollbar {
          width: 5px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background-color: #d1d5db;
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background-color: #9ca3af;
        }
      `}} />
    </NotificationContext.Provider>
  );
};