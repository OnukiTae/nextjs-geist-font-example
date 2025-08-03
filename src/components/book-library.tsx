'use client'

import { useState, useEffect } from 'react'
import { Book } from '@/types/book'
import { StorageService } from '@/lib/storage'
import { BookSearch } from './book-search'
import { BookGrid } from './book-grid'
import { BookFilters } from './book-filters'
import { Button } from './ui/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs'
import { Plus, BookOpen, Library, Heart } from 'lucide-react'

export function BookLibrary() {
  const [books, setBooks] = useState<Book[]>([])
  const [filteredBooks, setFilteredBooks] = useState<Book[]>([])
  const [activeTab, setActiveTab] = useState<'all' | 'want-to-read' | 'currently-reading' | 'read'>('all')
  const [searchQuery, setSearchQuery] = useState('')
  const [showSearch, setShowSearch] = useState(false)

  useEffect(() => {
    const loadedBooks = StorageService.getBooks()
    setBooks(loadedBooks)
    setFilteredBooks(loadedBooks)
  }, [])

  useEffect(() => {
    let filtered = books

    // Filter by status
    if (activeTab !== 'all') {
      filtered = filtered.filter(book => book.status === activeTab)
    }

    // Filter by search query
    if (searchQuery) {
      filtered = filtered.filter(book =>
        book.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        book.authors.some(author => author.toLowerCase().includes(searchQuery.toLowerCase()))
      )
    }

    setFilteredBooks(filtered)
  }, [books, activeTab, searchQuery])

  const handleBookAdd = (book: Book) => {
    StorageService.addBook(book)
    setBooks(StorageService.getBooks())
    setShowSearch(false)
  }

  const handleBookUpdate = (id: string, updates: Partial<Book>) => {
    StorageService.updateBook(id, updates)
    setBooks(StorageService.getBooks())
  }

  const handleBookDelete = (id: string) => {
    StorageService.deleteBook(id)
    setBooks(StorageService.getBooks())
  }

  const getTabCount = (status: Book['status']) => {
    return books.filter(book => book.status === status).length
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-4xl font-bold text-foreground mb-2">BookShelf</h1>
          <p className="text-muted-foreground">Your personal reading companion</p>
        </div>
        <Button onClick={() => setShowSearch(true)} className="gap-2">
          <Plus className="h-4 w-4" />
          Add Book
        </Button>
      </div>

      {showSearch && (
        <div className="mb-8">
          <BookSearch onBookAdd={handleBookAdd} onClose={() => setShowSearch(false)} />
        </div>
      )}

      <div className="mb-6">
        <BookFilters searchQuery={searchQuery} onSearchChange={setSearchQuery} />
      </div>

      <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as any)} className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="all" className="gap-2">
            <Library className="h-4 w-4" />
            All ({books.length})
          </TabsTrigger>
          <TabsTrigger value="want-to-read" className="gap-2">
            <Heart className="h-4 w-4" />
            Want to Read ({getTabCount('want-to-read')})
          </TabsTrigger>
          <TabsTrigger value="currently-reading" className="gap-2">
            <BookOpen className="h-4 w-4" />
            Reading ({getTabCount('currently-reading')})
          </TabsTrigger>
          <TabsTrigger value="read" className="gap-2">
            <BookOpen className="h-4 w-4" />
            Read ({getTabCount('read')})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="mt-6">
          <BookGrid 
            books={filteredBooks} 
            onBookUpdate={handleBookUpdate}
            onBookDelete={handleBookDelete}
          />
        </TabsContent>
        <TabsContent value="want-to-read" className="mt-6">
          <BookGrid 
            books={filteredBooks} 
            onBookUpdate={handleBookUpdate}
            onBookDelete={handleBookDelete}
          />
        </TabsContent>
        <TabsContent value="currently-reading" className="mt-6">
          <BookGrid 
            books={filteredBooks} 
            onBookUpdate={handleBookUpdate}
            onBookDelete={handleBookDelete}
          />
        </TabsContent>
        <TabsContent value="read" className="mt-6">
          <BookGrid 
            books={filteredBooks} 
            onBookUpdate={handleBookUpdate}
            onBookDelete={handleBookDelete}
          />
        </TabsContent>
      </Tabs>

      {filteredBooks.length === 0 && (
        <div className="text-center py-12">
          <BookOpen className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
          <h3 className="text-xl font-semibold mb-2">No books found</h3>
          <p className="text-muted-foreground mb-4">
            {books.length === 0 
              ? "Start building your library by adding your first book!"
              : "Try adjusting your filters or search query."
            }
          </p>
          {books.length === 0 && (
            <Button onClick={() => setShowSearch(true)} className="gap-2">
              <Plus className="h-4 w-4" />
              Add Your First Book
            </Button>
          )}
        </div>
      )}
    </div>
  )
}
