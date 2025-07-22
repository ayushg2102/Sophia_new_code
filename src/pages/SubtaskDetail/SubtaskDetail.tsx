import React, { useState } from 'react';
import { Layout, Card, Tag, Button, Typography, Divider, Table, Input, List, Tooltip, message, Dropdown } from 'antd';
import { ArrowLeftOutlined, CalendarOutlined, ClockCircleOutlined, UserOutlined, SearchOutlined, InfoCircleOutlined, CopyOutlined } from '@ant-design/icons';
import { useParams, useNavigate } from 'react-router-dom';
import Header from '../../components/Header/Header';
import { mockTasks } from '../../data/mockData';
import { Subtask, EmployeeContribution, Task } from '../../types';
import dayjs from 'dayjs';
import './SubtaskDetail.css';

const { Content } = Layout;
const { Title, Text } = Typography;

// Utility to convert instructions to HTML (basic)
function instructionsToHtml(instructions: string) {
  // Simple: replace line breaks with <br/>
  return instructions.replace(/\n/g, '<br/>');
}

const SubtaskDetail: React.FC = () => {
  const { subtaskId } = useParams<{ subtaskId: string }>();
  const navigate = useNavigate();
  const [searchText, setSearchText] = useState('');

  // Find the subtask across all tasks
  let subtask: Subtask | undefined;
  let parentTask: Task | undefined;
  
  for (const task of mockTasks) {
    const found = task.subtasks?.find(s => s.subtask_id === subtaskId);
    if (found) {
      subtask = found;
      parentTask = task;
      break;
    }
  }

  if (!subtask) {
    return (
      <Layout>
        <Header />
        <Content style={{ padding: '24px' }}>
          <div>Subtask not found</div>
        </Content>
      </Layout>
    );
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'green';
      case 'in-progress': return 'blue';
      case 'due': return 'orange';
      default: return 'default';
    }
  };

  const handleBackClick = () => {
    if (parentTask) {
      navigate(`/task/${parentTask.task_id}`);
    } else {
      navigate('/dashboard');
    }
  };

  const filteredEmployees = subtask.employee_contributions?.filter(employee =>
    employee.name.toLowerCase().includes(searchText.toLowerCase())
  ) || [];

  const columns = [
    {
      title: 'Name',
      dataIndex: 'name',
      key: 'name',
      sorter: (a: EmployeeContribution, b: EmployeeContribution) => 
        a.name.localeCompare(b.name),
      render: (text: string) => <Text strong>{text}</Text>,
    },
    {
      title: 'Latest Contribution ($)',
      dataIndex: 'latest_contribution',
      key: 'latest_contribution',
      sorter: (a: EmployeeContribution, b: EmployeeContribution) => 
        a.latest_contribution - b.latest_contribution,
      render: (amount: number) => 
        amount === 0 ? <Text type="secondary">0</Text> : `$${amount.toLocaleString()}`,
    },
    {
      title: 'Latest Contribution Date',
      dataIndex: 'latest_contribution_date',
      key: 'latest_contribution_date',
      sorter: (a: EmployeeContribution, b: EmployeeContribution) => {
        if (!a.latest_contribution_date) return 1;
        if (!b.latest_contribution_date) return -1;
        return dayjs(a.latest_contribution_date).unix() - dayjs(b.latest_contribution_date).unix();
      },
      render: (date: string | null) => 
        date ? dayjs(date).format('MMM DD, YYYY') : <Text type="secondary">N/A</Text>,
    },
    {
      title: 'YTD Contribution ($)',
      dataIndex: 'ytd_contribution',
      key: 'ytd_contribution',
      sorter: (a: EmployeeContribution, b: EmployeeContribution) => 
        a.ytd_contribution - b.ytd_contribution,
      render: (amount: number) => 
        amount === 0 ? <Text type="secondary">0</Text> : `$${amount.toLocaleString()}`,
    },
  ];

  // --- Modern Instructions UI ---
  // fallback for array or no instructions
  let steps: string[] = [];
  if (Array.isArray(subtask.instructions)) {
    steps = subtask.instructions;
  } else if (typeof subtask.instructions === 'string' && subtask.instructions.trim()) {
    // Try to split by numbered steps (e.g., '1.', '2.', etc.)
    const regex = /\s*\d+\.[^\d]*/g;
    const matches = subtask.instructions.match(regex);
    if (matches && matches.length > 1) {
      // Split by numbered steps
      steps = subtask.instructions.split(/\s*\d+\./).filter(Boolean).map(s => s.trim());
    } else {
      // Fallback: split by newlines
      steps = subtask.instructions.split(/\n|\r/).filter(Boolean).map(s => s.trim());
    }
  }

  return (
    <Layout className="subtask-detail-layout">
      <Header />
      <Content className="subtask-detail-content">
        <div className="subtask-detail-container">
          <div className="subtask-detail-header">
            <Button 
              icon={<ArrowLeftOutlined />} 
              onClick={handleBackClick}
              className="back-button"
            >
              Back to Task
            </Button>
          </div>
          

          <Card className="subtask-info-card">
            <div className="subtask-info-header">
              <div>
                <Title level={2} className="subtask-title">
                  {subtask.subtask_short_description}
                </Title>
                <Text className="parent-task">
                  {parentTask?.task_short_description} • {parentTask?.task_category}
                </Text>
              </div>
              <Tag color={getStatusColor(subtask.status)} className="status-tag">
                {subtask.status.charAt(0).toUpperCase() + subtask.status.slice(1)}
              </Tag>
            </div>

            <Divider />
            {/* add a dropdown taking full width it will contain runDate like this : RunDate – Jul 15, 2025 | Period Covered – Jul 8, 2025 to Jul 14, 2025 add 4 values*/}
            <Dropdown className='mb-5' menu={{
              items: [
                  {
                    key: '1',
                    label: 'RunDate – Jul 15, 2025 | Period Covered – Jul 8, 2025 to Jul 14, 2025',
                  },
                  {
                    key: '2',
                    label: 'RunDate – Jul 14, 2025 | Period Covered – Jul 7, 2025 to Jul 13, 2025',
                  },
                  {
                    key: '3',
                    label: 'RunDate – Jul 13, 2025 | Period Covered – Jul 6, 2025 to Jul 12, 2025',
                  }
              ],
            }}>
              <Button>RunDate – Jul 15, 2025 | Period Covered – Jul 8, 2025 to Jul 14, 2025</Button>
            </Dropdown>
            {/* Modern Instructions Section */}
            <div style={{ padding: '16px 0'  }} className='mt-5'>
              <Typography.Title level={5} style={{ marginBottom: 12, display: 'flex', alignItems: 'center', gap: 8 }}>
                <span style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  width: 32,
                  height: 32,
                  borderRadius: '50%',
                  border: '2px solid #1890ff',
                  background: '#fff',
                  marginRight: 8,
                }}>
                  <InfoCircleOutlined style={{ color: '#1890ff', fontSize: 20 }} />
                </span>
                Instructions
              </Typography.Title>
              {(() => {
                if (typeof subtask.instructions === 'string' && subtask.instructions.trim()) {
                  const safeInstructions = subtask.instructions || '';
                  return (
                    <Card
                      bordered={false}
                      style={{
                        background: 'linear-gradient(90deg, #f0f7ff 0%, #e6f7ff 100%)',
                        boxShadow: '0 2px 12px rgba(24, 144, 255, 0.08)',
                        borderRadius: 10,
                        marginBottom: 16,
                        padding: 0,
                      }}
                      bodyStyle={{ padding: 0 }}
                    >
                      <div style={{
                        padding: '18px 24px',
                        fontSize: 17,
                        color: '#222',
                        lineHeight: 1.7,
                        fontFamily: 'Segoe UI, Arial, sans-serif',
                        position: 'relative',
                        minHeight: 48,
                        wordBreak: 'break-word',
                      }}>
                        <div dangerouslySetInnerHTML={{ __html: instructionsToHtml(safeInstructions) }} />
                        <Tooltip title="Copy all instructions">
                          <Button
                            shape="circle"
                            icon={<CopyOutlined />}
                            size="small"
                            style={{ position: 'absolute', top: 12, right: 16, background: '#e6f7ff', border: 'none' }}
                            onClick={() => {
                              navigator.clipboard.writeText(safeInstructions);
                              message.success('Instructions copied!');
                            }}
                          />
                        </Tooltip>
                      </div>
                    </Card>
                  );
                }
                if (steps.length > 0) {
                  return (
                    <Card
                      bordered={false}
                      style={{
                        background: 'linear-gradient(90deg, #f0f7ff 0%, #e6f7ff 100%)',
                        boxShadow: '0 2px 12px rgba(24, 144, 255, 0.08)',
                        borderRadius: 10,
                        marginBottom: 16,
                        padding: 0,
                      }}
                      bodyStyle={{ padding: 0 }}
                    >
                      <div style={{
                        padding: '18px 24px',
                        fontSize: 17,
                        color: '#222',
                        lineHeight: 1.7,
                        fontFamily: 'Segoe UI, Arial, sans-serif',
                        position: 'relative',
                        minHeight: 48,
                        wordBreak: 'break-word',
                      }}>
                        <List
                          itemLayout="horizontal"
                          dataSource={steps}
                          renderItem={(item, idx) => (
                            <List.Item style={{ padding: '14px 0', border: 'none', alignItems: 'flex-start', background: idx % 2 === 0 ? '#f7fbff' : '#e6f7ff', borderRadius: 8, marginBottom: 6 }}>
                              <List.Item.Meta
                                avatar={<span style={{ fontWeight: 700, color: '#1677ff', fontSize: 22, minWidth: 32, display: 'inline-block', textAlign: 'right', fontFamily: 'Montserrat, Segoe UI, Arial, sans-serif' }}>{idx + 1}.</span>}
                                description={<span style={{ fontSize: 18, color: '#222', fontFamily: 'Montserrat, Segoe UI, Arial, sans-serif', letterSpacing: 0.1, lineHeight: 1.8 }}>{item}</span>}
                              />
                            </List.Item>
                          )}
                        />
                        <Tooltip title="Copy all instructions">
                          <Button
                            shape="circle"
                            icon={<CopyOutlined />}
                            size="small"
                            style={{ position: 'absolute', top: 12, right: 16, background: '#e6f7ff', border: 'none' }}
                            onClick={() => {
                              navigator.clipboard.writeText(steps.map((s, i) => `${i + 1}. ${s}`).join('\n'));
                              message.success('Instructions copied!');
                            }}
                          />
                        </Tooltip>
                      </div>
                    </Card>
                  );
                } else {
                  return (
                    <div style={{ color: '#888', fontStyle: 'italic', fontSize: 16, padding: '18px 24px', background: '#fafafa', borderRadius: 8, border: '1px solid #eee' }}>
                      No instructions provided.
                    </div>
                  );
                }
              })()}
            </div>

            <div className="subtask-metrics">
              <div className="metric-item">
                <CalendarOutlined className="metric-icon" />
                <div>
                  <Text strong>Started At</Text>
                  <br />
                  <Text>
                    {subtask.started_at ? dayjs(subtask.started_at).format('MM/DD/YYYY HH:mm') : 'Not started'}
                  </Text>
                </div>
              </div>

              <div className="metric-item">
                <ClockCircleOutlined className="metric-icon" />
                <div>
                  <Text strong>Duration</Text>
                  <br />
                  <Text>{subtask.duration || 'N/A'}</Text>
                </div>
              </div>

              <div className="metric-item">
                <UserOutlined className="metric-icon" />
                <div>
                  <Text strong>Employees Analyzed</Text>
                  <br />
                  <Text>{subtask.employees_analyzed || 0}</Text>
                </div>
              </div>

              <div className="metric-item">
                <CalendarOutlined className="metric-icon" />
                <div>
                  <Text strong>Period Considered</Text>
                  <br />
                  <Text>{subtask.period_considered || 'N/A'}</Text>
                </div>
              </div>
            </div>

            {subtask.completed_at && (
              <div className="completion-info">
                <Text strong>Completed At: </Text>
                <Text>{dayjs(subtask.completed_at).format('MM/DD/YYYY HH:mm')}</Text>
              </div>
            )}
          </Card>

          <Card className="employees-card">
            <div className="employees-header">
              <Title level={3} className="employees-title">
                Employee Contributions
              </Title>
              <Input
                placeholder="Search by name..."
                prefix={<SearchOutlined />}
                value={searchText}
                onChange={(e) => setSearchText(e.target.value)}
                className="employee-search"
                allowClear
              />
            </div>

            <Table
              columns={columns}
              dataSource={filteredEmployees}
              rowKey="name"
              pagination={{
                pageSize: 10,
                showSizeChanger: true,
                showQuickJumper: true,
                showTotal: (total, range) => 
                  `${range[0]}-${range[1]} of ${total} employees`,
              }}
              className="employees-table"
              scroll={{ x: 800 }}
            />
          </Card>
        </div>
      </Content>
    </Layout>
  );
};

export default SubtaskDetail;