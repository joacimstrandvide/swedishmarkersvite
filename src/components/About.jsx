import styles from './About.module.css'

function About() {
    return (
        <section className={styles.aboutContainer}>
            <h2>About SwedishMarkers</h2>
            <p>
                On this page, you can easily find interesting and unique places
                around Sweden.
            </p>
            <h3>Created by</h3>
            <a
                href="https://www.strandvide.se"
                target="_blank"
                rel="noopener noreferrer"
            >
                Joacim Strandvide
            </a>
            <br />
            {/* Antalet besökare totalt & idag */}
            <a href="https://visitorbadge.io/status?path=https%3A%2F%2Fjoacimstrandvide.github.io%2FSwedishMarkers%2F">
                <img
                    src="https://api.visitorbadge.io/api/visitors?path=https%3A%2F%2Fjoacimstrandvide.github.io%2FSwedishMarkers%2F&label=Visitors%20Total&countColor=%23263759"
                    alt="visitors"
                />
            </a>
            <a href="https://visitorbadge.io/status?path=https%3A%2F%2Fjoacimstrandvide.github.io%2FSwedishMarkers%2F">
                <img
                    src="https://api.visitorbadge.io/api/daily?path=https%3A%2F%2Fjoacimstrandvide.github.io%2FSwedishMarkers%2F&label=Visitors%20Today&countColor=%23263759"
                    alt="visitors"
                />
            </a>
        </section>
    )
}

export default About
