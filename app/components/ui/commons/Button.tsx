
const ButtonDefault = ({ title, url }: { title: string, url: string }) => {
  return (
    <div className="rounded-full border-2 py-2 px-6 border-accent">
      <a className="text-accent" href={url}>{title}</a>
    </div>
  )
}

export default ButtonDefault
