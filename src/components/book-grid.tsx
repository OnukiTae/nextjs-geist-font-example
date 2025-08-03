'use client'

import { Book } from '@/types/book'
import { BookCard } from './book-card'

interface BookGridProps {
  books: Book[]
  onBookUpdate: (id: string, updates: Partial<Book>) => void
  onBookDelete: (id: string) => void
}

export function BookGrid({ books, onBookUpdate, onBookDelete }: BookGridProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
      {books.map((book) => (
        <BookCard
          key={book.id}
          book={book}
          onUpdate={onBookUpdate}
          onDelete={onBookDelete}
        />
      ))}
    </div>
  )
}
