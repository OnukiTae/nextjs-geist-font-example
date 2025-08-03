'use client'

import { useState } from 'react'
import { Book } from '@/types/book'
import { GoogleBooksService } from '@/lib/google-books'
import { Button } from './ui/button'
import { Input } from './ui/input'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select'
import { Badge } from './ui/badge'
import { Loader2, Search, X, Plus } from 'lucide-react'
import { toast } from 'sonner'

interface BookSearchProps {
  onBookAdd: (book: Book) => void
  onClose: () => void
}

export function BookSearch({ onBookAdd, onClose }: BookSearchProps) {
  const [query, setQuery] = useState('')
  const [searchResults, setSearchResults] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(false)

  const handleSearch = async () => {
    if (!query.trim()) return

    setIsLoading(true)
    try {
      const response = await GoogleBooksService.searchBooks(query)
      setSearchResults(response.items || [])
    } catch (error) {
      toast.error('Failed to search books. Please try again.')
      console.error('Search error:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleAddBook = (googleBook: any, status: Book['status']) => {
    const bookData = GoogleBooksService.convertGoogleBookToBook(googleBook)
    const book: Book = {
      ...bookData,
      status,
      dateAdded: new Date().toISOString(),
    }
    
    onBookAdd(book)
    toast.success(`Added "${book.title}" to your library!`)
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSearch()
    }
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Search Books</CardTitle>
            <CardDescription>
              Search for books using Google Books API
            </CardDescription>
          </div>
          <Button variant="ghost" size="sm" onClick={onClose}>
            <X className="h-4 w-4" />
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex gap-2">
          <Input
            placeholder="Search by title, author, or ISBN..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyPress={handleKeyPress}
            className="flex-1"
          />
          <Button onClick={handleSearch} disabled={isLoading || !query.trim()}>
            {isLoading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Search className="h-4 w-4" />
            )}
          </Button>
        </div>

        {searchResults.length > 0 && (
          <div className="space-y-4 max-h-96 overflow-y-auto">
            {searchResults.map((book) => (
              <SearchResultItem
                key={book.id}
                book={book}
                onAdd={handleAddBook}
              />
            ))}
          </div>
        )}

        {searchResults.length === 0 && query && !isLoading && (
          <div className="text-center py-8 text-muted-foreground">
            No books found for "{query}". Try a different search term.
          </div>
        )}
      </CardContent>
    </Card>
  )
}

interface SearchResultItemProps {
  book: any
  onAdd: (book: any, status: Book['status']) => void
}

function SearchResultItem({ book, onAdd }: SearchResultItemProps) {
  const { volumeInfo } = book
  const [selectedStatus, setSelectedStatus] = useState<Book['status']>('want-to-read')

  return (
    <div className="flex gap-4 p-4 border rounded-lg">
      {volumeInfo.imageLinks?.thumbnail && (
        <img
          src={volumeInfo.imageLinks.thumbnail}
          alt={volumeInfo.title}
          className="w-16 h-24 object-cover rounded"
        />
      )}
      <div className="flex-1 space-y-2">
        <div>
          <h4 className="font-semibold line-clamp-2">{volumeInfo.title}</h4>
          {volumeInfo.authors && (
            <p className="text-sm text-muted-foreground">
              by {volumeInfo.authors.join(', ')}
            </p>
          )}
        </div>
        
        {volumeInfo.description && (
          <p className="text-sm text-muted-foreground line-clamp-3">
            {volumeInfo.description.replace(/<[^>]*>/g, '')}
          </p>
        )}
        
        <div className="flex flex-wrap gap-1">
          {volumeInfo.categories?.slice(0, 3).map((category: string) => (
            <Badge key={category} variant="secondary" className="text-xs">
              {category}
            </Badge>
          ))}
        </div>
        
        <div className="flex items-center gap-2 pt-2">
          <Select value={selectedStatus} onValueChange={(value) => setSelectedStatus(value as Book['status'])}>
            <SelectTrigger className="w-40">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="want-to-read">Want to Read</SelectItem>
              <SelectItem value="currently-reading">Currently Reading</SelectItem>
              <SelectItem value="read">Read</SelectItem>
            </SelectContent>
          </Select>
          <Button size="sm" onClick={() => onAdd(book, selectedStatus)} className="gap-1">
            <Plus className="h-3 w-3" />
            Add
          </Button>
        </div>
      </div>
    </div>
  )
}
