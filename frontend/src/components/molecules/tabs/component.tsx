'use client'

import { Tab, TabList, TabPanel, TabProvider } from '@gravity-ui/uikit'
import { useState } from 'react'

import styles from './component.module.css'
import { TabsProps } from './types'

export const Tabs = ({ tabs }: TabsProps) => {
  const [value, setValue] = useState(tabs[0].value)

  return (
    <TabProvider value={value} onUpdate={setValue}>
      <TabList size="xl">
        {tabs.map((tab, index) => (
          <Tab key={'tab-' + tab.value + index} value={tab.value} counter={tab.counter}>
            {tab.label}
          </Tab>
        ))}
      </TabList>
      {tabs.map((tab, index) => (
        <TabPanel key={'tabPanel-' + tab.value + index} value={tab.value}>
          <div className={styles.container}>{tab.content}</div>
        </TabPanel>
      ))}
    </TabProvider>
  )
}
