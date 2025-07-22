import React from "react";
import {
  Layout,
  Card,
  Tag,
  Button,
  Space,
  Typography,
  Divider,
  Row,
  Col,
} from "antd";
import {
  ArrowLeftOutlined,
  CalendarOutlined,
  SyncOutlined,
  UserOutlined,
} from "@ant-design/icons";
import { useParams, useNavigate } from "react-router-dom";
import Header from "../../components/Header/Header";
import { mockTasks } from "../../data/mockData";
import { Action, Subtask } from "../../types";
import dayjs from "dayjs";
import "./TaskView.css";

const { Content } = Layout;
const { Title, Text } = Typography;

const TaskView: React.FC = () => {
  const { taskId } = useParams<{ taskId: string }>();
  const navigate = useNavigate();

  const task = mockTasks.find((t) => t.task_id === taskId);

  if (!task) {
    return (
      <Layout>
        <Header />
        <Content style={{ padding: "24px" }}>
          <div>Task not found</div>
        </Content>
      </Layout>
    );
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed":
        return "green";
      case "in-progress":
        return "blue";
      case "due":
        return "orange";
      default:
        return "default";
    }
  };

  const handleSubtaskClick = (subtaskId: string) => {
    navigate(`/subtask/${subtaskId}`);
  };

  const handleBackClick = () => {
    navigate("/dashboard");
  };

  const handleSubtaskCardClick = (subtaskId: string) => {
    navigate(`/subtask/${subtaskId}`);
  };

  return (
    <Layout className="task-view-layout">
      <Header />
      <Content className="task-view-content">
        <div className="task-view-container">
          <div className="task-view-header">
            <Button
              icon={<ArrowLeftOutlined />}
              onClick={handleBackClick}
              className="back-button"
            >
              Back to Dashboard
            </Button>
          </div>

          <Card className="task-info-card">
            <div className="task-info-header">
              <div>
                <Title level={2} className="task-title">
                  {task.task_short_description}
                </Title>
                <Text className="task-category">{task.task_category}</Text>
              </div>
              <div className="task-tags">
                <Tag color={getStatusColor(task.status)} className="status-tag">
                  {task.status.charAt(0).toUpperCase() + task.status.slice(1)}
                </Tag>
                <Tag color="yellow" className="frequency-tag">
                  {task.frequency}
                </Tag>
              </div>
            </div>

            {/* <Divider /> */}
            {task.description && (
              <>
                <Divider />
                <div className="task-description">
                  <Title level={4}>Description</Title>
                  <Text>{task.description}</Text>
                </div>
              </>
            )}
            <Row gutter={[24, 16]} className="task-details">
              <Col xs={24} sm={12} md={8}>
                <div className="task-detail-item">
                  <CalendarOutlined className="detail-icon" />
                  <div>
                    <Text strong>Due Date</Text>
                    <br />
                    <Text>
                      {dayjs(task.task_due_date).format("MMMM DD, YYYY")}
                    </Text>
                  </div>
                </div>
              </Col>
              <Col xs={24} sm={12} md={8}>
                <div className="task-detail-item">
                  <SyncOutlined className="detail-icon" />
                  <div>
                    <Text strong>Frequency</Text>
                    <br />
                    <Text>{task.frequency}</Text>
                  </div>
                </div>
              </Col>
              <Col xs={24} sm={12} md={8}>
                <div className="task-detail-item">
                  <UserOutlined className="detail-icon" />
                  <div>
                    <Text strong>Subtasks</Text>
                    <br />
                    <Text>{task.subtasks?.length || 0} tasks</Text>
                  </div>
                </div>
              </Col>
            </Row>
          </Card>

          <Card className="subtasks-card">
            <Title level={3} className="subtasks-title">
              Subtasks
            </Title>

            <div className="subtasks-list">
              {task.subtasks?.map((subtask: Subtask) => (
                <Card
                  key={subtask.subtask_id}
                  className="subtask-card"
                  hoverable
                  onClick={() => handleSubtaskCardClick(subtask.subtask_id)}
                >
                  <div className="subtask-header">
                    <div className="subtask-info">
                      <Title level={5} className="subtask-title">
                        {subtask.subtask_short_description}
                      </Title>
                      <Tag
                        color={getStatusColor(subtask.status)}
                        className="subtask-status"
                      >
                        {subtask.status.charAt(0).toUpperCase() +
                          subtask.status.slice(1)}
                      </Tag>
                    </div>
                    <Button
                      type="primary"
                      size="small"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleSubtaskClick(subtask.subtask_id);
                      }}
                    >
                      View Details
                    </Button>
                  </div>

                  <Space
                    direction="vertical"
                    size={4}
                    className="subtask-details"
                  >
                    {subtask.period_considered && (
                      <Text type="secondary">
                        <CalendarOutlined /> Period: {subtask.period_considered}
                      </Text>
                    )}
                    {subtask.employees_analyzed && (
                      <Text type="secondary">
                        <UserOutlined /> Employees: {subtask.employees_analyzed}
                      </Text>
                    )}
                    {subtask.duration && (
                      <Text type="secondary">Duration: {subtask.duration}</Text>
                    )}
                  </Space>
                </Card>
              ))}
            </div>
          </Card>
          <Card className="subtasks-card mt-5">
            <Title level={3} className="subtasks-title">
              Actions
            </Title>

            <div className="subtasks-list">
              {task.actions?.map((action: Action) => (
                <Card
                  key={action.action_id}
                  className="subtask-card" // Reusing 'subtask-card' for visual consistency
                  hoverable
                  // onClick={() => handleSubtaskCardClick(action.action_id)} // Optional: define this handler
                >
                  <div className="subtask-header">
                    <div className="subtask-info">
                    <Title level={5} className="subtask-title">
                      Instructions
                    </Title>

                      <Title level={5} className="subtask-title">
                        <ul>
                          {action.instructions
                            .split(/\n?\d+\.\s/) // splits by numbers like "1. ", "2. ", etc.
                            .filter(Boolean) // removes any empty strings from split
                            .map((point, index) => (
                              <li key={index}>{point.trim()}</li>
                            ))}
                        </ul>
                      </Title>
                      <div className="subtask-status">
                        {action.tools_used.map((tool: string) => (
                          <Tag key={tool} color="blue">
                            {tool}
                          </Tag>
                        ))}
                      </div>
                    </div>
                    {/* <Button
                      type="primary"
                      size="small"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleSubtaskCardClick(action.action_id); // Optional: define this handler
                      }}
                    >
                      View Details
                    </Button> */}
                  </div>
                </Card>
              ))}
            </div>
          </Card>
        </div>
      </Content>
    </Layout>
  );
};

export default TaskView;
