"use client"

import Link from "next/link"
import "./css/cities-dropdown.css"
import { useState, useEffect, useRef } from "react"

interface CityDisplay {
  slug: string
  city: string
  flag?: {
    alt?: string;
    img?: string;
  }
  
}

export default function CitiesDropdown({
  text = "Explore Our Cities",
  cities,
  color,
  onSelectCity
}: {
  text?: string
  cities: CityDisplay[]
  color?: string,
  onSelectCity?: (slug: string, value: string) => void;
}) {
  const [isOpen, setIsOpen] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)
  console.log({cities});
  

  const toggleDropdown = () => setIsOpen(!isOpen)

  // Cierra el dropdown al hacer clic fuera
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])


  return (
    <div className="relative inline-block" ref={dropdownRef}>
      {/* Toggle Button */}
      <div
        className="main-searcher cursor-pointer"
        onClick={toggleDropdown}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault()
            toggleDropdown()
          }
        }}
      >
        <p className="searcher" style={{ color: color }}>
          {text}
        </p>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="21"
          height="20"
          viewBox="0 0 21 20"
          fill="none"
          className={`transition-transform duration-200 ${isOpen ? "rotate-180" : ""
            }`}
        >
          <path
            d="M15.6484 8.02881L10.7109 12.9663L5.77344 8.02881"
            stroke="#0A4747"
            strokeWidth="1.64583"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </div>

      {/* Dropdown Menu */}
      {isOpen && (
        <div className="dropdown-menu">
          <ul className="city-list">
            {cities.map((city, index) => (
              <li key={index}>
                {onSelectCity ?
                  <button onClick={() => onSelectCity(city.slug, city.city)} className="w-full text-left cursor-pointer">{city.city}</button>
                  :
                  <Link
                    className="city-item"
                    href={`/city/${city.slug}`}
                    rel="noopener noreferrer"
                    onClick={() => setIsOpen(false)} // también se cierra al clickear una ciudad
                  >
                    {city.flag &&
                      <img
                        src={city.flag.img}
                        alt={city.flag.alt}
                        className="city-flag"
                      />
                    }
                    {city.city}
                  </Link>
                }
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  )
}
