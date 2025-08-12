import React, { useEffect, useState } from 'react';
import { Layout, Row, Col, Typography, Card, Tag, Tabs, Input, Button, Table } from 'antd';
import { useNavigate } from 'react-router-dom';
import { 
  SearchOutlined,
  AppstoreOutlined,
  UnorderedListOutlined,
  RightOutlined
} from '@ant-design/icons';
import Header from '../../components/Header/Header';
import CreateTaskModal from '../../components/CreateTaskModal/CreateTaskModal';
import { mockTasks } from '../../data/mockData';
import { Task } from '../../types';
import './Dashboard.css';

const { Content } = Layout;
const { Title, Text } = Typography;

// Define categories from tasks.json
const CATEGORIES = [
  {
    key: 'Categories'
  },
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
    {
      key:'Regulatory Monitoring & Updates'
    }
];

const Dashboard: React.FC = () => {
  const [createModalVisible, setCreateModalVisible] = useState(false);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [viewMode, setViewMode] = useState<'card' | 'list'>('card');
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
        const response = await fetch('/api/tasks');
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        console.log("Fetched tasks:", data.data.tasks);
        
        // Transform the tasks (without sorting here)
        const dynamicTaskData = data.data.tasks.map((item: any) => ({
          task_id: item.task_id,
          task_category: item["Task Category"],
          task_short_description: (item.task_short_description || '').trim(),
          frequency: item.Frequency || '',
          task_due_date: item.task_due_date || '',
          status: 'active',
          description: item.RPY_Com || '',
          subtasks: []
        }));

        setTasks(dynamicTaskData);
      } catch (err) {
        console.error('Error fetching tasks:', err);
        setTasks([]);
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
              {/* <Title level={2} className="dashboard-title">
                Dashboard
              </Title> */}
              {/* <Text className="dashboard-subtitle">
                Manage your compliance tasks, automate workflows, and track progress across all business units
              </Text> */}
            </div>
            {/* <Button 
              type="primary" 
              icon={<PlusOutlined />} 
              size="large"
              className="create-task-btn"
              onClick={() => setCreateModalVisible(true)}
            >
              Create New Task
            </Button> */}
          </div>

          {/* <Row gutter={[16, 16]} className="metrics-row">
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
          </Row> */}

          {/* Category Overview Section */}
          {/* Removed the All Categories square card section as per new requirements */}

          <Row gutter={24} className="main-content">
            <Col xs={24} lg={24}>
              <div className="tasks-section">
                <div className="tasks-header">
                  <h2 className="category-heading">Dashboard</h2>
                  <div className="header-controls">
                    <Button.Group style={{ marginRight: 16 }}>
                      <Button
                        type={viewMode === 'card' ? 'primary' : 'default'}
                        icon={<AppstoreOutlined />}
                        onClick={() => setViewMode('card')}
                        size="small"
                      >
                        Card
                      </Button>
                      <Button
                        type={viewMode === 'list' ? 'primary' : 'default'}
                        icon={<UnorderedListOutlined />}
                        onClick={() => setViewMode('list')}
                        size="small"
                      >
                        List
                      </Button>
                    </Button.Group>
                    <Input
                      placeholder="Search tasks..."
                      prefix={<SearchOutlined />}
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      style={{
                        width: 300,
                        borderRadius: 8
                      }}
                      allowClear
                    />
                  </div>
                </div>
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
                  defaultActiveKey="Alerts & Monitoring - Compliance"
                  items={CATEGORIES
                    .filter(category => {
                      // Always show "Categories" as it's a heading
                      if (category.key === 'Categories') return true;
                      
                      // Only show categories that have matching tasks when searching
                      if (!searchTerm.trim()) return true;
                      const categoryTasks = tasks.filter(task => task.task_category === category.key);
                      return categoryTasks.some(task =>
                        task.task_short_description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                        task.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                        task.frequency?.toLowerCase().includes(searchTerm.toLowerCase())
                      );
                    })
                    .map(category => {
                    // Filter and sort tasks for this category
                    let categoryTasks = tasks
                      .filter((task) => task.task_category === category.key)
                      .sort((a, b) => 
                        (a.task_short_description || '').trim().localeCompare((b.task_short_description || '').trim())
                      );

                    // Apply search filter if search term exists
                    if (searchTerm.trim()) {
                      categoryTasks = categoryTasks.filter((task) =>
                        task.task_short_description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                        task.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                        task.frequency?.toLowerCase().includes(searchTerm.toLowerCase())
                      );
                    }

                    return {
                      label: (
                        <span>
                          {category.key === 'Categories' ? (
                            <span style={{ fontSize: '18px', color: '#000000', fontWeight: 'bold' }}>
                              {category.key}
                            </span>
                          ) : (
                            <>
                              {category.key} <span style={{ color: '#8c8c8c' }}>({categoryTasks.length})</span>
                            </>
                          )}
                        </span>
                      ),
                      key: category.key,
                      disabled: category.key === 'Categories',
                      children: category.key === 'Categories' ? null : (
                        <div>
                          <div style={{ maxHeight: 'calc(100vh - 90px)', overflowY: 'auto', overflowX: 'hidden', width: '100%' }}>
                            {viewMode === 'card' ? (
                              <Row gutter={[16, 16]} style={{ margin: 0, width: '100%' }}>
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
                            ) : (
                              <Table
                                dataSource={categoryTasks}
                                pagination={false}
                                size="middle"
                                rowKey="task_id"
                                style={{ background: 'white' }}
                                columns={[
                                  {
                                    title: 'Task',
                                    dataIndex: 'task_short_description',
                                    key: 'task',
                                    ellipsis: true,
                                    render: (text: string) => (
                                      <span style={{ fontWeight: 500 }}>{text}</span>
                                    ),
                                  },
                                  {
                                    title: 'Frequency',
                                    dataIndex: 'frequency',
                                    key: 'frequency',
                                    width: 120,
                                    render: (frequency: string) => (
                                      <Tag color={frequency === 'Daily' ? 'yellow' : frequency === 'Weekly' ? 'orange' : frequency === 'Monthly' ? 'blue' : 'default'}>
                                        {frequency}
                                      </Tag>
                                    ),
                                  },
                                  {
                                    title: 'Status',
                                    dataIndex: 'status',
                                    key: 'status',
                                    width: 100,
                                    render: (status: string) => (
                                      <Tag color={status === 'active' ? 'blue' : status === 'completed' ? 'green' : 'orange'}>
                                        {status === 'active' ? 'Active' : status === 'completed' ? 'Done' : 'Pending'}
                                      </Tag>
                                    ),
                                  },
                                  {
                                    title: 'Actions',
                                    key: 'actions',
                                    width: 80,
                                    render: (_, task) => (
                                      <Button
                                        type="text"
                                        icon={<RightOutlined />}
                                        onClick={() => handleTaskClick(task.task_id)}
                                        style={{ color: '#1677ff' }}
                                      />
                                    ),
                                  },
                                ]}
                              />
                            )}
                          </div>
                        </div>
                      ),
                    };
                  })}
                />
              </div>
            </Col>
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