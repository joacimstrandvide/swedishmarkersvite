import styles from './Help.module.css'

function Help() {
    return (
        <section className={styles.helpContainer}>
            {/* Titel */}
            <h1 className={styles.title}>
                Swedish<strong>Markers</strong> - Help
            </h1>
            <p>
                As a general rule, you should only add locations you have
                personally visited.
            </p>
            <p>
                On this page you can explore various interesting places across
                Sweden. If you are logged in, you can add, edit, or delete
                locations. Right-click, or press and hold on mobile, where you
                want to place a new marker, then fill in the details. To edit an
                existing location, click the edit button and hit save when
                you're done.
            </p>
            <p>
                You can filter the locations on the map by category using the
                menu in the corner.
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
