export const convertTitleToUri = (title: string) => title
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9-]+/g, '-')
    .replace(/-$/, '')

export const convertUriToTitle = (uri: string) => uri.replace(/-s-/g, "'s-")
    .replace(/-+/g, ' ')
    .replace(/(?<= )\S|^./g, firstLetter => firstLetter.toUpperCase())