# 1. Etapa de construcción (Build)
FROM node:20-alpine AS builder

WORKDIR /app

# Copiar archivos de dependencias
COPY package*.json ./

# Instalar dependencias
RUN npm install

# Copiar el resto del código de la aplicación
COPY . .

# 2. Etapa de producción (Run)
FROM node:20-alpine

WORKDIR /app

COPY package*.json ./

# Instalar SOLO dependencias de producción para mantener la imagen limpia y ligera
RUN npm ci --only=production

# Copiar el código desde la etapa de construcción
COPY --from=builder /app ./

# Puerto en el que corre tu API Express (cámbialo si usas el 8080 u otro)
EXPOSE 3000

# Comando para arrancar la aplicación
CMD ["node", "index.js"]