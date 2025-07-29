import React, { useEffect, useState } from 'react';
import { Layout, Card, Tag, Button, Typography, Divider, List, Spin, Alert, Row, Col } from 'antd';
import { ArrowLeftOutlined, CalendarOutlined, ToolOutlined, ClockCircleOutlined } from '@ant-design/icons';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import Header from '../../components/Header/Header';
import './ActionDetail.css';

const { Content } = Layout;
const { Title, Text } = Typography;

interface ActionRun {
  date: string;
  status: 'completed' | 'pending' | 'in review';
}

interface ActionDetailType {
  action_id: string;
  action_name: string;
  task_name: string;
  subtask_name: string;
  instructions: string;
  tools: string[];
  trigger_date: string;
  trigger_type: 'relative' | 'fixed';
  action_runs: ActionRun[];
}

const ActionDetail: React.FC = () => {
  const { actionId } = useParams<{ actionId: string }>();
  const navigate = useNavigate();
  const [action, setAction] = useState<ActionDetailType | null>(null);
  const [loading, setLoading] = useState(true);


  // Get task name from navigation state if available
  const { state } = useLocation() as { state?: { taskName?: string } };
  const taskNameFromState = state && state.taskName;

  useEffect(() => {
    setLoading(true);
    setTimeout(() => {
      setAction({
        action_id: actionId || '',
        action_name: 'Sample Action',
        task_name: taskNameFromState || 'Sample Task',
        subtask_name: 'Sample Subtask',
        instructions: 'Follow these steps to complete the action.\nEnsure all requirements are met.',
        tools: ['Tool A', 'Tool B'],
        trigger_date: '2025-07-29',
        trigger_type: 'fixed',
        action_runs: [
          { date: '2025-07-28', status: 'completed' },
          { date: '2025-07-29', status: 'pending' },
          { date: '2025-07-30', status: 'in review' },
        ],
      });
      setLoading(false);
    }, 500);
  }, [actionId, taskNameFromState]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'green';
      case 'pending': return 'orange';
      case 'in review': return 'blue';
      default: return 'default';
    }
  };

  const handleBackClick = () => {
    navigate(-1);
  };

  if (loading) {
    return <Spin style={{ marginTop: 60 }} />;
  }

  if (!action) {
    return <Alert message={'Action not found'} type="error" showIcon style={{ marginTop: 60 }} />;
  }

  return (
    <Layout>
      <Header />
      <Content style={{ padding: '24px', maxWidth: 900, margin: '0 auto' }}>
        <Button type="link" icon={<ArrowLeftOutlined />} onClick={handleBackClick} style={{ marginBottom: 16 }}>
          Back
        </Button>
        <Card>
          <Title level={3}>{action.action_name}</Title>
          <Text strong>Task:</Text> <Text>{action.task_name}</Text> <Divider type="vertical" />
          <Text strong>Sub Task:</Text> <Text>{action.subtask_name}</Text>
          <Divider />
          <Title level={5}>Instructions</Title>
          <div style={{ marginBottom: 16, whiteSpace: 'pre-line' }}>{action.instructions}</div>
          <Title level={5}>Tools Used</Title>
          <div style={{ marginBottom: 16 }}>
            {action.tools.map(tool => (
              <Tag icon={<ToolOutlined />} color="blue" key={tool} style={{ marginBottom: 4 }}>{tool}</Tag>
            ))}
          </div>
          <Row gutter={16} style={{ marginBottom: 16 }}>
            <Col span={12}>
              <Text strong>Trigger Date: </Text>
              <Tag icon={<CalendarOutlined />} color="purple">{action.trigger_date}</Tag>
            </Col>
            <Col span={12}>
              <Text strong>Trigger Type: </Text>
              <Tag icon={<ClockCircleOutlined />} color="magenta">{action.trigger_type}</Tag>
            </Col>
          </Row>
          <Divider />
          <Title level={5}>Action Runs</Title>
          <List
            itemLayout="horizontal"
            dataSource={action.action_runs}
            renderItem={run => (
              <List.Item>
                <List.Item.Meta
                  title={run.date}
                  description={<Tag color={getStatusColor(run.status)}>{run.status}</Tag>}
                />
              </List.Item>
            )}
          />
        </Card>
      </Content>
    </Layout>
  );
};

export default ActionDetail;
