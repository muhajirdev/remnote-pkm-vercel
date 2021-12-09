import { Link } from "remix"
import clsx from "clsx"

const getRemUrl = (id) => `/notes/${id}`


export const RenderTextItem = ({ item }) => {
    if (item.type === "text") {
        const styles = clsx({ "font-bold": item.bold, "underline": item.url })
        if (item.url)
            return <a href={item.url} className={styles}>{item.text}</a>
        return <span className={styles}>{item.text}</span>
    }

    if (item.type === 'internal-link') {
        return <Link to={getRemUrl(item.id)} className="underline">{item.text.map((nestedItem, index) => <RenderTextItem key={index} item={nestedItem} />)}</Link>
    }

    return item.text
}

const Wrapper = ({ children, wrapper, shouldWrap }) => {
    if (shouldWrap) {
        return wrapper(children)
    }
    return children
}

export const RenderText = ({ rem, root = false }) => {
    return <Wrapper shouldWrap={rem.link} wrapper={(children) => <Link to={getRemUrl(rem.id)} className="underline">{children}</Link>}>
        <span className={clsx({
            "font-bold text-2xl": root,
        })}>{rem.text.map((item, index) => <RenderTextItem key={index} item={item} />)}</span>
    </Wrapper>
}


export const Rem = ({ rem, root = false }) => {
    return <li className="list-disc ml-4">
        <RenderText rem={rem} root={root} />
        <ul>
            {rem.children && rem.children.map(child => <Rem key={child.id} rem={child} />)}
        </ul>
    </li>
}
