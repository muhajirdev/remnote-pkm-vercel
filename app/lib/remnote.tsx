import data from './rem.json'

export const DOCUMENT_ID = 'Zd8W2E9Kxiwziibrb'
export const TREE_OF_KNOWLEDGE_ID = 'NZLKRTHKpTZDTWEAM'

export const findRemById = (id) => data.docs.find((doc) => doc._id === id)
export const playground = () => data.docs.filter((doc) => doc.forget === true)
const findRemByText = (text) =>
  data.docs.find((doc) =>
    doc.key.find((key) => typeof key === 'string' && key.match(text))
  )
const searchRemByText = (text) =>
  data.docs.filter((doc) =>
    doc.key.find((key) => typeof key === 'string' && key.match(text))
  )
const removeEmptyRem = (rem) => rem.key.length > 0
const formatKey = (key) => key.map(formatKeyItem)
const formatKeyItem = (key) => {
  if (typeof key === 'string') {
    return { type: 'text', text: key }
  }

  if (typeof key === 'object' && key.i === 'm') {
    return {
      type: 'text',
      text: key.text,
      bold: key.b,
      latex: key.x,
      code: key.q,
      emptry: key.u,
      url: key.url,
      highlighted: key.h,
    }
  }

  if (typeof key === 'object' && key.i === 'q') {
    const remLink = findRemById(key._id)
    return { type: 'internal-link', id: key._id, text: formatKey(remLink.key) }
  }

  return { type: 'unknown', text: JSON.stringify(key) }
}

const getContext = (id) => {
  const rem = findRemById(id)
  const children = rem.children
    .map((child) => findRemById(child))
    .filter(removeEmptyRem)
    .map((child) => formatKey(child.key))
  const subBlocks = rem.subBlocks
    .map((subBlock) => findRemById(subBlock))
    .filter(removeEmptyRem)
    .map((subBlock) => formatKey(subBlock.key))
  const parent = findRemById(rem.parent)?.key
  return {
    text: rem.key,
    children,
    parent,
    subBlocks,
  }
}

const isNoise = (rem) => {
  if (rem.key.length === 0) return true
  if (rem.key[0] === 'contains:') return true
  if (rem.forget === true) return true

  return false
}

export const getParent = (id) => {
  const rem = findRemById(id)
  const parent = findRemById(rem.parent)
  if (!parent) return null
  return {
    id: parent._id,
    text: formatKey(parent.key),
    link: true,
  }
}

export const buildBreadCumbs = (rem) => {
  const breadCumb = []
  let parent = getParent(rem._id)
  while (parent) {
    breadCumb.push(parent)
    parent = getParent(parent.id)
  }
  return breadCumb.reverse()
}

export const getReferences = (id) => {
  const rem = findRemById(id)
  const references = rem.references?.map((reference) => {
    const remReference = findRemById(reference.q)
    return {
      breadcumbs: buildBreadCumbs(remReference),
      id: remReference._id,
      text: formatKey(remReference.key),
    }
  })
  return references
}

export const buildTree = (id, isRoot = false) => {
  const rem = findRemById(id)
  if (isNoise(rem)) return null
  const isDocument = !!rem?.crt?.o

  const children =
    isDocument && !isRoot
      ? []
      : rem.children
          .map((child) => buildTree(child, false))
          .filter((child) => !!child) // filter out null caused by `isNoise`

  return {
    id: rem._id,
    link: isDocument,
    text: formatKey(rem.key),
    children: children,
  }
}

export const listPublicNotes = () => {
  return data.docs
    .filter((doc) => {
      const isDocument = !!doc?.crt?.o
      if (!isDocument) return false
      const breadcumbs = buildBreadCumbs(doc)
      if (breadcumbs.length === 0) return false
      if (breadcumbs[0].id !== TREE_OF_KNOWLEDGE_ID) return false
      return true
    })
    .map((doc) => ({
      id: doc._id,
      link: true,
      text: formatKey(doc.key),
    }))
}
