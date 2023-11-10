export function removeReservedUrisFromLocationHash(locationHashSegments: string[]): void {
    const reservedUris: string[] = [
        'favorites',
        'search',
    ]

    locationHashSegments.forEach(
        (locationHashSegment: string, index: number): void => {
            if (!reservedUris.includes(locationHashSegment) || index !== 0) {
                return
            }

            locationHashSegments[index] = ''
        }
    )
}
