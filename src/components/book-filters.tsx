'use client'

import { Input } from './ui/input'
import { Search } from 'lucide-react'

interface BookFiltersProps {
  searchQuery: string
  onSearchChange: (query: string) => void
}

export function BookFilters({ searchQuery, onSearchChange }: BookFiltersProps) {
  return (
    <div className="flex items-center gap-4">
      <div className="relative flex-1 max-w-md">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search your library..."
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          className="pl-10"
        />
      </div>
    </div>
  )
}
    