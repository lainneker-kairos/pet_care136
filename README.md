# 🐾 PetCare - Tu Mascota en las Mejores Manos

![PetCare Landing Page](image_f5a481.jpg)

## 📖 Sobre el Proyecto
**PetCare** es una plataforma web integral desarrollada para conectar a dueños de mascotas con cuidadores de confianza, paseadores y hoteles caninos.
Este proyecto fue construido como parte del Bootcamp de Full-Stack de **4Geeks Academy**.

La aplicación permite a los usuarios encontrar soluciones personalizadas para el cuidado de sus mascotas, garantizando seguridad y diversión en cada etapa.

## ✨ Características Principales
* **Perfiles Duales:** Los usuarios pueden gestionar sus perfiles de forma independiente como **Dueño de Mascota** y como **Cuidador** [cite: 1].
* **Búsqueda Geoposicionada:** Integración con mapas interactivos para encontrar cuidadores cerca de tu ubicación (ej. Valladolid, Madrid).
* **Gestión de Servicios:**
  * 🦮 **Paseos:** Reserva de paseos personalizados indicando fecha, hora, duración y ciudad.
  * 🏨 **Hotel Canino:** Reserva de estancias 24/7 con fechas exactas de entrada y salida.
  * 🏡 **Guardería:** Cuidado adaptado a las necesidades diarias.
* **Paneles de Control (Dashboards):** 
  * *Dueños:* Gestión de datos de contacto y registro de mascotas.
  * *Cuidadores:* Configuración de tarifas, experiencia, biografía profesional, ubicación y disponibilidad semanal.

## 🛠️ Tecnologías Utilizadas

### Frontend
* **React.js / Next.js:** Construcción de la interfaz de usuario.
* **JavaScript / TypeScript**
* **Tailwind CSS:** Estilos y diseño responsivo.
* **Google Maps API:** Renderizado de mapas e indicadores de ubicación.

### Backend
* **Python & Flask:** Arquitectura de la API RESTful.
* **SQLAlchemy:** ORM para la gestión de la base de datos.
* **PostgreSQL:** Base de datos relacional.
* **JWT (JSON Web Tokens):** Autenticación segura de usuarios.

## 🚀 Instalación y Configuración Local

### Requisitos Previos
* Node.js y npm
* Python 3.x
* PostgreSQL

### Configuración del Backend
1. Clonar el repositorio:
   ```bash
   git clone https://github.com/lainneker-kairos/pet_care136.git
   cd pet_care136
   ```
2. Crear y activar el entorno virtual:
   ```bash
   python -m venv venv
   source venv/bin/activate  # En Windows: venv\Scripts\activate
   ```
3. Instalar dependencias:
   ```bash
   pip install -r requirements.txt
   ```
4. Configurar variables de entorno creando un archivo `.env` en la raíz.
5. Ejecutar migraciones e iniciar el servidor:
   ```bash
   flask db upgrade
   python src/app.py
   ```

### Configuración del Frontend
1. Navegar al directorio de la aplicación frontend.
2. Instalar las dependencias:
   ```bash
   npm install
   ```
3. Iniciar el servidor de desarrollo:
   ```bash
   npm run dev
   ```

## 📸 Vistas de la Aplicación

| ![Perfil de Dueño](image_f5a19f.jpg) | ![Perfil de Cuidador](image_f5a142.jpg) |
| :---: | :---: |
| *Panel de Dueño* | *Panel de Cuidador* |

| ![Lista de Cuidadores](image_f59dbf.jpg) | ![Reserva de Paseos](image_f5a0c0.jpg) |
| :---: | :---: |
| *Búsqueda con Mapa Interactivo* | *Reserva de Paseos* |

## 👨‍💻 Proyecto grupal
**Lainneker Contreras**
**Valeria Carballo**
**Israel**
**Jeison Rendón**


* Desarrollador Full-Stack | Valladolid, España.
* [GitHub Profile](https://github.com/lainneker-kairos)
