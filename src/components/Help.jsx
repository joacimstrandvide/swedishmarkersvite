import styles from './Help.module.css'

function Help() {
    return (
        <section className={styles.helpContainer}>
            <h2>Help</h2>
            <p>
                You can filter the locations on the map by opening the menu and
                selecting a category.
            </p>
            <p>
                You can also search for specific themes, such as “restaurant,”
                to display relevant results within the area shown on the map.
                Information is retrieved from overpass using openstreetmap.
            </p>
            <p>The search field can also be hidden</p>
        </section>
    )
}

export default Help
