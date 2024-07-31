export type ResponseType = {
    value?: string
    statusCode?: number
    message?: string
    error?: string
}

export type ImageType = {
    id: string
    url: string
    width: string
    height: string
}

export type UserType = {
    name: string
    email: string
    slug: string
    description: string
    image: ImageType
    cover: ImageType
    statusCode?: number
}
