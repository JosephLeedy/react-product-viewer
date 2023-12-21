import {Request, Response as ExpressResponse} from 'express'
import redisClient from '../../redisClient'
import {OauthCredentials, OauthToken} from '../../../types/Oauth'
import {buildOauthAuthorizationHeader} from '../../../helpers/oauth'

export default async function Products(_request: Request, response: ExpressResponse): Promise<void> {
    const oauthCredentials: OauthCredentials = await redisClient.hGetAll('PRODUCT_VIEWER:OAUTH:CREDENTIALS') as OauthCredentials
    const authToken: OauthToken = await redisClient.hGetAll('PRODUCT_VIEWER:OAUTH:API_TOKEN') as OauthToken
    const requestUrl: string = 'https://commerce246.test/rest/V1/products?searchCriteria[pageSize]=50'
    const authorizationHeader: string = buildOauthAuthorizationHeader('GET', oauthCredentials, requestUrl, authToken)
    const productsResponse = await fetch(
        requestUrl,
        {
            method: 'GET',
            headers: {
                Authorization: authorizationHeader
            }
        }
    )
    const productsJson = await productsResponse.json()

    response.json(productsJson)
}
