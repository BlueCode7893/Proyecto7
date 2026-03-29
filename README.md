🚀 Proyecto Backend Node.js - Express

Este proyecto consiste en un servidor web robusto construido con Node.js y Express, desarrollado a través de un proceso de aprendizaje modular. Implementa persistencia de datos en archivos planos, gestión de variables de entorno y una arquitectura de carpetas profesional.
📋 Requisitos del Sistema

    Node.js: v18.0.0 o superior.

🛠️ Instalación y Configuración

    Clonar el proyecto y situarse en la carpeta raíz.

    Instalar dependencias:
    Bash

npm install

Configurar variables de entorno:
Crea un archivo .env en la raíz con el siguiente contenido:
Fragmento de código

    PORT=3000

    Preparar archivos de persistencia:
    Asegúrate de que exista la carpeta logs/. El sistema creará automáticamente el archivo log.txt tras la primera interacción.

🚀 Instrucciones de Ejecución

El proyecto incluye scripts personalizados en el package.json:

    Modo Desarrollo (Recomendado): Utiliza nodemon para reiniciar el servidor automáticamente ante cualquier cambio.
    Bash

npm run dev

Modo Producción: Ejecución estándar con Node.js.
Bash

    npm start

📂 Estructura del Proyecto

Se ha implementado una arquitectura modular para asegurar la escalabilidad y el mantenimiento del código:

    index.js: Punto de entrada de la aplicación. Configura middlewares globales y levanta el servidor.

    routes/: Contiene el enrutador externo (router.js), separando la definición de rutas de la configuración del servidor (Tarea PLUS).

    middlewares/: Aloja el logger.js, encargado de interceptar las peticiones para registrar actividad.

    controllers/: Espacio destinado a la lógica de negocio (funciones que procesan las peticiones).

    public/: Carpeta de archivos estáticos. Incluye el index.html servido mediante express.static.

    logs/: Carpeta dedicada a la persistencia de datos (archivo log.txt).

📝 Justificación Técnica

    Nombre del archivo (index.js): Se eligió por ser la convención estándar de Node.js y NPM, facilitando la detección automática del punto de entrada.

    Uso de Middlewares: Se implementó un middleware de registro (logger) para centralizar la persistencia sin repetir código en cada ruta.

    Persistencia en archivos planos: Se utiliza el módulo nativo fs con appendFile para garantizar que el historial de logs no se sobrescriba y persista tras reiniciar el servidor.

    Estructura Modular: La separación en carpetas (routes, middlewares, etc.) evita el "código espagueti", permitiendo que el proyecto crezca de forma organizada siguiendo el principio de responsabilidad única.
# Proyecto7
