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
        <nav className={styles.navbar}>
            <div className={styles.controls}>
                {/* Filtrering */}
                <div className={styles.filter}>
                    <select
                        id="category"
                        value={selectedCategory}
                        onChange={(e) => onCategoryChange(e.target.value)}
                    >
                        {/* Alla kategorier */}
                        <option value="all">Allt</option>
                        <option value="boat.webp">Båt</option>
                        <option value="food.webp">Mat</option>
                        <option value="swim.webp">Simmning</option>
                        <option value="kayak.webp">Kayak</option>
                        <option value="historic.webp">Historiskt</option>
                        <option value="nature.webp">Natur</option>
                        <option value="parking.webp">Parkering</option>
                        <option value="pier.webp">Brygga</option>
                        <option value="bunker.webp">Militärt</option>
                        <option value="spa.webp">Spa</option>
                        <option value="church.webp">Kyrka</option>
                        <option value="lighthouse.webp">Fyr</option>
                        <option value="potato.webp">Potatis</option>
                        <option value="animal.webp">Djur</option>
                        <option value="theme-park.webp">Park</option>
                    </select>
                </div>

                {/* Sök */}
                <div className={styles.searchWrapper}>
                    <SearchBar onSearch={onSearch} />
                </div>

                <div className={styles.buttons}>
                    {/* Hjälp */}
                    <Popup
                        trigger={
                            <button className={styles.button}>Hjälp</button>
                        }
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
                        trigger={
                            <button className={styles.button}>Ikoner</button>
                        }
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
                </div>
            </div>
        </nav>
    )
}

export default Navbar
