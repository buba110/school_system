FROM node:18-alpine

WORKDIR /app

# Copia el backend
COPY backend ./backend

# Copia el frontend dentro de backend/public (para que el backend lo sirva)
COPY frontend ./backend/public

# Establece el directorio de trabajo en backend
WORKDIR /app/backend

# Instala dependencias
RUN npm install

# Expone el puerto
EXPOSE 3000

# Comando de inicio
CMD ["npm", "start"]
