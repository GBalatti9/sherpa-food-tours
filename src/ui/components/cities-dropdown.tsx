"use client"

import Link from "next/link";
import "./css/cities-dropdown.css"
import { useState } from "react"

interface CityDisplay {
    slug: string;
    city: string;
}

export default function CitiesDropdown({text = "Explore Our Cities", cities, color} : {text?: string; cities: CityDisplay[], color?: string}) {
  const [isOpen, setIsOpen] = useState(false)

  const toggleDropdown = () => {
    setIsOpen(!isOpen)
  }


  return (
    <div className="relative inline-block">
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
        <p className="searcher" style={{color: color}}>{text}</p>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="21"
          height="20"
          viewBox="0 0 21 20"
          fill="none"
          className={`transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`}
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
                <Link className="city-item" href={`/city/${city.slug}`} rel="noopener noreferrer" onClick={() => toggleDropdown()}>{city.city}</Link>
                {/* <button
                  onClick={() => handleCitySelect(city.slug)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      handleCitySelect(city.city)
                    }
                  }}
                >
                  {city.city}
                </button> */}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  )
}
