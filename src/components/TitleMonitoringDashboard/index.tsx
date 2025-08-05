import React, { useState, useMemo } from 'react';
import { 
  Row, 
  Col, 
  Typography,
  Card, 
  Select, 
  Input, 
  Button, 
  Table, 
  message,
  Badge,
} from 'antd';
import { SearchOutlined, ReloadOutlined } from '@ant-design/icons';
const { Title } = Typography;
import dayjs from 'dayjs';
import SocialMediaMonitoringDashboard from '../SocialMediaContributions/SocialMediaMonitoringDashboard';

const { Text } = Typography;
const { Option } = Select;

interface TitleRecord {
  key: string;
  name: string;
  platform: string;
  titleHr: string;
  titleLinkedIn: string;
  category: 'Title Matching' | 'Title Not Matching';
  runDate: string;
}

// Mock data - replace with actual API call in production
const mockTitleData: TitleRecord[] = [
  {
    key: '1',
    name: 'John Doe',
    platform: 'LinkedIn',
    titleHr: 'Senior Software Engineer',
    titleLinkedIn: 'Senior Software Engineer',
    category: 'Title Matching',
    runDate: '2023-08-01 to 2023-08-31'
  },
  {
    key: '2',
    name: 'Jane Smith',
    platform: 'LinkedIn',
    titleHr: 'Product Manager',
    titleLinkedIn: 'Senior Product Manager',
    category: 'Title Not Matching',
    runDate: '2023-08-01 to 2023-08-31'
  },
  // Add more mock data as needed
];

