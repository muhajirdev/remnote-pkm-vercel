import { buildTree, TREE_OF_KNOWLEDGE_ID } from "~/lib/remnote"

import { useLoaderData } from 'remix'
import { Rem } from "~/components/rem"

export const loader = () => {
    const root = buildTree(TREE_OF_KNOWLEDGE_ID, true)
    return root
}


export default function RemnoteTest() {
    const root = useLoaderData();
    return (
        <ul>
            <Rem rem={root} root />
        </ul>
    )
}