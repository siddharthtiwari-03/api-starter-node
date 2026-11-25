import dotenv from 'dotenv'

dotenv.config({ quiet: true })

// Override with environment-specific file if APP_ENV is set
const envFiles = {
    dev: '.env.dev',
    prod: '.env.prod',
    stage: '.env.stage',
}

const targetEnvFile = envFiles?.[process.env.APP_ENV] || null

if (targetEnvFile) {
    dotenv.config({ path: [targetEnvFile], quiet: true, override: true })
}