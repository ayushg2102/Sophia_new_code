import React from 'react';
import { Card, Tag, Button, Space, Tooltip } from 'antd';
import { CalendarOutlined, ClockCircleOutlined } from '@ant-design/icons';
import { Task } from '../../types';
import { useNavigate } from 'react-router-dom';
import dayjs from 'dayjs';
import './TaskCard.css';

interface TaskCardProps {
  task: Task;
}

const TaskCard: React.FC<TaskCardProps> = ({ task }) => {
  const navigate = useNavigate();

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'blue';
      case 'completed': return 'green';
      case 'pending': return 'orange';
      default: return 'default';
    }
  };

  const getFrequencyColor = (frequency: string) => {
    switch (frequency) {
      case 'Daily': return 'yellow';
      case 'Weekly': return 'orange';
      case 'Monthly': return 'blue';
      case 'Quarterly': return 'purple';
      case 'One-Time': return 'green';
      default: return 'default';
    }
  };

  const handleViewTask = () => {
    navigate(`/task/${task.task_id}`);
  };

  const handleCardClick = () => {
    navigate(`/task/${task.task_id}`);
  };

  return (
    <Card className="task-card" hoverable onClick={handleCardClick}>
      <div className="task-header">
        <div className="task-title">
          <h4>{task.task_short_description}</h4>
          <div className="task-tags">
            <Tag color={getStatusColor(task.status)}>
              {task.status.charAt(0).toUpperCase() + task.status.slice(1)}
            </Tag>
            <Tag color={getFrequencyColor(task.frequency)}>
              {task.frequency}
            </Tag>
          </div>
        </div>
      </div>
      <div className="task-details">
      {task.description && (
        <div className="task-description">
          <Tooltip title={task.description}>
            <p>{task.description.substring(0, 100)}...</p>
          </Tooltip>
        </div>
      )}
        <Space direction="vertical" size={4} >
          <div className="task-detail-item">
            <CalendarOutlined className="task-icon" />
            <span>Due: {dayjs(task.task_due_date).format('MMM DD, YYYY')}</span>
          </div>
          <div className="task-detail-item">
            <ClockCircleOutlined className="task-icon" />
            <span>{task.subtasks?.length || 0} subtasks</span>
          </div>
        </Space>
      </div>
      
      <Button
        className="task-view-btn"
        type="primary"
        // icon={<EyeOutlined />}
        size="small"
        onClick={handleViewTask}
      >
        View Task
      </Button>
    </Card>
  );
};

export default TaskCard;