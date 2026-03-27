import { Text, Link } from '@gravity-ui/uikit'

import styles from './component.module.css'

export const Footer = () => (
  <footer className={styles.container}>
    <nav className={styles.linksContainer}>
      <Link href="/" view="secondary">
        <Text>О компании</Text>
      </Link>
      <Link href="/" view="secondary">
        <Text>Помощь</Text>
      </Link>
    </nav>
    <Text variant="body-short">© 2026 Флоу</Text>
  </footer>
)
