import React, { useState, useEffect } from "react";
import {
  Layout,
  Card,
  Table,
  Button,
  Space,
  Typography,
  Row,
  Col,
  Progress,
  Input,
  message,
  Spin,
  List,
  Collapse,
} from "antd";
import {
  ArrowLeftOutlined,
  SearchOutlined,
  LinkOutlined,
  RightOutlined,
  LoadingOutlined,
  ClockCircleOutlined,
  CheckCircleOutlined,
  ExclamationCircleOutlined,
} from "@ant-design/icons";
import { useParams, useNavigate } from "react-router-dom";
import Header from "../../components/Header/Header";
import { Task } from "../../types";

const { Content } = Layout;
const { Title, Text } = Typography;
const { Panel } = Collapse;

// Interface for action data
interface ActionData {
  key: string;
  action: string;
  noOfRuns: number;
  lastRun: string;
  nextRunDue: string;
  status: 'done' | 'ongoing' | 'overdue' | 'due';
}

// Interface for occurrence data
interface OccurrenceData {
  key: string;
  period: string;
  dueDate: string;
  status: 'done' | 'ongoing' | 'overdue' | 'due';
}

const TaskView: React.FC = () => {
  const { taskId } = useParams<{ taskId: string }>();
  const navigate = useNavigate();
  const [task, setTask] = useState<Task | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [searchText, setSearchText] = useState<string>('');
  const [actionsData, setActionsData] = useState<ActionData[]>([]);
  const [taskDetails, setTaskDetails] = useState<any>(null);
  const [expandedRowKeys, setExpandedRowKeys] = useState<readonly React.Key[]>([]);

  useEffect(() => {
    const fetchTaskDetail = async () => {
      setLoading(true);
      try {
        // API call to fetch task details
        const response = await fetch(`/api/sub-task-details/${taskId}`);
        if (response.ok) {
          const apiResponse = await response.json();
          console.log(apiResponse, "API Response");
          
          if (apiResponse.status === 'success' && apiResponse.data) {
            const taskData = apiResponse.data;
            
            // Set task data from API response
            const task: Task = {
              task_id: taskData.task_id,
              task_category: taskData.task_category,
              task_short_description: taskData.task_short_description,
              frequency: taskData.frequency,
              task_due_date: taskData.task_due_date,
              status: taskData.status,
              subtasks: taskData.subtasks || [],
              actions: taskData.actions || []
            };
            setTask(task);
            
            // Set task details for sidebar
            setTaskDetails({
              category: taskData.task_category,
              nextDueDate: taskData.task_due_date,
              frequency: taskData.frequency,
              description: taskData.description,
              // Calculate next due date from subtasks if available
              nextDueDate: taskData.subtasks?.find((st: any) => st.status === 'due')?.due_date || taskData.task_due_date
            });
            
            // Transform actions data for the table
            if (taskData.actions && taskData.actions.length > 0) {
              const transformedActions = taskData.actions.map((action: any, index: number) => ({
                key: action._id || `action-${index}`,
                action: action.action_instruction || action.action_description || 'No description available',
                noOfRuns: 0, // This would need to come from run history if available
                lastRun: action.action_updated_date ? new Date(action.action_updated_date).toLocaleDateString() : '--',
                nextRunDue: action.action_trigger_date ? new Date(action.action_trigger_date).toLocaleDateString() : '--',
                status: action.adjusted_relative_trigger_date ? 
                  (new Date(action.adjusted_relative_trigger_date) < new Date() ? 'overdue' : 'due') : 'due'
              }));
              setActionsData(transformedActions);
            } else {
              setActionsData([]);
            }
          } else {
            throw new Error('Invalid API response format');
          }
        } else {
          throw new Error('Failed to fetch task details');
        }
      } catch (error) {
        console.error('Error fetching task:', error);
        message.error('Failed to load task details');
        // Set empty data on error
        setTask(null);
        setTaskDetails(null);
        setActionsData([]);
      } finally {
        setLoading(false);
      }
    };

    fetchTaskDetail();
  }, [taskId]);

  // Status icon helper
  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'done':
        return <CheckCircleOutlined style={{ color: '#52c41a' }} />;
      case 'ongoing':
        return <LoadingOutlined style={{ color: '#faad14' }} />;
      case 'overdue':
        return <ExclamationCircleOutlined style={{ color: '#ff4d4f' }} />;
      case 'due':
        return <ClockCircleOutlined style={{ color: '#d9d9d9' }} />;
      default:
        return <ClockCircleOutlined style={{ color: '#d9d9d9' }} />;
    }
  };

  // Expandable row render function
  const expandedRowRender = () => {
    const runHistory = [
      { key: '1', runDate: '06/12/2025 | 04:45 pm', executedBy: 'Spencer', status: 'Success', occurrence: 'Q3 2025', dueDate: '03/31/2025' },
      { key: '2', runDate: '06/12/2025 | 04:45 pm', executedBy: 'Spencer', status: 'Success', occurrence: 'Q3 2025', dueDate: '03/31/2025' },
      { key: '3', runDate: '06/12/2025 | 04:45 pm', executedBy: 'Spencer', status: 'Success', occurrence: 'Q3 2025', dueDate: '03/31/2025' }
    ];

    const historyColumns = [
      {
        title: 'Run date & time',
        dataIndex: 'runDate',
        key: 'runDate',
        width: '25%',
      },
      {
        title: 'Executed by',
        dataIndex: 'executedBy',
        key: 'executedBy',
        width: '20%',
        render: (text: string) => (
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <div style={{ width: 24, height: 24, borderRadius: '50%', backgroundColor: '#000', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Text style={{ color: 'white', fontSize: '12px' }}>{text.charAt(0)}</Text>
            </div>
            <Text>{text}</Text>
          </div>
        ),
      },
      {
        title: 'Status',
        dataIndex: 'status',
        key: 'status',
        width: '15%',
        render: (status: string) => (
          <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
            <CheckCircleOutlined style={{ color: '#52c41a' }} />
            <Text style={{ color: '#52c41a' }}>{status}</Text>
          </div>
        ),
      },
      {
        title: 'Occurrence',
        dataIndex: 'occurrence',
        key: 'occurrence',
        width: '20%',
        render: (text: string, record: any) => (
          <div>
            <Text style={{ fontWeight: 500 }}>{text}</Text>
            <br />
            <Text type="secondary" style={{ fontSize: '12px' }}>Due: {record.dueDate}</Text>
          </div>
        ),
      },
      // {
      //   title: '',
      //   key: 'actions',
      //   width: '20%',
      //   render: () => (
      //     <div style={{ display: 'flex', gap: 8 }}>
      //       <Button type="link" icon={<LinkOutlined />} size="small" />
      //       <Button type="link" icon={<RightOutlined />} size="small" />
      //     </div>
      //   ),
      // },
    ];

    return (
      <Table
        columns={historyColumns}
        dataSource={runHistory}
        pagination={false}
        size="small"
        style={{ margin: '0 48px' }}
      />
    );
  };

  // Table columns configuration
  const columns = [
    {
      title: 'Actions',
      dataIndex: 'action',
      key: 'action',
      width: '40%',
      render: (text: string) => {
        // Truncate text to show only "Send a reminder email 1 week before the due date for the Sub task."
        const truncatedText = text.includes('Send a reminder email 1 week before the due date for the Sub task.') 
          ? 'Send a reminder email 1 week before the due date for the Sub task.'
          : text.length > 80 
            ? text.substring(0, 80) + '...'
            : text;
        
        return (
          <Text style={{ fontSize: '14px' }} title={text}>
            {truncatedText}
          </Text>
        );
      },
    },
    {
      title: 'No. of runs',
      dataIndex: 'noOfRuns',
      key: 'noOfRuns',
      width: '15%',
      align: 'center' as const,
      render: (runs: number) => (
        <Text style={{ fontSize: '14px', fontWeight: 500 }}>{runs}</Text>
      ),
    },
    {
      title: 'Last run',
      dataIndex: 'lastRun',
      key: 'lastRun',
      width: '15%',
      align: 'center' as const,
      render: (date: string) => (
        <Text style={{ fontSize: '14px' }}>{date}</Text>
      ),
    },
    {
      title: 'Next run due',
      dataIndex: 'nextRunDue',
      key: 'nextRunDue',
      width: '15%',
      align: 'center' as const,
      render: (date: string) => (
        <Text style={{ fontSize: '14px' }}>{date}</Text>
      ),
    },
    {
      title: '',
      key: 'actions',
      width: '15%',
      align: 'center' as const,
      render: () => (
        <Space size="small">
          <Button
            type="text"
            icon={<LinkOutlined />}
            size="small"
            style={{ color: '#1890ff' }}
          />
          <Button
            type="text"
            icon={<RightOutlined />}
            size="small"
            style={{ color: '#1890ff' }}
          />
        </Space>
      ),
    },
  ];

  // Filter actions based on search text
  const filteredActions = actionsData.filter((item: ActionData) =>
    item.action.toLowerCase().includes(searchText.toLowerCase())
  );

  // Calculate status counts for donut chart
  const statusCounts = {
    done: actionsData.filter((item: ActionData) => item.status === 'done').length,
    ongoing: actionsData.filter((item: ActionData) => item.status === 'ongoing').length,
    overdue: actionsData.filter((item: ActionData) => item.status === 'overdue').length,
    due: actionsData.filter((item: ActionData) => item.status === 'due').length,
  };

  const totalItems = Object.values(statusCounts).reduce((sum, count) => sum + count, 0);
  const donePercentage = totalItems > 0 ? Math.round((statusCounts.done / totalItems) * 100) : 0;

  // Transform subtasks data for occurrences
  const occurrencesData: OccurrenceData[] = task?.subtasks?.map((subtask: any, index: number) => {
    // Extract period from subtask description or use index
    const period = subtask.subtask_short_description?.includes('Quarter') ? 
      subtask.subtask_short_description.split(' - ')[1] || `Period ${index + 1}` : 
      `Period ${index + 1}`;
    
    return {
      key: subtask._id || `subtask-${index}`,
      period: period,
      dueDate: subtask.due_date ? new Date(subtask.due_date).toLocaleDateString() : '--',
      status: subtask.status === 'completed' ? 'done' : 
              subtask.status === 'due' ? 'due' : 
              subtask.status === 'overdue' ? 'overdue' : 'ongoing'
    };
  }) || [];

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

  return (
    <Layout style={{ minHeight: '100vh', background: '#f5f5f5' }}>
      <Header />
      <Content style={{ padding: '24px' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
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
              {task?.task_short_description || 'Social Media Alerts and Monitoring'}
            </Title>
            <Text type="secondary" style={{ fontSize: '14px' }}>
              Alerts & Compliance monitoring
            </Text>
          </div>

          {/* Main Content */}
          <Row gutter={24} style={{ alignItems: 'stretch' }}>
            {/* Left Column - Actions Table */}
            <Col xs={24} lg={16}>
              <Card style={{ borderRadius: '8px', boxShadow: '0 2px 8px rgba(0,0,0,0.06)', height: '100%' }}>
                <div style={{ marginBottom: '16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Text strong style={{ fontSize: '16px' }}>Actions</Text>
                  <Input
                    placeholder="Search actions..."
                    prefix={<SearchOutlined />}
                    value={searchText}
                    onChange={(e) => setSearchText(e.target.value)}
                    style={{ width: '300px' }}
                  />
                </div>
                <Table
                  columns={columns}
                  dataSource={filteredActions}
                  rowKey="key"
                  expandable={{
                    expandedRowRender,
                    expandedRowKeys,
                    onExpandedRowsChange: setExpandedRowKeys,
                  }}
                  pagination={false}
                  size="middle"
                />
              </Card>
            </Col>

            {/* Right Column - Details Sidebar */}
            <Col xs={24} lg={8}>
              <Card 
                title="Details" 
                style={{ 
                  borderRadius: '8px', 
                  boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
                  height: '100%',
                  minHeight: '600px'
                }}
              >
                {/* Donut Chart */}
                <div style={{ textAlign: 'center', marginBottom: '24px' }}>
                  <Progress
                    type="circle"
                    percent={donePercentage}
                    format={() => `${statusCounts.done}/${totalItems}\nDone`}
                    size={120}
                    strokeColor="#52c41a"
                    style={{ marginBottom: '16px' }}
                  />
                  
                  {/* Status Legend */}
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', alignItems: 'flex-start' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <div style={{ width: '12px', height: '12px', borderRadius: '50%', backgroundColor: '#52c41a' }}></div>
                      <Text style={{ fontSize: '14px' }}>{statusCounts.done} Done</Text>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <div style={{ width: '12px', height: '12px', borderRadius: '50%', backgroundColor: '#faad14' }}></div>
                      <Text style={{ fontSize: '14px' }}>{statusCounts.ongoing} Ongoing</Text>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <div style={{ width: '12px', height: '12px', borderRadius: '50%', backgroundColor: '#ff4d4f' }}></div>
                      <Text style={{ fontSize: '14px' }}>{statusCounts.overdue} Overdue</Text>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <div style={{ width: '12px', height: '12px', borderRadius: '50%', backgroundColor: '#d9d9d9' }}></div>
                      <Text style={{ fontSize: '14px' }}>{statusCounts.due} Due</Text>
                    </div>
                  </div>
                </div>

                {/* Task Details */}
                <div style={{ marginBottom: '24px' }}>
                  <div style={{ marginBottom: '12px' }}>
                    <Text type="secondary" style={{ fontSize: '12px' }}>Category</Text>
                    <br />
                    <Text style={{ fontSize: '14px', fontWeight: 500 }}>
                      {taskDetails?.category || task?.task_category || 'Alerts and Monitoring'}
                    </Text>
                  </div>
                  <div style={{ marginBottom: '12px' }}>
                    <Text type="secondary" style={{ fontSize: '12px' }}>Next due on</Text>
                    <br />
                    <Text style={{ fontSize: '14px', fontWeight: 500 }}>
                      {taskDetails?.nextDueDate ? new Date(taskDetails.nextDueDate).toLocaleDateString() : '--'}
                    </Text>
                  </div>
                  <div style={{ marginBottom: '12px' }}>
                    <Text type="secondary" style={{ fontSize: '12px' }}>Frequency</Text>
                    <br />
                    <Text style={{ fontSize: '14px', fontWeight: 500 }}>
                      {taskDetails?.frequency || task?.frequency || 'Quarterly'}
                    </Text>
                  </div>
                  {taskDetails?.description && (
                    <div style={{ marginBottom: '12px' }}>
                      <Text type="secondary" style={{ fontSize: '12px' }}>Description</Text>
                      <br />
                      <Text style={{ fontSize: '14px', fontWeight: 500 }}>
                        {taskDetails.description}
                      </Text>
                    </div>
                  )}
                  <div style={{ marginBottom: '12px' }}>
                    <Text type="secondary" style={{ fontSize: '12px' }}>Total Subtasks</Text>
                    <br />
                    <Text style={{ fontSize: '14px', fontWeight: 500 }}>
                      {task?.subtasks?.length || 0}
                    </Text>
                  </div>
                </div>

                {/* Occurrences */}
                <div>
                  <Text type="secondary" style={{ fontSize: '12px', display: 'block', marginBottom: '12px' }}>
                    Occurrence({occurrencesData.length})
                  </Text>
                  
                  <Collapse ghost>
                    <Panel header={`${occurrencesData.length} items`} key="1">
                      <List
                        size="small"
                        dataSource={occurrencesData}
                        renderItem={(item: OccurrenceData) => (
                          <List.Item style={{ padding: '8px 0', border: 'none' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', width: '100%' }}>
                              {getStatusIcon(item.status)}
                              <div style={{ flex: 1 }}>
                                <Text style={{ fontSize: '14px' }}>{item.period}</Text>
                                <br />
                                <Text type="secondary" style={{ fontSize: '12px' }}>
                                  Due: {item.dueDate}
                                </Text>
                              </div>
                            </div>
                          </List.Item>
                        )}
                      />
                    </Panel>
                  </Collapse>
                </div>
              </Card>
            </Col>
          </Row>
        </div>
      </Content>
    </Layout>
  );
};

export default TaskView;
