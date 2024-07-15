# Use uma imagem oficial do Node.js como imagem base
FROM node:18

# Defina o diretório de trabalho no contêiner
WORKDIR /usr/src/app

# Copie o package.json e package-lock.json para o diretório de trabalho
COPY package*.json ./

# Instale as dependências do aplicativo
RUN npm install

# Copie o restante do código da aplicação para o diretório de trabalho
COPY . .

# Compile a aplicação NestJS
RUN npm run build

# Exponha a porta que a aplicação irá rodar
EXPOSE 3000

# Defina o comando para iniciar a aplicação
CMD ["npm", "run", "start:prod"]
