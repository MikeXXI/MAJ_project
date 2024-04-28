# Full-stack Application with Docker

This project demonstrates a robust Docker architecture for running a React application integrated with different backend and database technologies. Specifically, it showcases setups using MongoDB with Node.js, and MySQL with Python, all serving a React frontend. The primary function of these applications is to enable CRUD operations, display a list of registered users, and provide admin capabilities for user management.

## Team Members and contributions

DJEGHERIF Mickael (M1 IOT) : architecture docker fonctionnelle (mysql / python) & Docker compose file
HAMIDA Aicha (M2 WEB) : Documentation, React with Tailwinds ,  tests end2end with Cypress, pipeline github action  & Docker compose file
DOFFÉMONT Jean Bernard (M1 IOT) :  architecture docker fonctionnelle (mongodb / nodejs)  & tests api Docker compose file

## Docker Architecture

The project is structured as follows, facilitating separation of concerns and modular development across different technologies:

```
.
├── my-app                  # React frontend application
│   ├── coverage            # Coverage 
│   ├── cypress             # Cypress end-to-end tests
│   ├── DockerfileReact     # Dockerfile for React application
│   ...
├── server                  # Backend services
│   ├── DockerfileNodejs    # Dockerfile for Node.js setup
│   ├── DockerfilePython    # Dockerfile for Python setup
│   ├── app.js              # Node.js server script
│   ├── models  
│       ├─── user.js        # MongoDB seed data
│   ├── main.py             # Python server script
├── sqlfiles                # SQL migration scripts for MySQL
│   ├── migrate-v001.sql
│   ...
├── docker-compose-nodejs-mongodb.yml # Docker Compose for Node.js + MongoDB
├── docker-compose-python-mysql.yml   # Docker Compose for Python + MySQL
└── README.md

```

## MongoDB, NodeJS, and React Setup

The docker-compose-nodejs-mongodb.yml file defines a Docker composition for running the application using MongoDB and Node.js for the backend, with React for the frontend:

#### docker-compose-nodejs-mongodb.yml :

```
version: "3.1"

services:
  mongo:
    image: mongo:latest
    ports:
      - 27017:27017
    volumes:
      - ./mongofiles/:/docker-entrypoint-initdb.d/
    restart: always

  mongo-express:
    image: mongo-express
    depends_on:
      - mongo
    ports:
      - 8081:8081
    environment:
      ME_CONFIG_MONGODB_SERVER: mongo

  server:
    image: nodejs-mongo
    volumes:
      - ./server:/server
      - /server/node_modules
    build:
      context: .
      dockerfile: ./server/DockerfileNodejs
    environment:
      - MONGO_HOST=mongo
      - MONGO_DATABASE
      - SERVER_PASSWORD
      - PORT=8000
    ports:
      - 8000:8000
    depends_on:
      - mongo
    command: node server.js

  react:
    image: react
    build:
      context: ./my-app
      dockerfile: ./DockerfileReact
    ports:
      - 3000:3000
    environment:
      - REACT_APP_SERVER_PORT=8000
    volumes:
      - ./my-app:/app
      - /app/node_modules
    depends_on:
      - server
    command: npm start

```

## Setup and Running Instructions

### MySQL, Python, and React Setup

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

### MongoDB, NodeJS, and React

File: docker-compose-nodejs-mongodb.yml

```
version: "3.1"

services:
  mongo:
    image: mongo:latest
    ports:
      - 27017:27017
    volumes:
      - ./mongofiles/:/docker-entrypoint-initdb.d/
    restart: always

  mongo-express:
    image: mongo-express
    depends_on:
      - mongo
    ports:
      - 8081:8081
    environment:
      ME_CONFIG_MONGODB_SERVER: mongo

  server:
    image: nodejs-mongo
    volumes:
      - ./server:/server
      - /server/node_modules
    build:
      context: .
      dockerfile: ./server/DockerfileNodejs
    environment:
      - MONGO_HOST=mongo
      - MONGO_DATABASE
      - SERVER_PASSWORD
      - PORT=8000
    ports:
      - 8000:8000
    depends_on:
      - mongo
    command: node server.js

  react:
    image: react
    build:
      context: ./my-app
      dockerfile: ./DockerfileReact
    ports:
      - 3000:3000
    environment:
      - REACT_APP_SERVER_PORT=8000
    volumes:
      - ./my-app:/app
      - /app/node_modules
    depends_on:
      - server
    command: npm start
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

     ...
```

## Testing

This project includes unit, integration, and end-to-end tests. Below are detailed instructions for executing these tests in each part of the application.

### Frontend (React)

_Unit and Integration Tests_
We use Jest and React Testing Library for frontend testing.

@testing-library/react for rendering components and interacting with the DOM.
@testing-library/jest-dom for additional matchers.
Mocking libraries like axios-mock-adapter for intercepting axios requests.
jest for running your tests.

 To run these tests, navigate to the app directory and execute:

```
cd app
npm install
npm install @testing-library/react @testing-library/jest-dom jest axios-mock-adapter react-toastify
npm test
```

This command runs all available tests and outputs the results, including coverage information.

_End-to-End Tests_

For end-to-end testing, we use Cypress. Ensure your application is running (either locally or in a Docker environment), then execute:

```
cd app
npm run cypress:open Or npm run cypress:run
```

This will open the Cypress interactive test runner where you can execute specific end-to-end tests.

### Backend (Node.js/MongoDB and Python/MySQL) 

_Node.js_

Unit and integration tests in the Node.js environment are handled by Jest. To run these tests, go to the server directory and use:

```
cd server
npm install
npm test
```

This will execute tests and provide a coverage report.

_Python_

For Python, we use pytest for both unit and integration tests. Ensure all dependencies are installed via pip, and then run:

```
cd server
pip install -r requirements.txt
pytest
```

This command will discover and run all tests in the server directory.

## Docker Environment Testing

Ensure all components function correctly within their Dockerized environments:

```
# Bring up the full stack
docker-compose -f docker-compose-nodejs-mongodb.yml up -d
# or
docker-compose -f docker-compose-python-mysql.yml up -d

# Execute tests
docker-compose -f docker-compose-nodejs-mongodb.yml exec server npm test
# or
docker-compose -f docker-compose-python-mysql.yml exec server pytest

# Shut down
docker-compose -f docker-compose-nodejs-mongodb.yml down
# or
docker-compose -f docker-compose-python-mysql.yml down

```

## Contributing

We welcome contributions from the community! If you'd like to contribute, please follow these steps:

1. Fork the repository.
2. Create a new branch for your feature or fix.
3. Commit your changes with meaningful commit messages.
4. Submit a pull request against the main branch.
5. Please make sure your code adheres to our coding standards and includes tests, if applicable.
