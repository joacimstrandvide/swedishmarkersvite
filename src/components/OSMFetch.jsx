import { useMap } from 'react-leaflet'
import { useState, useEffect, useRef } from 'react'
import { Marker, Popup } from 'react-leaflet'
import L from 'leaflet'
/* CSS */
import styles from './OSMFetch.module.css'

export default function OsmFetcher() {
    /* Alla states */
    const map = useMap()
    const [searchTerm, setSearchTerm] = useState('')
    const [osmData, setOsmData] = useState(null)
    const [loading, setLoading] = useState(false)
    const [dropdownVisible, setDropdownVisible] = useState(false)

    const searchContainerRef = useRef(null)

    /* Förslag i sök */
    const categories = ['restaurant', 'cafe', 'bar', 'atm', 'parking']

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (
                searchContainerRef.current &&
                !searchContainerRef.current.contains(event.target)
            ) {
                setDropdownVisible(false)
            }
        }
        document.addEventListener('mousedown', handleClickOutside)
        return () => {
            document.removeEventListener('mousedown', handleClickOutside)
        }
    }, [])

    /* Hämta området som är synligt på webbläsaren */
    const fetchOsmByBounds = async (theme) => {
        if (!map) return
        const bounds = map.getBounds()
        const south = bounds.getSouth()
        const west = bounds.getWest()
        const north = bounds.getNorth()
        const east = bounds.getEast()

        setLoading(true)

        /* OSM sök queryn */
        const query = `
[out:json][timeout:15];
(
  node["amenity"="${theme}"](${south},${west},${north},${east});
  way["amenity"="${theme}"](${south},${west},${north},${east});
);
out center qt;
        `
        const url =
            'https://overpass-api.de/api/interpreter?data=' +
            encodeURIComponent(query)

        try {
            const response = await fetch(url)
            const json = await response.json()
            setOsmData(json.elements)

            const locations = json.elements
                .map((el) => {
                    if (el.lat && el.lon) return [el.lat, el.lon]
                    if (el.center) return [el.center.lat, el.center.lon]
                    return null
                })
                .filter(Boolean)

            if (locations.length > 0) {
                const resultBounds = L.latLngBounds(locations)
                map.fitBounds(resultBounds)
            }
        } catch (err) {
            console.error('OSM fetch failed:', err)
            setOsmData([])
        } finally {
            setLoading(false)
        }
    }

    const handleSearch = (e) => {
        e.preventDefault()
        if (searchTerm.trim() !== '') {
            fetchOsmByBounds(searchTerm.trim().toLowerCase())
            setDropdownVisible(false)
        }
    }

    return (
        <div className={styles.searchContainer} ref={searchContainerRef}>
            <form className={styles.searchBar} onSubmit={handleSearch}>
                <input
                    type="text"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    onFocus={() => setDropdownVisible(true)}
                    placeholder="Search..."
                />
                <button type="submit">Search</button>
            </form>

            {/* Sök förslagen  */}
            {dropdownVisible && (
                <div className={styles.dropdown}>
                    <h3>Suggestions:</h3>
                    {categories.map((cat) => (
                        <div
                            key={cat}
                            className={styles.dropdownTag}
                            onClick={() => {
                                setSearchTerm(cat)
                                fetchOsmByBounds(cat)
                                setDropdownVisible(false)
                            }}
                        >
                            {cat.charAt(0).toUpperCase() + cat.slice(1)}
                        </div>
                    ))}
                </div>
            )}

            {loading && <div>Loading data...</div>}

            {osmData &&
                osmData.map((el) => {
                    if (el.type === 'node' && el.lat && el.lon) {
                        return (
                            <Marker key={el.id} position={[el.lat, el.lon]}>
                                <Popup>
                                    {el.tags?.name ||
                                        el.tags?.amenity ||
                                        'Nameless'}
                                </Popup>
                            </Marker>
                        )
                    }

                    if (el.type === 'way' && el.center) {
                        return (
                            <Marker
                                key={el.id}
                                position={[el.center.lat, el.center.lon]}
                            >
                                <Popup>
                                    {el.tags?.name ||
                                        el.tags?.amenity ||
                                        'Nameless'}
                                </Popup>
                            </Marker>
                        )
                    }

                    return null
                })}
        </div>
    )
}
