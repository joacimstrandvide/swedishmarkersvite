import styles from './Help.module.css'

function Help() {
    return (
        <section className={styles.helpContainer}>
            <h2>Hjälp</h2>
            <p>
                På den här sidan kan du hitta olika intressanta platser runtom i
                Sverige. Du kan själv lägga till, redigera eller ta bort.
                Högerklicka på den plats du vill skapa en ny ikon och fyll sedan
                i informationen. För att redigera klickar du bara på redigera
                texten och sen på spara när du är klar.
            </p>
            <p>
                Du kan filtrera platserna på kartan efter olika kategorier genom
                att öppna menyn.
            </p>
            <p>
                Du kan också söka efter specifika termer som "restaurant" för
                att visa relevanta resultat inom det område som visas på kartan.
                Informationen hämtas genom overpass med openstreetmap.
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
