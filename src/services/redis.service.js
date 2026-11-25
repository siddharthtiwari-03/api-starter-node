// services/redis.service.js
import { createClient } from 'redis'
import { envs } from './environment.service.js'

/** @type {Map<string, Promise<ReturnType<typeof createClient>>>} */
const clients = new Map()

/**
 * Get or initialize a shared Redis client by config name and optional region.
 * @param {keyof typeof envs.redis} [name='default']
 * @param {string} [region]
 */
export const getRedisClient = (name = 'default', region) => {
    const cacheId = region ? `${name}:${region}` : String(name)

    if (clients.has(cacheId)) return clients.get(cacheId)

    const config = envs.redis[name]

    if (!config) {
        return Promise.reject(
            new Error(`Redis configuration "${String(name)}" not found in envs.redis`)
        )
    }

    // Create and connect inside an IIFE promise so concurrent callers share the same connection
    const clientPromise = (async () => {
        const client = createClient({
            ...(config.username && { username: config.username }),
            ...(config.password && { password: config.password }),
            socket: {
                host: config.host || '127.0.0.1',
                port: Number(config.port || '6379'),
                // tls: true, // Uncomment if connecting to a managed cloud Redis with TLS
            },
        })

        client.on('error', (err) => {
            console.error(`[Redis:${cacheId}] Client Error:`, err)
        })

        await client.connect()
        return client
    })()

    // Evict failed connection promises so future calls can retry
    clientPromise.catch(() => clients.delete(cacheId))

    clients.set(cacheId, clientPromise)
    return clientPromise
}

/**
 * Gracefully close all active Redis client connections.
 */
export const closeAllRedisClients = async () => {
    const promises = Array.from(clients.values()).map(async (clientPromise) => {
        try {
            const client = await clientPromise
            if (client.isOpen) await client.quit()
        } catch {
            // Ignore clients that failed to connect
        }
    })
    await Promise.all(promises)
    clients.clear()
}
