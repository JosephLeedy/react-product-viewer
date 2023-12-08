import {convertTitleToUri, convertUriToTitle} from './UriConverter'

describe('URI Converter', (): void => {
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

    it.each(testCases)('converts a title to a URI ($title => $uri)', ({title, uri}): void => {
        expect(convertTitleToUri(title)).toBe(uri)
    })

    it.each(testCases)('converts a URI to a title ($uri => $title)', ({uri, title}): void => {
        expect(convertUriToTitle(uri)).toBe(title.trim())
    })
})
