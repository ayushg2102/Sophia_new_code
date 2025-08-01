import React, { useEffect, useState } from 'react';
import { Layout, Card, Tag, Button, Typography, Divider, List, Spin, Alert, Row, Col, Collapse } from 'antd';
import dayjs from 'dayjs';
import { ArrowLeftOutlined, CalendarOutlined, ToolOutlined, ClockCircleOutlined, CaretRightOutlined } from '@ant-design/icons';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import Header from '../../components/Header/Header';
import './ActionDetail.css';

const { Content } = Layout;
const { Title, Text } = Typography;

interface ActionRun {
  run_timestamp: string;
  run_status: string;
  description: string;
  human_msg: string;
  resume_at: string;
  step_id: number;
  subtask_due_date: string;
  subtask_id: string;
  subtask_name: string;
}

interface ActionDetailType {
  action_id: string | undefined;
  action_name: string;
  task_name: string;
  subtask_name: string;
  instructions: string;
  tools_used: string[];
  trigger_date: string;
  trigger_type: string | "relative" | "fixed";
  action_runs: ActionRun[];
  status?: string;
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
    const fetchActionDetail = async () => {
      try {
        // Replace with your actual API endpoint
        const response = await fetch(`/api/action-details/${actionId}`);
        if (!response.ok) throw new Error('Failed to fetch action details');
        const apiData = await response.json();
        
        // Access the nested data property from the API response
        const responseData = apiData.data || {};
        
        // Map API response to match our interface
        const mappedAction: ActionDetailType = {
          action_id: responseData.action_id,
          action_name: 'Reminder Email',
          task_name: taskNameFromState || responseData.task_name || 'Task',
          subtask_name: responseData.subtask_name || '',
          instructions: instructionsFromState || responseData.action_instructions,
          tools_used: Array.isArray(responseData.tools_used) ? responseData.tools_used : [],
          trigger_date: responseData.trigger_date,
          trigger_type: responseData.trigger_type,
          action_runs: Array.isArray(responseData.action_runs) ? responseData.action_runs : [],
          status: responseData.status || apiData.status
        };
        
        setAction(mappedAction);
        console.log(mappedAction,"mappedAction")
      } catch (error) {
        console.error('Error fetching action details:', error);
        // Optionally set an error state here if you want to show an error message
      } finally {
        setLoading(false);
      }
    };
    
    fetchActionDetail();
  }, [actionId, taskNameFromState, instructionsFromState]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
      case 'success':
        return 'green';
      case 'pending':
        return 'orange';
      case 'in review':
        return 'blue';
      default:
        return 'default';
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
                console.log(action,"action1123")
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
            <Title level={5} className="action-detail-section-title">Capabilities</Title>
            <div className="action-tools">
              <ToolOutlined />
              <Text strong>Tools: </Text>
              {action.tools_used && action.tools_used.length > 0 ? (
                action.tools_used.map((tool, index) => (
                  <Tag key={index} color="blue">
                    {tool}
                  </Tag>
                ))
              ) : (
                <Text type="secondary">No tools specified</Text>
              )}
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
              <Tag icon={<ClockCircleOutlined />} color="magenta">{action.trigger_type}</Tag>
            </div>
          </div>
          <div className="action-detail-section">
            <Title level={5} className="action-detail-section-title">Action Runs</Title>
            <List
              dataSource={action.action_runs}
              renderItem={(run, index) => (
                <List.Item key={index}>
                  <List.Item.Meta
                    title={
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                        <Tag color={getStatusColor(run.run_status)}>
                          {run.run_status === 'success' ? 'completed' : run.run_status}
                        </Tag>
                        <Text>{run.subtask_name}</Text>
                      </div>
                    }
                    description={
                      <div>
                        <Text type="secondary">
                          {dayjs(run.run_timestamp).format('MMM D, YYYY h:mm A')}
                        </Text>
                        <div style={{ marginTop: 8 }}>
                          <div style={{ marginBottom: 4 }}>{run.human_msg}</div>
                          <div style={{ marginBottom: 4 }}>{run.description}</div>
                          <div style={{ marginBottom: 4 }}>Status: {run.run_status}</div>
                          <div>Scheduled: {run.resume_at || 'N/A'}</div>
                        </div>
                      </div>
                    }
                  />
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
