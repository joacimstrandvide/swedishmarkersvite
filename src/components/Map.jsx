// Databasen
import { ref, onValue, push, update, remove } from 'firebase/database'
import { db } from '../firebase'
import { useState, useEffect, useRef } from 'react'
// CSS
import styles from './Map.module.css'
import Rating from '@mui/material/Rating'
// Leaflet
import 'leaflet/dist/leaflet.css'
import {
    MapContainer,
    TileLayer,
    Marker,
    Popup,
    LayersControl,
    useMapEvents
} from 'react-leaflet'
import { Icon, divIcon } from 'leaflet'
import MarkerClusterGroup from 'react-leaflet-cluster'
// Sök funktionen
import OSMFetch from './OSMFetch'
import L from 'leaflet'
// Ikonen när man söker
import markerIcon2x from 'leaflet/dist/images/marker-icon-2x.png'
import markerIcon from 'leaflet/dist/images/marker-icon.png'
import markerShadow from 'leaflet/dist/images/marker-shadow.png'

// Fixar standard ikonen när man söker
delete L.Icon.Default.prototype._getIconUrl
L.Icon.Default.mergeOptions({
    iconRetinaUrl: markerIcon2x,
    iconUrl: markerIcon,
    shadowUrl: markerShadow
})

function MapPart({ selectedCategory, searchQuery }) {
    const [data, setData] = useState([])

    // Hämtar alla platser
    useEffect(() => {
        const markersRef = ref(db, 'markers')

        onValue(markersRef, (snapshot) => {
            const markers = snapshot.val()

            if (!markers) {
                setData([])
                return
            }

            const formatted = Object.entries(markers).map(([id, marker]) => ({
                id,
                ...marker
            }))

            setData(formatted)
        })
    }, [])

    // Kluster Ikon
    const createClusterIcon = (cluster) => {
        return new divIcon({
            html: `<div class="circle">${cluster.getChildCount()}</div>`,
            iconSize: [33, 33],
            className: 'custom-cluster-icon'
        })
    }

    const markerRefs = useRef({})

    const base = import.meta.env.BASE_URL

    // Filtera platser efter kategori
    const filteredData =
        selectedCategory === 'all'
            ? data
            : data.filter((marker) => marker.icon === selectedCategory)
    // Lägg till markör
    const addMarker = (marker) => {
        const markersRef = ref(db, 'markers')
        push(markersRef, marker)
    }
    // Redigera markör
    const editMarker = (id, updatedFields) => {
        const markerRef = ref(db, `markers/${id}`)
        update(markerRef, updatedFields)
    }
    // Ta bort markör
    const deleteMarker = (id) => {
        const markerRef = ref(db, `markers/${id}`)
        remove(markerRef)
    }
    // Funktionen för att lägga till ny plats med höger klick
    function AddMarkerOnRightClick({ onAdd }) {
        useMapEvents({
            contextmenu: (e) => {
                const { lat, lng } = e.latlng

                const name = prompt('Name of place?')
                if (!name) return

                const popupcontent = prompt('Description?')
                const score = prompt('Score (1-5)?')
                const icon =
                    prompt('Icon filename (swim.webp, boat.webp, etc.)') || null

                onAdd({
                    lat,
                    lng,
                    name,
                    popupcontent: popupcontent || '',
                    score: score ? Number(score) : null,
                    icon
                })
            }
        })

        return null
    }

    return (
        <div style={{ position: 'relative' }}>
            <MapContainer center={[59.4036, 18.3297]} zoom={11}>
                <AddMarkerOnRightClick onAdd={addMarker} />
                <OSMFetch searchQuery={searchQuery} />

                {/* Olika kartor */}
                <LayersControl position="topright">
                    <LayersControl.BaseLayer checked name="OpenStreetMap">
                        <TileLayer
                            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                            url="http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                        />
                    </LayersControl.BaseLayer>

                    <LayersControl.BaseLayer name="Esri World Imagery">
                        <TileLayer
                            attribution="Tiles &copy; Esri &mdash; Source: Esri, ..."
                            url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"
                        />
                    </LayersControl.BaseLayer>

                    <LayersControl.BaseLayer name="CartoDB Positron">
                        <TileLayer
                            attribution='&copy; <a href="https://carto.com/">CARTO</a>'
                            url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
                        />
                    </LayersControl.BaseLayer>

                    <LayersControl.BaseLayer name="OpenTopoMap">
                        <TileLayer
                            attribution='Map data: &copy; <a href="https://opentopomap.org">OpenTopoMap</a>'
                            url="https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png"
                        />
                    </LayersControl.BaseLayer>

                    <LayersControl.Overlay name="OpenSeaMap Nautical">
                        <TileLayer
                            attribution='Map data: &copy; <a href="http://www.openseamap.org">OpenSeaMap</a> contributors'
                            url="https://tiles.openseamap.org/seamark/{z}/{x}/{y}.png"
                        />
                    </LayersControl.Overlay>

                    <MarkerClusterGroup
                        chunkedLoading
                        iconCreateFunction={createClusterIcon}
                    >
                        {filteredData.map((marker) => {
                            const markerIconObj = new Icon({
                                iconUrl: marker.icon
                                    ? `${base}/img/${marker.icon}`
                                    : `${base}/img/location.webp`,
                                iconSize: [30, 30]
                            })

                            return (
                                <Marker
                                    key={marker.id}
                                    position={[marker.lat, marker.lng]}
                                    icon={markerIconObj}
                                    ref={(ref) =>
                                        (markerRefs.current[marker.id] = ref)
                                    }
                                >
                                    <Popup>
                                        <div className={styles.popupContent}>
                                            {/* Name */}
                                            <h3>
                                                {marker.name}
                                                <button
                                                    className={
                                                        styles.popupEditButton
                                                    }
                                                    onClick={() => {
                                                        const newName = prompt(
                                                            'New name:',
                                                            marker.name
                                                        )
                                                        if (!newName) return
                                                        editMarker(marker.id, {
                                                            name: newName
                                                        })
                                                    }}
                                                >
                                                    ✎
                                                </button>
                                            </h3>

                                            {/* Description */}
                                            <p>
                                                {marker.popupcontent}
                                                <button
                                                    className={
                                                        styles.popupEditButton
                                                    }
                                                    onClick={() => {
                                                        const newDesc = prompt(
                                                            'New description:',
                                                            marker.popupcontent
                                                        )
                                                        if (!newDesc) return
                                                        editMarker(marker.id, {
                                                            popupcontent:
                                                                newDesc
                                                        })
                                                    }}
                                                >
                                                    ✎
                                                </button>
                                            </p>

                                            {/* Score */}
                                            <div
                                                style={{
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    gap: '5px'
                                                }}
                                            >
                                                Score:
                                                <Rating
                                                    name={`rating-${marker.id}`}
                                                    value={marker.score || 0}
                                                    precision={0.5}
                                                    readOnly
                                                />
                                                <button
                                                    className={
                                                        styles.popupEditButton
                                                    }
                                                    onClick={() => {
                                                        const newScore = prompt(
                                                            'Enter new score (1-5):',
                                                            marker.score || 0
                                                        )
                                                        if (!newScore) return
                                                        editMarker(marker.id, {
                                                            score: Number(
                                                                newScore
                                                            )
                                                        })
                                                    }}
                                                >
                                                    ✎
                                                </button>
                                            </div>

                                            {/* Icon */}
                                            <div style={{ marginTop: '5px' }}>
                                                Icon: {marker.icon || 'default'}
                                                <button
                                                    className={
                                                        styles.popupEditButton
                                                    }
                                                    onClick={() => {
                                                        const newIcon = prompt(
                                                            'Enter new icon filename (swim.webp, boat.webp, etc.):',
                                                            marker.icon || ''
                                                        )
                                                        if (!newIcon) return
                                                        editMarker(marker.id, {
                                                            icon: newIcon
                                                        })
                                                    }}
                                                >
                                                    ✎
                                                </button>
                                            </div>

                                            {/* Delete */}
                                            <button
                                                className={
                                                    styles.popupDeleteButton
                                                }
                                                onClick={() =>
                                                    deleteMarker(marker.id)
                                                }
                                            >
                                                Ta bort
                                            </button>
                                        </div>
                                    </Popup>
                                </Marker>
                            )
                        })}
                    </MarkerClusterGroup>
                </LayersControl>
            </MapContainer>
        </div>
    )
}

export default MapPart
