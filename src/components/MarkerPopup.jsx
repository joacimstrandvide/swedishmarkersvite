import { useState, useEffect } from 'react'
import Rating from '@mui/material/Rating'
import InlineEdit from './Edit'
import styles from './Map.module.css'

export default function MarkerPopup({
    marker,
    currentUser,
    editMarker,
    deleteMarker,
    availableIcons
}) {
    const isOwner = !marker.uid || currentUser?.uid === marker.uid
    const isLockedByOther =
        marker.editingBy && marker.editingBy !== currentUser?.uid
    const [isEditing, setIsEditing] = useState(false)

    useEffect(() => {
        if (marker.editingBy !== currentUser?.uid) setIsEditing(false)
    }, [marker.editingBy, currentUser])

    const startEditing = () => {
        if (isLockedByOther || !isOwner) return
        editMarker(marker.id, { editingBy: currentUser.uid })
        setIsEditing(true)
    }

    const stopEditing = () => {
        editMarker(marker.id, { editingBy: null })
        setIsEditing(false)
    }

    return (
        <div className={styles.popupContent}>
            <div className={styles.popupHeader}>
                {/* Namn */}
                <h3>
                    <InlineEdit
                        value={marker.name}
                        placeholder="Namn"
                        onSave={(val) => editMarker(marker.id, { name: val })}
                        disabled={!isEditing}
                    />
                </h3>

                {/* Redigera knapp, bara för ägaren */}
                {isLockedByOther ? (
                    <span className={styles.popupLocked}>
                        Redigeras redan...
                    </span>
                ) : isOwner ? (
                    <button
                        className={styles.popupEditButton}
                        onClick={isEditing ? stopEditing : startEditing}
                    >
                        {isEditing ? 'Spara' : 'Redigera'}
                    </button>
                ) : null}
            </div>

            {/* Beskrivning */}
            <InlineEdit
                value={marker.popupcontent}
                type="textarea"
                placeholder="Beskrivning"
                onSave={(val) => editMarker(marker.id, { popupcontent: val })}
                disabled={!isEditing}
                className={styles.popupDescription}
            />

            {/* Betyg */}
            <Rating
                value={marker.score || 0}
                precision={0.5}
                readOnly={!isEditing}
                onChange={(_, newValue) =>
                    editMarker(marker.id, { score: newValue })
                }
            />

            {/* Ikon */}
            {isEditing && (
                <div className={styles.popupRow}>
                    <span>Ikon:</span>
                    <select
                        className={styles.popupIconSelect}
                        value={marker.icon || 'location.webp'}
                        onChange={(e) =>
                            editMarker(marker.id, { icon: e.target.value })
                        }
                    >
                        {availableIcons.map((icon) => (
                            <option key={icon} value={icon}>
                                {icon.replace('.webp', '')}
                            </option>
                        ))}
                    </select>
                </div>
            )}

            {/* Vem som lade till platsen */}
            {marker.author && (
                <p className={styles.popupAuthor}>Skapad av {marker.author}</p>
            )}

            {/* Ta bort */}
            {isEditing && isOwner && (
                <button
                    className={styles.popupDeleteButton}
                    onClick={() => deleteMarker(marker.id)}
                >
                    Ta bort
                </button>
            )}
        </div>
    )
}
