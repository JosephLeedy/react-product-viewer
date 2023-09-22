import {render, screen} from '@testing-library/react'
import Footer from './Footer'

describe('Footer renders properly', () => {
    test('it has the copyright date', () => {
       render(<Footer/>)

        expect(screen.getByText(/^Copyright/)).toBeInTheDocument()
    })

    test('it has a project link', () => {
        render(<Footer/>)

        const gitHubLink = screen.getByTitle(/GitHub/)

        expect(gitHubLink).toBeInTheDocument()
        expect(gitHubLink.tagName).toBe('A')
    })
})