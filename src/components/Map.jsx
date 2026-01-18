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

// De ikoner som finns
const availableIcons = [
    'swim.webp',
    'boat.webp',
    'food.webp',
    'kayak.webp',
    'nature.webp',
    'parking.webp',
    'historic.webp',
    'location.webp' // standard
]

function MapPart({ selectedCategory, searchQuery }) {
    const [data, setData] = useState([])
    const markerRefs = useRef({})
    const base = import.meta.env.BASE_URL

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

    // CRUD-funktioner
    const addMarker = (marker) => push(ref(db, 'markers'), marker)
    const editMarker = (id, updatedFields) =>
        update(ref(db, `markers/${id}`), updatedFields)
    const deleteMarker = (id) => remove(ref(db, `markers/${id}`))

    // Kluster ikon
    const createClusterIcon = (cluster) => {
        return new divIcon({
            html: `<div class="circle">${cluster.getChildCount()}</div>`,
            iconSize: [33, 33],
            className: 'custom-cluster-icon'
        })
    }

    // Filtera platser
    const filteredData =
        selectedCategory === 'all'
            ? data
            : data.filter((marker) => marker.icon === selectedCategory)

    // Lägg till ny plats med höger klick
    function AddMarkerOnRightClick({ onAdd }) {
        const [newMarker, setNewMarker] = useState(null)

        useMapEvents({
            contextmenu: (e) => {
                setNewMarker({
                    lat: e.latlng.lat,
                    lng: e.latlng.lng,
                    name: '',
                    popupcontent: '',
                    score: 0,
                    icon: 'location.webp' /* Standard ikonen */
                })
            }
        })

        const handleAdd = () => {
            if (!newMarker.name) return
            onAdd({ ...newMarker, score: Number(newMarker.score) })
            setNewMarker(null)
        }

        if (!newMarker) return null

        return (
            <Marker
                position={[newMarker.lat, newMarker.lng]}
                icon={
                    new Icon({
                        iconUrl: `${base}/img/${newMarker.icon}`,
                        iconSize: [30, 30]
                    })
                }
            >
                <Popup onClose={() => setNewMarker(null)}>
                    <div
                        style={{
                            display: 'flex',
                            flexDirection: 'column',
                            gap: '5px',
                            minWidth: '150px'
                        }}
                    >
                        <input
                            type="text"
                            placeholder="Namn"
                            value={newMarker.name}
                            onChange={(e) =>
                                setNewMarker({
                                    ...newMarker,
                                    name: e.target.value
                                })
                            }
                        />
                        <textarea
                            placeholder="Beskrivning"
                            value={newMarker.popupcontent}
                            onChange={(e) =>
                                setNewMarker({
                                    ...newMarker,
                                    popupcontent: e.target.value
                                })
                            }
                        />
                        <input
                            type="number"
                            placeholder="Betyg (1-5)"
                            min={0}
                            max={5}
                            value={newMarker.score}
                            onChange={(e) =>
                                setNewMarker({
                                    ...newMarker,
                                    score: e.target.value
                                })
                            }
                        />
                        <select
                            value={newMarker.icon}
                            onChange={(e) =>
                                setNewMarker({
                                    ...newMarker,
                                    icon: e.target.value
                                })
                            }
                        >
                            {availableIcons.map((iconName) => (
                                <option key={iconName} value={iconName}>
                                    {iconName.replace('.webp', '')}
                                </option>
                            ))}
                        </select>
                        <button
                            onClick={handleAdd}
                            style={{ marginTop: '5px' }}
                        >
                            Lägg till
                        </button>
                    </div>
                </Popup>
            </Marker>
        )
    }

    return (
        <div style={{ position: 'relative' }}>
            <MapContainer center={[59.4036, 18.3297]} zoom={11}>
                <AddMarkerOnRightClick onAdd={addMarker} />
                <OSMFetch searchQuery={searchQuery} />

                {/* De olika kart lager som finns */}
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
                                            {/* Namn */}
                                            <h3>
                                                {marker.name}
                                                <button
                                                    className={
                                                        styles.popupEditButton
                                                    }
                                                    onClick={() => {
                                                        const newName = prompt(
                                                            'Nytt Namn:',
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

                                            {/* Beskrivning */}
                                            <p>
                                                {marker.popupcontent}
                                                <button
                                                    className={
                                                        styles.popupEditButton
                                                    }
                                                    onClick={() => {
                                                        const newDesc = prompt(
                                                            'Ny Beskrivning:',
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

                                            {/*  Betyg */}
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
                                                            'Nytt betyg (1-5):',
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

                                            {/* Ikon */}
                                            <div
                                                style={{
                                                    marginTop: '5px',
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    gap: '5px'
                                                }}
                                            >
                                                <span>Ikon:</span>
                                                <select
                                                    value={
                                                        marker.icon ||
                                                        'location.webp'
                                                    }
                                                    onChange={(e) =>
                                                        editMarker(marker.id, {
                                                            icon: e.target.value
                                                        })
                                                    }
                                                >
                                                    {availableIcons.map(
                                                        (iconName) => (
                                                            <option
                                                                key={iconName}
                                                                value={iconName}
                                                            >
                                                                {iconName.replace(
                                                                    '.webp',
                                                                    ''
                                                                )}
                                                            </option>
                                                        )
                                                    )}
                                                </select>
                                            </div>

                                            {/* Ta bort */}
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
