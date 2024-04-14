import {
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
} from 'lucide-react'

import { useSearchParams } from 'react-router-dom'
import { Button } from './ui/button'

interface PaginationProps {
  pages: number
  items: number[]
  page: number
}

export function Pagination({ pages, items, page }: PaginationProps) {
  const [searchParams, setSearch] = useSearchParams()
  const row = searchParams.get("row")

  function firstPage() {
    setSearch(state => {
      state.set('page', '1')

      return state
    })
  }

  function previousPage() {
    if (page - 1 <= 0) return

    setSearch(state => {
      state.set('page', String(page - 1))

      return state
    })
  }

  function nextPage() {
    if (page + 1 > pages) return

    setSearch(state => {
      state.set('page', String(page + 1))

      return state
    })
  }

  function lastPage() {
    setSearch(state => {
      state.set('page', String(pages))

      return state
    })
  }

  function setFilterRow(value: string){
    setSearch(state => {
      state.set('row', value)
      return state
    })
    
  }

  return (
    <div className="flex text-sm items-center justify-between text-zinc-500">
      <span>Showing {items[1]} of {items[0]} items</span>
      <div className="flex items-center gap-8">
        <div className="flex items-center gap-2">
          <span>Rows per page</span>

          <select title='page' defaultValue={String(row)} name='page' onChange={(e) => setFilterRow(e.target.value)}
            className='px-3 py-1.5 text-zinc-100 tabular-nums rounded-md border border-zinc-800 bg-zinc-800/50 flex items-center gap-2.5 z-50 text-sm max-h-96 min-w-[6rem] overflow-hidden bg-zinc-900'

            aria-label='Page'
          >
            <option value="5"
              className='flex items-center gap-2 text-zinc-300 px-3 py-1.5 justify-between outline-none hover:bg-zinc-800'
            >5</option>
            <option value="10"
              className='flex items-center gap-2 text-zinc-300 px-3 py-1.5 justify-between outline-none hover:bg-zinc-800'
            >10</option>
            <option value="15"
              className='flex items-center gap-2 text-zinc-300 px-3 py-1.5 justify-between outline-none hover:bg-zinc-800'
            >15</option>
          </select>
        </div>

        <span>Page {page} of {pages} </span>

        <div className="space-x-1.5">
          <Button onClick={firstPage} size="icon" disabled={page == 1}>
            <ChevronsLeft className="size-4" />
            <span className="sr-only">First page</span>
          </Button>
          <Button onClick={previousPage} disabled={page - 1 <= 0}>
            <ChevronLeft className="size-4" />
            <span className="sr-only">Previous page</span>
          </Button>
          <Button onClick={nextPage} size="icon" disabled={page + 1 > pages}>
            <ChevronRight className="size-4" />
            <span className="sr-only">Next page</span>
          </Button>
          <Button onClick={lastPage} size="icon" disabled={page == pages}>
            <ChevronsRight className="size-4" />
            <span className="sr-only">Last page</span>
          </Button>
        </div>
      </div>
    </div >
  )
}
