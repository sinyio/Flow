import Image from "next/image";
import Link from "next/link";

import styles from "./page.module.css";
import { Text } from "@gravity-ui/uikit";
import { ScrollRevealText } from "@components/scroll-reveal-text";
import { MainCard } from "@entities/main";
import { PhoneSection } from "@widgets/main/phone-section/phone-section";
import { PostCard } from "@entities/post";

export default function MainPage() {
  return (
    <>
      <section className={styles.hero}>
        <Image
          src="/main/hero.jpg"
          alt=""
          fill
          priority
          className={`${styles.heroImage} ${styles.desktopOnly}`}
        />
        <Image
          src="/main/hero-mobile.jpg"
          alt=""
          fill
          priority
          className={`${styles.heroImage} ${styles.mobileOnly}`}
        />

        <div className={styles.container}>
          <div className={styles.content}>
            <div className={styles.heroLogo}>
              <Image
                src="/logo.png"
                alt="Flow"
                width={160}
                height={40}
                style={{ width: "160px", height: "auto" }}
              />
            </div>
            <Text variant="header-1">Передавайте между Москвой и Тбилиси</Text>
            <Text variant="display-4" as="h1" className={styles.heading}>
              Путь для
              <br />
              вашей посылки
            </Text>
            <Text variant="body-3" className={styles.description}>
              Флоу — P2P платформа, где отправители находят проверенных
              путешественников для доставки небольших посылок и документов между
              Москвой и Тбилиси.
            </Text>
            <div className={styles.buttons}>
              <Link href="/ads" className={styles.buttonPrimary}>
                <Text variant="header-1">Разместить объявление</Text>
              </Link>
              <Link href="/feed" className={styles.buttonSecondary}>
                <Text variant="header-1">Найти доставку</Text>
              </Link>
            </div>
          </div>
        </div>
      </section>
      <div className={styles.mainContent}>
        <section className={styles.mainSection}>
          <div className={styles.container}>
            <ScrollRevealText
              lines={[
                "Когда нужно быстро и законно передать что-то",
                "важное, хочется понимать, кто везет посылку, на каких условиях проходит сделка и когда исполнитель получит оплату. Флоу делает этот процесс прозрачным: от публикации объявления до доставки и отзыва после завершения.",
              ]}
              className={styles.animatedText}
            />
          </div>
        </section>
        <section className={styles.infoSection}>
          <div className={styles.container}>
            <Text variant="display-4" className={styles.infoHeading} as="h2">
              Простой сценарий для
              <br /> отправителя и исполнителя
            </Text>
            <div className={styles.cardsGrid}>
              <MainCard
                title="Поиск"
                description="Выберите объявление в ленте или создайте своё — с маршрутом, сроками, параметрами посылки и оплатой."
                imageSrc="/main/1.png"
              />
              <MainCard
                title="Обсуждение"
                description="Обсудите детали в чате и подтвердите исполнителя внутри платформы."
                imageSrc="/main/2.png"
              />
              <div className={styles.cardCenter}>
                <MainCard
                  title="Доставка"
                  description="Оплатите сделку через сервис. Передача и получение подтверждаются кодами. После доставки исполнитель получает оплату."
                  imageSrc="/main/3.png"
                />
              </div>
            </div>
          </div>
        </section>
        <PhoneSection />
        <section className={styles.conclusionSection}>
          <div className={styles.container}>
            <div className={styles.conclusionContent}>
              <Text variant="display-4">
                Изучите правила сервиса <br /> и опыт сообщества
              </Text>
              <Text variant="body-3" className={styles.conclusionDescription}>
                Бренд-медиа Флоу — это материалы о правилах сообщества,
                ограничениях на передачу, подготовке посылки и практике
                использования сервиса. Здесь собрана информация, которая
                помогает действовать осознанно и без лишних рисков.
              </Text>
              <div className={styles.conclusionCards}>
                <PostCard
                  post={{
                    id: "mock-1",
                    title: "Как работает Флоу?",
                    image: "/main/4.jpg",
                    createdAt: "2025-04-10T00:00:00.000Z",
                    author: null,
                    viewsCount: 187,
                    likesCount: 0,
                    favoritesCount: 0,
                    commentsCount: 0,
                    isLiked: false,
                    isFavorite: false,
                  }}
                />
                <PostCard
                  post={{
                    id: "mock-2",
                    title: "Как работает Флоу?",
                    image: "/main/5.jpg",
                    createdAt: "2025-04-10T00:00:00.000Z",
                    author: null,
                    viewsCount: 187,
                    likesCount: 0,
                    favoritesCount: 0,
                    commentsCount: 0,
                    isLiked: false,
                    isFavorite: false,
                  }}
                />
              </div>
              <div className={styles.conclusionBtnWrap}>
                <Link href="/media" className={styles.buttonPrimary}>
                  <Text variant="header-1">Открыть бренд-медиа</Text>
                </Link>
              </div>
            </div>
          </div>
        </section>
      </div>
      <section className={styles.footer}>
        <Image
          src="/main/footer.jpg"
          alt=""
          fill
          priority
          className={`${styles.footerImage} ${styles.desktopOnly}`}
        />
        <Image
          src="/main/footer-mobile.jpg"
          alt=""
          fill
          priority
          className={`${styles.footerImage} ${styles.mobileOnly}`}
        />

        <div className={styles.container}>
          <div className={styles.content}>
            <Text
              variant="display-4"
              as="h1"
              className={styles.footerHeading}
            >
              Если вы уже едете — <br /> возьмите доставку по пути
            </Text>
            <Text variant="subheader-3" className={styles.description}>
              Выберите подходящее объявление, договоритесь в чате и получите
              оплату после подтвержденной доставки.
            </Text>
            <div className={`${styles.buttons} ${styles.footerButtons}`}>
              <Link href="/feed" className={styles.buttonPrimary}>
                <Text variant="header-1">Найти посылку</Text>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
