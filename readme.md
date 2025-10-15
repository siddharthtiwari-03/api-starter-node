# API starter kit: Node JS

This is a starter kit to speedup your initial setup time and provide a well structured backend for the better code readability and manageability.

## Prerequisites

- Node JS installed
- VS Code (Or any of your other favorite code editors)
- MySQL Database with at least one table inside it (you may use schema provided inside utils)
- Docker (Latest Stable) when opting for containerized approach

## Project structure

The project follows a clean, modern structure, centralizing all core application logic within the src/ directory.

```
api-starter-kit
├──src/
|  ├──models/
|  |  └──model-classes
|  ├──routers/
|  |  ├──super-admin/
|  |  |  └──super-admin-related-routes
|  |  └──user/
|  |  |  └──user-related-routes
|  └──services/
|  |  └──helper-services
├──utils/
|  └──util-files
├──.env-files
├──Dockerfile
├──docker-compose-file
├──package.json
└──readme.md
```

### Setup

This project has already provided you means to integrate different .env files based on the 'NODE_ENV' for different stages of the application viz.
- A **.env** file inside the **root** directory, this file holds common configurations for all stages of application (mandatory for all environments)
- A **.env.dev** file inside the **root** directory (relating to development environments)
- A **.env.prod** file inside the **root** directory (relating to production environments)
- A **.env.stage** file inside the **root** directory (relating to staging environments)
- Provide entries mandatory to connect with the database


### Initialize

Use following command to initialize by installing all the required dependencies

```bash
npm install
```

The starter kit provides seamless commands for both **local execution** and **comprehensive containerized development via Docker**, all managed through npm scripts

### 1. Standard Local Execution (Host Machine)
These commands run the application directly on your local Node.js environment.

| Command     | Environment | Live Reload           | Description                                              |
| ----------- | ----------- | --------------------- | -------------------------------------------------------- |
| npm run dev | Development | Enabled (via nodemon) | Starts the application for rapid development cycles.     |
| npm start   | Production  | Disabled              | Runs the compiled application optimized for performance. |


### 2. Comprehensive Containerized (Docker)
You can also run this app using containerized docker, by using following commands:


| Command                     | Description                                                        | Notes                                                                                                          |
| --------------------------- | ------------------------------------------------------------------ | -------------------------------------------------------------------------------------------------------------- |
| npm run docker              | Build & Start All Services                                         | Runs docker compose up --build --force-recreate -d. Use this for initial setup or after configuration changes. |
| npm run docker:down         | Gracefully Stop and Remove containers and networks.                |                                                                                                                |
| npm run docker:down:volumes | Stop, Remove containers, networks, and volumes.                    | Caution: This deletes all associated data (e.g., database contents).                                           |
| npm run docker:logs         | View live logs for the primary server container.                   |                                                                                                                |
| npm run docker:logs:all     | View live logs for all running services with timestamps.           |                                                                                                                |
| npm run docker:ps           | List the status of all running containers defined in compose.yaml. |                                                                                                                |