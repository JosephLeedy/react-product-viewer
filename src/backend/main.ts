import http from 'node:http'
import readline, {Key} from 'node:readline'
import express, {Express, urlencoded} from 'express'
import './config'
import routes from './routes'
import redisClient from './redisClient'

let server: http.Server
const exitGracefully = async (): Promise<void> => {
    server.close((): void => {
        console.log('HTTP server closed')
    })

    await redisClient.quit().then((): void => {
        console.log('Redis is disconnected')
    })

    process.exit()
}
const app: Express = express()
const port: number = parseInt(process.env.BACKEND_PORT || '3000', 10)

readline.emitKeypressEvents(process.stdin);

if (process.stdin.isTTY) {
    process.stdin.setRawMode(true)
}

process.on('SIGTERM', exitGracefully)
process.on('SIGINT', exitGracefully)

process.stdin.on('keypress', (_character: string, key: Key): void => {
    if (!(key.name === 'c' && key.ctrl === true) && key.name !== 'q') {
        return
    }

    exitGracefully().then()
})

redisClient.connect().then()

app.use(urlencoded({extended: true}))
app.use('/', routes)

server = app.listen(port, (): void => {
    console.log(`Application is running on port ${port}\n`)
    console.log(`Local URL: http://localhost:${port}`)
    console.log(`Process ID: ${process.pid}\n`)
    console.log('Press q to exit\n')
})
