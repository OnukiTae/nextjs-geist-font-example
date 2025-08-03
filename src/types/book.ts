export interface Book {
  id: string
  title: string
  authors: string[]
  description?: string
  publishedDate?: string
  pageCount?: number
  categories?: string[]
  thumbnail?: string
  previewLink?: string
  infoLink?: string
  // User-specific fields
  status: 'want-to-read' | 'currently-reading' | 'read'
  rating?: number
  notes?: string
  currentPage?: number
  dateAdded: string
  dateStarted?: string
  dateFinished?: string
}

export interface GoogleBook {
  id: string
  volumeInfo: {
    title: string
    authors?: string[]
    description?: string
    publishedDate?: string
    pageCount?: number
    categories?: string[]
    imageLinks?: {
      thumbnail?: string
      smallThumbnail?: string
    }
    previewLink?: string
    infoLink?: string
  }
}

export interface GoogleBooksResponse {
  items: GoogleBook[]
  totalItems: number
}
