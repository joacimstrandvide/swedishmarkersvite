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
                        <option value="all">All</option>
                        <option value="/img/boat.webp">Boat</option>
                        <option value="/img/food.webp">Food</option>
                        <option value="/img/swim.webp">Swimming</option>
                        <option value="/img/kayak.webp">Kayak</option>
                        <option value="/img/historic.webp">Historical</option>
                        <option value="/img/nature.webp">Nature</option>
                        <option value="/img/parking.webp">Parking</option>
                    </select>
                </div>
                {/* Sök */}
                <SearchBar onSearch={onSearch} />
                {/* Hjälp */}
                <Popup
                    trigger={<button className={styles.open}>Help</button>}
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
                    trigger={<button className={styles.open}>Icons</button>}
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
