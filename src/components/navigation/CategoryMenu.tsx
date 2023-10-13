import React from 'react'
import Spinner from 'react-bootstrap/Spinner'
import useCategories from '../../hooks/useCategories'
import {convertTitleToUri} from '../../utilites/UriConverter'
import Category from '../../types/Category'

export default function CategoryMenu(): React.JSX.Element {
    const {isLoadingCategories, rootCategory} = useCategories()
    const renderCategoryMenuItems = (
        category: Category,
        isDropdownItem: boolean = false,
        uriSegments: string[] = []
    ) => {
        const hasChildren: boolean = category.children_data.length > 0
        const locationHashSegments: string[] = window.location.hash.substring(1).split('/')
        let isActive: boolean

        uriSegments.push(convertTitleToUri(category.name))

        isActive = uriSegments.every((uriSegment: string) => locationHashSegments.includes(uriSegment))

        return (
            <li key={category.id} className={`nav-item` + (hasChildren ? ' dropdown' : '')}>
                <a href={`#${uriSegments.join('/')}`}
                   onClick={handleMenuItemClick}
                   className={
                       `nav-link` + (hasChildren ? ' dropdown-toggle' : '') + (isDropdownItem ? ' dropdown-item' : '')
                           + (isActive ? ' active' : '')
                   }
                   {...(hasChildren && {
                       "role": "button",
                       "data-bs-toggle": "dropdown",
                       "aria-expanded": false
                   })}
                >{category.name}</a>
                {hasChildren &&
                    <ul className="dropdown-menu">
                        {
                            category.children_data.map((childCategory: Category) => {
                                const categorySubMenu: React.JSX.Element = renderCategoryMenuItems(
                                    childCategory,
                                    true,
                                    uriSegments
                                )

                                uriSegments.splice(-1)

                                return categorySubMenu
                            })
                        }
                    </ul>
                }
            </li>
        )
    }
    const setActiveMenuItems = (currentMenuItem: EventTarget & HTMLAnchorElement): void => {
        let parentElement: Element | null = currentMenuItem.parentElement

        Array.from(currentMenuItem.closest('.navbar-nav')!.getElementsByClassName('active'))
            .forEach((activeMenuItem: Element): void => {
                activeMenuItem.classList.remove('active')
            })

        currentMenuItem.classList.add('active')

        while (parentElement) {
            if (parentElement.matches('.navbar-nav')) {
                break
            }

            if (parentElement.previousElementSibling?.matches('.nav-link')) {
                parentElement.previousElementSibling.classList.add('active')
            }

            parentElement = parentElement.parentElement
        }
    }
    const handleMenuItemClick = (event: React.MouseEvent<HTMLAnchorElement, MouseEvent>): void => {
        const currentMenuItem: EventTarget & HTMLAnchorElement = event.currentTarget

        setActiveMenuItems(currentMenuItem)
    }

    return (
        <>
            {
                isLoadingCategories ?
                    <Spinner animation="border" role="status" data-testid="categories-loading-indicator">
                        <span className="visually-hidden">Loading categories...</span>
                    </Spinner>
                :
                    <ul className="navbar-nav me-auto" data-testid="category-menu">
                        {rootCategory.children_data.map((category: Category) => renderCategoryMenuItems(category))}
                    </ul>
            }
        </>
    )
}
