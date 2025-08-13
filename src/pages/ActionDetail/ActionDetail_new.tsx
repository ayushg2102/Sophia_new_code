//HELLO WORLD : OLD component

import React, { useEffect, useState } from 'react';
import { Layout, Card, Tag, Button, Typography, Spin, Alert, Collapse } from 'antd';
import dayjs from 'dayjs';
import { ArrowLeftOutlined, CalendarOutlined, ToolOutlined, ClockCircleOutlined, CaretRightOutlined } from '@ant-design/icons';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import Header from '../../components/Header/Header';
import './ActionDetail.css';
import PoliticalContributionsDashboard from '../../components/PoliticalContributionsDashboard';
import SocialMediaMonitoringDashboard from '../../components/SocialMediaContributions/SocialMediaMonitoringDashboard';

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
  const { state } = useLocation() as { state?: { taskName?: string, instructions?: string } };
  const { taskName: taskNameFromState, instructions: instructionsFromState } = state || {};

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
          action_name: 'Action',
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

  // Special handling for full-width components
  if (taskNameFromState === 'Political Contributions') {
    return (
      <div style={{ width: '100%', padding: '20px' }}>
        <Header />
        <Button type="link" icon={<ArrowLeftOutlined />} onClick={handleBackClick}>
            Back
          </Button>
        <PoliticalContributionsDashboard />
      </div>
    );
  }
  
  if (taskNameFromState === 'Social Media') {
    return (
      <div style={{ width: '100%', padding: '20px' }}>
        <Header />
        <Button type="link" icon={<ArrowLeftOutlined />} onClick={handleBackClick}>
            Back
          </Button>
        <SocialMediaMonitoringDashboard />
      </div>
    );
  }

  // Default layout for other actions
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
            </div>
          </div>
          
          <div className="action-detail-section">
            <Title level={5} className="action-detail-section-title">Instructions</Title>
            <div className="action-detail-instructions">
              {(() => {
                const lines = action.instructions.split(/\r?\n/).filter(l => l.trim() !== '');
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
                      {stepLines.map((l, i) => 
                        <li key={i} style={{ marginBottom: 4 }}>
                          {l.replace(/^\s*(-|\d+\.|Step|•)\s*/, '')}
                        </li>
                      )}
                    </ol>
                  )}
                  {stepLines.length === 0 && (
                    <div>{lines.map((l, i) => <div key={i} style={{ marginBottom: 4 }}>{l}</div>)}</div>
                  )}
                </>;
              })()}
            </div>
          </div>
          
          <div className="action-detail-section">
            <Title level={5} className="action-detail-section-title">Capabilities</Title>
            <div className="action-tools" style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <ToolOutlined style={{ color: '#8c8c8c' }} />
              {action.tools_used?.length > 0 ? (
                action.tools_used.map((tool, index) => (
                  <Tag key={index} color="blue" style={{ margin: 0 }}>
                    {tool}
                  </Tag>
                ))
              ) : (
                <Text type="secondary">No tools specified</Text>
              )}
            </div>
          </div>
          
          <div className="action-detail-trigger-row" style={{ 
            display: 'flex', 
            gap: 24, 
            margin: '16px 0',
            padding: '12px 0',
            borderTop: '1px solid #f0f0f0',
            borderBottom: '1px solid #f0f0f0'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <span className="action-detail-label" style={{ color: '#8c8c8c' }}>Trigger Date:</span>
              <Tag icon={<CalendarOutlined />} color="blue" style={{ margin: 0 }}>
                {dayjs(action.trigger_date).isValid() 
                  ? dayjs(action.trigger_date).format('MMM D, YYYY') 
                  : action.trigger_date}
              </Tag>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <span className="action-detail-label" style={{ color: '#8c8c8c' }}>Trigger Type:</span>
              <Tag icon={<ClockCircleOutlined />} color="magenta" style={{ margin: 0 }}>
                {action.trigger_type}
              </Tag>
            </div>
          </div>
          
          <div className="action-detail-section">
            <Title level={5} className="action-detail-section-title">Action Runs</Title>
            <Collapse
              bordered={false}
              className="action-runs-collapse"
              expandIcon={({ isActive }) => <CaretRightOutlined rotate={isActive ? 90 : 0} />}
              style={{ background: 'none' }}
            >
              {action.action_runs.map((run, index) => (
                <Collapse.Panel
                  key={index}
                  header={
                    <div style={{ 
                      display: 'flex', 
                      justifyContent: 'space-between', 
                      alignItems: 'center',
                      width: '100%',
                      padding: '8px 0'
                    }}>
                      <Text strong style={{ fontSize: '15px' }}>{run.subtask_name}</Text>
                      <Tag 
                        color={getStatusColor(run.run_status)} 
                        style={{ 
                          marginLeft: 8,
                          textTransform: 'capitalize',
                          fontWeight: 500
                        }}
                      >
                        {run.run_status === 'success' ? 'Completed' : run.run_status.toLowerCase()}
                      </Tag>
                    </div>
                  }
                  className="action-run-panel"
                  style={{
                    marginBottom: 12,
                    background: '#fff',
                    borderRadius: 8,
                    border: '1px solid #f0f0f0',
                    overflow: 'hidden'
                  }}
                >
                  <div className="action-run-details" style={{ padding: '12px 0' }}>
                    <div className="detail-row" style={{ 
                      display: 'flex', 
                      marginBottom: 12,
                      lineHeight: 1.5 
                    }}>
                      <span className="detail-label" style={{
                        flex: '0 0 120px',
                        color: '#8c8c8c',
                        fontWeight: 500
                      }}>When</span>
                      <span className="detail-value" style={{ flex: 1 }}>
                        {dayjs(run.run_timestamp).format('MMM D, YYYY [at] h:mm A')}
                      </span>
                    </div>
                    
                    {run.human_msg && (
                      <div className="detail-row" style={{
                        display: 'flex',
                        marginBottom: 12,
                        lineHeight: 1.5
                      }}>
                        <span className="detail-label" style={{
                          flex: '0 0 120px',
                          color: '#8c8c8c',
                          fontWeight: 500
                        }}>Message</span>
                        <span className="detail-value" style={{ flex: 1 }}>
                          {run.human_msg}
                        </span>
                      </div>
                    )}
                    
                    {run.description && (
                      <div className="detail-row" style={{
                        display: 'flex',
                        marginBottom: 12,
                        lineHeight: 1.5
                      }}>
                        <span className="detail-label" style={{
                          flex: '0 0 120px',
                          color: '#8c8c8c',
                          fontWeight: 500
                        }}>Details</span>
                        <span className="detail-value" style={{ flex: 1 }}>
                          {run.description}
                        </span>
                      </div>
                    )}
                    
                    <div className="detail-row" style={{
                      display: 'flex',
                      marginBottom: 12,
                      alignItems: 'center',
                      lineHeight: 1.5
                    }}>
                      <span className="detail-label" style={{
                        flex: '0 0 120px',
                        color: '#8c8c8c',
                        fontWeight: 500
                      }}>Status</span>
                      <span className="detail-value" style={{ flex: 1 }}>
                        <Tag 
                          color={getStatusColor(run.run_status)}
                          style={{
                            textTransform: 'capitalize',
                            margin: 0
                          }}
                        >
                          {run.run_status === 'success' ? 'Completed' : run.run_status.toLowerCase()}
                        </Tag>
                      </span>
                    </div>
                    
                    {run.resume_at && (
                      <div className="detail-row" style={{
                        display: 'flex',
                        marginBottom: 0,
                        lineHeight: 1.5
                      }}>
                        <span className="detail-label" style={{
                          flex: '0 0 120px',
                          color: '#8c8c8c',
                          fontWeight: 500
                        }}>Next Action</span>
                        <span className="detail-value" style={{ flex: 1 }}>
                          {dayjs(run.resume_at).isValid()
                            ? `Scheduled for ${dayjs(run.resume_at).format('MMM D, YYYY [at] h:mm A')}`
                            : `Will resume ${run.resume_at}`}
                        </span>
                      </div>
                    )}
                  </div>
                </Collapse.Panel>
              ))}
            </Collapse>
          </div>
        </Card>
      </Content>
    </Layout>
  );
};

export default ActionDetail;

