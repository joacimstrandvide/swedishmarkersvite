// Databasen
import { ref, onValue, push, update, remove } from 'firebase/database'
import { db } from '../firebase'
import { useState, useEffect, useRef } from 'react'
import { signInAnonymously, onAuthStateChanged } from 'firebase/auth'
import { auth } from '../firebase'
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
// Popup komponent
import MarkerPopup from './MarkerPopup'

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
    'location.webp', // standard
    'swim.webp',
    'boat.webp',
    'food.webp',
    'kayak.webp',
    'nature.webp',
    'parking.webp',
    'historic.webp',
    'bunker.webp',
    'pier.webp'
]

function MapPart({ selectedCategory, searchQuery }) {
    const [data, setData] = useState([])
    const markerRefs = useRef({})
    const base = import.meta.env.BASE_URL

    /* Anonym auth */
    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            if (!user) {
                signInAnonymously(auth).catch(console.error)
            }
        })

        return () => unsubscribe()
    }, [])

    // Hämtar alla platser
    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            if (!user) return

            const markersRef = ref(db, 'markers')
            onValue(markersRef, (snapshot) => {
                const markers = snapshot.val()
                if (!markers) {
                    setData([])
                    return
                }

                const formatted = Object.entries(markers).map(
                    ([id, marker]) => ({
                        id,
                        ...marker
                    })
                )
                setData(formatted)
            })
        })

        return () => unsubscribe()
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
                    <div className={styles.popupForm}>
                        <input
                            className={styles.popupInput}
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
                            className={styles.popupTextarea}
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
                            className={styles.popupInput}
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
                            className={styles.popupSelect}
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
                            className={styles.popupButton}
                            onClick={handleAdd}
                        >
                            Skapa Ny
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
                                    <Popup
                                        closeOnClick={false}
                                        autoClose={false}
                                    >
                                        {/* All data i popupen */}
                                        <MarkerPopup
                                            marker={marker}
                                            editMarker={editMarker}
                                            deleteMarker={deleteMarker}
                                            availableIcons={availableIcons}
                                        />
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
