import { FileDown, Filter, MoreHorizontal, Plus, Search, RefreshCcw } from "lucide-react"
import { Header } from "./components/header"
import { Tabs } from "./components/tabs"
import { Button } from "./components/ui/button"
import { Control, Input } from "./components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "./components/ui/table"
import { keepPreviousData, useQuery } from "@tanstack/react-query"
import { Pagination } from "./components/pagination"
import { useSearchParams } from "react-router-dom"
import { useState } from "react"
import * as Dialog from "@radix-ui/react-dialog"
import { CreateTagForm } from "./components/create-tag-form"

export interface TagsRoot {
  first: number
  prev: number | null
  next: number
  last: number
  pages: number
  items: number
  data: Tag[]
}

export interface Tag {
  title: string
  amount: number
  slug: string
  id: string
}

export function App() {
  const [searchParams, setSearchParams] = useSearchParams()

  const urlFilter = searchParams.get('filter') ?? ''
  const [filter, setFilter] = useState(urlFilter)

  // const debounceFilter = useDebounceValue(filter, 1000)

  const page = searchParams.get('page') ? Number(searchParams.get('page')) : 1
  const numRows = searchParams.get('row') ? Number(searchParams.get('row')) : 5

  const { data: tags, isLoading } = useQuery<TagsRoot>({
    queryKey: ['get-tags', urlFilter, page, numRows],
    queryFn: async () => {

       const response = await fetch(`http://localhost:8888/tags?_page=${page}&_per_page=${numRows}&title=${urlFilter}`)
       const data = await response.json()
       console.log(data);

  

      return data
    },
    placeholderData: keepPreviousData, // CARREGAMENTO SUTIL
    //staleTime: 1000 * 60, // RECARREGA OS DADOS APOS ESSE TEMPO
  })

  function onFilter() {
    setSearchParams(params => {
      params.set('page', '1')
      params.set('filter', filter)
      return params
    })
  }

  function refresh() {
    setFilter('')
    setSearchParams(params => {
      params.set('filter', '')
      return params
    })
  }

  if (isLoading) return null

  return (
    <article className="p-10 space-y-8">
      <div>
        <Header />
        <Tabs />
      </div>

      <main className="max-w-6xl mx-auto space-y-5">
        <div className="flex items-center gap-3">
          <h1 className="text-xl font-bold">Tags</h1>
          <Dialog.Root >
            <Dialog.Trigger asChild>
              <Button variant="primary" >
                <Plus className="size-3" />
                Create new
              </Button>
            </Dialog.Trigger>

            <Dialog.Portal>
              <Dialog.Overlay className="fixed inset-0 bg-black/70" />
              <Dialog.Content className="fixed space-y-10 p-10 right-0 top-0 bottom-0 h-screen min-w-[320px] bg-zinc-900 border-l border-zinc-900">
                <div className="space-y-3">
                  <Dialog.Title className="text-xl font-bold ">
                    Create tag
                  </Dialog.Title>
                  <Dialog.Description className="text-sm text-zinc-500 ">
                    Tags can be used to group similar concepts.
                  </Dialog.Description>
                </div>

                <CreateTagForm></CreateTagForm>
                <Dialog.Close />
              </Dialog.Content>
            </Dialog.Portal>
          </Dialog.Root>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-x-2">
            <Input variant='filter'>
              <Search className="size-3" />
              <Control
                placeholder="Search tags..."
                onChange={e => setFilter(e.target.value)}
                value={filter}
              />

              <Button variant="none" onClick={refresh}>
                <RefreshCcw className="size-3" />
              </Button>
            </Input>

            <Button onClick={onFilter}>
              <Filter className="size-3" />
              Filter
            </Button>
          </div>

          <Button>
            <FileDown className="size-3" />
            Export
          </Button>
        </div>

        <Table>
          <TableHeader>
            <TableRow>
              <TableHead></TableHead>
              <TableHead>Tag</TableHead>
              <TableHead>Amount of projects</TableHead>
              <TableHead></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {/* {Array.from({ length: 10 }).map((_, index) => { */}
            {tags?.data.map((tag, index) => {
              return (
                <TableRow key={index}>
                  <TableCell></TableCell>
                  <TableCell>
                    <div className="flex flex-col gap-0.5">
                      <span className="font-medium">{tag.title}</span>
                      <span className="text-xs text-zinc-500">{`${tag.slug} - ${tag.id}`}</span>
                    </div>
                  </TableCell>
                  <TableCell className="text-zinc-300">
                    {`${tag.amount} ${tag.amount > 0 ? `projetos` : `projeto`}`}
                    {/* {tag.contentType} */}
                  </TableCell>
                  <TableCell className="text-right">
                    <Button size="icon">
                      <MoreHorizontal className="size-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              )
            })}
          </TableBody>
        </Table>

        {tags && <Pagination pages={tags.pages} items={[tags.items, tags.data.length]} page={page} />}
      </main>
    </article >
  )
}