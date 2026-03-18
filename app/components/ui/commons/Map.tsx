
import Image from "next/image";
import Link from "next/link";

const Map = () => {
  const mapUrl = "https://www.google.com/maps?s=web&lqi=Cg1tZWRpbiBjYW1pc2FzWhciDW1lZGluIGNhbWlzYXMqBggCEAAQAZIBDmNsb3RoaW5nX3N0b3Jl&vet=12ahUKEwiEodexiZSTAxXPRDABHVtWJ_QQ1YkKegQIKBAB..i&cs=1&um=1&ie=UTF-8&fb=1&gl=co&sa=X&geocode=KffjcQKImT-OMXwiTgT2jsS3&daddr=110311,+Cl.+10+%2378,+Bogot%C3%A1";

  return (
    <Link 
      href={mapUrl} 
      target="_blank" 
      rel="noopener noreferrer"
      className="block w-full h-full overflow-hidden rounded-2xl shadow-lg border border-white/10 hover:opacity-90 transition-opacity"
    >
        <Image 
          src="/home/mapa.png" 
          alt="Ubicación Medin Camisas" 
          width={800} 
          height={500}
          className="w-full h-full object-cover"
        />
    </Link>
  )
}

export default Map;
