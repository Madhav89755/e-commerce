# e-commerce
This is an e-commerce application backend built with Nodejs and ExpressJS.


# To run the application
1. Run `npm i`
2. Create a `.env` in the root folder with following variables:
    - JWT_SECRET="your_jwt_secret_key"
    - DB_NAME=node_proj
    - DB_USER=postgres
    - DB_PASS=root1234
    - DB_HOST=localhost
    - DB_PORT=5433
    - DB_DIALECT=postgres
    - PORT=3000
3. Run `npm run dev` to start the server
4. Now project should be accissible at `http://localhost:3000`

# Swagger Documentation
Api documentation of this application is accessible at endpoint `/api-docs/`.
