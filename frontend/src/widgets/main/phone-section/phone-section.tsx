'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useRef, useState } from 'react';
import { Text } from '@gravity-ui/uikit';

import styles from './phone-section.module.css';

const SLIDES = [
  {
    label: 'Быстрый старт',
    title: 'Находите нужные объявления за несколько минут',
    body: 'Лента показывает актуальные предложения по маршруту Москва — Тбилиси и Тбилиси — Москва. Фильтры помогают сразу отобрать подходящие по времени, условиям и оплате.',
    href: '/feed',
    linkText: 'Перейти в ленту',
    image: '/main/phone-1.png',
  },
  {
    label: 'Прозрачность с первого взгляда',
    title: 'Понимайте, что именно нужно доставить',
    body: 'До начала общения вы видите состав объявления: описание посылки, вес, габариты, сроки, маршрут и стоимость. Это снижает неопределенность и помогает быстрее принять решение.',
    href: '/ads',
    linkText: 'Разместить объявление',
    image: '/main/phone-2.png',
  },
  {
    label: 'Договоренности без потерь',
    title: 'Обсуждайте все важное там, где проходит сделка',
    body: 'В чате удобно уточнить детали и перейти к следующему шагу без лишних переходов. Платформа помогает закрепить исполнителя, подтвердить участие и провести оплату внутри сервиса.',
    href: '/feed',
    linkText: 'Найти исполнителя',
    image: '/main/phone-3.png',
  },
  {
    label: 'Доверие, которое видно',
    title: 'Смотрите отзывы и опыт до начала сделки',
    body: 'Профиль пользователя помогает оценить надежность заранее. Отзывы после завершенных доставок формируют понятную репутацию и делают выбор спокойнее.',
    href: '/auth',
    linkText: 'Зарегистрироваться',
    image: '/main/phone-4.png',
  },
];

export function PhoneSection() {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const innerRef = useRef<HTMLDivElement>(null);
  const slideRefs = useRef<(HTMLDivElement | null)[]>([]);
  const [activeSlide, setActiveSlide] = useState(0);
  const [mounted, setMounted] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const touchStartX = useRef(0);

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth <= 834);
    check();
    setMounted(true);
    window.addEventListener('resize', check);
    return () => window.removeEventListener('resize', check);
  }, []);

  useEffect(() => {
    if (!mounted || isMobile) return;
    const wrapper = wrapperRef.current;
    const inner = innerRef.current;
    if (!wrapper || !inner) return;

    const update = () => {
      const rect = wrapper.getBoundingClientRect();
      const scrolled = -rect.top;
      const scrollable = rect.height - window.innerHeight;

      if (rect.top > 0) {
        inner.style.position = 'absolute';
        inner.style.top = '0';
        inner.style.bottom = '';
        inner.style.left = '0';
        inner.style.right = '0';
      } else if (scrolled < scrollable) {
        inner.style.position = 'fixed';
        inner.style.top = '0';
        inner.style.bottom = '';
        inner.style.left = '0';
        inner.style.right = '0';
      } else {
        inner.style.position = 'absolute';
        inner.style.top = `${scrollable}px`;
        inner.style.bottom = '';
        inner.style.left = '0';
        inner.style.right = '0';
      }

      const progress = Math.max(0, Math.min(1, scrolled / scrollable));
      const fractional = progress * (SLIDES.length - 1);

      slideRefs.current.forEach((el, i) => {
        if (!el) return;
        const offset = fractional - i;
        const opacity = Math.max(0, 1 - Math.abs(offset));
        const translateY = -offset * 480;
        el.style.opacity = String(opacity);
        el.style.transform = `translateY(${translateY}px)`;
      });

      const slide = Math.min(SLIDES.length - 1, Math.round(fractional));
      setActiveSlide(slide);
    };

    window.addEventListener('scroll', update, { passive: true });
    update();
    return () => window.removeEventListener('scroll', update);
  }, [isMobile, mounted]);

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    const diff = touchStartX.current - e.changedTouches[0].clientX;
    if (Math.abs(diff) > 50) {
      setActiveSlide(prev =>
        diff > 0 ? Math.min(SLIDES.length - 1, prev + 1) : Math.max(0, prev - 1),
      );
    }
  };

  if (!mounted) return null;

  if (isMobile) {
    const slide = SLIDES[activeSlide];
    return (
      <div className={styles.mobileWrapper}>
        <div
          className={styles.mobileCard}
          onTouchStart={handleTouchStart}
          onTouchEnd={handleTouchEnd}
        >
          {SLIDES.map((s, i) => (
            <div
              key={i}
              className={`${styles.mobilePhoneWrap} ${i === activeSlide ? styles.mobilePhoneActive : ''}`}
            >
              <Image src={s.image} alt="" fill className={styles.phoneImg} />
            </div>
          ))}
        </div>

        <div className={styles.dots}>
          {SLIDES.map((_, i) => (
            <button
              key={i}
              className={`${styles.dot} ${i === activeSlide ? styles.dotActive : ''}`}
              onClick={() => setActiveSlide(i)}
              aria-label={`Слайд ${i + 1}`}
            />
          ))}
        </div>

        <div
          className={styles.mobileText}
          onTouchStart={handleTouchStart}
          onTouchEnd={handleTouchEnd}
        >
          <Text variant="header-1" className={styles.label}>{slide.label}</Text>
          <Text variant="display-3" as="h2" className={styles.title}>{slide.title}</Text>
          <Text variant="body-3" className={styles.body}>{slide.body}</Text>
          <Link href={slide.href} className={styles.btn}>
            <Text variant="header-1">{slide.linkText}</Text>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div ref={wrapperRef} className={styles.wrapper}>
      <div ref={innerRef} className={styles.inner}>
        <div className={styles.card}>
          <div className={styles.phoneCol}>
            {SLIDES.map((slide, i) => (
              <div
                key={i}
                className={`${styles.phoneWrap} ${i === activeSlide ? styles.phoneActive : ''}`}
              >
                <Image src={slide.image} alt="" fill className={styles.phoneImg} />
              </div>
            ))}
          </div>
          <div className={styles.contentCol}>
            {SLIDES.map((slide, i) => (
              <div
                key={i}
                ref={(el) => { slideRefs.current[i] = el; }}
                className={styles.slide}
                style={{ opacity: i === 0 ? 1 : 0 }}
              >
                <Text variant="header-1" className={styles.label}>{slide.label}</Text>
                <Text variant="display-3" as="h2" className={styles.title}>{slide.title}</Text>
                <Text variant="body-3" className={styles.body}>{slide.body}</Text>
                <Link href={slide.href} className={styles.btn}>
                  <Text variant="header-1">{slide.linkText}</Text>
                </Link>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
