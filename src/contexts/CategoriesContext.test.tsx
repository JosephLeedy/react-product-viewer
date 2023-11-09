import {render, screen} from '@testing-library/react'
import {CategoriesContextProvider, useCategoriesContext} from './CategoriesContext'
import rootCategory from '../test/data/categories.json'

describe('Categories Context', (): void => {
    it('provides categories', (): void => {
        const CategoriesContextConsumer = (): React.JSX.Element => {
            const {categories} = useCategoriesContext()

            return <h3>{categories[0].name}</h3>
        }

        render(
            <CategoriesContextProvider isLoadingCategories={false} categories={rootCategory.children_data}>
                <CategoriesContextConsumer/>
            </CategoriesContextProvider>
        )

        expect(screen.getByText(rootCategory.children_data[0].name)).toBeInTheDocument()
    })
})