import Image from 'next/image'
import Link from 'next/link'

import styles from './page.module.css'

export default function MainPage() {
  return (
    <section className={styles.hero}>
      <Image
        src="/main/hero.jpg"
        alt=""
        fill
        priority
        className={styles.heroImage}
      />
      <div className={styles.overlay} />

      <div className={styles.content}>
        <p className={styles.eyebrow}>Передавайте между Москвой и Тбилиси</p>
        <h1 className={styles.heading}>
          Путь для<br />вашей посылки
        </h1>
        <p className={styles.description}>
          Флоу — P2P платформа, где отправители находят проверенных
          путешественников для доставки небольших посылок и документов
          между Москвой и Тбилиси.
        </p>
        <div className={styles.buttons}>
          <Link href="/ads" className={styles.buttonPrimary}>
            Разместить объявление
          </Link>
          <Link href="/feed" className={styles.buttonSecondary}>
            Найти доставку
          </Link>
        </div>
      </div>
    </section>
  )
}
