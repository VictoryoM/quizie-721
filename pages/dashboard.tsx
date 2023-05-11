import React from 'react'
import SimpleSidebar from '../components/dashboard/sidebarDashboard';
import HomeStatistics from '../components/dashboard/HomeStat'
import TrendingTopics from '@/components/dashboard/TrendingTopics';
import BanTopics from '@/components/dashboard/BanTopics';
import Settings from '@/components/dashboard/Settings';
import RemoveTopic from '@/components/dashboard/RemoveTopic';

const dashboard = () => {
    return (
        <>
           <SimpleSidebar>
      <div id="home">
        <HomeStatistics />
      </div>
      <div id="trending-topics">
        <TrendingTopics />
      </div>
      <div id="remove-topics">
        <RemoveTopic />
      </div>
      <div id="ban-topics">
        <BanTopics />
      </div>
      <div id="settings">
        <Settings />
      </div>
     
    </SimpleSidebar>

        </>

    )
}

export default dashboard