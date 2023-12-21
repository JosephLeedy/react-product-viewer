import {Router} from 'express'
import Callback from '../actions/Oauth/Callback'
import Identity from '../actions/Oauth/Identity'

const oauthRoutes: Router = Router()

oauthRoutes.post('/callback', Callback)
oauthRoutes.get('/identity', Identity)

export default oauthRoutes