const TitleMonitoringDashboard: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [searchText, setSearchText] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<string>('All');
  const [runDateFilter, setRunDateFilter] = useState<string>('All');
  const [monitoringType, setMonitoringType] = useState<string>('Title Monitoring');
  
  // Get unique run dates for filter
  const runDates = useMemo(() => {
    const dates = new Set<string>();
    mockTitleData.forEach(item => {
      if (item.runDate) dates.add(item.runDate);
    });
    return Array.from(dates).map(date => ({
      label: date,
      value: date
    }));
  }, []);

  // Filter data based on search and filters
  const filteredData = useMemo(() => {
    return mockTitleData.filter(item => {
      const matchesSearch = 
        item.name.toLowerCase().includes(searchText.toLowerCase()) ||
        item.titleHr.toLowerCase().includes(searchText.toLowerCase()) ||
        item.titleLinkedIn.toLowerCase().includes(searchText.toLowerCase());
      
      const matchesCategory = categoryFilter === 'All' || item.category === categoryFilter;
      const matchesRunDate = runDateFilter === 'All' || item.runDate === runDateFilter;
      
      return matchesSearch && matchesCategory && matchesRunDate;
    });
  }, [searchText, categoryFilter, runDateFilter]);

  const handleSearch = (value: string) => {
    setSearchText(value);
  };

  const handleCategoryChange = (value: string) => {
    setCategoryFilter(value);
  };

  const handleRunDateChange = (value: string) => {
    setRunDateFilter(value);
  };
  const changeMonitoringType = (value: string) => {
    setMonitoringType(value);
  };

  const handleFreshRun = () => {
    setLoading(true);
    // In a real app, this would trigger an API call to refresh the data
    setTimeout(() => {
      message.success('Title monitoring data refreshed successfully');
      setLoading(false);
    }, 1500);
  };

  const columns = [
    {
      title: 'Name',
      dataIndex: 'name',
      key: 'name',
      sorter: (a: TitleRecord, b: TitleRecord) => a.name.localeCompare(b.name),
    },
    {
      title: 'Platform',
      dataIndex: 'platform',
      key: 'platform',
      filters: [
        { text: 'LinkedIn', value: 'LinkedIn' },
        // Add other platforms as needed
      ],
      onFilter: (value: any, record: TitleRecord) => record.platform === value,
    },
    {
      title: 'Title as per HR',
      dataIndex: 'titleHr',
      key: 'titleHr',
      sorter: (a: TitleRecord, b: TitleRecord) => a.titleHr.localeCompare(b.titleHr),
    },
    {
      title: 'Title as per LinkedIn',
      dataIndex: 'titleLinkedIn',
      key: 'titleLinkedIn',
      sorter: (a: TitleRecord, b: TitleRecord) => a.titleLinkedIn.localeCompare(b.titleLinkedIn),
    },
    {
      title: 'Category',
      dataIndex: 'category',
      key: 'category',
      filters: [
        { text: 'Title Matching', value: 'Title Matching' },
        { text: 'Title Not Matching', value: 'Title Not Matching' },
      ],
      onFilter: (value: any, record: TitleRecord) => record.category === value,
      render: (category: string) => (
        <span style={{ 
          color: category === 'Title Matching' ? '#52c41a' : '#f5222d',
          fontWeight: 500
        }}>
          {category}
        </span>
      ),
    },
  ];

  // Return the SocialMediaMonitoringDashboard when monitoringType is 'Post Monitoring'
  if (monitoringType === 'Post Monitoring') {
    return <SocialMediaMonitoringDashboard />;
  }

  // Otherwise, return the Title Monitoring dashboard
  return (
    <div style={{ width: '100%' }}>
     <Row gutter={[16, 16]} style={{ marginBottom: 24 }} align="middle">
          <Col xs={24} md={8}>
            <Select
              defaultValue="All"
              style={{ width: '100%' }}
              onChange={handleCategoryChange}
            >
              <Option value="All">All Run Dates</Option>
              {runDates.map(date => (
                <Option key={date.value} value={date.value}>
                  {date.label}
                </Option>
              ))}
            </Select>
          </Col>
          <Col xs={24} md={10}>
            <Input.Search
              placeholder="Search employees..."
              allowClear
              enterButton={<SearchOutlined />}
              onSearch={handleSearch}
              style={{ width: '100%' }}
            />
          </Col>
          <Col xs={24} md={6} style={{ textAlign: 'right' }}>
            <Button 
              type="primary" 
              icon={<ReloadOutlined />}
              onClick={handleFreshRun}
            >
              Execute Fresh Run
            </Button>
          </Col>
        </Row>
        {/* Title Section */}
        <Row justify="space-between" align="middle" style={{ marginBottom: 24 }}>
          <Col>
            <Title level={3} style={{ margin: 0 }}>Social Media Monitoring - Analysis Run</Title>
          </Col>
          <Col>
            <Badge status="success" text="Completed" />
          </Col>
        </Row>

        {/* Summary Cards */}
        <Row gutter={[16, 16]} style={{ marginBottom: 24 }} justify="space-between">
                  <Col flex="1" style={{ minWidth: '160px', padding: '0 8px' }}>
                    <Card title="Started At" size="small" style={{ height: '100%', margin: 0 }}>
                      <div style={{ fontSize: '0.9rem' }}>{dayjs().format('MM/DD/YYYY HH:mm')}</div>
                    </Card>
                  </Col>
                  <Col flex="1" style={{ minWidth: '160px', padding: '0 8px' }}>
                    <Card title="Completed At" size="small" style={{ height: '100%', margin: 0 }}>
                      <div style={{ fontSize: '0.9rem' }}>{dayjs().add(20, 'minute').format('MM/DD/YYYY HH:mm')}</div>
                    </Card>
                  </Col>
                  <Col flex="1" style={{ minWidth: '140px', padding: '0 8px' }}>
                    <Card title="Duration" size="small" style={{ height: '100%', margin: 0 }}>
                      <div style={{ fontSize: '0.9rem' }}>19 min 58 sec</div>
                    </Card>
                  </Col>
                  <Col flex="1" style={{ minWidth: '140px', padding: '0 8px' }}>
                    <Card title="Employees Analyzed" size="small" style={{ height: '100%', margin: 0 }}>
                      <div style={{ fontSize: '1.1rem', fontWeight: 500 }}>43</div>
                    </Card>
                  </Col>
                </Row>
<Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
          <Col xs={24} md={6}>
            <div className="filter-group">
              <label>Monitoring Type</label>
              <Select
                style={{ width: '100%' }}
                defaultValue="all"
                onChange={(value) => {
                  changeMonitoringType(value);
                  }}
              >
                <Option value="Title Monitoring">Title Monitoring</Option>
                <Option value="Post Monitoring">Post Monitoring</Option>
              </Select>
            </div>
          </Col>
          
          <Col xs={24} md={6}>
            <div className="filter-group">
              <label>Category</label>
              <Select
                style={{ width: '100%' }}
                defaultValue="all"
                onChange={(value) => console.log('Category:', value)}
              >
                <Option value="all">All</Option>
                <Option value="high">Title Matching</Option>
                <Option value="low">Title Not Matching</Option>
              </Select>
            </div>
          </Col>
          
        </Row>
      <Card>
        <Table
          columns={columns}
          dataSource={filteredData}
          loading={loading}
          pagination={{
            pageSize: 10,
            showSizeChanger: true,
            showTotal: (total) => `Total ${total} records`,
          }}
          scroll={{ x: 'max-content' }}
          rowKey="key"
        />
      </Card>
    </div>
  );
};

export default TitleMonitoringDashboard;
