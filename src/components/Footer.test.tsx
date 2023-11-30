import {render, screen} from '@testing-library/react'
import Footer from './Footer'

describe('Footer Component', (): void => {
    it('renders the copyright date', (): void => {
        render(<Footer/>)

        expect(screen.getByText(/^Copyright/)).toBeInTheDocument()
    })

    it('renders a project link', (): void => {
        let gitHubLink: HTMLAnchorElement

        render(<Footer/>)

        gitHubLink = screen.getByTitle(/GitHub/)

        expect(gitHubLink).toBeInTheDocument()
        expect(gitHubLink.tagName).toBe('A')
    })
})
