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
                <HomeStatistics />
                <TrendingTopics />
                <RemoveTopic />
                <BanTopics />
                <Settings />
            </SimpleSidebar>

        </>

    )
}

export default dashboard