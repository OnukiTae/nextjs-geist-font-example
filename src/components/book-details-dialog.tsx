'use client'

import { useState } from 'react'
import { Book } from '@/types/book'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from './ui/dialog'
import { Button } from './ui/button'
import { Input } from './ui/input'
import { Label } from './ui/label'
import { Textarea } from './ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select'
import { Badge } from './ui/badge'
import { Progress } from './ui/progress'
import { Star, ExternalLink, Calendar, BookOpen, Users } from 'lucide-react'
import { toast } from 'sonner'

interface BookDetailsDialogProps {
  book: Book
  open: boolean
  onOpenChange: (open: boolean) => void
  onUpdate: (id: string, updates: Partial<Book>) => void
}

export function BookDetailsDialog({ book, open, onOpenChange, onUpdate }: BookDetailsDialogProps) {
  const [isEditing, setIsEditing] = useState(false)
  const [editedBook, setEditedBook] = useState<Book>(book)

  const handleSave = () => {
    onUpdate(book.id, editedBook)
    setIsEditing(false)
    toast.success('Book updated successfully!')
  }

  const handleCancel = () => {
    setEditedBook(book)
    setIsEditing(false)
  }

  const getReadingProgress = () => {
    if (!book.pageCount || !book.currentPage) return 0
    return Math.round((book.currentPage / book.pageCount) * 100)
  }

  const formatDate = (dateString?: string) => {
    if (!dateString) return 'Not set'
    return new Date(dateString).toLocaleDateString()
  }

  const getStatusLabel = (status: Book['status']) => {
    switch (status) {
      case 'want-to-read':
        return 'Want to Read'
      case 'currently-reading':
        return 'Currently Reading'
      case 'read':
        return 'Read'
      default:
        return status
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center justify-between">
            {isEditing ? 'Edit Book' : book.title}
            <div className="flex gap-2">
              {!isEditing && (
                <Button variant="outline" size="sm" onClick={() => setIsEditing(true)}>
                  Edit
                </Button>
              )}
              {isEditing && (
                <>
                  <Button variant="outline" size="sm" onClick={handleCancel}>
                    Cancel
                  </Button>
                  <Button size="sm" onClick={handleSave}>
                    Save
                  </Button>
                </>
              )}
            </div>
          </DialogTitle>
          {!isEditing && (
            <DialogDescription>
              by {book.authors.join(', ')}
            </DialogDescription>
          )}
        </DialogHeader>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Book Cover */}
          <div className="space-y-4">
            <div className="aspect-[3/4] bg-muted rounded-lg overflow-hidden">
              {book.thumbnail ? (
                <img
                  src={book.thumbnail}
                  alt={book.title}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-muted-foreground">
                  No Cover Available
                </div>
              )}
            </div>

            {/* External Links */}
            {!isEditing && (
              <div className="space-y-2">
                {book.previewLink && (
                  <Button variant="outline" size="sm" className="w-full gap-2" asChild>
                    <a href={book.previewLink} target="_blank" rel="noopener noreferrer">
                      <ExternalLink className="h-4 w-4" />
                      Preview
                    </a>
                  </Button>
                )}
                {book.infoLink && (
                  <Button variant="outline" size="sm" className="w-full gap-2" asChild>
                    <a href={book.infoLink} target="_blank" rel="noopener noreferrer">
                      <ExternalLink className="h-4 w-4" />
                      More Info
                    </a>
                  </Button>
                )}
              </div>
            )}
          </div>

          {/* Book Details */}
          <div className="md:col-span-2 space-y-6">
            {isEditing ? (
              <EditForm book={editedBook} onChange={setEditedBook} />
            ) : (
              <ViewDetails book={book} />
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}

interface EditFormProps {
  book: Book
  onChange: (book: Book) => void
}

function EditForm({ book, onChange }: EditFormProps) {
  const updateField = (field: keyof Book, value: any) => {
    onChange({ ...book, [field]: value })
  }

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="status">Status</Label>
          <Select value={book.status} onValueChange={(value) => updateField('status', value)}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="want-to-read">Want to Read</SelectItem>
              <SelectItem value="currently-reading">Currently Reading</SelectItem>
              <SelectItem value="read">Read</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label htmlFor="rating">Rating</Label>
          <Select 
            value={book.rating?.toString() || '0'} 
            onValueChange={(value) => updateField('rating', value === '0' ? undefined : parseInt(value))}
          >
            <SelectTrigger>
              <SelectValue placeholder="No rating" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="0">No rating</SelectItem>
              <SelectItem value="1">1 star</SelectItem>
              <SelectItem value="2">2 stars</SelectItem>
              <SelectItem value="3">3 stars</SelectItem>
              <SelectItem value="4">4 stars</SelectItem>
              <SelectItem value="5">5 stars</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {book.status === 'currently-reading' && book.pageCount && (
        <div>
          <Label htmlFor="currentPage">Current Page</Label>
          <Input
            id="currentPage"
            type="number"
            min="0"
            max={book.pageCount}
            value={book.currentPage || 0}
            onChange={(e) => updateField('currentPage', parseInt(e.target.value) || 0)}
          />
        </div>
      )}

      <div>
        <Label htmlFor="notes">Notes</Label>
        <Textarea
          id="notes"
          placeholder="Add your thoughts about this book..."
          value={book.notes || ''}
          onChange={(e) => updateField('notes', e.target.value)}
          rows={4}
        />
      </div>
    </div>
  )
}

interface ViewDetailsProps {
  book: Book
}

function ViewDetails({ book }: ViewDetailsProps) {
  const getReadingProgress = () => {
    if (!book.pageCount || !book.currentPage) return 0
    return Math.round((book.currentPage / book.pageCount) * 100)
  }

  const formatDate = (dateString?: string) => {
    if (!dateString) return 'Not set'
    return new Date(dateString).toLocaleDateString()
  }

  const getStatusLabel = (status: Book['status']) => {
    switch (status) {
      case 'want-to-read':
        return 'Want to Read'
      case 'currently-reading':
        return 'Currently Reading'
      case 'read':
        return 'Read'
      default:
        return status
    }
  }

  return (
    <div className="space-y-6">
      {/* Status and Rating */}
      <div className="flex items-center gap-4">
        <Badge variant="secondary">{getStatusLabel(book.status)}</Badge>
        {book.rating && (
          <div className="flex items-center gap-1">
            {Array.from({ length: 5 }).map((_, i) => (
              <Star
                key={i}
                className={`h-4 w-4 ${
                  i < book.rating! 
                    ? 'fill-yellow-400 text-yellow-400' 
                    : 'text-muted-foreground'
                }`}
              />
            ))}
          </div>
        )}
      </div>

      {/* Reading Progress */}
      {book.status === 'currently-reading' && book.pageCount && book.currentPage && (
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span>Reading Progress</span>
            <span>{book.currentPage}/{book.pageCount} pages ({getReadingProgress()}%)</span>
          </div>
          <Progress value={getReadingProgress()} />
        </div>
      )}

      {/* Book Information */}
      <div className="grid grid-cols-2 gap-4 text-sm">
        {book.publishedDate && (
          <div className="flex items-center gap-2">
            <Calendar className="h-4 w-4 text-muted-foreground" />
            <span>Published: {book.publishedDate}</span>
          </div>
        )}
        {book.pageCount && (
          <div className="flex items-center gap-2">
            <BookOpen className="h-4 w-4 text-muted-foreground" />
            <span>{book.pageCount} pages</span>
          </div>
        )}
        <div className="flex items-center gap-2">
          <Users className="h-4 w-4 text-muted-foreground" />
          <span>{book.authors.join(', ')}</span>
        </div>
      </div>

      {/* Categories */}
      {book.categories && book.categories.length > 0 && (
        <div>
          <h4 className="font-medium mb-2">Categories</h4>
          <div className="flex flex-wrap gap-2">
            {book.categories.map((category) => (
              <Badge key={category} variant="outline">
                {category}
              </Badge>
            ))}
          </div>
        </div>
      )}

      {/* Description */}
      {book.description && (
        <div>
          <h4 className="font-medium mb-2">Description</h4>
          <p className="text-sm text-muted-foreground leading-relaxed">
            {book.description.replace(/<[^>]*>/g, '')}
          </p>
        </div>
      )}

      {/* Notes */}
      {book.notes && (
        <div>
          <h4 className="font-medium mb-2">My Notes</h4>
          <p className="text-sm text-muted-foreground leading-relaxed whitespace-pre-wrap">
            {book.notes}
          </p>
        </div>
      )}

      {/* Dates */}
      <div className="text-xs text-muted-foreground space-y-1">
        <div>Added: {formatDate(book.dateAdded)}</div>
        {book.dateStarted && <div>Started: {formatDate(book.dateStarted)}</div>}
        {book.dateFinished && <div>Finished: {formatDate(book.dateFinished)}</div>}
      </div>
    </div>
  )
}
