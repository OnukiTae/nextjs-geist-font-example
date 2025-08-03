import { Book } from '@/types/book'

const STORAGE_KEY = 'bookshelf-books'

export class StorageService {
  static getBooks(): Book[] {
    if (typeof window === 'undefined') return []
    
    try {
      const stored = localStorage.getItem(STORAGE_KEY)
      return stored ? JSON.parse(stored) : []
    } catch (error) {
      console.error('Error reading books from storage:', error)
      return []
    }
  }

  static saveBooks(books: Book[]): void {
    if (typeof window === 'undefined') return
    
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(books))
    } catch (error) {
      console.error('Error saving books to storage:', error)
    }
  }

  static addBook(book: Book): void {
    const books = this.getBooks()
    const existingIndex = books.findIndex(b => b.id === book.id)
    
    if (existingIndex >= 0) {
      books[existingIndex] = book
    } else {
      books.push(book)
    }
    
    this.saveBooks(books)
  }

  static updateBook(id: string, updates: Partial<Book>): void {
    const books = this.getBooks()
    const index = books.findIndex(b => b.id === id)
    
    if (index >= 0) {
      books[index] = { ...books[index], ...updates }
      this.saveBooks(books)
    }
  }

  static deleteBook(id: string): void {
    const books = this.getBooks()
    const filtered = books.filter(b => b.id !== id)
    this.saveBooks(filtered)
  }

  static getBookById(id: string): Book | undefined {
    const books = this.getBooks()
    return books.find(b => b.id === id)
  }

  static getBooksByStatus(status: Book['status']): Book[] {
    const books = this.getBooks()
    return books.filter(b => b.status === status)
  }
}
