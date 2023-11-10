import React from 'react'
import {fireEvent, render, screen} from '@testing-library/react'
import {CurrentCategoryContextProvider, useCurrentCategoryContext} from './CurrentCategoryContext'
import {findCategoryByLocationHash} from '../utilities/CategoryFinder'
import Category from '../types/Category'
import rootCategory from '../test/data/categories.json'

describe('Current Category Context', (): void => {
    const originalWindowLocation: Location = window.location
    const CurrentCategoryContextConsumer = (): React.JSX.Element => {
        const {currentCategory} = useCurrentCategoryContext()

        return currentCategory !== null ? <h3>{currentCategory.name}</h3> : <></>
    }

    afterEach((): void => {
        Object.defineProperty(window, 'location', {value: {hash: originalWindowLocation.hash}})
    })

    it.each([
        {
            locationHash: '#women',
            categoryName: 'Women'
        },
        {
            locationHash: '#women/tops',
            categoryName: 'Tops'
        },
        {
            locationHash: '#women/tops/hoodies-sweatshirts',
            categoryName: 'Hoodies & Sweatshirts'
        },
    ])('provides the $categoryName category based on the $locationHash location hash',
        ({locationHash, categoryName}): void => {
        Object.defineProperty(window, 'location', {value: {hash: locationHash}})

        render(
            <CurrentCategoryContextProvider categories={rootCategory.children_data}>
                <CurrentCategoryContextConsumer/>
            </CurrentCategoryContextProvider>
        )

        expect(screen.getByText(categoryName)).toBeInTheDocument()
    })

    it('does not provide a category if the location hash is invalid', (): void => {
        Object.defineProperty(window, 'location', {value: {hash: '#test'}})

        render(
            <CurrentCategoryContextProvider categories={rootCategory.children_data}>
                <CurrentCategoryContextConsumer/>
            </CurrentCategoryContextProvider>
        )

        expect(screen.queryByText('Test')).not.toBeInTheDocument()
    });

    it('updates the current category', (): void => {
        let setCurrentCategory: (currentCategory: Category) => void
        const UpdateCurrentCategoryButton = (): React.JSX.Element => {
            ({setCurrentCategory} = useCurrentCategoryContext())

            return <button onClick={() => handleUpdateCategoryButtonClick()}>Update Category</button>
        }
        const handleUpdateCategoryButtonClick = (): void => {
            Object.defineProperty(window, 'location', {value: {hash: '#training'}})

            window.dispatchEvent(new Event('hashchange'))
        }
        const handleLocationHashChange = (): void => {
            const trainingCategory: Category | null = findCategoryByLocationHash(
                rootCategory.children_data,
                window.location.hash.substring(1).split('/')
            )

            if (trainingCategory === null) {
                return
            }

            setCurrentCategory(trainingCategory)
        }

        Object.defineProperty(window, 'location', {value: {hash: '#women'}})

        render(
            <CurrentCategoryContextProvider categories={rootCategory.children_data}>
                <CurrentCategoryContextConsumer/>
                <UpdateCurrentCategoryButton/>
            </CurrentCategoryContextProvider>
        )

        window.addEventListener('hashchange', handleLocationHashChange)

        fireEvent.click(screen.getByText('Update Category'))

        expect(screen.getByText('Training')).toBeInTheDocument()
    });
})
