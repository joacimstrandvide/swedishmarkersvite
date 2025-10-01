import styles from './Credits.module.css'

function Credits() {
    /* Alla ikoner som används */
    return (
        <section className={styles.creditContainer}>
            <a
                id="cred"
                href="https://www.flaticon.com/free-icons/location"
                title="location icons"
            >
                Location icons created by Smashicons - Flaticon
            </a>
            <a
                id="cred"
                href="https://www.flaticon.com/free-icons/boat"
                title="boat icons"
            >
                Boat icons created by Freepik - Flaticon
            </a>
            <a
                href="https://www.flaticon.com/free-icons/swimming"
                title="swimming icons"
            >
                Swimming icons created by Freepik - Flaticon
            </a>
            <a
                id="cred"
                href="https://www.flaticon.com/free-icons/restaurant"
                title="restaurant icons"
            >
                Restaurant icons created by Freepik - Flaticon
            </a>
            <a
                href="https://www.flaticon.com/free-icons/monument"
                title="monument icons"
            >
                Monument icons created by Icons Ideal - Flaticon
            </a>
            <a
                href="https://www.flaticon.com/free-icons/nature"
                title="nature icons"
            >
                Nature icons created by Eucalyp - Flaticon
            </a>
            <a
                href="https://www.flaticon.com/free-icons/kayak"
                title="kayak icons"
            >
                Kayak icons created by Freepik - Flaticon
            </a>
            <a
                href="https://www.flaticon.com/free-icons/parking-sign"
                title="parking sign icons"
            >
                Parking sign icons created by SyafriStudio - Flaticon
            </a>
        </section>
    )
}

export default Credits
