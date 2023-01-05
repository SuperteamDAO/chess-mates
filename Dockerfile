FROM node:16
WORKDIR /usr/src/app
COPY package.json pnpm-lock.yaml ./
RUN npm i -g pnpm
RUN pnpm install
RUN apt update
RUN apt install -y libx11-xcb-dev
COPY . ./
RUN pnpm build