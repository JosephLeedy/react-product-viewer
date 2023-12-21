import {createClient} from 'redis'

const redisClient = createClient({
        username: process.env.VITE_REDIS_USERNAME,
        password: process.env.VITE_REDIS_PASSWORD,
        database: parseInt(process.env.VITE_REDIS_DATABASE || '0', 10),
        socket: {
            host: process.env.VITE_REDIS_HOST || 'localhost',
            port: parseInt(process.env.VITE_REDIS_PORT || '6379', 10),
            path: process.env.VITE_REDIS_SOCKET_PATH,
        },
    })
    .on('connect', (): void => {
        console.log('Redis is connected')
    })
    .on('error', (error: string) => {
        console.log('Redis encountered an error:', error)
    })

export default redisClient
