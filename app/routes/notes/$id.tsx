import { json } from 'remix'
import {
  buildBreadCumbs,
  buildTree,
  findRemById,
  getParent,
  getReferences,
  TREE_OF_KNOWLEDGE_ID,
} from '~/lib/remnote'

import { Link, useLoaderData } from 'remix'
import { Rem, RenderText, RenderTextItem } from '~/components/rem'

export const loader = ({ params }) => {
  const root = buildTree(params.id, true)
  const breadcumbs = buildBreadCumbs(findRemById(params.id))
  if (breadcumbs.length === 0 && params.id !== TREE_OF_KNOWLEDGE_ID)
    throw json({ webmasterEmail: 'goAway' }, { status: 401 })
  if (breadcumbs.length > 0 && breadcumbs[0].id !== TREE_OF_KNOWLEDGE_ID)
    throw json({ webmasterEmail: 'goAway' }, { status: 401 })

  const references = getReferences(params.id)
  return { root, breadcumbs, references }
}

const Breadcumbs = ({ breadcumbs }) => {
  return (
    <div>
      {breadcumbs
        .reverse()
        .map((breadcumb) => (
          <span className="text-gray-400">
            <RenderText rem={breadcumb} />
          </span>
        ))
        .reduce((prev, curr) => [curr, <span> / </span>, prev])}
    </div>
  )
}

export default function RemnoteTest() {
  const data = useLoaderData()

  if (!data) return <div> This page is private</div>

  const { root, breadcumbs, references } = data

  return (
    <div>
      {breadcumbs.length > 0 && <Breadcumbs breadcumbs={breadcumbs} />}
      <ul>
        <Rem rem={root} root={true} />
      </ul>

      {references && (
        <div className="my-8">
          <div className="text-xl">Linked to this note</div>
          {references.map((reference) => (
            <div className="bg-gray-50 rounded p-4 mt-4">
              {reference.breadcumbs && (
                <Breadcumbs breadcumbs={reference.breadcumbs} />
              )}
              <Link to={`/notes/${reference.id}`}>
                {reference.text.map((item) => (
                  <RenderTextItem item={item} />
                ))}
              </Link>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
