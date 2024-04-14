import { Button } from "./ui/button"
import { Check, File, Loader2, X } from "lucide-react"
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import * as Dialog from "@radix-ui/react-dialog"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { useState } from "react"
import axios from "axios"

const createShema = z.object({
    title: z.string().min(3, { message: "Minimum 3 characters." }),
})

type CreateTagParams = z.infer<typeof createShema>

function createKeyString(input: string) {
    return input.normalize("NFD").toLowerCase().replace(/[^\w\s]/g, '').replace(/\s+/g, '-')
}

export function CreateTagForm() {
    const queryClient = useQueryClient()
    const { register, handleSubmit, watch, formState } = useForm<CreateTagParams>({
        resolver: zodResolver(createShema)
    })

    const [file, setFile] = useState<FileList | null>(null)


    const key = watch('title')
        ? createKeyString(watch('title'))
        : ''

    const { mutateAsync } = useMutation({
        mutationFn: async ({ title }: CreateTagParams) => {
            console.log(title, key);

            if (!file || file.length === 0) return
            const type = file[0].type

            await fetch('http://localhost:3333/upload', {
                method: "POST",
                body: JSON.stringify({
                    name: title,
                    key,
                    contentType: type,
                    creator: "erik616"
                }),
                headers: {
                    'Content-Type': 'application/json'
                }
            }
            ).then(response => response.json())
                .then(data => console.log(data))
                .catch(error => console.error(error))


            return
            // const respose = await fetch('http://localhost:8888/tags', {
            //     method: 'POST',
            //     body: JSON.stringify({
            //         title,
            //         key,
            //         amount: 0
            //     })
            // })


            const url = settings.signedUrl

            const arq = file[0]
            axios.put(url, arq, {
                headers: {
                    "Content-Type": type
                }
            })

        },
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: ['get-tags']
            })
        }
    })

    async function createTag({ title }: CreateTagParams) {
        await mutateAsync({ title })
    }

    return (
        <form onSubmit={handleSubmit(createTag)} className="w-full space-y-6">
            <div className="space-y-2">
                <label className="text-sm font-medium block" htmlFor="title">Tag name</label>
                <input
                    {...register('title')}
                    id="title"
                    type="text"
                    className="border border-zinc-800 rounded-lg px-3 py-2 bg-zinc-800/50 w-full text-sm"
                />
            </div>

            <div className="space-y-2">
                <label className="text-sm font-medium block" htmlFor="key">Key</label>
                <input
                    id="key"
                    type="text"
                    value={key}
                    readOnly
                    className="border border-zinc-800 rounded-lg px-3 py-2 bg-zinc-800/50 w-full text-sm"
                />
                {formState.errors?.title && (
                    <p className="text-sm text-red-400">{formState.errors?.title.message}</p>
                )}
            </div>

            <div className="space-y-2 text-sm font-medium border-dashed border-2 border-teal-400 rounded-lg px-3 py-4 bg-zinc-800/50 w-full flex items-center justify-center gap-2 hover:cursor-pointer">
                <label className="flex items-center justify-center" htmlFor="file">
                    <File className="size-4" />
                    My File
                </label>
                <input
                    id="file"
                    type="file"
                    className=""
                    onChange={e => setFile(e.target.files)}
                />
            </div>

            <div className="flex items-center justify-end gap-2">
                <Dialog.Close asChild>
                    <Button>
                        <X className="size-3" />
                        Cancel
                    </Button>
                </Dialog.Close>
                <Button disabled={formState.isSubmitting} className="bg-teal-400 text-teal-950" type="submit">
                    {formState.isSubmitting ? <Loader2 className="size-3 animate-spin" /> : <Check className="size-3" />}
                    Create
                </Button>
            </div>
        </form>
    )
}