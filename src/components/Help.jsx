import styles from './Help.module.css'

function Help() {
    return (
        <section className={styles.helpContainer}>
            <h2>Help</h2>
            <p>
                On this page, you can easily find interesting and unique places
                around Sweden.
            </p>
            <p>
                You can filter the locations on the map by opening the menu and
                selecting a category.
            </p>
            <p>
                You can also search for specific themes, such as “restaurant,”
                to display relevant results within the area shown on the map.
                Information is retrieved from overpass using openstreetmap.
            </p>
            <a
                href="https://www.strandvide.se"
                target="_blank"
                rel="noopener noreferrer"
            >
                Created by Joacim Strandvide
            </a>
        </section>
    )
}

export default Help
