import { useMap } from 'react-leaflet'
import { useState, useEffect } from 'react'
import { Marker, Popup } from 'react-leaflet'
import L from 'leaflet'
import styles from './OSMFetch.module.css'

export default function OsmFetcher({ searchQuery }) {
    const map = useMap()
    const [osmData, setOsmData] = useState([])
    const [loading, setLoading] = useState(false)

    useEffect(() => {
        if (!searchQuery || !map) return

        const fetchOsmByBounds = async (theme) => {
            const bounds = map.getBounds()
            const south = bounds.getSouth()
            const west = bounds.getWest()
            const north = bounds.getNorth()
            const east = bounds.getEast()

            setLoading(true)

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

        fetchOsmByBounds(searchQuery)
    }, [searchQuery, map])

    return (
        <>
            {loading && <div className={styles.loading}>Loading data...</div>}
            {osmData.map((el) => {
                const position =
                    el.lat && el.lon
                        ? [el.lat, el.lon]
                        : el.center
                        ? [el.center.lat, el.center.lon]
                        : null

                if (!position) return null

                return (
                    <Marker key={el.id} position={position}>
                        <Popup>
                            {el.tags?.name || el.tags?.amenity || 'Nameless'}
                        </Popup>
                    </Marker>
                )
            })}
        </>
    )
}
