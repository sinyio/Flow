'use client'

import { ProfileDetails, ProfileHeader } from '@components/profile'
import { Tabs } from '@components/tabs/component'
import { mockProfileDetails, mockTabs } from './mocks'

const ProfileView = () => (
  <>
    <ProfileHeader name="Иван Иванов" subtitle="ответственный исполнитель" />

    <ProfileDetails lines={mockProfileDetails} />

    <div style={{ margin: '0 16px' }}>
      <Tabs tabs={mockTabs} />
    </div>
  </>
)

export default ProfileView
