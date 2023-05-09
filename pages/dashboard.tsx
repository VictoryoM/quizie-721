import React from 'react'
import SimpleSidebar from '../components/dashboard/sidebarDashboard';
import HomeStatistics from '../components/dashboard/HomeStat'
import TrendingTopics from '@/components/dashboard/TrendingTopics';
import BanTopics from '@/components/dashboard/BanTopics';

const dashboard = () => {
    return (
        <>
            <SimpleSidebar>
                <HomeStatistics />
                <TrendingTopics />
                <BanTopics />
            </SimpleSidebar>

        </>

    )
}

export default dashboard