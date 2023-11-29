import React from 'react'
import {render, screen, waitFor} from '@testing-library/react'
import {UserEvent, userEvent} from '@testing-library/user-event'
import ProductFilterForm from './ProductFilterForm'
import {
    CurrentProductFilterContextProvider,
    useCurrentProductFilterContext
} from '../../contexts/CurrentProductFilterContext'

describe('Product Filter Form Component', (): void => {
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
        Object.defineProperty(window, 'location', {value: {hash: '#test'}})
    })

    afterEach((): void => {
        Object.defineProperty(window, 'location', {value: {hash: originalLocationHash}})
    })

    it('renders a filter type menu', async (): Promise<void> => {
        render(
            <CurrentProductFilterContextProvider>
                <ProductFilterForm/>
            </CurrentProductFilterContextProvider>
        )

        await waitFor((): void => {
            expect(screen.getByTitle('Filter by')).toBeInTheDocument()
            expect(screen.getByText('Name')).toBeInTheDocument()
            expect(screen.getByText('SKU')).toBeInTheDocument()
        })
    })

    it('renders a keyword input', async (): Promise<void> => {
        render(
            <CurrentProductFilterContextProvider>
                <ProductFilterForm/>
            </CurrentProductFilterContextProvider>
        )

        await waitFor((): void => {
            expect(screen.getByPlaceholderText('Filter products')).toBeInTheDocument()
        })
    })

    it('updates the current product filter type when a new type is selected', async (): Promise<void> => {
        const user: UserEvent = userEvent.setup()

        render(
            <CurrentProductFilterContextProvider>
                <ProductFilterForm/>
                <CurrentProductFilterContextConsumer/>
            </CurrentProductFilterContextProvider>
        )

        await user.click(screen.getByText('SKU'))

        await waitFor((): void => {
            expect(screen.getByText('sku')).toBeInTheDocument()
        })
    })

    it('updates the current product filter value when a new keyword is entered', async (): Promise<void> => {
        const user: UserEvent = userEvent.setup()

        render(
            <CurrentProductFilterContextProvider>
                <ProductFilterForm/>
                <CurrentProductFilterContextConsumer/>
            </CurrentProductFilterContextProvider>
        )

        await user.type(screen.getByPlaceholderText('Filter products'), 'Test Product')

        await waitFor((): void => {
            expect(screen.getByText('Test Product')).toBeInTheDocument()
            expect(window.location.hash).toMatch(/filter=name&keyword=Test\+Product/)
        })
    })

    it('sets the current product filter type from the type in the location hash', async (): Promise<void> => {
        Object.defineProperty(window, 'location', {value: {hash: '#test?filter=sku&keyword=ABC-123'}})

        render(
            <CurrentProductFilterContextProvider>
                <ProductFilterForm/>
                <CurrentProductFilterContextConsumer/>
            </CurrentProductFilterContextProvider>
        )

        await waitFor((): void => {
            expect(screen.getByText('SKU')).toHaveClass('active')
            expect(screen.getByText('sku')).toBeInTheDocument()
        })
    })

    it('sets the current product filter value from the keyword in the location hash', async (): Promise<void> => {
        Object.defineProperty(window, 'location', {value: {hash: '#test?filter=name&keyword=Test+Product'}})

        render(
            <CurrentProductFilterContextProvider>
                <ProductFilterForm/>
                <CurrentProductFilterContextConsumer/>
            </CurrentProductFilterContextProvider>
        )

        await waitFor((): void => {
            expect(screen.getByPlaceholderText('Filter products')).toHaveValue('Test Product')
            expect(screen.getByText('Test Product')).toBeInTheDocument()
        })
    })

    it('clears the current product filter value when the current keyword is erased', async (): Promise<void> => {
        const user: UserEvent = userEvent.setup()

        Object.defineProperty(window, 'location', {value: {hash: '#test?filter=name&keyword=Test+Product'}})

        render(
            <CurrentProductFilterContextProvider>
                <ProductFilterForm/>
                <CurrentProductFilterContextConsumer/>
            </CurrentProductFilterContextProvider>
        )

        await user.clear(screen.getByPlaceholderText('Filter products'))

        await waitFor((): void => {
            expect(screen.queryByText('Test Product')).not.toBeInTheDocument()
            expect(window.location.hash).toEqual('#test')
        })
    })
})
