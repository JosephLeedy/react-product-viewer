import {removeReservedUrisFromLocationHash} from './ReservedUriRemover'

describe('Reserved URI Remover', (): void => {
    it('removes a reserved keyword from the beginning of a location hash', (): void => {
        const locationHashSegments: string[] = [
            'search',
        ]

        removeReservedUrisFromLocationHash(locationHashSegments)

        expect(locationHashSegments[0]).toEqual('')
    })

    it('does not remove an unreserved keyword from a location hash', (): void => {
        const locationHashSegments: string[] = [
            'women',
        ]

        removeReservedUrisFromLocationHash(locationHashSegments)

        expect(locationHashSegments[0]).toEqual('women')
    })

    it('does not remove a reserved keyword from anywhere else in a location hash', (): void => {
        const locationHashSegments: string[] = [
            'women',
            'search'
        ]

        removeReservedUrisFromLocationHash(locationHashSegments)

        expect(locationHashSegments).toEqual(['women', 'search'])
    })
})