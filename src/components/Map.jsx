// Databasen
import { ref, onValue, push, update, remove } from 'firebase/database'
import { db } from '../firebase'
import { useState, useEffect, useRef } from 'react'
import { onAuthStateChanged } from 'firebase/auth'
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
// Popup komponent
import MarkerPopup from './MarkerPopup'

// De ikoner som finns
export const availableIcons = [
    'location.webp',
    'swim.webp',
    'beach.webp',
    'view.webp',
    'boat.webp',
    'food.webp',
    'kayak.webp',
    'nature.webp',
    'parking.webp',
    'rest.webp',
    'museum.webp',
    'historic.webp',
    'bunker.webp',
    'pier.webp',
    'spa.webp',
    'church.webp',
    'lighthouse.webp',
    'potato.webp',
    'animal.webp',
    'theme-park.webp',
    'shipwreck.webp',
    'nuclear.webp',
    'lake.webp',
    'battery.webp'
]

// Lägg till ny plats med höger klick
function AddMarkerOnRightClick({ onAdd, base }) {
    const [newMarker, setNewMarker] = useState(null)

    useMapEvents({
        contextmenu: (e) => {
            setNewMarker({
                lat: e.latlng.lat,
                lng: e.latlng.lng,
                name: '',
                popupcontent: '',
                score: 0,
                icon: 'location.webp'
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
                        placeholder="Name"
                        value={newMarker.name}
                        onChange={(e) =>
                            setNewMarker({ ...newMarker, name: e.target.value })
                        }
                    />
                    <textarea
                        className={styles.popupTextarea}
                        placeholder="Description"
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
                        placeholder="Score (1-5)"
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
                            setNewMarker({ ...newMarker, icon: e.target.value })
                        }
                    >
                        {availableIcons.map((iconName) => (
                            <option key={iconName} value={iconName}>
                                {iconName.replace('.webp', '')}
                            </option>
                        ))}
                    </select>
                    <button className={styles.popupButton} onClick={handleAdd}>
                        Create New
                    </button>
                </div>
            </Popup>
        </Marker>
    )
}

function MapPart({ selectedCategory }) {
    const [data, setData] = useState([])
    const [currentUser, setCurrentUser] = useState(null)
    const [authLoading, setAuthLoading] = useState(true)
    const markerRefs = useRef({})
    const base = import.meta.env.BASE_URL

    useEffect(() => {
        const unsub = onAuthStateChanged(auth, (user) => {
            setCurrentUser(user || null)
            setAuthLoading(false)
        })
        return () => unsub()
    }, [])

    // Hämtar alla platser, synligt för alla, men bara inloggade kan redigera
    useEffect(() => {
        const markersRef = ref(db, 'markers')
        const unsub = onValue(markersRef, (snapshot) => {
            const markers = snapshot.val()
            if (!markers) {
                setData([])
                return
            }
            setData(Object.entries(markers).map(([id, m]) => ({ id, ...m })))
        })
        return () => unsub()
    }, [])

    const addMarker = (marker) => {
        if (!currentUser) return
        push(ref(db, 'markers'), {
            ...marker,
            uid: currentUser.uid,
            author: currentUser.displayName || currentUser.email,
            createdAt: Date.now()
        })
    }

    const editMarker = (id, fields) => update(ref(db, `markers/${id}`), fields)
    const deleteMarker = (id) => remove(ref(db, `markers/${id}`))

    const createClusterIcon = (cluster) =>
        new divIcon({
            html: `<div class="circle">${cluster.getChildCount()}</div>`,
            iconSize: [33, 33],
            className: 'custom-cluster-icon'
        })

    const filteredData =
        selectedCategory === 'all'
            ? data
            : data.filter((m) => m.icon === selectedCategory)

    if (authLoading) return null

    return (
        <div style={{ position: 'relative' }}>
            <MapContainer center={[59.4036, 18.3297]} zoom={11}>
                {/* Bara inloggade kan lägga till platser */}
                {currentUser && (
                    <AddMarkerOnRightClick onAdd={addMarker} base={base} />
                )}

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
                        {filteredData.map((marker) => (
                            <Marker
                                key={marker.id}
                                position={[marker.lat, marker.lng]}
                                icon={
                                    new Icon({
                                        iconUrl: marker.icon
                                            ? `${base}/img/${marker.icon}`
                                            : `${base}/img/location.webp`,
                                        iconSize: [30, 30]
                                    })
                                }
                                ref={(r) => (markerRefs.current[marker.id] = r)}
                            >
                                <Popup closeOnClick={false} autoClose={false}>
                                    <MarkerPopup
                                        marker={marker}
                                        currentUser={currentUser}
                                        editMarker={editMarker}
                                        deleteMarker={deleteMarker}
                                        availableIcons={availableIcons}
                                    />
                                </Popup>
                            </Marker>
                        ))}
                    </MarkerClusterGroup>
                </LayersControl>
            </MapContainer>
        </div>
    )
}

export default MapPart
