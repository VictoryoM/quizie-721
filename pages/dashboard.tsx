import React from 'react'
import SimpleSidebar from '../dashboard/sidebarDashboard';
import DashboardStatistics from '../dashboard/dashboardMain'

const dashboard = () => {
    return (
        <>
        <SimpleSidebar>
            <DashboardStatistics />
        </SimpleSidebar>
           
        </>

    )
}

export default dashboard