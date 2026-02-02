import Image from "next/image"
import Link from "next/link"

const Logo = ({logoSrc}: {logoSrc: string}) => {
  return (
    <>
      <Link href="/" className="flex items-center">
            <Image
              src={logoSrc}
              alt={"Logo Medin Camisas"}
              width={63}
              height={63}
              priority
              className="w-auto object-contain"
            />
          </Link>
    </>
  )
}

export default Logo
