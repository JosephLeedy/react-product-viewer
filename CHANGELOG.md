# Changelog for React Product Viewer

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog][kac], and this project adheres to
[Semantic Versioning][semver].

## [Unreleased]

### Changed
- Replaced category and product JSON files with calls to a backend catalog API
- The categories loading spinner has been moved from the Category Menu 
component to the main application component

### Fixed
- Scrollbars are no longer shown when page footer is not present 
- Refactored the Current Category Context Provider to set its default value 
using a function rather than setting it after the check for provided categories 

### Removed
- The Categories Context no longer tracks whether the categories have been 
loaded

## [1.0.0] - 2023-12-11

### Added
- Initial MVP with the following functionality:
  * Category menu rendered from a static JSON file
  * Product Grid rendered from a static JSON file
  * Basic product search and filtering by name or SKU

[kac]: https://keepachangelog.com/en/1.0.0/
[semver]: https://semver.org/spec/v2.0.0.html
[Unreleased]: https://github.com/JosephLeedy/react-product-viewer/compare/1.0.0...HEAD
[1.0.0]: https://github.com/JosephLeedy/react-product-viewer/releases/tag/1.0.0
