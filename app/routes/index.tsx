import { useState } from 'react'
import { Link, useLoaderData } from 'remix'
import { listPublicNotes } from '~/lib/remnote'
import { Rem, RenderText, RenderTextItem } from '~/components/rem'

export let meta = () => {
  return {
    title: 'Muhajir.dev',
    description: `Muhajir's working notes`,
  }
}

const Hero = () => (
  <div className="my-20">
    <h1 className="text-3xl font-bold mb-4">Muhammad Muhajir</h1>
    <p className="max-w-md text-xl">
      Hi! I am a product engineer. I work on technologies that expand what
      people can think and do
    </p>
  </div>
)

export const Notes = ({ docs }) => {
  return (
    <div className="">
      <div>Latest notes</div>
      <div className="flex flex-wrap -mx-4">
        {docs.map((doc) => (
          <div className="p-4 w-1/3">
            <div className="rounded bg-gray-200 h-full p-2">
              <RenderText rem={doc} />
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export const loader = () => {
  const publicNotes = listPublicNotes()
  return publicNotes
}

export default function Index() {
  const publicNotes = useLoaderData()
  return (
    <div className="mx-auto max-w-5xl px-4 py-4 ">
      <Hero />
      <Notes docs={publicNotes} />
    </div>
  )
}
