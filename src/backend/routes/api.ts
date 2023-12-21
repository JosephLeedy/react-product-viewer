import {Router} from 'express'
import Products from '../actions/Api/Products'
import Product from '../actions/Api/Product'

const apiRoutes: Router = Router()

apiRoutes.get('/products', Products)
apiRoutes.get('/product/:sku', Product)

export default apiRoutes
