import React from 'react'
import SimpleSidebar from '../components/dashboard/sidebarDashboard';
import DashboardStatistics from '../components/dashboard/dashboardMain'
import Charts from '@/components/dashboard/Charts';

const dashboard = () => {
    return (
        <>
            <SimpleSidebar>
                <DashboardStatistics />
                {/* <Charts/> */}
            </SimpleSidebar>

        </>

    )
}

export default dashboard