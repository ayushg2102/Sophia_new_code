import React, { useEffect, useState } from 'react';
import { Layout, Row, Col, Typography, Button, Card, Tag, Tabs } from 'antd';
import { useNavigate } from 'react-router-dom';
import { 
  CheckCircleOutlined, 
  ClockCircleOutlined, 
  AlertOutlined, 
  PlayCircleOutlined,
  PlusOutlined
} from '@ant-design/icons';
import Header from '../../components/Header/Header';
import MetricCard from '../../components/Dashboard/MetricCard';
import CreateTaskModal from '../../components/CreateTaskModal/CreateTaskModal';
import { mockDashboardMetrics, mockTasks } from '../../data/mockData';
import { Task } from '../../types';
import './Dashboard.css';

const { Content } = Layout;
const { Title, Text } = Typography;

// Define categories from tasks.json
const CATEGORIES = [
  {
    key: 'Alerts & Monitoring - Compliance'  },
  {
    key: 'Compliance Client Declarations'  },
  {
    key: 'Compliance Reminders Management'  },
  {
    key: 'Compliance Reviews'  },
  {
    key: 'Document Analysis and Information Gathering'  },
  {
    key: 'Industry Trend Analysis & Updates'  },
  {
    key: 'Regulatory Form Filing'  },
];

