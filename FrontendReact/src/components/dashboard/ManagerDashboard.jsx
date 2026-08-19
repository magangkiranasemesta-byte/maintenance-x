import React from "react";

import {
    BarChart3,
    Package,
    TrendingUp,
    DollarSign,
    CheckCircle,
    Activity,
    AlertTriangle
} from "lucide-react";

import StatCard from "./StatCard";

const ManagerDashboard = () => {

    return (
        <div className="role-dashboard">

            {/* HEADER */}

            <div className="dashboard-header">

                <div>

                    <p className="dashboard-label">
                        MANAGEMENT PANEL
                    </p>

                    <h1>
                        Manager Dashboard
                    </h1>

                    <p className="dashboard-description">
                        Monitor maintenance performance
                        and operational KPI.
                    </p>

                </div>

                <div className="dashboard-date">

                    <BarChart3 size={18} />

                    <span>
                        Performance Overview
                    </span>

                </div>

            </div>


            {/* KPI */}

            <div className="dashboard-stat-grid">

                <StatCard
                    title="Total Equipment"
                    value="120"
                    subtitle="Registered assets"
                    icon={<Package size={24} />}
                    variant="blue"
                />

                <StatCard
                    title="Equipment Uptime"
                    value="94.5%"
                    subtitle="+2.4% this month"
                    icon={<Activity size={24} />}
                    variant="green"
                />

                <StatCard
                    title="Completion Rate"
                    value="92%"
                    subtitle="+4.2% this month"
                    icon={<CheckCircle size={24} />}
                    variant="purple"
                />

                <StatCard
                    title="Maintenance Cost"
                    value="Rp 24.5M"
                    subtitle="This month"
                    icon={<DollarSign size={24} />}
                    variant="orange"
                />

            </div>


            {/* KPI CARDS */}

            <div className="dashboard-card">

                <div className="card-header">

                    <div>

                        <h3>
                            Maintenance Performance
                        </h3>

                        <p>
                            Key performance indicators
                        </p>

                    </div>

                    <TrendingUp size={20} />

                </div>


                <div className="manager-kpi-grid">

                    <div className="manager-kpi">

                        <div className="kpi-icon">
                            <CheckCircle size={22} />
                        </div>

                        <div>

                            <span>
                                Completion Rate
                            </span>

                            <strong>
                                92%
                            </strong>

                            <small>
                                +4.2% from last month
                            </small>

                        </div>

                    </div>


                    <div className="manager-kpi">

                        <div className="kpi-icon">
                            <Activity size={22} />
                        </div>

                        <div>

                            <span>
                                Equipment Uptime
                            </span>

                            <strong>
                                94.5%
                            </strong>

                            <small>
                                +2.4% from last month
                            </small>

                        </div>

                    </div>


                    <div className="manager-kpi">

                        <div className="kpi-icon">
                            <TrendingUp size={22} />
                        </div>

                        <div>

                            <span>
                                On-Time Maintenance
                            </span>

                            <strong>
                                88%
                            </strong>

                            <small>
                                +3.1% from last month
                            </small>

                        </div>

                    </div>

                </div>

            </div>


            {/* TREND */}

            <div className="dashboard-two-column">

                <div className="dashboard-card">

                    <div className="card-header">

                        <div>

                            <h3>
                                Maintenance Trend
                            </h3>

                            <p>
                                Monthly maintenance activity
                            </p>

                        </div>

                        <BarChart3 size={20} />

                    </div>


                    <div className="simple-chart">

                        <div className="chart-bars">

                            <div className="chart-column">

                                <div
                                    className="chart-bar"
                                    style={{
                                        height: "55%"
                                    }}
                                />

                                <span>
                                    Jan
                                </span>

                            </div>


                            <div className="chart-column">

                                <div
                                    className="chart-bar"
                                    style={{
                                        height: "70%"
                                    }}
                                />

                                <span>
                                    Feb
                                </span>

                            </div>


                            <div className="chart-column">

                                <div
                                    className="chart-bar"
                                    style={{
                                        height: "48%"
                                    }}
                                />

                                <span>
                                    Mar
                                </span>

                            </div>


                            <div className="chart-column">

                                <div
                                    className="chart-bar"
                                    style={{
                                        height: "82%"
                                    }}
                                />

                                <span>
                                    Apr
                                </span>

                            </div>


                            <div className="chart-column">

                                <div
                                    className="chart-bar"
                                    style={{
                                        height: "92%"
                                    }}
                                />

                                <span>
                                    May
                                </span>

                            </div>

                        </div>

                    </div>

                </div>


                {/* EQUIPMENT HEALTH */}

                <div className="dashboard-card">

                    <div className="card-header">

                        <div>

                            <h3>
                                Equipment Health
                            </h3>

                            <p>
                                Overall equipment condition
                            </p>

                        </div>

                        <Package size={20} />

                    </div>


                    <div className="health-overview">

                        <div className="health-circle">

                            <strong>
                                79%
                            </strong>

                            <span>
                                Good
                            </span>

                        </div>


                        <div className="health-details">

                            <div>
                                <span className="health-dot good" />
                                <span>Good</span>
                                <strong>95</strong>
                            </div>

                            <div>
                                <span className="health-dot warning" />
                                <span>Warning</span>
                                <strong>15</strong>
                            </div>

                            <div>
                                <span className="health-dot critical" />
                                <span>Critical</span>
                                <strong>10</strong>
                            </div>

                        </div>

                    </div>

                </div>

            </div>


            {/* MANAGEMENT ALERT */}

            <div className="dashboard-alert manager-alert">

                <AlertTriangle size={20} />

                <div>

                    <strong>
                        Management Attention
                    </strong>

                    <p>
                        10 equipment units are currently
                        classified as critical and require
                        maintenance attention.
                    </p>

                </div>

            </div>

        </div>
    );
};

export default ManagerDashboard;