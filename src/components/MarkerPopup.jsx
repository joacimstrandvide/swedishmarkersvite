import { useState } from 'react'
import Rating from '@mui/material/Rating'
import InlineEdit from './Edit'
import styles from './Map.module.css'

export default function MarkerPopup({
    marker,
    editMarker,
    deleteMarker,
    availableIcons
}) {
    const [isEditing, setIsEditing] = useState(false)

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

                <button
                    className={styles.popupEditButton}
                    onClick={() => setIsEditing((prev) => !prev)}
                >
                    {isEditing ? '✓ Spara' : '✎ Redigera'}
                </button>
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
                            editMarker(marker.id, {
                                icon: e.target.value
                            })
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

            {/* Ta bort */}
            {isEditing && (
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
