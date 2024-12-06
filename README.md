Frontend King Tide

Este repositorio contiene el frontend de la aplicación King Tide, una aplicación web para visualizar y gestionar información deportiva.

Requisitos previos

	•	Node.js v16 o superior
	•	npm o yarn

Instalación

	1.	Clonar el repositorio:
git clone https://github.com/usuario/frontend_kingtide.git
cd frontend_kingtide
	2.	Instalar dependencias:
npm install

Desarrollo local

Para ejecutar el entorno de desarrollo:
npm run dev

La aplicación estará disponible en http://localhost:5173.

Construcción para producción

npm run build

Esto generará la carpeta dist con los archivos optimizados.

Docker

El frontend se despliega en un contenedor Docker utilizando Nginx.

Construir la imagen Docker:

docker build -t usuario/frontend_kingtide:latest .

Ejecutar el contenedor:

docker run -p 80:80 usuario/frontend_kingtide:latest

Variables de entorno

	•	VITE_API_DEPORTES_URL: URL base para la API del backend.

Contribuciones

Contribuciones son bienvenidas. Por favor, abre un issue o un pull request.

Licencia

Este proyecto está bajo la licencia MIT.
