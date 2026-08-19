import React from "react";

const StatCard = ({
    title,
    value,
    subtitle,
    icon,
    variant = "blue"
}) => {
    return (
        <div className={`dashboard-stat-card ${variant}`}>

            <div className="stat-card-content">

                <div className="stat-card-info">
                    <p className="stat-card-title">
                        {title}
                    </p>

                    <h2 className="stat-card-value">
                        {value}
                    </h2>

                    {subtitle && (
                        <p className="stat-card-subtitle">
                            {subtitle}
                        </p>
                    )}
                </div>

                <div className="stat-card-icon">
                    {icon}
                </div>

            </div>

        </div>
    );
};

export default StatCard;