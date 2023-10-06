import {convertTitleToUri, convertUriToTitle} from './UriConverter'

describe('URI Converter', () => {
    const testCases = [
        {
            title: 'Title',
            uri: 'title'
        },
        {
            title: 'Hello World',
            uri: 'hello-world'
        },
        {
            title: "What's New",
            uri: 'what-s-new'
        },
        {
            title: "Title With Extra Space  ",
            uri: 'title-with-extra-space'
        }
    ]

    test.each(testCases)('it converts a title to a URI ($title => $uri)', ({title, uri}) => {
        expect(convertTitleToUri(title)).toBe(uri)
    })

    test.each(testCases)('it converts a URI to a title ($uri => $title)', ({uri, title}) => {
        expect(convertUriToTitle(uri)).toBe(title.trim())
    })
})
