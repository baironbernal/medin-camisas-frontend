
const WhatsappButton = () => {
  return (
    <a
            href="https://wa.me/"
            target="_blank"
            rel="noopener noreferrer"
            className="
              hidden
              lg:flex
              items-center
              rounded-full
              bg-accent
              text-dark
              px-4
              py-2
              font-medium
              transition
              hover:bg-green-400
            "
          >
            WhatsApp
          </a>
  )
}

export default WhatsappButton
