import {Request, Response} from 'express'
import redisClient from '../../redisClient'

export default async function Callback(request: Request, response: Response): Promise<void> {
    if (
        request.body === undefined
        || !request.body.hasOwnProperty('oauth_consumer_key')
        || !request.body.hasOwnProperty('oauth_consumer_secret')
        || !request.body.hasOwnProperty('store_base_url')
        || !request.body.hasOwnProperty('oauth_verifier')
    ) {
        response.status(400).send('A required field is missing from the request')

        return
    }

    if (request.body.store_base_url.replace(/\/$/, '') !== process.env.VITE_MAGENTO_BASE_URL) {
        response.status(400).send('Invalid store base URL')

        return
    }

    await redisClient.hSet('PRODUCT_VIEWER:OAUTH:CREDENTIALS', request.body)

    response.sendStatus(200)
}
