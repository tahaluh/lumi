FROM node:20.11.1

COPY package.json package-lock.json /var/lumi/

WORKDIR /var/lumi

COPY . /var/lumi
RUN mkdir -p /var/lumi/uploads

RUN npm install

EXPOSE 8080

RUN npm run build
CMD ["npm", "run", "dev"]
