import {render, screen} from '@testing-library/react'
import Navigation from './Navigation'

describe('Navigation bar renders properly', () => {
    test('it has the app name as a main heading', () => {
        const { getByText } =  render(<Navigation/>)

        expect(getByText('Product Viewer')).toBeInTheDocument()
        expect(screen.getByRole('heading', {level: 1})).toBeInTheDocument()
    })

    test('it has a navigation menu', () => {
        render(<Navigation/>)

        expect(screen.getByRole('navigation')).toBeInTheDocument()
    })

    test('it has a search form', () => {
        render(<Navigation/>)

        expect(screen.getByRole('search')).toBeInTheDocument()
    })
})