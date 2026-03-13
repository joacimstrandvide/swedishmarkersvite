import { useState } from 'react'
import styles from './OSMFetch.module.css'

export default function OSMSearchBar({ onSearch }) {
    const [searchTerm, setSearchTerm] = useState('')

    const handleSubmit = (e) => {
        e.preventDefault()
        /* Se till att det finns text, ta bort whitespaces och konvertera till lowercase */
        if (searchTerm.trim() !== '') {
            onSearch(searchTerm.trim().toLowerCase())
        }
    }

    return (
        <form className={styles.searchBar} onSubmit={handleSubmit}>
            <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Sök..."
            />
            <button type="submit">Sök</button>
        </form>
    )
}
