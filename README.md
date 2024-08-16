# e-commerce
This is an e-commerce application backend built with Nodejs and ExpressJS.
This node application is configured to use with PostgreSQL database.


# To run the application
1. Run `npm i`
2. Create a `.env` in the root folder with following variables:
    - JWT_SECRET="your_jwt_secret_key"
    - DB_NAME="database_name"
    - DB_USER="database_user_name"
    - DB_PASS="database_password"
    - DB_HOST="database_host"
    - DB_PORT="database_port"
    - DB_DIALECT="database e.g postgres, mysql"
    - PORT="PORT for the node app to run e.g. 3000"
3. Run `npm run dev` to start the server
4. Now project should be accissible at `http://localhost:3000`

# Swagger Documentation
Api documentation of this application is accessible at endpoint `/api-docs/`.
