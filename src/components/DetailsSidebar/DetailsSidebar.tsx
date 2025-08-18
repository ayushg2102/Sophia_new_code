import React from 'react';
import { Card, Typography, List, Collapse } from 'antd';
import { 
  CheckCircleOutlined, 
  ExclamationCircleOutlined, 
  LoadingOutlined, 
  ClockCircleOutlined 
} from '@ant-design/icons';

const { Text } = Typography;
const { Panel } = Collapse;

export interface StatusCounts {
  done: number;
  ongoing: number;
  overdue: number;
  due: number;
}

export interface OccurrenceData {
  key: string;
  period: string;
  dueDate: string;
  status: 'done' | 'ongoing' | 'overdue' | 'due';
}

export interface DetailsSidebarProps {
  title?: string;
  statusCounts: StatusCounts;
  totalItems: number;
  donePercentage: number;
  category: string;
  nextDueDate: string;
  frequency: string;
  description?: string;
  totalSubtasks?: number;
  occurrences: OccurrenceData[];
  style?: React.CSSProperties;
}

const DetailsSidebar: React.FC<DetailsSidebarProps> = ({
  title = "Details",
  statusCounts,
  totalItems,
  donePercentage,
  category,
  nextDueDate,
  frequency,
  description,
  totalSubtasks,
  occurrences,
  style
}) => {
  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'done':
        return <CheckCircleOutlined style={{ color: '#006400' }} />;
      case 'ongoing':
        return <LoadingOutlined style={{ color: '#faad14' }} />;
      case 'overdue':
        return <ExclamationCircleOutlined style={{ color: '#ff4d4f' }} />;
      default:
        return <ClockCircleOutlined style={{ color: '#d9d9d9' }} />;
    }
  };

  // Custom donut chart component
  const MultiColorDonut = () => {
    const size = 120;
    const strokeWidth = 8;
    const radius = (size - strokeWidth) / 2;
    const circumference = radius * 2 * Math.PI;
    const center = size / 2;

    // Calculate percentages for each status
    const total = totalItems || 1;
    const donePercent = (statusCounts.done / total) * 100;
    const ongoingPercent = (statusCounts.ongoing / total) * 100;
    const overduePercent = (statusCounts.overdue / total) * 100;
    const duePercent = (statusCounts.due / total) * 100;

    // Calculate stroke dash arrays for each segment
    const doneLength = (donePercent / 100) * circumference;
    const ongoingLength = (ongoingPercent / 100) * circumference;
    const overdueLength = (overduePercent / 100) * circumference;
    const dueLength = (duePercent / 100) * circumference;

    // Calculate rotation offsets for each segment
    let currentOffset = 0;
    const doneOffset = currentOffset;
    currentOffset += doneLength;
    const ongoingOffset = currentOffset;
    currentOffset += ongoingLength;
    const overdueOffset = currentOffset;
    currentOffset += overdueLength;
    const dueOffset = currentOffset;

    return (
      <div style={{ position: 'relative', display: 'inline-block' }}>
        <svg width={size} height={size} style={{ transform: 'rotate(-90deg)' }}>
          {/* Background circle */}
          <circle
            cx={center}
            cy={center}
            r={radius}
            fill="none"
            stroke="#f0f0f0"
            strokeWidth={strokeWidth}
          />
          
          {/* Done segment - Green */}
          {statusCounts.done > 0 && (
            <circle
              cx={center}
              cy={center}
              r={radius}
              fill="none"
              stroke="#006400"
              strokeWidth={strokeWidth}
              strokeDasharray={`${doneLength} ${circumference}`}
              strokeDashoffset={-doneOffset}
              strokeLinecap="round"
            />
          )}
          
          {/* Ongoing segment - Yellow/Amber */}
          {statusCounts.ongoing > 0 && (
            <circle
              cx={center}
              cy={center}
              r={radius}
              fill="none"
              stroke="#faad14"
              strokeWidth={strokeWidth}
              strokeDasharray={`${ongoingLength} ${circumference}`}
              strokeDashoffset={-ongoingOffset}
              strokeLinecap="round"
            />
          )}
          
          {/* Overdue segment - Red */}
          {statusCounts.overdue > 0 && (
            <circle
              cx={center}
              cy={center}
              r={radius}
              fill="none"
              stroke="#ff4d4f"
              strokeWidth={strokeWidth}
              strokeDasharray={`${overdueLength} ${circumference}`}
              strokeDashoffset={-overdueOffset}
              strokeLinecap="round"
            />
          )}
          
          {/* Due segment - Yellow */}
          {statusCounts.due > 0 && (
            <circle
              cx={center}
              cy={center}
              r={radius}
              fill="none"
              stroke="#808080"
              strokeWidth={strokeWidth}
              strokeDasharray={`${dueLength} ${circumference}`}
              strokeDashoffset={-dueOffset}
              strokeLinecap="round"
            />
          )}
        </svg>
        
        {/* Center text */}
        <div 
          style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            textAlign: 'center',
            fontSize: '16px',
            fontWeight: 'bold',
            lineHeight: '1.2'
          }}
        >
          <div style={{ fontSize: '20px', color: '#006400' }}>{statusCounts.done}/{totalItems}</div>
          <div style={{ fontSize: '12px', color: '#666' }}>Done</div>
        </div>
      </div>
    );
  };

  return (
    <Card 
      title={title}
      style={{ 
        borderRadius: '6px', 
        boxShadow: '0 1px 4px rgba(0,0,0,0.08)',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        ...style
      }}
      bodyStyle={{ padding: '16px', flex: 1, overflow: 'auto', display: 'flex', flexDirection: 'column' }}
    >
      {/* Donut Chart */}
      <div style={{ textAlign: 'center', marginBottom: '20px' }}>
        <div style={{ marginBottom: '12px' }}>
          <MultiColorDonut />
        </div>
        
        {/* Status Legend */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', alignItems: 'flex-start' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <div style={{ width: '10px', height: '10px', borderRadius: '50%', backgroundColor: '#006400' }}></div>
            <Text style={{ fontSize: '13px' }}>{statusCounts.done} Done</Text>
          </div>
          {statusCounts.ongoing > 0 && (
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <div style={{ width: '10px', height: '10px', borderRadius: '50%', backgroundColor: '#faad14' }}></div>
              <Text style={{ fontSize: '13px' }}>{statusCounts.ongoing} Ongoing</Text>
            </div>
          )}
          {statusCounts.overdue > 0 && (
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <div style={{ width: '10px', height: '10px', borderRadius: '50%', backgroundColor: '#ff4d4f' }}></div>
              <Text style={{ fontSize: '13px' }}>{statusCounts.overdue} Overdue</Text>
            </div>
          )}
          {statusCounts.due > 0 && (
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <div style={{ width: '10px', height: '10px', borderRadius: '50%', backgroundColor: '#808080' }}></div>
              <Text style={{ fontSize: '13px' }}>{statusCounts.due} Not Due</Text>
            </div>
          )}
        </div>
      </div>

      {/* Details */}
      <div style={{ marginBottom: '18px' }}>
        <div style={{ marginBottom: '10px' }}>
          <Text type="secondary" style={{ fontSize: '11px' }}>Category</Text>
          <br />
          <Text style={{ fontSize: '13px', fontWeight: 500 }}>
            {category}
          </Text>
        </div>
        <div style={{ marginBottom: '10px' }}>
          <Text type="secondary" style={{ fontSize: '11px' }}>Next due on</Text>
          <br />
          <Text style={{ fontSize: '13px', fontWeight: 500 }}>
            {nextDueDate}
          </Text>
        </div>
        <div style={{ marginBottom: '10px' }}>
          <Text type="secondary" style={{ fontSize: '11px' }}>Frequency</Text>
          <br />
          <Text style={{ fontSize: '13px', fontWeight: 500 }}>
            {frequency}
          </Text>
        </div>
        {description && (
          <div style={{ marginBottom: '10px' }}>
            <Text type="secondary" style={{ fontSize: '11px' }}>Description</Text>
            <br />
            <Text style={{ fontSize: '13px', fontWeight: 500 }}>
              {description}
            </Text>
          </div>
        )}
        {totalSubtasks !== undefined && (
          <div style={{ marginBottom: '10px' }}>
            <Text type="secondary" style={{ fontSize: '11px' }}>Total Subtasks</Text>
            <br />
            <Text style={{ fontSize: '13px', fontWeight: 500 }}>
              {totalSubtasks}
            </Text>
          </div>
        )}
      </div>

      {/* Occurrences */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minHeight: 0 }}>
        <Text type="secondary" style={{ fontSize: '11px', display: 'block', marginBottom: '10px' }}>
          Sub Tasks({occurrences.length})
        </Text>
        
        <div style={{ flex: 1, overflow: 'hidden' }}>
          <Collapse defaultActiveKey={["1"]} ghost style={{ height: '100%' }}>
            <Panel header={`${occurrences.length} items`} key="1" style={{ height: '100%' }}>
              <div style={{ maxHeight: '300px', overflow: 'auto' }}>
                <List
                  size="small"
                  dataSource={occurrences}
                  renderItem={(item: OccurrenceData) => (
                    <List.Item style={{ padding: '6px 0', border: 'none' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px', width: '100%' }}>
                        {getStatusIcon(item.status)}
                        <div style={{ flex: 1 }}>
                          <Text style={{ fontSize: '13px' }}>{item.period}</Text>
                          <br />
                          <Text type="secondary" style={{ fontSize: '11px' }}>
                            Due: {item.dueDate}
                          </Text>
                        </div>
                      </div>
                    </List.Item>
                  )}
                />
              </div>
            </Panel>
          </Collapse>
        </div>
      </div>
    </Card>
  );
};

export default DetailsSidebar;
