# API starter kit: Node JS

This is a starter kit to speedup your initial setup time and provide a well structured backend for the better code readability and manageability.

## Prerequisites

- Node JS installed
- VS Code (Or any of your other favorite code editors)
- MySQL Database with at least one table inside it (you may use schema provided inside utils)

### Setup

- Create a **.env** file inside the **root** directory, this file holds common configurations for all stages of application (mandatory for all environments)
- Create a **.env.dev** file inside the **root** directory (relating to development environments)
- Create a **.env.prod** file inside the **root** directory (relating to production environments)
- Create a **.env.stage** file inside the **root** directory (relating to staging environments)
- Provide entries mandatory to connect with the database


### Initialize

Use following command to initialize by installing all the required dependencies

```bash
npm install
```

### Run in Dev mode

Use following cli command to run application on dev mode (live reload enabled)

```bash
npm run dev
```

### Run in Production mode

Use following cli command to run application on production mode (live reload disabled)

```bash
npm start
```