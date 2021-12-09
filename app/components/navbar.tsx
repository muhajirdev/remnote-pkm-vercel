import { Link } from 'remix'

export const Navbar = () => {
  return (
    <div className="shadow-sm">
      <div className="flex justify-between mx-auto max-w-5xl px-4 py-4 ">
        <Link to="/">Muhajir</Link>
        <div className="flex space-x-4">
          <Link to="/">Home</Link>
          <Link to="/notes">Notes</Link>
        </div>
      </div>
    </div>
  )
}
