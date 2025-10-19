"use client"

import { useState } from "react"
//import { ChevronDown } from "lucide-react"

interface FilterOption {
    value: string
    label: string
}

const filterOptions: FilterOption[] = [
    { value: "eat", label: "Eat" },
    { value: "drink", label: "Drink" },
    { value: "explore", label: "Explore" },
]

interface FiltersDropdownProps {
    text?: string
    onFilterChange?: (filter: string | null) => void
    selectedFilter?: string | null
}

export default function FiltersDropdown({
    text = "Select Filter",
    onFilterChange,
    selectedFilter = null,
}: FiltersDropdownProps) {
    const [isOpen, setIsOpen] = useState(false)
    const [internalSelectedFilter, setInternalSelectedFilter] = useState<string | null>(selectedFilter)

    const currentFilter = selectedFilter !== undefined ? selectedFilter : internalSelectedFilter
    //const displayText = currentFilter ? filterOptions.find((f) => f.value === currentFilter)?.label || text : text

    const toggleDropdown = () => {
        setIsOpen(!isOpen)
    }

    const handleFilterSelect = (filterValue: string) => {
        const newFilter = currentFilter === filterValue ? null : filterValue

        if (selectedFilter === undefined) {
            setInternalSelectedFilter(newFilter)
        }

        onFilterChange?.(newFilter)
        setIsOpen(false)
    }

    return (
        <div className="relative inline-block">
            {/* Toggle Button */}
            <div
                className="flex items-center justify-between gap-2 px-4 rounded-lg cursor-pointer hover:bg-gray-50 transition-colors py-2 border"
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
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 18 18" fill="none">
                    <path d="M6.44727 13.8149L15.6556 13.8149" stroke="#0A4747" strokeWidth="1.41667" strokeLinecap="round" strokeLinejoin="round" />
                    <path d="M11.0527 9.21094L15.6569 9.21094" stroke="#0A4747" strokeWidth="1.41667" strokeLinecap="round" strokeLinejoin="round" />
                    <path d="M7.51042 9.21094L2.90625 9.21094" stroke="#0A4747" strokeWidth="1.41667" strokeLinecap="round" strokeLinejoin="round" />
                    <path d="M2.90625 4.60693L12.1146 4.60693" stroke="#0A4747" strokeWidth="1.41667" strokeLinecap="round" strokeLinejoin="round" />
                    <path d="M6.44792 13.8151C6.44792 12.8371 5.65508 12.0443 4.67708 12.0443C3.69908 12.0443 2.90625 12.8371 2.90625 13.8151C2.90625 14.7931 3.69908 15.5859 4.67708 15.5859C5.65508 15.5859 6.44792 14.7931 6.44792 13.8151Z" stroke="#0A4747" strokeWidth="1.41667" strokeLinejoin="round" />
                    <path d="M11.0514 9.2111C11.0514 8.2331 10.2586 7.44027 9.2806 7.44027C8.3026 7.44027 7.50977 8.2331 7.50977 9.2111C7.50977 10.1891 8.3026 10.9819 9.2806 10.9819C10.2586 10.9819 11.0514 10.1891 11.0514 9.2111Z" stroke="#0A4747" strokeWidth="1.41667" strokeLinejoin="round" />
                    <path d="M15.6569 4.60661C15.6569 3.62861 14.8641 2.83577 13.8861 2.83577C12.9081 2.83577 12.1152 3.62861 12.1152 4.60661C12.1152 5.5846 12.9081 6.37744 13.8861 6.37744C14.8641 6.37744 15.6569 5.5846 15.6569 4.60661Z" stroke="#0A4747" strokeWidth="1.41667" strokeLinejoin="round" />
                </svg>
                {/* <ChevronDown
                    className={`w-4 h-4 text-gray-500 transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`}
                /> */}
                Filtar
            </div>

            {/* Dropdown Menu */}
            {isOpen && (
                <div className="absolute top-full left-[-5rem] mt-1 min-w-[140px] bg-white rounded-lg shadow-lg z-50">
                    <ul className="py-1">
                        {filterOptions.map((filter) => (
                            <li key={filter.value} style={{fontFamily:"var(--font-excelsior)", color: "var(--title-color)"}}>
                                <button
                                    className={`w-full px-4 py-2 text-left hover:bg-gray-100 transition-colors`}
                                    onClick={() => handleFilterSelect(filter.value)}
                                    onKeyDown={(e) => {
                                        if (e.key === "Enter") {
                                            handleFilterSelect(filter.value)
                                        }
                                    }}
                                >
                                    {filter.label}
                                    {currentFilter === filter.value && <span className="ml-2 text-blue-500">✓</span>}
                                </button>
                            </li>
                        ))}
                        {currentFilter && (
                            <li className="border-t border-gray-100 mt-1 pt-1">
                                <button
                                    className="w-full px-4 py-2 text-left text-gray-500 hover:bg-gray-100 transition-colors"
                                    onClick={() => handleFilterSelect(currentFilter)}
                                >
                                    Clear filter
                                </button>
                            </li>
                        )}
                    </ul>
                </div>
            )}
        </div>
    )
}
