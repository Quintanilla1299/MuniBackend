# 🛠️ Guía de Configuración e Instalación del Proyecto

Este documento proporciona instrucciones paso a paso para instalar, configurar y ejecutar el proyecto en tu entorno local. Por favor, sigue cada paso cuidadosamente para garantizar un funcionamiento adecuado del sistema.

## 📋 Requisitos del Sistema

Antes de comenzar, asegúrate de tener instalado lo siguiente:

- **Node.js** (versión 16 o superior) - [Descargar](https://nodejs.org/)
- **MySQL** (versión 8 o superior) - [Descargar](https://dev.mysql.com/downloads/)
- **Git** - [Descargar](https://git-scm.com/)

## 🚀 Pasos de Instalación

### 1. Clonar el Repositorio

Clona el proyecto desde el repositorio proporcionado:

```bash
git clone https://github.com/Quintanilla1299/MuniBackend.git
cd proyecto
```

### 2. Instalar Dependencias

Instala las librerías necesarias:

```bash
npm install
```

Este comando instalará todas las dependencias listadas en el archivo `package.json`.

### 3. Configurar Variables de Entorno

Crea un archivo `.env` en la raíz del proyecto. Este archivo contiene información de configuración crítica como la conexión a la base de datos y el puerto del servidor.

Ejemplo de contenido para `.env`:

```env
# Configuración del Servidor
PORT=9000

# Configuración de la Base de Datos
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=tu-contraseña
DB_NAME=nombre_base_datos
DB_PORT=3306
```

**Nota:** Reemplaza los valores según tu entorno.

### 4. Configurar la Base de Datos

Crea la base de datos en MySQL:

```sql
CREATE DATABASE nombre_base_datos;
```

El proyecto creará automáticamente las tablas al iniciar el servidor.

### 5. Ejecutar el Servidor

#### Modo Desarrollo

Para ejecutar el servidor con recarga automática:

```bash
npm run dev
```

#### Modo Producción

Construye el proyecto:

```bash
npm run build
```

Inicia el servidor:

```bash
npm start
```

## 🔗 Endpoints del Proyecto

El proyecto organiza las rutas de API en el directorio `routes/`. Categorías principales de rutas:

- Servicios basicos: `/sit/servicios-basicos`
- Establecimientos: `/sit/establecimientos`

Consulta la documentación adicional o utiliza herramientas como Postman para explorar los endpoints.

## 🕰️ Tareas Automatizadas y Comunicación en Tiempo Real

### Trabajos Programados (Cron Jobs)

Las tareas automatizadas están configuradas en `cronJobs.js`, ejecutándose en intervalos predefinidos.

### WebSockets

La comunicación en tiempo real está implementada usando WebSockets, configurada en `server.js`.

## 🌐 Acceder al Proyecto

Accede al proyecto en tu navegador:

```
http://localhost:9000 (o el puerto configurado en .env)
```

## 🛠️ Resolución de Problemas

Si encuentras problemas, verifica:

- Las variables de `.env` estén correctamente configuradas
- El servidor MySQL esté funcionando
- Revisa los registros del servidor para obtener información detallada de errores


