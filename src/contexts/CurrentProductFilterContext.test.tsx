import React from 'react'
import {fireEvent, render, screen} from '@testing-library/react'
import {Mock} from 'vitest'
import {CurrentProductFilterContextProvider, useCurrentProductFilterContext} from './CurrentProductFilterContext'
import {ProductFilterType} from '../types/ProductFilter'

describe('Current Product Filter Context', (): void => {
    const originalLocationHash: string = window.location.hash
    const CurrentProductFilterContextConsumer = (): React.JSX.Element => {
        const {currentProductFilter} = useCurrentProductFilterContext()

        return (
            <dl>
               <dt>{currentProductFilter.type}</dt>
               <dd>{currentProductFilter.value}</dd>
            </dl>
        )
    }

    beforeEach((): void => {
        Object.defineProperty(window, 'location', {value: {hash: '#test?filter=sku&keyword=ABC-123'}})
    })

    afterEach((): void => {
        Object.defineProperty(window, 'location', {value: {hash: originalLocationHash}})
    })

    it('provides the current product filter from the location hash', (): void => {
        render(
            <CurrentProductFilterContextProvider>
                <CurrentProductFilterContextConsumer/>
            </CurrentProductFilterContextProvider>
        )

        expect(screen.getByText('sku')).toBeInTheDocument()
        expect(screen.getByText('ABC-123')).toBeInTheDocument()
    })

    it('sets the current product filter', (): void => {
        const UpdateCurrentProductFilterButton = (): React.JSX.Element => {
            const {setCurrentProductFilter} = useCurrentProductFilterContext()

            return (
                <button onClick={(): void => {
                    setCurrentProductFilter({type: ProductFilterType.Name, value: 'DEF-456', isUpdated: true})
                }}>
                    Update Current Product Filter
                </button>
            )
        }

        render(
            <CurrentProductFilterContextProvider>
                <UpdateCurrentProductFilterButton/>
                <CurrentProductFilterContextConsumer/>
            </CurrentProductFilterContextProvider>
        )

        fireEvent.click(screen.getByText('Update Current Product Filter'))

        expect(screen.getByText('name')).toBeInTheDocument()
        expect(screen.getByText('DEF-456')).toBeInTheDocument()
    })

    it('throws an error if it is used outside of its provider', (): void => {
        vi.spyOn(console, 'error').mockImplementation((): Mock => vi.fn()) // Prevent error from being output in console

        expect((): void => {
            render(<CurrentProductFilterContextConsumer/>)
        }).toThrow('useCurrentProductFilterContext must be used within a CurrentProductFilterContextProvider')

        vi.restoreAllMocks()
    })
})
