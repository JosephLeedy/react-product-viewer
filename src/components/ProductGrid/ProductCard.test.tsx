import {render, screen} from '@testing-library/react'
import {formatPrice, getProductDescription, getProductUrl, getSalePrice} from '../../helpers/productData'
import Product from '../../types/Product'
import ProductCard from './ProductCard'
import productData from '../../test/data/products.json'

const products: Product[] = productData.items as Product[]

describe('Product Card Component', (): void => {
    it('renders a card with the name of a given product', (): void => {
        const product: Product = products.find((product: Product): boolean => product.id === 1) as Product

        render(<ProductCard product={product} products={products}/>)

        expect(screen.getByRole('heading', {name: new RegExp(product.name)})).toBeInTheDocument()
    })

    it('renders a card with the image of a given product', (): void => {
        const product: Product = products.find((product: Product): boolean => product.id === 1) as Product
        let productImage: HTMLElement

        render(<ProductCard product={product} products={products}/>)

        productImage = screen.getByRole('img')

        expect(productImage).toBeInTheDocument()
        expect(productImage).toHaveAccessibleName(product.name)
    })

    it('renders a card with the description of a given product if the description is available', (): void => {
        const product: Product = products.find((product: Product): boolean => product.id === 1) as Product
        const productDescription: string = getProductDescription(product)

        render(<ProductCard product={product} products={products}/>)

        expect(screen.getByText(productDescription)).toBeInTheDocument()
    })

    it('renders a card with no description for a given product if the description is not available', (): void => {
        const product: Product = products.find((product: Product): boolean => product.id === 1) as Product

        product.custom_attributes[8].value = ''

        render(<ProductCard product={product} products={products}/>)

        expect(screen.queryByTestId('product-description')).not.toBeInTheDocument()
    })

    it('renders a card with the price of a given product', (): void => {
        const product: Product = products.find((product: Product): boolean => product.id === 1) as Product
        const price: string = formatPrice(product.price)

        render(<ProductCard product={product} products={products}/>)

        expect(screen.getByText(price)).toBeInTheDocument()
    })

    it('renders a card with the sale price of a given product', (): void => {
        const product: Product = products.find((product: Product): boolean => product.id === 1) as Product
        const price: string = formatPrice(getSalePrice(product) as number)

        render(<ProductCard product={product} products={products}/>)

        expect(screen.getByText(price)).toBeInTheDocument()
    })

    it('renders a card with a store link to a given product', (): void => {
        const product: Product = products.find((product: Product): boolean => product.id === 1) as Product
        const productUrl: string = getProductUrl(product, products)
        let storeLink: HTMLAnchorElement

        render(<ProductCard product={product} products={products}/>)

        storeLink = screen.getByRole('button')

        expect(storeLink).toBeInTheDocument()
        expect(storeLink.href).toEqual(productUrl)
    })
})
