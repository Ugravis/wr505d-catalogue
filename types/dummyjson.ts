export interface DummyJsonProductDimensions {
  width: number
  height: number
  depth: number
}

export interface DummyJsonProductReview {
  rating: number
  comment: string
  date: string
  reviewerName: string
  reviewerEmail: string
}

export interface DummyJsonProductMeta {
  createdAt: string
  updatedAt: string
  barcode: string
  qrCode: string
}

export interface DummyJsonProduct {
  id: number
  title: string
  description: string
  category: string
  price: number
  discountPercentage: number
  rating: number
  stock: number
  tags: string[]
  brand?: string
  sku: string
  weight: number
  dimensions: DummyJsonProductDimensions
  warrantyInformation: string
  shippingInformation: string
  availabilityStatus: string
  reviews: DummyJsonProductReview[]
  returnPolicy: string
  minimumOrderQuantity: number
  meta: DummyJsonProductMeta
  images: string[]
  thumbnail: string
}

export interface DummyJsonProductListResponse {
  products: DummyJsonProduct[]
  total: number
  skip: number
  limit: number
}

export interface DummyJsonCategory {
  slug: string
  name: string
  url: string
}

export interface DummyJsonUser {
  id: number
  username: string
  email: string
  firstName: string
  lastName: string
  gender: string
  image: string
}

export interface DummyJsonLoginRequest {
  username: string
  password: string
  expiresInMins?: number
}

export interface DummyJsonLoginResponse extends DummyJsonUser {
  accessToken: string
  refreshToken: string
}

export interface DummyJsonRefreshResponse {
  accessToken: string
  refreshToken: string
}
