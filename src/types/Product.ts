export interface ProductsResponse {
    items: Product[],
    total_count: number
}

export default interface Product {
    id: number
    sku: string
    name: string
    attribute_set_id: number
    price: number
    status: ProductStatus
    visibility: ProductVisibility
    type_id: ProductTypeId
    created_at: string | Date
    updated_at: string | Date
    extension_attributes: ProductExtensionAttributes
    product_links: ProductLink[]
    options: ProductOption[]
    media_gallery_entries: MediaGalleryEntry[]
    tier_prices: ProductTierPrice[]
    custom_attributes: CustomProductAttribute[]
}

export interface ProductExtensionAttributes {
    website_ids?: number[]
    category_links?: CategoryLink[]
    discounts?: Discount[]
    bundle_product_options?: BundleProductOption[]
    stock_items?: StockItem[]
    downloadable_product_links?: DownloadableProductLink[]
    downloadable_product_samples?: DownloadableProductSample[]
    giftcard_amounts?: GiftcardAmount[]
    configurable_product_options?: ConfigurableProductOption[]
    configurable_product_links?: number[]
}

export interface CategoryLink {
    position: number
    category_id: string
    extension_attributes?: any[]
}

export interface Discount {
    discount_data: DiscountData[]
    rule_label: string
    rule_id: number
}

export interface DiscountData {
    amount: number
    base_amount: number
    original_amount: number
    base_original_amount: number
}

export interface BundleProductOption {
    option_id: number
    title: string
    required: true
    type: string
    position: number
    sku: string
    product_links: BundleProductLink[]
    extension_attributes?: any[]
}

export interface BundleProductLink {
    id: string
    sku: string
    option_id: number
    qty: number
    position: number
    is_default: boolean
    price: number
    price_type: null | string,
    can_change_quantity: CanChangeBundleProductQuantity
}

export interface StockItem {
    item_id: number
    product_id: number
    stock_id: number
    qty: number
    is_in_stock: boolean
    is_qty_decimal: boolean
    show_default_notification_message: boolean
    use_config_min_qty: boolean
    min_qty: number
    use_config_min_sale_qty: number
    min_sale_qty: number
    use_config_max_sale_qty: boolean
    max_sale_qty: number
    use_config_backorders: boolean
    backorders: number
    use_config_notify_stock_qty: boolean
    notify_stock_qty: number
    use_config_qty_increments: boolean
    qty_increments: number
    use_config_enable_qty_inc: boolean
    enable_qty_increments: boolean
    use_config_manage_stock: boolean
    manage_stock: boolean
    low_stock_date: string
    is_decimal_divided: boolean
    stock_status_changed_auto: number
    extension_attributes?: any[]
}

export interface DownloadableProductLink {
    id: number
    title: string
    sort_order: number
    is_shareable: number
    price: number
    number_of_downloads: number
    link_type: DownloadableProductLinkType
    link_file: string
    link_file_content: FileContent
    link_url: string
    sample_type: DownloadableProductSampleFileType | null
    sample_file?: string
    sample_file_content?: FileContent
    sample_url?: string
    extension_attributes?: any[]
}

export interface FileContent {
    file_data: string;
    name: string;
    extension_attributes?: any[];
}

export interface DownloadableProductSample {
    id: number
    title: string
    sort_order: number
    sample_type: DownloadableProductSampleFileType
    sample_file?: string
    sample_file_content?: FileContent
    sample_url?: string
    extension_attributes?: any[]
}

export interface GiftcardAmount {
    attribute_id: number
    website_id: number
    value: number
    website_value: number
    extension_attributes?: any[]
}

export interface ConfigurableProductOption {
    id: number
    attribute_id: string
    label: string
    position: number
    values: ConfigurableProductOptionValue[]
    product_id: number
}

export interface ConfigurableProductOptionValue {
    value_index: number
}

export interface ProductLink {
    sku: string
    link_type: LinkType
    linked_product_sku: string
    linked_product_type: ProductTypeId
    position: number
}

export interface ProductOption {
    product_sku: string
    option_id: number
    title: string
    type: string
    sort_order: number
    is_require: boolean
    price: number
    price_type: string
    sku: string
    file_extension: string
    max_characters: number
    image_size_x: number
    image_size_y: number
    values: ProductOptionValue[]
    extension_attributes?: any[]
}

export interface ProductOptionValue {
    title: string
    sort_order: number
    price: number
    price_type: string
    sku: string
    extension_attributes?: any[]
}

export interface MediaGalleryEntry {
    id: number
    media_type: string
    label: string
    position: number
    disabled: boolean
    types: MediaGalleryEntryType[]
    file: string
}

export interface ProductTierPrice {
    customer_group_id: number
    qty: number
    value: number
    extension_attributes?: any[]
}

export interface CustomProductAttribute {
    attribute_code: string
    value: string[] | string
}

export enum ProductStatus {
    Disabled = 0,
    Enabled = 1
}

export enum ProductVisibility {
    NotVisibleIndividually = 1,
    Catalog = 2,
    Search = 3,
    CatalogSearch = 4
}

export enum ProductTypeId {
    Simple = 'simple',
    Configurable = 'configurable',
    Grouped = 'grouped',
    Bundle = 'bundle',
    Virtual = 'virtual',
    Downloadable = 'downloadable',
    GiftCard = 'giftcard'
}

export enum LinkType {
    Crosssell = 'crosssell',
    Upsell = 'upsell',
    Related = 'related'
}

export enum MediaGalleryEntryType {
    Image = 'image',
    SmallImage = 'small_image',
    Thumbnail = 'thumbnail'
}

export enum CanChangeBundleProductQuantity {
    Yes,
    No
}

export enum DownloadableProductLinkType {
    Url = 'url',
    File = 'file'
}

type DownloadableProductSampleFileType = DownloadableProductLinkType
