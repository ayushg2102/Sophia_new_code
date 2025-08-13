import React, { useState, useEffect } from "react";
import {
  Layout,
  Card,
  Typography,
  Button,
  Table,
  Space,
  Row,
  Col,
  Spin,
  message,
} from "antd";
import {
  ArrowLeftOutlined,
  RightOutlined,
  CheckCircleOutlined,
} from "@ant-design/icons";
import { useParams, useNavigate } from "react-router-dom";
import Header from '../../components/Header/Header';
import DetailsSidebar, { OccurrenceData } from '../../components/DetailsSidebar';
import './TaskView.css';
import { Task } from "../../types";

const { Content } = Layout;
const { Title, Text } = Typography;

// Interface for action data
interface ActionData {
  key: string;
  action: string;
  noOfRuns: number;
  lastRun: string;
  nextRunDue: string;
  status: 'done' | 'ongoing' | 'overdue' | 'due';
}



const TaskView: React.FC = () => {
  const { taskId } = useParams<{ taskId: string }>();
  const navigate = useNavigate();
  const [task, setTask] = useState<Task | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [actionsData, setActionsData] = useState<ActionData[]>([]);
  const [taskDetails, setTaskDetails] = useState<any>(null);
  const [expandedRowKeys, setExpandedRowKeys] = useState<readonly React.Key[]>([]);
  const [actionRunHistory, setActionRunHistory] = useState<{[key: string]: any[]}>({});
  const [loadingActionDetails, setLoadingActionDetails] = useState<{[key: string]: boolean}>({});


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
              frequency: taskData.frequency,
              description: taskData.description,
              // Calculate next due date from subtasks if available, fallback to task due date
              nextDueDate: taskData.subtasks?.find((st: any) => st.status === 'due')?.due_date || taskData.task_due_date
            });
            
            // Transform actions data for the table
            if (taskData.actions && taskData.actions.length > 0) {
              const transformedActions = taskData.actions.map((action: any, index: number) => ({
                key: action.action_id || `action-${index}`,
                action: action.action_instruction || action.action_description || 'No description available',
                noOfRuns: action.action_runs?.length || 0, // Will be updated after fetching action details
                lastRun: action.action_updated_date ? new Date(action.action_updated_date).toLocaleDateString() : '--',
                nextRunDue: action.action_trigger_date ? new Date(action.action_trigger_date).toLocaleDateString() : '--',
                status: action.adjusted_relative_trigger_date ? 
                  (new Date(action.adjusted_relative_trigger_date) < new Date() ? 'overdue' : 'due') : 'due'
              }));
              setActionsData(transformedActions);
              
              // Set default expanded rows for tasks that allow expansion
              if (taskData.task_short_description !== "Social Media" && taskData.task_short_description !== "Political Contributions") {
                const allActionKeys = transformedActions.map(action => action.key);
                setExpandedRowKeys(allActionKeys);
              }
              
              // Fetch action details for all actions immediately
              fetchAllActionDetails(taskData.actions);
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



  // Fetch action details for all actions at once
  const fetchAllActionDetails = async (actions: any[]) => {
    const actionIds = actions.map(action => action.action_id).filter(Boolean);
    
    // Set loading state for all actions
    const loadingState = actionIds.reduce((acc, id) => ({ ...acc, [id]: true }), {});
    setLoadingActionDetails(loadingState);
    
    // Fetch all action details in parallel
    const fetchPromises = actionIds.map(async (actionId) => {
      try {
        const response = await fetch(`/api/action-details/${actionId}`);
        if (response.ok) {
          const apiResponse = await response.json();
          if (apiResponse.status === 'success' && apiResponse.data) {
            const runHistory = apiResponse.data.action_runs?.map((run: any, index: number) => ({
              key: `${actionId}-run-${index}`,
              runSummary: run.human_msg ? (run.human_msg.length > 50 ? run.human_msg.substring(0, 50) + '...' : run.human_msg) : '--',
              runDate: run.run_timestamp ? new Date(run.run_timestamp).toLocaleString() : '--',
              status: run.run_status || 'Unknown',
              occurrence: run.subtask_name || '--',
              dueDate: run.subtask_due_date ? new Date(run.subtask_due_date).toLocaleDateString() : '--'
            })) || [];
            
            const noOfRuns = apiResponse.data.action_runs?.length || 0;
            
            return { actionId, runHistory, noOfRuns };
          }
        } else {
          console.error(`Failed to fetch action details for ${actionId}`);
          return { actionId, runHistory: [], noOfRuns: 0 };
        }
      } catch (error) {
        console.error(`Error fetching action details for ${actionId}:`, error);
        return { actionId, runHistory: [], noOfRuns: 0 };
      }
    });
    
    // Wait for all requests to complete
    const results = await Promise.all(fetchPromises);
    
    // Update state with all results
    const newRunHistory: {[key: string]: any[]} = {};
    const newLoadingState: {[key: string]: boolean} = {};
    const newRunCounts: {[key: string]: number} = {};
    
    results.forEach(result => {
      if (result) {
        newRunHistory[result.actionId] = result.runHistory;
        newLoadingState[result.actionId] = false;
        newRunCounts[result.actionId] = result.noOfRuns || 0;
      }
    });
    
    setActionRunHistory(prev => ({ ...prev, ...newRunHistory }));
    setLoadingActionDetails(prev => ({ ...prev, ...newLoadingState }));
    
    // Update actionsData with the actual run counts
    setActionsData(prevActions => 
      prevActions.map(action => ({
        ...action,
        noOfRuns: newRunCounts[action.key] || 0
      }))
    );
  };



  // Expandable row render function
  const expandedRowRender = (record: ActionData) => {
    const actionId = record.key;
    const runHistory = actionRunHistory[actionId] || [];
    const isLoading = loadingActionDetails[actionId];

    const historyColumns = [
      {
        title: 'Run summary',
        dataIndex: 'runSummary',
        key: 'runSummary',
        width: '35%',
        align: 'left' as const,
        render: (text: string) => (
          <div style={{ padding: '12px 16px' }}>
            <div style={{ 
              fontSize: '14px', 
              lineHeight: '1.4',
              color: '#262626',
              fontWeight: '400'
            }}>
              {text}
            </div>
          </div>
        ),
      },
      {
        title: 'Run date & time',
        dataIndex: 'runDate',
        key: 'runDate',
        width: '25%',
        align: 'center' as const,
        render: (text: string) => (
          <div style={{ padding: '12px 16px', textAlign: 'center' }}>
            <div style={{ 
              fontSize: '14px', 
              fontWeight: '500',
              color: '#262626'
            }}>
              {text}
            </div>
          </div>
        ),
      },
      {
        title: 'Status',
        dataIndex: 'status',
        key: 'status',
        width: '15%',
        align: 'center' as const,
        render: (status: string) => {
          const getStatusConfig = (status: string) => {
            switch (status.toLowerCase()) {
              case 'completed':
              case 'success':
                return {
                  color: '#52c41a',
                  backgroundColor: '#f6ffed',
                  borderColor: '#b7eb8f',
                  text: 'Completed'
                };
              case 'failed':
              case 'error':
                return {
                  color: '#ff4d4f',
                  backgroundColor: '#fff2f0',
                  borderColor: '#ffccc7',
                  text: 'Failed'
                };
              case 'running':
              case 'in_progress':
                return {
                  color: '#faad14',
                  backgroundColor: '#fffbe6',
                  borderColor: '#ffe58f',
                  text: 'Running'
                };
              default:
                return {
                  color: '#8c8c8c',
                  backgroundColor: '#f5f5f5',
                  borderColor: '#d9d9d9',
                  text: status
                };
            }
          };
          
          const config = getStatusConfig(status);
          
          return (
            <div style={{ 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center',
              padding: '8px 12px'
            }}>
              <div style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                padding: '4px 12px',
                borderRadius: '16px',
                backgroundColor: config.backgroundColor,
                border: `1px solid ${config.borderColor}`,
                fontSize: '12px',
                fontWeight: '500'
              }}>
                <CheckCircleOutlined style={{ 
                  color: config.color, 
                  fontSize: '14px' 
                }} />
                <span style={{ color: config.color }}>
                  {config.text}
                </span>
              </div>
            </div>
          );
        },
      },
      {
        title: 'Occurrence',
        dataIndex: 'occurrence',
        key: 'occurrence',
        width: '25%',
        align: 'left' as const,
        render: (text: string, record: any) => (
          <div style={{ padding: '8px 12px' }}>
            <div style={{ 
              fontWeight: 500, 
              fontSize: '14px',
              lineHeight: '1.4',
              color: '#262626',
              marginBottom: '4px'
            }}>
              {text}
            </div>
            <div style={{ 
              fontSize: '12px',
              lineHeight: '1.2',
              color: '#8c8c8c'
            }}>
              Due: {record.dueDate}
            </div>
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

    if (isLoading) {
      return (
        <div style={{ margin: '0 48px', padding: '20px', textAlign: 'center' }}>
          <Spin size="small" />
          <Text style={{ marginLeft: 8 }}>Loading run history...</Text>
        </div>
      );
    }

    if (runHistory.length === 0 && !isLoading) {
      return (
        <div style={{ margin: '0 48px', padding: '20px', textAlign: 'center' }}>
          <Text type="secondary">No run history available for this action.</Text>
        </div>
      );
    }

    return (
      <div style={{ 
        margin: '0 24px', 
        padding: '16px',
        backgroundColor: '#fafafa',
        borderRadius: '8px'
      }}>
        <Table
          columns={historyColumns}
          dataSource={runHistory}
          pagination={false}
          size="middle"
          rowKey="key"
          bordered
          style={{
            backgroundColor: 'white',
            borderRadius: '6px',
            overflow: 'hidden'
          }}
          className="run-history-table"
        />
      </div>
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
      render: (_: any, record: ActionData) => (
        <Space size="small">
          <Button
            type="text"
            icon={<RightOutlined />}
            size="small"
            style={{ color: '#1890ff' }}
            onClick={() => {
              if (task?.task_short_description === "Social Media") {
                navigate('/social-media-dashboard');
              } else if (task?.task_short_description === "Political Contributions") {
                navigate('/political-contributions-dashboard');
              } else {
                navigate(`/action/${record.key}`, { 
                  state: { 
                    task: task,
                    taskDetails: taskDetails,
                    occurrencesData: occurrencesData,
                    statusCounts: statusCounts,
                    totalSubtasks: totalSubtasks,
                    donePercentage: donePercentage
                  }
                });
              }
            }}
          />
        </Space>
      ),
    },
  ];

  // Calculate status counts for donut chart based on subtasks
  const statusCounts = {
    done: task?.subtasks?.filter((subtask: any) => subtask.status === 'completed').length || 0,
    ongoing: task?.subtasks?.filter((subtask: any) => subtask.status === 'ongoing').length || 0,
    overdue: task?.subtasks?.filter((subtask: any) => subtask.status === 'overdue').length || 0,
    due: task?.subtasks?.filter((subtask: any) => subtask.status === 'due').length || 0,
  };

  const totalSubtasks = task?.subtasks?.length || 0;
  const donePercentage = totalSubtasks > 0 ? Math.round((statusCounts.done / totalSubtasks) * 100) : 0;

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
              {task?.task_category || 'Alerts & Compliance monitoring'}
            </Text>
          </div>

          {/* Main Content */}
          <Row gutter={24} style={{ alignItems: 'stretch' }}>
            {/* Left Column - Actions Table */}
            <Col xs={24} lg={16}>
              <Card style={{ borderRadius: '8px', boxShadow: '0 2px 8px rgba(0,0,0,0.06)', height: '100%' }}>
                <div style={{ marginBottom: '16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Text strong style={{ fontSize: '16px' }}>Actions</Text>
                </div>
                <Table
                  columns={columns}
                  dataSource={actionsData}
                  rowKey="key"
                  expandable={(task?.task_short_description === "Social Media" || task?.task_short_description === "Political Contributions") ? undefined : {
                    expandedRowRender: (record) => expandedRowRender(record),
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
              <DetailsSidebar
                statusCounts={statusCounts}
                totalItems={totalSubtasks}
                donePercentage={donePercentage}
                category={taskDetails?.category || task?.task_category || 'Alerts and Monitoring'}
                nextDueDate={taskDetails?.nextDueDate ? new Date(taskDetails.nextDueDate).toLocaleDateString() : '--'}
                frequency={taskDetails?.frequency || task?.frequency || 'Quarterly'}
                description={taskDetails?.description}
                totalSubtasks={task?.subtasks?.length || 0}
                occurrences={occurrencesData}
              />
            </Col>
          </Row>
        </div>
      </Content>
    </Layout>
  );
};

export default TaskView;
