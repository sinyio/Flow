'use client'

import { useState } from 'react'
import { Tab, TabList, TabPanel, TabProvider } from '@gravity-ui/uikit'

import {
  MobileBottomMenu,
  ProfileDetails,
  ProfileHeader,
  ProfileStats,
  ReviewCard,
} from '@components/profile'
import styles from './view.module.scss'

const ProfileView = () => {
  const [tab, setTab] = useState<'reviews' | 'ads'>('reviews')

  return (
    <div className={styles.page}>
      <div className={styles.container}>
        <ProfileHeader name="Иван Иванов" role="ответственный исполнитель" onMessage={() => {}} />

        <ProfileStats
          stats={[{ label: '2 отзыва' }, { label: '4 доставки' }, { label: '1 объявление' }]}
        />

        <ProfileDetails
          lines={[
            { labelMuted: 'На флоу', value: 'с 10 марта 2026 года' },
            { labelMuted: 'Оставил', value: '4 отзыва' },
            { labelMuted: 'Успешно доставил', value: '4 отправления' },
          ]}
        />

        <TabProvider value={tab} onUpdate={value => setTab(value as typeof tab)}>
          <TabList size="l" className={styles.tabs}>
            <Tab value="reviews" counter={2}>
              Отзывы
            </Tab>
            <Tab value="ads" counter={1}>
              Объявления
            </Tab>
          </TabList>

          <div className={styles.panels}>
            <TabPanel value="reviews">
              <div className={styles.cards}>
                <ReviewCard
                  authorName="Андрей"
                  authorMeta="6 марта | Отправитель"
                  statusText="Сделка состоялась"
                  text="Все прошло отлично, Иван передал документы во время пересадки в Тбилиси. Спасибо за аккуратность и пунктуальность."
                />
                <ReviewCard
                  authorName="Андрей"
                  authorMeta="6 марта | Отправитель"
                  statusText="Сделка состоялась"
                  text="Все прошло отлично, Иван передал документы во время пересадки в Тбилиси. Спасибо за аккуратность и пунктуальность."
                />
              </div>
            </TabPanel>
            <TabPanel value="ads">
              <div className={styles.empty}>Пока нет объявлений</div>
            </TabPanel>
          </div>
        </TabProvider>
      </div>

      <MobileBottomMenu active="profile" />
    </div>
  )
}

export default ProfileView
