export default function Banner({ name, image }: { name: string; image: string }) {
  return (
    <section className="hidden  h-[20vh] lg:h-[30vh] w-full lg:block" style={{backgroundImage: "url('/home/background.jpg')", 
    backgroundSize: "cover", 
    backgroundPosition: "center", backgroundRepeat: "no-repeat"}}>
      <div className="w-full h-full flex items-center justify-center">
        <h1 className="text-white text-5xl">{name}</h1>
      </div>
    </section>
  )
}
