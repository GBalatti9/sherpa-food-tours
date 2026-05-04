"use client"

import Link from "next/link"
import "./css/cities-dropdown.css"
import { useState, useEffect, useRef, useCallback } from "react"

interface CityDisplay {
  id: number
  slug: string
  city: string
  flag?: {
    alt?: string;
    img?: string;
  }
  tourCount?: number
}

export default function CitiesDropdown({
  text = "Explore Our Cities",
  cities,
  color,
  currentPath,
  onSelectCity
}: {
  text?: string
  cities: CityDisplay[]
  color?: string
  currentPath?: string
  onSelectCity?: (id: number, slug: string, value: string) => void;
}) {
  const [isOpen, setIsOpen] = useState(false)
  const [query, setQuery] = useState("")
  const dropdownRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  const toggleDropdown = () => {
    setIsOpen(prev => {
      if (!prev) setQuery("")
      return !prev
    })
  }

  // Close on outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  // Close on Escape
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setIsOpen(false)
    }
    if (isOpen) {
      document.addEventListener("keydown", handleKeyDown)
      return () => document.removeEventListener("keydown", handleKeyDown)
    }
  }, [isOpen])

  // Focus search input when opening
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 50)
    }
  }, [isOpen])

  // Detect current city from path
  const getCurrentCitySlug = useCallback(() => {
    if (!currentPath) return null
    const match = currentPath.match(/^\/city\/([^/]+)/)
    return match ? match[1] : null
  }, [currentPath])

  const currentCitySlug = getCurrentCitySlug()

  // Filter cities by search query
  const filtered = query
    ? cities.filter(c => c.city.toLowerCase().includes(query.toLowerCase()))
    : cities

  const showSearch = true

  // Legacy mode for Travel Guide filter
  if (onSelectCity) {
    return (
      <div className="relative inline-block" ref={dropdownRef}>
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
          <p className="searcher text-2xl" style={{ color }}>
            {text}
          </p>
          <svg xmlns="http://www.w3.org/2000/svg" width="21" height="20" viewBox="0 0 21 20" fill="none"
            className={`transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`}>
            <path d="M15.6484 8.02881L10.7109 12.9663L5.77344 8.02881" stroke="#0A4747" strokeWidth="1.64583" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>
        {isOpen && (
          <div className="dropdown-menu-legacy">
            <ul className="city-list-legacy">
              {cities.map((city, index) => (
                <li key={index}>
                  <button
                    onClick={() => { onSelectCity(city.id, city.slug, city.city); setIsOpen(false) }}
                    className="city-item-legacy w-full text-left cursor-pointer"
                  >
                    {city.city}
                  </button>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    )
  }

  // New refined dropdown for navbar
  return (
    <div className="relative inline-block" ref={dropdownRef}>
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
        <p className="searcher text-2xl" style={{ color }}>
          {text}
        </p>
        <svg xmlns="http://www.w3.org/2000/svg" width="21" height="20" viewBox="0 0 21 20" fill="none"
          className={`transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`}>
          <path d="M15.6484 8.02881L10.7109 12.9663L5.77344 8.02881" stroke={color || "#0A4747"} strokeWidth="1.64583" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </div>

      {isOpen && (
        <div className="cities-panel">
          {/* Search */}
          {showSearch && (
            <div className="cities-search">
              <div className="cities-search-wrapper">
                <svg className="cities-search-icon" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#9CA3AF" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="11" cy="11" r="7" /><path d="m20 20-3-3" />
                </svg>
                <input
                  ref={inputRef}
                  className="cities-search-input"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder={`Search ${cities.length} cities`}
                />
              </div>
            </div>
          )}

          {/* City list */}
          <div className="cities-list">
            {filtered.length > 0 ? (
              filtered.map((city) => {
                const isCurrent = currentCitySlug === city.slug
                return (
                  <Link
                    key={city.slug}
                    href={`/city/${city.slug}/`}
                    className="cities-row"
                    onClick={() => setIsOpen(false)}
                  >
                    {city.flag?.img && (
                      <img
                        src={city.flag.img}
                        alt={city.flag.alt || city.city}
                        className="cities-row-flag"
                      />
                    )}
                    <span className={`cities-row-name${isCurrent ? " is-current" : ""}`}>
                      {city.city}
                    </span>
                    {city.tourCount != null && city.tourCount > 0 && (
                      <span className="cities-row-tours">
                        {city.tourCount} {city.tourCount === 1 ? "tour" : "tours"}
                      </span>
                    )}
                    {isCurrent && (
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#E55A2B" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ marginLeft: 4, flexShrink: 0 }}>
                        <polyline points="20 6 9 17 4 12" />
                      </svg>
                    )}
                  </Link>
                )
              })
            ) : (
              <div className="cities-empty">
                No cities match &ldquo;{query}&rdquo;
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="cities-footer">
            <span className="cities-footer-text">Don&apos;t see your city?</span>
            <Link href="/contact/" className="cities-footer-link" onClick={() => setIsOpen(false)}>
              Request one &rarr;
            </Link>
          </div>
        </div>
      )}
    </div>
  )
}
