import { GoogleBooksResponse, GoogleBook } from '@/types/book'

const GOOGLE_BOOKS_API_BASE = 'https://www.googleapis.com/books/v1'

export class GoogleBooksService {
  static async searchBooks(query: string, maxResults: number = 20): Promise<GoogleBooksResponse> {
    try {
      const response = await fetch(
        `${GOOGLE_BOOKS_API_BASE}/volumes?q=${encodeURIComponent(query)}&maxResults=${maxResults}`
      )
      
      if (!response.ok) {
        throw new Error('Failed to fetch books from Google Books API')
      }
      
      const data = await response.json()
      return data
    } catch (error) {
      console.error('Error searching books:', error)
      throw error
    }
  }

  static async getBookById(id: string): Promise<GoogleBook> {
    try {
      const response = await fetch(`${GOOGLE_BOOKS_API_BASE}/volumes/${id}`)
      
      if (!response.ok) {
        throw new Error('Failed to fetch book details from Google Books API')
      }
      
      const data = await response.json()
      return data
    } catch (error) {
      console.error('Error fetching book details:', error)
      throw error
    }
  }

  static convertGoogleBookToBook(googleBook: GoogleBook): Omit<import('@/types/book').Book, 'status' | 'dateAdded'> {
    const { volumeInfo } = googleBook
    
    return {
      id: googleBook.id,
      title: volumeInfo.title || 'Unknown Title',
      authors: volumeInfo.authors || ['Unknown Author'],
      description: volumeInfo.description,
      publishedDate: volumeInfo.publishedDate,
      pageCount: volumeInfo.pageCount,
      categories: volumeInfo.categories,
      thumbnail: volumeInfo.imageLinks?.thumbnail,
      previewLink: volumeInfo.previewLink,
      infoLink: volumeInfo.infoLink,
    }
  }
}
