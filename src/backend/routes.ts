import {Router} from 'express'
import homeRoutes from './routes/home'
import apiRoutes from './routes/api'
import oauthRoutes from './routes/oauth'

const routes: Router = Router()

routes.use('/', homeRoutes)
routes.use('/api', apiRoutes)
routes.use('/oauth', oauthRoutes)

export default routes
