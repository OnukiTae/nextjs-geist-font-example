'use client'

import { useState } from 'react'
import { Book } from '@/types/book'
import { Card, CardContent, CardFooter } from './ui/card'
import { Button } from './ui/button'
import { Badge } from './ui/badge'
import { Progress } from './ui/progress'
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuSeparator, 
  DropdownMenuTrigger 
} from './ui/dropdown-menu'
import { BookDetailsDialog } from './book-details-dialog'
import { MoreVertical, Star, Trash2, Eye, Edit } from 'lucide-react'
import { toast } from 'sonner'

interface BookCardProps {
  book: Book
  onUpdate: (id: string, updates: Partial<Book>) => void
  onDelete: (id: string) => void
}

export function BookCard({ book, onUpdate, onDelete }: BookCardProps) {
  const [showDetails, setShowDetails] = useState(false)

  const getStatusColor = (status: Book['status']) => {
    switch (status) {
      case 'want-to-read':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300'
      case 'currently-reading':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300'
      case 'read':
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300'
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300'
    }
  }

  const getStatusLabel = (status: Book['status']) => {
    switch (status) {
      case 'want-to-read':
        return 'Want to Read'
      case 'currently-reading':
        return 'Reading'
      case 'read':
        return 'Read'
      default:
        return status
    }
  }

  const getReadingProgress = () => {
    if (book.status !== 'currently-reading' || !book.pageCount || !book.currentPage) {
      return 0
    }
    return Math.round((book.currentPage / book.pageCount) * 100)
  }

  const handleStatusChange = (newStatus: Book['status']) => {
    const updates: Partial<Book> = { status: newStatus }
    
    if (newStatus === 'currently-reading' && book.status !== 'currently-reading') {
      updates.dateStarted = new Date().toISOString()
    } else if (newStatus === 'read' && book.status !== 'read') {
      updates.dateFinished = new Date().toISOString()
      updates.currentPage = book.pageCount
    }
    
    onUpdate(book.id, updates)
    toast.success(`Moved "${book.title}" to ${getStatusLabel(newStatus)}`)
  }

  const handleDelete = () => {
    if (confirm(`Are you sure you want to remove "${book.title}" from your library?`)) {
      onDelete(book.id)
      toast.success(`Removed "${book.title}" from your library`)
    }
  }

  return (
    <>
      <Card className="h-full flex flex-col hover:shadow-lg transition-shadow">
        <CardContent className="p-4 flex-1">
          <div className="aspect-[3/4] mb-3 bg-muted rounded-md overflow-hidden">
            {book.thumbnail ? (
              <img
                src={book.thumbnail}
                alt={book.title}
                className="w-full h-full object-cover cursor-pointer"
                onClick={() => setShowDetails(true)}
              />
            ) : (
              <div 
                className="w-full h-full flex items-center justify-center text-muted-foreground cursor-pointer"
                onClick={() => setShowDetails(true)}
              >
                No Cover
              </div>
            )}
          </div>
          
          <div className="space-y-2">
            <h3 
              className="font-semibold text-sm line-clamp-2 cursor-pointer hover:text-primary"
              onClick={() => setShowDetails(true)}
            >
              {book.title}
            </h3>
            
            <p className="text-xs text-muted-foreground line-clamp-1">
              {book.authors.join(', ')}
            </p>
            
            <Badge className={`text-xs ${getStatusColor(book.status)}`}>
              {getStatusLabel(book.status)}
            </Badge>
            
            {book.status === 'currently-reading' && book.pageCount && book.currentPage && (
              <div className="space-y-1">
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>Progress</span>
                  <span>{book.currentPage}/{book.pageCount}</span>
                </div>
                <Progress value={getReadingProgress()} className="h-1" />
              </div>
            )}
            
            {book.rating && (
              <div className="flex items-center gap-1">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star
                    key={i}
                    className={`h-3 w-3 ${
                      i < book.rating! 
                        ? 'fill-yellow-400 text-yellow-400' 
                        : 'text-muted-foreground'
                    }`}
                  />
                ))}
              </div>
            )}
          </div>
        </CardContent>
        
        <CardFooter className="p-4 pt-0">
          <div className="flex items-center justify-between w-full">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowDetails(true)}
              className="gap-1"
            >
              <Eye className="h-3 w-3" />
              View
            </Button>
            
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm">
                  <MoreVertical className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => setShowDetails(true)}>
                  <Edit className="h-4 w-4 mr-2" />
                  Edit Details
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => handleStatusChange('want-to-read')}>
                  Want to Read
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => handleStatusChange('currently-reading')}>
                  Currently Reading
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => handleStatusChange('read')}>
                  Read
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleDelete} className="text-destructive">
                  <Trash2 className="h-4 w-4 mr-2" />
                  Remove
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </CardFooter>
      </Card>
      
      {showDetails && (
        <BookDetailsDialog
          book={book}
          open={showDetails}
          onOpenChange={setShowDetails}
          onUpdate={onUpdate}
        />
      )}
    </>
  )
}
