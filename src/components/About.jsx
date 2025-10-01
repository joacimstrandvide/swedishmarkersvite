import styles from './About.module.css'

function About() {
    return (
        <section className={styles.aboutContainer}>
            <h2>About SwedishMarkers</h2>
            <p>
                On this page, you can easily find interesting and unique places
                around Sweden.
            </p>
            <h3>
                Created by{' '}
                <a
                    href="https://www.strandvide.se"
                    target="_blank"
                    rel="noopener noreferrer"
                >
                    Joacim Strandvide
                </a>
            </h3>
        </section>
    )
}

export default About
