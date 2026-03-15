import { useState, useEffect } from 'react'

export default function InlineEdit({
    value,
    onSave,
    type = 'text',
    placeholder = '',
    className,
    disabled = false
}) {
    const [editing, setEditing] = useState(false)
    const [draft, setDraft] = useState(value)

    useEffect(() => {
        // Skriv inte över en pågående redigering
        if (!editing) setDraft(value)
    }, [value, editing])

    useEffect(() => {
        if (!editing) return

        const timeout = setTimeout(() => {
            if (draft !== value) {
                onSave(draft)
            }
        }, 500)

        return () => clearTimeout(timeout)
    }, [draft, editing, value, onSave])

    const handleBlur = () => {
        if (draft !== value) onSave(draft)
        setEditing(false)
    }

    if (disabled || !editing) {
        return (
            <div
                className={className}
                onClick={() => !disabled && setEditing(true)}
                style={{ cursor: disabled ? 'default' : 'pointer' }}
            >
                {value || <em>{placeholder}</em>}
            </div>
        )
    }

    if (type === 'textarea') {
        return (
            <textarea
                autoFocus
                value={draft}
                onChange={(e) => setDraft(e.target.value)}
                onBlur={handleBlur}
                className="inlineTextarea"
            />
        )
    }

    return (
        <input
            autoFocus
            type="text"
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            onBlur={handleBlur}
            className="inlineInput"
        />
    )
}
