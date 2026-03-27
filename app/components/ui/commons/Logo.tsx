import Image from "next/image"
import Link from "next/link"

export default function Logo({logoSrc}: {logoSrc: string}) {
  return (
    <>
      <Link href="/" className="flex items-center h-[6rem]">
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
