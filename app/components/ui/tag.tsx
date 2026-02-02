const Tag = ({ title, icon }: { title: string, icon: React.ReactNode }) => {
  return (
    <div className="rounded-full border-2 shadow-3xl py-1 px-3 border-purple w-fit">
      <span className="text-accent text-shadow-lg lg:text-sm xl:text-md 2xl:text-lg flex items-center gap-2">{icon} {title}</span>
    </div>
  )
}

export default Tag
