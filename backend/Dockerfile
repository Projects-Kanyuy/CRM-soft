FROM node:20-alpine AS build

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

FROM node:20-alpine AS production

WORKDIR /app

# Copy only the built node_modules and src
COPY --from=build /app /app

# Install only production dependencies to keep the final image light
RUN npm prune --production

EXPOSE 5000

CMD ["npm", "start"]