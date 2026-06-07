import { useState, useEffect } from 'react'
import InlineEdit from './Edit'
import styles from './Map.module.css'

export default function MarkerPopup({
    marker,
    currentUser,
    editMarker,
    deleteMarker,
    availableIcons
}) {
    const isLockedByOther =
        marker.editingBy && marker.editingBy !== currentUser?.uid
    const [isEditing, setIsEditing] = useState(false)

    useEffect(() => {
        if (marker.editingBy !== currentUser?.uid) setIsEditing(false)
    }, [marker.editingBy, currentUser])

    const startEditing = () => {
        if (isLockedByOther) return
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

                {/* Redigera knapp */}
                {isLockedByOther ? (
                    <span className={styles.popupLocked}>
                        Currently editing...
                    </span>
                ) : currentUser ? (
                    <button
                        className={styles.popupEditButton}
                        onClick={isEditing ? stopEditing : startEditing}
                    >
                        {isEditing ? 'Save' : 'Edit'}
                    </button>
                ) : null}
            </div>

            {/* Beskrivning */}
            <InlineEdit
                value={marker.popupcontent}
                type="textarea"
                placeholder="Description"
                onSave={(val) => editMarker(marker.id, { popupcontent: val })}
                disabled={!isEditing}
                className={styles.popupDescription}
            />

            {/* Ikon */}
            {isEditing && (
                <div className={styles.popupRow}>
                    <span>Icon:</span>
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

            {/* Vem som skapade platsen */}
            {marker.author && (
                <p className={styles.popupAuthor}>Created by {marker.author}</p>
            )}

            {/* Ta bort */}
            {isEditing && (
                <button
                    className={styles.popupDeleteButton}
                    onClick={() => deleteMarker(marker.id)}
                >
                    Remove
                </button>
            )}
        </div>
    )
}
