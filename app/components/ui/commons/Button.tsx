import Link from "next/link"

const ButtonDefault = ({ title, url }: { title: string, url: string }) => {
  return (
    <div className="rounded-full border-2 py-2 px-6 border-accent">
      <Link className="text-accent" href={url}>{title}</Link>
    </div>
  )
}

export default ButtonDefault
