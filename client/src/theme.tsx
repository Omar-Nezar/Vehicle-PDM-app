import { useState } from "react"

export default function ThemeToggle() {
  const [dark, setDark] = useState(false)

  const toggle = () => {
    const root = document.documentElement
    root.classList.toggle("dark")
    setDark(!dark)
  }

  return (
    <button
      onClick={toggle}
      className="fixed bottom-5 right-5 p-3 rounded-full bg-primary text-primary-foreground shadow-lg"
    >
      {dark ? "☀️" : "🌙"}
    </button>
  )
}