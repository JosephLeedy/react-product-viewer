import {getByTestId, render} from '@testing-library/react'
import App from './App'

describe("App renders properly", () => {
    test("it has a header", () => {
        render(<App/>)

        expect(getByTestId(document.documentElement, 'page-header')).toBeInTheDocument()
    })

    test("it has a body", () => {
        render(<App/>)

        expect(getByTestId(document.documentElement, 'page-body')).toBeInTheDocument()
    })

    test("it has a footer", () => {
        render(<App/>)

        expect(getByTestId(document.documentElement, 'page-footer')).toBeInTheDocument()
    })
})
