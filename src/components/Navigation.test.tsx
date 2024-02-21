import {render, screen} from '@testing-library/react'
import {CategoriesContextProvider} from '../contexts/CategoriesContext'
import {SearchQueryContextProvider} from '../contexts/SearchQueryContext'
import Navigation from './Navigation'
import rootCategory from '../test/data/categories.json'

describe('Navigation Component', (): void => {
    it('renders the app name as a main heading', (): void => {
        render(
            <CategoriesContextProvider categories={rootCategory.children_data}>
                <SearchQueryContextProvider>
                    <Navigation/>
                </SearchQueryContextProvider>
            </CategoriesContextProvider>
        )

        expect(screen.getByRole('heading', {level: 1, name: 'Product Viewer'})).toBeInTheDocument()
    })

    it('renders a navigation menu', (): void => {
        render(
            <CategoriesContextProvider categories={rootCategory.children_data}>
                <SearchQueryContextProvider>
                    <Navigation/>
                </SearchQueryContextProvider>
            </CategoriesContextProvider>
        )

        expect(screen.getByRole('navigation')).toBeInTheDocument()
    })

    it('renders a search form', (): void => {
        render(
            <CategoriesContextProvider categories={rootCategory.children_data}>
                <SearchQueryContextProvider>
                    <Navigation/>
                </SearchQueryContextProvider>
            </CategoriesContextProvider>
        )

        expect(screen.getByRole('search')).toBeInTheDocument()
    })
})