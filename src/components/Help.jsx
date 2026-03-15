import styles from './Help.module.css'

function Help() {
    return (
        <section className={styles.helpContainer}>
            {/* Titel */}
            <h1 className={styles.title}>
                Swedish<strong>Markers</strong> - Hjälp
            </h1>
            <p>
                På den här sidan kan du hitta olika intressanta platser runtom i
                Sverige. Du kan själv lägga till, redigera eller ta bort.
                Högerklicka på den plats du vill skapa en ny ikon och fyll sedan
                i informationen. För att redigera klickar du bara på redigera
                texten och sen på spara när du är klar.
            </p>
            <p>
                Du kan filtrera platserna på kartan efter olika kategorier genom
                att klicka på menyn i hörnet.
            </p>
            <a
                href="https://www.strandvide.se"
                target="_blank"
                rel="noopener noreferrer"
            >
                Skapad av Joacim Strandvide
            </a>
        </section>
    )
}

export default Help
