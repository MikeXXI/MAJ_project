# Full-stack Application with Docker

This project demonstrates a versatile Docker architecture for running a React application integrated with different backend and database technologies. Specifically, it showcases setups using MongoDB with Node.js, and MySQL with Python, all serving a React frontend. The primary function of these applications is to enable CRUD operations, display a list of registered users, and provide admin capabilities for user management.

## Docker Architecture

The project is structured as follows, facilitating separation of concerns and modular development across different technologies:
```
.
├── app
│   ├── cypress
│   ├── DockerfileReact
│   ...
├── server
│   ├── DockerfileNodejs
│   ├── DockerfilePython
│   ├── server.js
│   ├── server.py
├── sqlfiles
│   ├── migrate-v001.sql
│   ...
├── mongofiles
│   ├── migrate-v001.json
│   ...
├── docker-compose-python-mysql.yml
├── docker-compose-nodejs-mongodb.yml
└── README.md
```
## MongoDB, NodeJS, and React Setup

The docker-compose-nodejs-mongodb.yml file defines a Docker composition for running the application using MongoDB and Node.js for the backend, with React for the frontend:


#### docker-compose-nodejs-mongodb.yml :
```
version: '3.8'
services:
  app:
    build: ./app
    ports:
      - "3000:3000"
  server:
    build:
      context: ./server
      dockerfile: DockerfileNodejs
    ports:
      - "5000:5000"
    depends_on:
      - mongodb
  mongodb:
    image: mongo
    volumes:
      - ./mongofiles:/data/db
    ports:
      - "27017:27017"
```

## MySQL, Python, and React Setup

The docker-compose-python-mysql.yml file outlines a Docker composition for deploying the application using MySQL and Python for the backend, with React on the frontend:

#### docker-compose-python-mysql.yml
```
version: '3.8'
services:
  app:
    build: ./app
    ports:
      - "3000:3000"
  server:
    build:
      context: ./server
      dockerfile: DockerfilePython
    ports:
      - "5000:5000"
    depends_on:
      - mysql
  mysql:
    image: mysql:5.7
    volumes:
      - ./sqlfiles:/docker-entrypoint-initdb.d
    environment:
      MYSQL_ROOT_PASSWORD: root
      MYSQL_DATABASE: app_db
    ports:
      - "3306:3306"
```
## Deployment
To deploy the application, use the corresponding docker-compose command:

### For MongoDB/NodeJS/React:
```
docker-compose -f docker-compose-nodejs-mongodb.yml up -d
```
### For MySQL/Python/React:
```
docker-compose -f docker-compose-python-mysql.yml up -d
```
After starting the application, access the React frontend by navigating to http://localhost:3000 in your web browser.

## GitHub Actions Pipeline

Our CI/CD pipeline, defined in .github/workflows/ci-cd.yml, automates the build, test, and deployment process, encompassing unit tests, integration tests, Docker environment setup, and Cypress end-to-end tests.
```

name: CI/CD Pipeline

on: [push, pull_request]

jobs:
  build-and-test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - name: Set up Docker Environment
        run: docker-compose -f docker-compose-nodejs-mongodb.yml up -d
      ...
      - name: Shutdown Docker Environment
        run: docker-compose -f docker-compose-nodejs-mongodb.yml down
```
## Testing
This project includes unit, integration, and end-to-end tests. For specific instructions on executing these tests, please refer to the test scripts located in the respective app and server directories.

## Contributing
We welcome contributions from the community! If you'd like to contribute, please follow these steps:

1. Fork the repository.
2. Create a new branch for your feature or fix.
3. Commit your changes with meaningful commit messages.
4. Submit a pull request against the main branch.
5. Please make sure your code adheres to our coding standards and includes tests, if applicable.


