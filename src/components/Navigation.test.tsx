import {render, screen} from '@testing-library/react'
import {CategoriesContextProvider} from '../contexts/CategoriesContext'
import Navigation from './Navigation'
import rootCategory from '../test/data/categories.json'

describe('Navigation bar renders properly', () => {
    test('it has the app name as a main heading', () => {
        const { getByText } =  render(
            <CategoriesContextProvider isLoadingCategories={false} categories={rootCategory.children_data}>
                <Navigation/>
            </CategoriesContextProvider>
        )

        expect(getByText('Product Viewer')).toBeInTheDocument()
        expect(screen.getByRole('heading', {level: 1})).toBeInTheDocument()
    })

    test('it has a navigation menu', () => {
        render(
            <CategoriesContextProvider isLoadingCategories={false} categories={rootCategory.children_data}>
                <Navigation/>
            </CategoriesContextProvider>
        )

        expect(screen.getByRole('navigation')).toBeInTheDocument()
    })

    test('it has a search form', () => {
        render(
            <CategoriesContextProvider isLoadingCategories={false} categories={rootCategory.children_data}>
                <Navigation/>
            </CategoriesContextProvider>
        )

        expect(screen.getByRole('search')).toBeInTheDocument()
    })
})