import {findCategoryByLocationHash, findCategoryByName} from './CategoryFinder'
import Category from '../types/Category'
import categories from '../test/data/categories.json'

describe('Category Finder Utility', (): void => {
    describe('Find Category by Location Hash', (): void => {
        it('finds a category by a given location hash', (): void => {
            const foundCategory: Category | null = findCategoryByLocationHash(categories.children_data, ['training'])

            expect(foundCategory).not.toBeNull()
            expect(foundCategory?.name).toEqual('Training')
        })

        it("returns null if a given location hash doesn't match a category", (): void => {
            const foundCategory: Category | null = findCategoryByLocationHash(categories.children_data, ['test'])

            expect(foundCategory).toBeNull()
        })
    })

    describe('Find Category by Name', (): void => {
        it('finds a category by a given name', (): void => {
            const category: Category | null = findCategoryByName('Women', categories.children_data)

            expect(category).not.toBeNull()
            expect(category?.name).toEqual('Women')
        })

        it("returns null if a category matching a given name isn't found", (): void => {
            const category: Category | null = findCategoryByName('Test', categories.children_data)

            expect(category).toBeNull()
        })
    })
})