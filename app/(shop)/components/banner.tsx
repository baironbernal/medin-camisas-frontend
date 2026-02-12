export const Banner = ({ name, image }: { name: string; image: string }) => {
  return (
    <section className="hidden  h-[40vh] w-full lg:block" style={{backgroundImage: `url(${image})`, backgroundSize: "cover", backgroundPosition: "center"}}>
      <div className="w-full h-full flex items-center justify-center">
        <h1 className="text-white text-5xl">{name}</h1>
      </div>
    </section>
  )
}
