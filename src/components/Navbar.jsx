// Popup fönster
import Popup from 'reactjs-popup'
import 'reactjs-popup/dist/index.css'
// Komponenter
import Credits from './Credits'
import Help from './Help'
import styles from './Navbar.module.css'
import SearchBar from './Searchbar'

function Navbar({ selectedCategory, onCategoryChange, onSearch }) {
    return (
        <>
            {/* Navigationen */}
            <input
                type="checkbox"
                id="menu-toggle"
                className={styles['menu-toggle']}
            />
            <label htmlFor="menu-toggle" className={styles['menu-button']}>
                <div className={styles.bar}></div>
                <div className={styles.bar}></div>
                <div className={styles.bar}></div>
            </label>
            <nav className={styles.navbar}>
                {/* Titel */}
                <h1>
                    Swedish<strong>Markers</strong>
                </h1>
                {/* Filtrering */}
                <div className={styles.filter}>
                    <label htmlFor="category">Filter:</label>
                    <select
                        id="category"
                        value={selectedCategory}
                        onChange={(e) => onCategoryChange(e.target.value)}
                    >
                        {/* Alla kategorier */}
                        <option value="all">Alla</option>
                        <option value="boat.webp">Båt</option>
                        <option value="food.webp">Mat</option>
                        <option value="swim.webp">Simmning</option>
                        <option value="kayak.webp">Kayak</option>
                        <option value="historic.webp">Historiskt</option>
                        <option value="nature.webp">Natur</option>
                        <option value="parking.webp">Parkering</option>
                    </select>
                </div>
                {/* Sök */}
                <SearchBar onSearch={onSearch} />
                {/* Hjälp */}
                <Popup
                    trigger={<button className={styles.open}>Hjälp</button>}
                    modal
                    nested
                >
                    {(close) => (
                        <div className="modal">
                            <button className="close" onClick={close}>
                                &times;
                            </button>
                            <div className="content">
                                <Help />
                            </div>
                        </div>
                    )}
                </Popup>
                {/* Ikoner */}
                <Popup
                    trigger={<button className={styles.open}>Ikoner</button>}
                    modal
                    nested
                >
                    {(close) => (
                        <div className="modal">
                            <button className="close" onClick={close}>
                                &times;
                            </button>
                            <div className="content">
                                <Credits />
                            </div>
                        </div>
                    )}
                </Popup>
                {/* Antalet besökare totalt */}
                <a href="https://visitorbadge.io/status?path=https%3A%2F%2Fjoacimstrandvide.github.io%2FSwedishMarkers%2F">
                    <img
                        src="https://api.visitorbadge.io/api/visitors?path=https%3A%2F%2Fjoacimstrandvide.github.io%2FSwedishMarkers%2F&label=Visitors%20Total&countColor=%23263759"
                        alt="visitors"
                    />
                </a>
            </nav>
        </>
    )
}

export default Navbar
