import React, { useEffect, useState } from 'react';
import { Layout, Card, Tag, Button, Typography, Divider, List, Spin, Alert, Row, Col } from 'antd';
import dayjs from 'dayjs';
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
  action_id: string | undefined;
  action_name: string;
  task_name: string;
  subtask_name: string;
  instructions: string;
  tools: string[];
  trigger_date: string;
  trigger_type: string | "relative" | "fixed";
  action_runs: ActionRun[];
}

const ActionDetail: React.FC = () => {
  const { actionId } = useParams<{ actionId: string }>();
  const navigate = useNavigate();
  const [action, setAction] = useState<ActionDetailType | null>(null);
  const [loading, setLoading] = useState(true);


  // Get task name from navigation state if available
  const { state } = useLocation() as { state?: { taskName?: string, actionId?: string, instructions?: string } };
  const taskNameFromState = state && state.taskName;
  const actionIdFromState = state && state.actionId;
  const instructionsFromState = state && state.instructions;

  useEffect(() => {
    setLoading(true);
    // Simulate fetching from local actions.json
    import('../../data/actions.json').then((module) => {
      const actionsData = module.default.data;
      const foundAction = actionsData.actions.find((a: any) => a.action_id === actionId);
      if (foundAction) {
        setAction({
          action_id: actionIdFromState,
          action_name: 'Reminder Email',
          task_name: taskNameFromState || actionsData.task_short_description || 'Sample Task',
          subtask_name: '', // Could be enhanced by matching subtask if needed
          instructions: instructionsFromState || foundAction.action_instruction,
          tools: ['Send Email', 'Send Reminder', 'Block Calendar'],
          trigger_date: foundAction.action_trigger_date,
          trigger_type: foundAction.action_trigger_type,
          action_runs: [
            { date: foundAction.action_trigger_date, status: 'pending' },
            { date: foundAction.adjusted_relative_trigger_date, status: 'completed' },
          ],
        });
      }
      setLoading(false);
    });
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
    <Layout className="action-detail-layout">
      <Header />
      <Content className="action-detail-content">
        <div className="action-detail-back">
          <Button type="link" icon={<ArrowLeftOutlined />} onClick={handleBackClick}>
            Back
          </Button>
        </div>
        <Card className="action-detail-card">
          <div className="action-detail-header">
            <Title level={3} className="action-detail-title">{action.action_name}</Title>
            <div className="action-detail-meta">
              <span className="action-detail-label">Task:</span> <span>{action.task_name}</span>
              {/* <span className="action-detail-label">Sub Task:</span> <span>{action.subtask_name}</span> */}
            </div>
          </div>
          <div className="action-detail-section">
            <Title level={5} className="action-detail-section-title">Instructions</Title>
            {/* Render instructions as a list of steps if possible */}
            <div className="action-detail-instructions">
              {(() => {
                const lines = action.instructions.split(/\r?\n/).filter(l => l.trim() !== '');
                // Find step/bullet lines
                const stepLines = lines.filter(l => /^\s*(-|\d+\.|Step|•)/i.test(l.trim()));
                const beforeList = [];
                for (let i = 0; i < lines.length; i++) {
                  if (/^\s*(-|\d+\.|Step|•)/i.test(lines[i].trim())) break;
                  beforeList.push(lines[i]);
                }
                return <>
                  {beforeList.length > 0 && (
                    <div style={{ marginBottom: 8 }}>
                      {beforeList.map((l, i) => <div key={i}>{l}</div>)}
                    </div>
                  )}
                  {stepLines.length > 0 && (
                    <ol style={{ marginLeft: 20, marginBottom: 8 }}>
                      {stepLines.map((l, i) => <li key={i}>{l.replace(/^\s*(-|\d+\.|Step|•)\s*/, '')}</li>)}
                    </ol>
                  )}
                  {stepLines.length === 0 && (
                    <div>{lines.map((l, i) => <div key={i}>{l}</div>)}</div>
                  )}
                </>;
              })()}
            </div>
          </div>
          <div className="action-detail-section">
            <Title level={5} className="action-detail-section-title">Tools Used</Title>
            <div className="action-detail-tools">
              {action.tools.map(tool => (
                <Tag icon={<ToolOutlined />} color="blue" key={tool}>{tool}</Tag>
              ))}
            </div>
          </div>
          <div className="action-detail-trigger-row">
            <div>
              <span className="action-detail-label">Trigger Date:</span>
              <Tag icon={<CalendarOutlined />} color="blue">
                {dayjs(action.trigger_date).isValid() ? dayjs(action.trigger_date).format('MM/DD/YYYY') : action.trigger_date}
              </Tag>
            </div>
            <div>
              <span className="action-detail-label">Trigger Type:</span>
              <Tag icon={<ClockCircleOutlined />} color="magenta">{action.trigger_type.toUpperCase()}</Tag>
            </div>
          </div>
          <div className="action-detail-section">
            <Title level={5} className="action-detail-section-title">Run Dates</Title>
            <List
              itemLayout="horizontal"
              dataSource={action.action_runs}
              renderItem={(run, idx) => (
                <List.Item key={idx}>
                  <span style={{ marginRight: 16 }}>{dayjs(run.date).isValid() ? dayjs(run.date).format('MM/DD/YYYY') : run.date}</span>
                  <Tag color={getStatusColor(run.status)} style={{ minWidth: 80, textAlign: 'center' }}>{run.status.charAt(0).toUpperCase() + run.status.slice(1)}</Tag>
                </List.Item>
              )}
            />
          </div>
        </Card>
      </Content>
    </Layout>
  );
};

export default ActionDetail;
