import React, { useEffect, useState } from 'react';
import { 
  Layout, 
  Card, 
  Tag, 
  Button, 
  Typography, 
  Spin, 
  Alert, 
  Collapse, 
  Tabs, 
  Table, 
  Row,
  Col,
  Space
} from 'antd';
import dayjs from 'dayjs';
import { 
  ArrowLeftOutlined, 
  CheckCircleOutlined
} from '@ant-design/icons';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import Header from '../../components/Header/Header';
import DetailsSidebar from '../../components/DetailsSidebar';
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
  const location = useLocation();
  const [action, setAction] = useState<ActionDetailType | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('runs-history');

  // Get task data from navigation state (passed from TaskView)
  const passedTaskData = location.state as {
    task: any;
    taskDetails: any;
    occurrencesData: any[];
    statusCounts: any;
    totalSubtasks: number;
    donePercentage: number;
  } | null;

  // Fetch action details from API
  const fetchActionDetails = async () => {
    if (!actionId) return;
    
    setLoading(true);
    try {
      const response = await fetch(`/api/action-details/${actionId}`);
      if (response.ok) {
        const apiResponse = await response.json();
        if (apiResponse.status === 'success' && apiResponse.data) {
          const actionData = {
            action_id: apiResponse.data.action_id,
            action_name: apiResponse.data.action_instructions?.split('\n')[0] || 'Action',
            task_name: apiResponse.data.task_name || 'Task',
            subtask_name: apiResponse.data.subtask_name || '',
            instructions: apiResponse.data.action_instructions || '',
            tools_used: apiResponse.data.tools_used || ['Send email', 'Send email 2'],
            trigger_date: apiResponse.data.trigger_date || '',
            trigger_type: apiResponse.data.trigger_type || 'relative',
            action_runs: apiResponse.data.action_runs || [],
            status: 'active'
          };
          setAction(actionData);
        }
      } else {
        console.error('Failed to fetch action details');
      }
    } catch (error) {
      console.error('Error fetching action details:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchActionDetails();
  }, [actionId]);

  // Parse action instructions for process notes
  const parseInstructions = (instructions: string) => {
    if (!instructions) {
      return {
        objective: '',
        subject: 'Reminder – Sub task',
        body: '\n\nHope you are doing well!\n\nI wanted to remind you that "Sub task" is due on <Sub Task Due Date>.\nHere are some notes for your task:\nWebsite Review Alert & Monitoring\n\n',
        holidays: [
          '- Jan 1: New Year\'s Day',
          '- Jan 20: Martin Luther King Jr. Day',
          '- Feb 17: Presidents\' Day',
          '- May 26: Memorial Day',
          '- Jun 19: Juneteenth',
          '- Jul 4: Independence Day',
          '- Sep 1: Labor Day',
          '- Oct 13: Columbus Day',
          '- Nov 11: Veterans Day',
          '- Nov 27: Thanksgiving',
          '- Dec 25: Christmas Day'
        ]
      };
    }

    // Split instructions by line breaks and filter out empty lines
    const lines = instructions.split('\n').filter(line => line.trim());
    
    // First line is the objective
    const objective = lines[0] || '';
    
    // Extract email template subject
    const subjectMatch = instructions.match(/Subject:\s*["""]([^"""]+)["""]/i);
    const subject = subjectMatch ? subjectMatch[1] : 'Reminder – Sub task';
    
    // Extract email body (everything between "Hi" and "Regards")
    const bodyMatch = instructions.match(/Hi\s+([^,\n]+),\s*([\s\S]*?)\s*Regards,/i);
    let body = '';
    let recipientName = 'Spencer';
    
    if (bodyMatch) {
      recipientName = bodyMatch[1].trim();
      body = bodyMatch[2].trim();
      // Clean up the body formatting
      body = body.replace(/\s+/g, ' ').replace(/\.\s+/g, '.\n\n').trim();
    } else {
      // Fallback: look for content after "Use the following email format:"
      const formatMatch = instructions.match(/Use the following email format:\s*([\s\S]*?)(?=Before sending|Xponance Holidays|$)/i);
      if (formatMatch) {
        const emailContent = formatMatch[1];
        const emailBodyMatch = emailContent.match(/Hi\s+([^,\n]+),\s*([\s\S]*?)\s*Regards,/i);
        if (emailBodyMatch) {
          recipientName = emailBodyMatch[1].trim();
          body = emailBodyMatch[2].trim();
          // Clean up the body formatting
          body = body.replace(/\s+/g, ' ').replace(/\.\s+/g, '.\n\n').trim();
        }
      }
    }

    // Default holidays list (omit from instructions as requested)
    const holidays = [
      '- Jan 1: New Year\'s Day',
      '- Jan 20: Martin Luther King Jr. Day',
      '- Feb 17: Presidents\' Day',
      '- May 26: Memorial Day',
      '- Jun 19: Juneteenth',
      '- Jul 4: Independence Day',
      '- Sep 1: Labor Day',
      '- Oct 13: Columbus Day',
      '- Nov 11: Veterans Day',
      '- Nov 27: Thanksgiving',
      '- Dec 25: Christmas Day'
    ];
    
    return { objective, subject, body, holidays, recipientName };
  };



  // Runs history table columns
  const runsColumns = [
    {
      title: 'Run Log',
      dataIndex: 'human_msg',
      key: 'human_msg',
      width: '35%',
      render: (text: string, record: ActionRun) => (
        <div>
          <Text strong>{text}</Text>
          <br />
        </div>
      ),
    },
    {
      title: 'Run date & time',
      dataIndex: 'run_timestamp',
      key: 'run_timestamp',
      width: '25%',
      align: 'center' as const,
      render: (timestamp: string) => (
        <Text>{dayjs(timestamp).format('MM/DD/YYYY | hh:mm A')}</Text>
      ),
    },
    {
      title: 'Status',
      dataIndex: 'run_status',
      key: 'run_status',
      width: '15%',
      align: 'center' as const,
      render: (status: string) => {
        const getStatusConfig = (status: string) => {
          switch (status?.toLowerCase()) {
            case 'completed':
            case 'success':
              return { color: '#52c41a', bg: '#f6ffed', border: '#b7eb8f', text: 'Success' };
            case 'failed':
            case 'error':
              return { color: '#ff4d4f', bg: '#fff2f0', border: '#ffccc7', text: 'Failed' };
            case 'running':
            case 'ongoing':
              return { color: '#faad14', bg: '#fffbe6', border: '#ffe58f', text: 'Ongoing' };
            default:
              return { color: '#8c8c8c', bg: '#f5f5f5', border: '#d9d9d9', text: 'Due' };
          }
        };
        
        const config = getStatusConfig(status);
        
        return (
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '6px',
            padding: '4px 12px',
            borderRadius: '16px',
            backgroundColor: config.bg,
            border: `1px solid ${config.border}`,
            fontSize: '12px',
            fontWeight: '500'
          }}>
            <CheckCircleOutlined style={{ color: config.color, fontSize: '14px' }} />
            <span style={{ color: config.color }}>{config.text}</span>
          </div>
        );
      },
    },
    {
      title: 'Occurrence',
      dataIndex: 'subtask_name',
      key: 'subtask_name',
      width: '25%',
      render: (text: string, record: ActionRun) => (
        <div>
          <Text strong>{text || 'Q3 2025'}</Text>
          <br />
          <Text type="secondary" style={{ fontSize: '12px' }}>
            Due: {record.subtask_due_date ? dayjs(record.subtask_due_date).format('MM/DD/YYYY') : '03/31/2025'}
          </Text>
        </div>
      ),
    },
  ];

  // Use passed task data from TaskView or fallback to default values
  const sidebarData = passedTaskData ? {
    statusCounts: passedTaskData.statusCounts,
    totalSubtasks: passedTaskData.totalSubtasks,
    donePercentage: passedTaskData.donePercentage,
    category: passedTaskData.taskDetails?.category || passedTaskData.task?.task_category || 'Alerts and Monitoring',
    nextDueDate: passedTaskData.taskDetails?.nextDueDate ? 
      new Date(passedTaskData.taskDetails.nextDueDate).toLocaleDateString() : '--',
    frequency: passedTaskData.taskDetails?.frequency || passedTaskData.task?.frequency || 'Quarterly',
    description: passedTaskData.taskDetails?.description,
    occurrences: passedTaskData.occurrencesData
  } : {
    // Fallback values when no data is passed (direct navigation)
    statusCounts: { done: 0, ongoing: 0, overdue: 0, due: 0 },
    totalSubtasks: 0,
    donePercentage: 0,
    category: 'Loading...',
    nextDueDate: '--',
    frequency: '--',
    description: undefined,
    occurrences: []
  };

  // Mock runs data if no API data
  const mockRunsData = [
    {
      run_timestamp: '2025-06-12T04:45:00.000Z',
      run_status: 'completed',
      description: 'Process media content',
      human_msg: 'Process media content',
      resume_at: '',
      step_id: 1,
      subtask_due_date: '2025-03-31T00:00:00.000Z',
      subtask_id: 'q3-2025',
      subtask_name: 'Q3 2025'
    },
    {
      run_timestamp: '2025-06-12T04:45:00.000Z',
      run_status: 'completed',
      description: 'Identify keywords or trigger phrases',
      human_msg: 'Identify keywords or trigger phrases',
      resume_at: '',
      step_id: 2,
      subtask_due_date: '2025-03-31T00:00:00.000Z',
      subtask_id: 'q3-2025-2',
      subtask_name: 'Q3 2025'
    },
    {
      run_timestamp: '2025-06-12T04:45:00.000Z',
      run_status: 'completed',
      description: 'Prepared excel file with analysis notes',
      human_msg: 'Prepared excel file with analysis notes',
      resume_at: '',
      step_id: 3,
      subtask_due_date: '2025-03-31T00:00:00.000Z',
      subtask_id: 'q3-2025-3',
      subtask_name: 'Q3 2025'
    }
  ];

  if (loading) {
    return (
      <Layout style={{ minHeight: '100vh', background: '#f5f5f5' }}>
        <Header />
        <Content style={{ padding: '24px', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
          <Spin size="large" />
        </Content>
      </Layout>
    );
  }

  if (!action) {
    return (
      <Layout style={{ minHeight: '100vh', background: '#f5f5f5' }}>
        <Header />
        <Content style={{ padding: '24px' }}>
          <Alert
            message="Action not found"
            description="The requested action could not be found."
            type="error"
            showIcon
          />
        </Content>
      </Layout>
    );
  }

  const { objective, subject, body, holidays, recipientName } = parseInstructions(action.instructions);
  const runsData = action.action_runs.length > 0 ? action.action_runs : [];

  return (
    <Layout style={{ minHeight: '100vh', background: '#f5f5f5' }}>
      <Header />
      <Content style={{ padding: '24px' }}>
        <div style={{ maxWidth: '1400px', margin: '0 auto' }}>
          {/* Header Section */}
          <div style={{ marginBottom: '24px' }}>
            <Button
              type="text"
              icon={<ArrowLeftOutlined />}
              onClick={() => navigate(-1)}
              style={{ padding: '4px 8px', marginBottom: '16px' }}
            >
              Back
            </Button>
            <Title level={2} style={{ margin: '0 0 8px 0', fontSize: '24px', fontWeight: 600 }}>
              {action.action_name}
            </Title>
            <Text type="secondary" style={{ fontSize: '14px', display: 'block', marginBottom: '16px' }}>
              {action.task_name}
            </Text>
            
            {/* Info Cards Row */}
            <Row gutter={16} style={{ marginBottom: '24px' }}>
              {/* Last run date & time card */}
              <Col xs={24} sm={8}>
                <Card 
                  style={{ 
                    borderRadius: '8px', 
                    border: '1px solid #e8e8e8',
                    boxShadow: '0 1px 2px rgba(0,0,0,0.04)',
                    height: '100%'
                  }}
                  bodyStyle={{ padding: '16px' }}
                >
                  <Text type="secondary" style={{ fontSize: '12px', display: 'block', marginBottom: '8px' }}>
                    Last run date & time
                  </Text>
                  <Text strong style={{ fontSize: '14px' }}>
                    {runsData[0]?.run_timestamp 
                      ? dayjs(runsData[0].run_timestamp).format('MM/DD/YYYY | hh:mm A')
                      : '06/12/2025 | 04:45 pm'
                    }
                  </Text>
                </Card>
              </Col>
              
              {/* Trigger type card */}
              <Col xs={24} sm={8}>
                <Card 
                  style={{ 
                    borderRadius: '8px', 
                    border: '1px solid #e8e8e8',
                    boxShadow: '0 1px 2px rgba(0,0,0,0.04)',
                    height: '100%'
                  }}
                  bodyStyle={{ padding: '16px' }}
                >
                  <Text type="secondary" style={{ fontSize: '12px', display: 'block', marginBottom: '8px' }}>
                    Trigger type
                  </Text>
                  <Tag 
                    color={action.trigger_type === 'relative' ? 'green' : 'blue'}
                    style={{ 
                      textTransform: 'capitalize',
                      borderRadius: '16px',
                      padding: '4px 12px',
                      fontSize: '12px',
                      fontWeight: '500'
                    }}
                  >
                    {action.trigger_type}
                  </Tag>
                </Card>
              </Col>
              
              {/* Capabilities card */}
              <Col xs={24} sm={8}>
                <Card 
                  style={{ 
                    borderRadius: '8px', 
                    border: '1px solid #e8e8e8',
                    boxShadow: '0 1px 2px rgba(0,0,0,0.04)',
                    height: '100%'
                  }}
                  bodyStyle={{ padding: '16px' }}
                >
                  <Text type="secondary" style={{ fontSize: '12px', display: 'block', marginBottom: '8px' }}>
                    Capabilities
                  </Text>
                  <Space wrap size="small">
                    {action.tools_used.map((tool, index) => (
                      <Tag 
                        key={index} 
                        color="processing"
                        style={{
                          borderRadius: '16px',
                          padding: '4px 12px',
                          fontSize: '12px',
                          fontWeight: '500',
                          cursor: 'pointer'
                        }}
                      >
                        {tool}
                      </Tag>
                    ))}
                  </Space>
                </Card>
              </Col>
            </Row>
          </div>

          {/* Main Layout */}
          <Row gutter={24} style={{ alignItems: 'stretch' }}>
            {/* Left Column - Tabs */}
            <Col xs={24} lg={16}>
              <Card style={{ borderRadius: '8px', boxShadow: '0 2px 8px rgba(0,0,0,0.06)', height: '100%' }}>
                <Tabs 
                  activeKey={activeTab} 
                  onChange={setActiveTab}
                  items={[
                    {
                      key: 'runs-history',
                      label: 'Runs history',
                      children: (
                        <div>
                          <Table
                            columns={runsColumns}
                            dataSource={runsData}
                            rowKey={(record, index) => `${record.subtask_id}-${index}`}
                            pagination={false}
                            size="middle"
                            bordered
                          />
                        </div>
                      ),
                    },
                    {
                      key: 'process-notes',
                      label: 'Processing notes',
                      children: (
                        <div style={{ padding: '16px' }}>
                          <div style={{ marginBottom: '16px' }}>
                            <Text strong style={{ display: 'block', marginBottom: '8px' }}>Objective</Text>
                            <Text>{objective}</Text>
                          </div>

                          {/* add a action_instructions data UI below where xponance holdiays should not come as its below */}

                          <div style={{ marginBottom: '16px' }}>
                            <Text strong style={{ display: 'block', marginBottom: '8px' }}>Instructions</Text>
                            <Text>{action.instructions.split('\n').map((line, index) => (
                              <Text key={index}>{line}</Text>
                            ))}</Text>
                          </div>
                          
                          <div>
                            <Text strong style={{ display: 'block', marginBottom: '8px' }}>Xponance holidays</Text>
                            <Collapse 
                              size="small"
                              items={[{
                                key: 'holidays',
                                label: `${holidays.length} holidays`,
                                children: (
                                  <ul style={{ paddingLeft: '20px', margin: 0 }}>
                                    {holidays.map((holiday, idx) => (
                                      <li key={idx}>{holiday.replace(/^-\s*/, '')}</li>
                                    ))}
                                  </ul>
                                )
                              }]}
                            />
                          </div>
                        </div>
                      ),
                    },
                  ]}
                />
              </Card>
            </Col>

            {/* Right Column - Details Sidebar */}
            <Col xs={24} lg={8}>
              <DetailsSidebar
                statusCounts={sidebarData.statusCounts}
                totalItems={sidebarData.totalSubtasks}
                donePercentage={sidebarData.donePercentage}
                category={sidebarData.category}
                nextDueDate={sidebarData.nextDueDate}
                frequency={sidebarData.frequency}
                description={sidebarData.description}
                totalSubtasks={sidebarData.totalSubtasks}
                occurrences={sidebarData.occurrences}
              />
            </Col>
          </Row>
        </div>
      </Content>
    </Layout>
  );
};

export default ActionDetail;
