import React from 'react'
import {fireEvent, render, screen, waitFor} from '@testing-library/react'
import {CurrentCategoryContextProvider, useCurrentCategoryContext} from '../contexts/CurrentCategoryContext'
import LocationHashChangeListener from './LocationHashChangeListener'
import rootCategory from '../test/data/categories.json'

describe('Location Hash Change Listener Component', (): void => {
    it('updates the current category when the location hash changes', (): void => {
        const CategoryNameComponent = (): React.JSX.Element => {
            const {currentCategory} = useCurrentCategoryContext()

            return <h3>{currentCategory?.name}</h3>
        }
        const UpdateCurrentCategoryButton = (): React.JSX.Element => {
            return <button onClick={() => handleUpdateCategoryButtonClick()}>Update Category</button>
        }
        const handleUpdateCategoryButtonClick = (): void => {
            Object.defineProperty(window, 'location', {value: {hash: '#training'}})

            window.dispatchEvent(new Event('hashchange'))
        }

        Object.defineProperty(window, 'location', {value: {hash: '#women'}})

        render(
            <CurrentCategoryContextProvider categories={rootCategory.children_data}>
                <CategoryNameComponent/>
                <UpdateCurrentCategoryButton/>
                <LocationHashChangeListener
                    categories={rootCategory.children_data}
                    currentPage={1}
                    setCurrentPage={(): void => {}}
                />
            </CurrentCategoryContextProvider>
        )

        fireEvent.click(screen.getByText('Update Category'))

        expect(screen.queryByText('Women')).not.toBeInTheDocument()
        expect(screen.getByText('Training')).toBeInTheDocument()
    })

    it('changes pages when the user navigates in their browser', async (): Promise<void> => {
        let currentPage: number = 4
        const setCurrentPage = (newCurrentPage: number): void => {
            currentPage = newCurrentPage
        }

        render(
            <CurrentCategoryContextProvider categories={rootCategory.children_data}>
                <LocationHashChangeListener
                    categories={rootCategory.children_data}
                    currentPage={currentPage}
                    setCurrentPage={setCurrentPage}
                />
            </CurrentCategoryContextProvider>
        )

        Object.defineProperty(window, 'location', {value: {hash: '#gear/bags?page=2'}})

        await waitFor((): void => {
            window.dispatchEvent(new Event('hashchange'))

            expect(currentPage).toEqual(2)
        })
    })
})