const Dashboard: React.FC = () => {
  const [createModalVisible, setCreateModalVisible] = useState(false);
  const [tasks, setTasks] = useState<Task[]>(mockTasks);
  const navigate = useNavigate();

  const handleCreateTask = (taskData: any) => {
    const newTask: Task = {
      task_id: `task-${Date.now()}`,
      task_category: taskData.category,
      task_short_description: taskData.task_name,
      frequency: taskData.frequency,
      task_due_date: taskData.due_date,
      status: 'active',
      description: taskData.description,
      subtasks: taskData.subtasks.map((subtask: any, index: number) => ({
        subtask_id: `subtask-${Date.now()}-${index}`,
        subtask_short_description: subtask.name,
        status: 'due',
        period_considered: 'TBD',
        employees_analyzed: 0,
        employee_contributions: []
      }))
    };
    
    setTasks([newTask, ...tasks]);
  };

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const response = await fetch('https://sophia.xponance.com/api/all-task-master');
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        const dynamicTaskData:any=[];
        data.data.forEach((item:any) => {
          dynamicTaskData.push({
            task_id: item.task_id,
            task_category: item["Task Category"],
            task_short_description: item.task_short_description,
            frequency: item.Frequency,
            task_due_date: item.task_due_date,
            status: 'active',
            description: item.RPY_Com,
            subtasks: []
          })
        })
        setTasks(dynamicTaskData);
      } catch (err) {
        console.error('Error fetching tasks:', err);
        // setError('Failed to load tasks. Please try again later.');
        setTasks([]);
      } finally {
        // setLoading(false);
      }
    };

    fetchTasks();
  }, []);

  const handleTaskClick = (taskId: string) => {
    console.log(taskId,"TAKAKS")
    navigate(`/task/${taskId}`);
  };

  return (
    <Layout className="dashboard-layout" style={{ background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)' }}>
      <Header />
      <Content className="dashboard-content">
        <div className="dashboard-container">
          <div className="dashboard-header">
            <div>
              <Title level={2} className="dashboard-title">
                Dashboard
              </Title>
              {/* <Text className="dashboard-subtitle">
                Manage your compliance tasks, automate workflows, and track progress across all business units
              </Text> */}
            </div>
            <Button 
              type="primary" 
              icon={<PlusOutlined />} 
              size="large"
              className="create-task-btn"
              onClick={() => setCreateModalVisible(true)}
            >
              Create New Task
            </Button>
          </div>

          <Row gutter={[16, 16]} className="metrics-row">
            <Col xs={24} sm={12} md={6}>
              <MetricCard
                title="Sub-Tasks Completed"
                value={mockDashboardMetrics.active_tasks}
                icon={<PlayCircleOutlined />}
                color="#1677ff"
                suffix="From Last Month"
              />
            </Col>
            <Col xs={24} sm={12} md={6}>
              <MetricCard
                title="Overdue Sub-Tasks"
                value={mockDashboardMetrics.due_this_week}
                icon={<ClockCircleOutlined />}
                color="#faad14"
                suffix="Overdue"
              />
            </Col>
            <Col xs={24} sm={12} md={6}>
              <MetricCard
                title="Active Employees"
                value={mockDashboardMetrics.completed}
                icon={<CheckCircleOutlined />}
                color="#52c41a"
                suffix="This Month"
              />
            </Col>
            <Col xs={24} sm={12} md={6}>
              <MetricCard
                title="Pending Actions"
                value={mockDashboardMetrics.actions_pending}
                icon={<AlertOutlined />}
                color="#ff4d4f"
                suffix="Automated Workflows"
              />
            </Col>
          </Row>

          {/* Category Overview Section */}
          {/* Removed the All Categories square card section as per new requirements */}

          <Row gutter={24} className="main-content">
            <Col xs={24} lg={24}>
              <div className="tasks-section">
                <h2 className="category-heading">Tasks</h2>
                <Tabs
                  tabPosition="left"
                  style={{ 
                    background: '#fff',
                    borderRadius: 16,
                    overflow: 'hidden',
                    boxShadow: '0 2px 12px rgba(0,0,0,0.07)'
                  }}
                  className="category-tabs"
                  tabBarStyle={{
                    textAlign: 'left',
                    padding: '8px 0'
                  }}
                  items={CATEGORIES.map(category => {
                    const categoryTasks = tasks.filter((task) => task.task_category === category.key);
                    return {
                      label: (
                        <span>
                          {category.key} <span style={{ color: '#8c8c8c' }}>({categoryTasks.length})</span>
                        </span>
                      ),
                      key: category.key,
                      children: (
                        <div>
                          {/* <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
                            <Title level={4} style={{ margin: 0 }}>{category.key}</Title>
                            <Button type="link" onClick={() => navigate(`/all-tasks?category=${encodeURIComponent(category.key)}`)} style={{ fontWeight: 500 }}>
                              View All
                            </Button>
                          </div> */}
                          <Row gutter={[24, 24]}>
                            {categoryTasks.length === 0 ? (
                              <Col span={24} style={{ textAlign: 'left', color: '#aaa' }}>
                                <Text type="secondary">No tasks in this category.</Text>
                              </Col>
                            ) : (
                              categoryTasks.map((task) => (
                                <Col xs={24} sm={12} md={8} lg={6} key={task.task_id}>
                                  <Card
                                    className="task-square-card"
                                    hoverable
                                    style={{
                                      borderRadius: 12,
                                      boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
                                      minHeight: 180,
                                      display: 'flex',
                                      flexDirection: 'column',
                                      justifyContent: 'flex-start',
                                      alignItems: 'center',
                                      cursor: 'pointer',
                                      textAlign: 'center',
                                    }}
                                    onClick={() =>{
                                      console.log(task,"123")
                                      handleTaskClick(task.task_id)}
                                    } 
                                  >
                                    <Title level={5} style={{ marginBottom: 8 }}>{task.task_short_description}</Title>
                                    <Text type="secondary" style={{ marginBottom: 8, display: 'block' }}>
                                      {task.task_short_description}
                                    </Text>
                                    <div style={{ marginTop: 8 }}>
                                      <Tag color={task.frequency === 'Daily' ? 'yellow' : 'default'}>{task.frequency}</Tag>
                                    </div>
                                  </Card>
                                </Col>
                              ))
                            )}
                          </Row>
                        </div>
                      ),
                    };
                  })}
                />
              </div>
            </Col>
            
            {/* <Col xs={24} lg={9}>
              <div className="action-center">
                <div className="section-header">
                  <div className="section-title-container">
                    <AlertOutlined className="section-icon" />
                    <Title level={4} className="section-title">Action Center</Title>
                  </div>
                  <Button 
                    type="text" 
                    size="small"
                    onClick={handleViewAllTasks}
                  >
                    View All
                  </Button>
                </div>
                
                <div className="action-metrics">
                  <Row gutter={8}>
                    <Col span={8}>
                      <div className="action-metric">
                        <div className="action-metric-value success">12</div>
                        <div className="action-metric-label">Successful</div>
                      </div>
                    </Col>
                    <Col span={8}>
                      <div className="action-metric">
                        <div className="action-metric-value warning">3</div>
                        <div className="action-metric-label">Pending</div>
                      </div>
                    </Col>
                    <Col span={8}>
                      <div className="action-metric">
                        <div className="action-metric-value error">1</div>
                        <div className="action-metric-label">Failed</div>
                      </div>
                    </Col>
                  </Row>
                </div>
                
                <div className="recent-actions">
                  <Title level={5} className="actions-subtitle">Recent Action Runs</Title>
                  <div className="action-items">
                    <div className="action-item">
                      <div className="action-item-content">
                        <div className="action-item-title">Send calendar invites for risk assessment meetings</div>
                        <div className="action-item-time">Mar 17, 02:30 PM</div>
                      </div>
                      <Tag color="green" size="small">Successful</Tag>
                    </div>
                    <div className="action-item">
                      <div className="action-item-content">
                        <div className="action-item-title">Send calendar invites for risk assessment meetings</div>
                        <div className="action-item-time">Mar 16, 10:30 PM</div>
                      </div>
                      <Tag color="green" size="small">Successful</Tag>
                    </div>
                  </div>
                  
                  <Button type="dashed" block className="configure-action-btn">
                    <SettingOutlined /> Configure New Action
                  </Button>
                </div>
                
                <div className="upcoming-tasks">
                  <div className="section-header-small">
                    <CalendarOutlined className="section-icon-small" />
                    <Title level={5} className="section-title-small">Upcoming Tasks</Title>
                    <Button type="text" size="small">View All</Button>
                  </div>
                  
                  <div className="upcoming-task-items">
                    <div className="upcoming-task-item">
                      <div className="upcoming-task-indicator risk"></div>
                      <div className="upcoming-task-content">
                        <div className="upcoming-task-title">Risk Assessment</div>
                        <div className="upcoming-task-meta">
                          <CalendarOutlined /> 30 days overdue
                        </div>
                      </div>
                      <Tag color="orange">Progress</Tag>
                    </div>
                    <div className="upcoming-task-item">
                      <div className="upcoming-task-indicator risk"></div>
                      <div className="upcoming-task-content">
                        <div className="upcoming-task-title">Risk Assessment</div>
                        <div className="upcoming-task-meta">
                          <CalendarOutlined /> Due
                        </div>
                      </div>
                      <Tag color="orange">Due</Tag>
                    </div>
                    <div className="upcoming-task-item">
                      <div className="upcoming-task-indicator risk"></div>
                      <div className="upcoming-task-content">
                        <div className="upcoming-task-title">Risk Assessment</div>
                        <div className="upcoming-task-meta">
                          <CalendarOutlined /> 30 days overdue
                        </div>
                      </div>
                      <Tag color="orange">Due</Tag>
                    </div>
                  </div>
                </div>
              </div>
            </Col> */}
          </Row>
        </div>
      </Content>

      <CreateTaskModal
        visible={createModalVisible}
        onClose={() => setCreateModalVisible(false)}
        onSubmit={handleCreateTask}
      />
    </Layout>
  );
};

export default Dashboard;