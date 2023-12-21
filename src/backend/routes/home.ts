import {Request, Response, Router} from 'express'

const indexRoutes: Router = Router()

indexRoutes.get('/', (_request: Request, response: Response) => {
    response.send('Nothing to see here, move along!')
})

export default indexRoutes
