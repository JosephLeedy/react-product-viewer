export const convertTitleToUri = (title: string): string => title
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9-]+/g, '-')
    .replace(/-$/, '')

export const convertUriToTitle = (uri: string): string => uri
    .replace(/-s-/g, "'s-")
    .replace(/-+/g, ' ')
    .replace(/(?<= )\S|^./g, (firstLetter: string) => firstLetter.toUpperCase())