import React from 'react';
import { Card, Statistic } from 'antd';
import { ReactNode } from 'react';
import './MetricCard.css';

interface MetricCardProps {
  title: string;
  value: number;
  icon: ReactNode;
  color: string;
  suffix?: string;
}

const MetricCard: React.FC<MetricCardProps> = ({ title, value, icon, color, suffix }) => {
  return (
    <Card className="metric-card">
      <div className="metric-content">
        <div className="metric-header">
          <div className="metric-title">{title}</div>
          <div className="metric-icon" style={{ color: color }}>
            {icon}
          </div>
        </div>
        <div className="metric-value-container">
          <div className="metric-value">{value}</div>
          {suffix && <div className="metric-suffix">{suffix}</div>}
        </div>
      </div>
    </Card>
  );
};

export default MetricCard;