import React, { useState, useMemo } from 'react';
import { 
  Table, Card, Row, Col, Typography, Badge, Select, Input, Button, 
  Space, Avatar, Dropdown, Menu, Spin, Tag, Empty 
} from 'antd';
import { 
  LinkedinOutlined, TwitterOutlined, FacebookOutlined, 
  SearchOutlined, SyncOutlined, UserOutlined, DownOutlined 
} from '@ant-design/icons';
import dayjs from 'dayjs';

const { Title, Text } = Typography;
const { Option } = Select;

// Mock data for the social media monitoring dashboard
const mockData = [
  {
    key: '1',
    name: 'John Smith',
    platform: 'LinkedIn',
    findings: {
      url: 'https://linkedin.com/in/johnsmith',
      triggerPhrase: 'Market analysis post',
      category: 'Financial Commentary',
      keywords: 'stocks, market, analysis',
      bias: 'Medium'
    }
  },
  {
    key: '2',
    name: 'Jane Doe',
    platform: 'Twitter',
    findings: {
      url: 'https://twitter.com/janedoe',
      triggerPhrase: 'Political opinion post',
      category: 'Political Opinion',
      keywords: 'election, vote, campaign',
      bias: 'High'
    }
  },
  {
    key: '3',
    name: 'Robert Johnson',
    platform: 'Facebook',
    findings: {
      url: 'https://facebook.com/robertjohnson',
      triggerPhrase: 'No posts available',
      category: 'No posts available',
      keywords: 'N/A',
      bias: 'N/A'
    }
  }
];

const SocialMediaMonitoringDashboard: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [searchText, setSearchText] = useState('');
  const [keywordsFilter, setKeywordsFilter] = useState('All');
  const [biasFilter, setBiasFilter] = useState('All');
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  // Calculate summary metrics
  const summaryMetrics = useMemo(() => ({
    totalEmployees: mockData.length,
    totalFindings: mockData.filter(item => item.findings.keywords !== 'N/A').length,
    highBias: mockData.filter(item => item.findings.bias === 'High').length,
    mediumBias: mockData.filter(item => item.findings.bias === 'Medium').length,
    lowBias: mockData.filter(item => item.findings.bias === 'Low').length,
  }), []);

  // Filter data based on search and filters
  const filteredData = useMemo(() => {
    return mockData.filter(item => {
      const matchesSearch = item.name.toLowerCase().includes(searchText.toLowerCase()) ||
                         item.findings.triggerPhrase.toLowerCase().includes(searchText.toLowerCase());
      
      const matchesKeywords = keywordsFilter === 'All' || 
                            (keywordsFilter === 'With Keywords' && item.findings.keywords !== 'N/A') ||
                            (keywordsFilter === 'Without Keywords' && item.findings.keywords === 'N/A');
      
      const matchesBias = biasFilter === 'All' || 
                         (biasFilter === 'High' && item.findings.bias === 'High') ||
                         (biasFilter === 'Medium' && item.findings.bias === 'Medium') ||
                         (biasFilter === 'Low' && item.findings.bias === 'Low') ||
                         (biasFilter === 'None' && item.findings.bias === 'N/A');
      
      return matchesSearch && matchesKeywords && matchesBias;
    });
  }, [searchText, keywordsFilter, biasFilter]);

  // Get current page data
  const currentData = useMemo(() => {
    const startIndex = (currentPage - 1) * pageSize;
    return filteredData.slice(startIndex, startIndex + pageSize);
  }, [filteredData, currentPage, pageSize]);

  // Handle table change (pagination, sorting)
  const handleTableChange = (pagination: any) => {
    setCurrentPage(pagination.current);
    setPageSize(pagination.pageSize);
  };

  // Handle refresh data
  const handleRefresh = () => {
    setLoading(true);
    // Simulate API call
    setTimeout(() => {
      setLoading(false);
    }, 1000);
  };

  // Table columns
  const columns = [
    {
      title: 'Employee Name',
      dataIndex: 'name',
      key: 'name',
      sorter: (a: any, b: any) => a.name.localeCompare(b.name),
      width: 200,
    },
    {
      title: 'Platform',
      dataIndex: 'platform',
      key: 'platform',
      render: (platform: string) => {
        const platformIcons: Record<string, React.ReactNode> = {
          'LinkedIn': <LinkedinOutlined style={{ color: '#0077B5' }} />,
          'Twitter': <TwitterOutlined style={{ color: '#1DA1F2' }} />,
          'Facebook': <FacebookOutlined style={{ color: '#4267B2' }} />
        };
        return (
          <span>
            {platformIcons[platform] || platform}
            {' '}{platform}
          </span>
        );
      },
      filters: [
        { text: 'LinkedIn', value: 'LinkedIn' },
        { text: 'Twitter', value: 'Twitter' },
        { text: 'Facebook', value: 'Facebook' },
      ],
      onFilter: (value: any, record: any) => record.platform === value,
      width: 150,
    },
    {
      title: 'Trigger Phrase',
      dataIndex: ['findings', 'triggerPhrase'],
      key: 'triggerPhrase',
      ellipsis: true,
    },
    {
      title: 'Category',
      dataIndex: ['findings', 'category'],
      key: 'category',
      filters: [
        { text: 'Financial Commentary', value: 'Financial Commentary' },
        { text: 'Market Analysis', value: 'Market Analysis' },
        { text: 'Political Opinion', value: 'Political Opinion' },
      ],
      onFilter: (value: any, record: any) => record.findings.category === value,
      width: 180,
    },
    {
      title: 'Keywords',
      dataIndex: ['findings', 'keywords'],
      key: 'keywords',
      render: (text: string) => text === 'N/A' ? <span style={{ color: '#999' }}>None</span> : text,
      width: 200,
    },
    {
      title: 'Bias',
      dataIndex: ['findings', 'bias'],
      key: 'bias',
      render: (bias: string) => {
        const biasColors: Record<string, string> = {
          'High': '#ff4d4f',
          'Medium': '#faad14',
          'Low': '#52c41a',
          'N/A': '#d9d9d9'
        };
        return (
          <Tag color={biasColors[bias] || '#d9d9d9'}>
            {bias === 'N/A' ? 'None' : bias}
          </Tag>
        );
      },
      filters: [
        { text: 'High', value: 'High' },
        { text: 'Medium', value: 'Medium' },
        { text: 'Low', value: 'Low' },
        { text: 'None', value: 'N/A' },
      ],
      onFilter: (value: any, record: any) => record.findings.bias === value,
      width: 120,
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_: any, record: any) => (
        <Space size="middle">
          <a href={record.findings.url} target="_blank" rel="noopener noreferrer">
            View Profile
          </a>
          <a onClick={() => console.log('Flag for review:', record.key)}>Flag</a>
        </Space>
      ),
      width: 150,
    },
  ];

  // User menu dropdown
  const userMenu = (
    <Menu>
      <Menu.Item key="profile">Profile</Menu.Item>
      <Menu.Item key="settings">Settings</Menu.Item>
      <Menu.Divider />
      <Menu.Item key="logout">Logout</Menu.Item>
    </Menu>
  );

  return (
    <div className="social-media-dashboard" style={{ padding: '24px' }}>
      <Spin spinning={loading}>
        {/* Header Section */}
        <Row justify="space-between" align="middle" style={{ marginBottom: 24 }}>
          <Col>
            <div style={{ display: 'flex', alignItems: 'center' }}>
              <div style={{
                width: 32,
                height: 32,
                backgroundColor: '#1890ff',
                borderRadius: 4,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginRight: 12,
                color: 'white',
                fontWeight: 'bold'
              }}>
                S
              </div>
              <Title level={4} style={{ margin: 0 }}>Sophia - Social Media Monitoring</Title>
            </div>
          </Col>
          <Col>
            <Dropdown overlay={userMenu} trigger={['click']}>
              <div style={{ cursor: 'pointer', display: 'flex', alignItems: 'center' }}>
                <Avatar 
                  icon={<UserOutlined />} 
                  style={{ marginRight: 8, backgroundColor: '#1890ff' }}
                />
                <span>Admin User</span>
                <DownOutlined style={{ marginLeft: 8, fontSize: 12 }} />
              </div>
            </Dropdown>
          </Col>
        </Row>

        {/* Summary Cards */}
        <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
          <Col xs={24} md={6}>
            <Card size="small" title="Total Employees" style={{ height: '100%' }}>
              <Title level={3} style={{ margin: 0 }}>{summaryMetrics.totalEmployees}</Title>
              <span style={{ color: '#8c8c8c' }}>Monitored accounts</span>
            </Card>
          </Col>
          <Col xs={24} md={6}>
            <Card size="small" title="Total Findings" style={{ height: '100%' }}>
              <Title level={3} style={{ margin: 0, color: '#ff4d4f' }}>
                {summaryMetrics.totalFindings}
              </Title>
              <span style={{ color: '#8c8c8c' }}>Potential policy violations</span>
            </Card>
          </Col>
          <Col xs={24} md={6}>
            <Card size="small" title="High Risk" style={{ height: '100%' }}>
              <Title level={3} style={{ margin: 0, color: '#ff4d4f' }}>
                {summaryMetrics.highBias}
              </Title>
              <span style={{ color: '#8c8c8c' }}>Requires immediate review</span>
            </Card>
          </Col>
          <Col xs={24} md={6}>
            <Card size="small" title="Last Run" style={{ height: '100%' }}>
              <Title level={4} style={{ margin: 0 }}>
                {dayjs().format('MMM D, YYYY')}
              </Title>
              <span style={{ color: '#8c8c8c' }}>{dayjs().format('h:mm A')}</span>
            </Card>
          </Col>
        </Row>

        {/* Action Controls */}
        <Row gutter={[16, 16]} style={{ marginBottom: 24 }} align="middle">
          <Col xs={24} md={8}>
            <Card size="small" title="Key Words Found" style={{ height: '100%' }}>
              <Select
                value={keywordsFilter}
                onChange={setKeywordsFilter}
                style={{ width: '100%' }}
                placeholder="Filter by keywords"
              >
                <Option value="All">All</Option>
                <Option value="With Keywords">With Keywords</Option>
                <Option value="Without Keywords">Without Keywords</Option>
              </Select>
            </Card>
          </Col>
          <Col xs={24} md={8}>
            <Card size="small" title="Bias Level" style={{ height: '100%' }}>
              <Select
                value={biasFilter}
                onChange={setBiasFilter}
                style={{ width: '100%' }}
                placeholder="Filter by bias level"
              >
                <Option value="All">All</Option>
                <Option value="High">High</Option>
                <Option value="Medium">Medium</Option>
                <Option value="Low">Low</Option>
                <Option value="None">None</Option>
              </Select>
            </Card>
          </Col>
          <Col xs={24} md={8}>
            <Card size="small" title="Search & Actions" style={{ height: '100%' }}>
              <Input.Search
                placeholder="Search employees or trigger phrases"
                allowClear
                enterButton={
                  <Button type="primary">
                    <SearchOutlined /> Search
                  </Button>
                }
                value={searchText}
                onChange={(e) => setSearchText(e.target.value)}
                onSearch={(value) => setSearchText(value)}
              />
              <div style={{ marginTop: 8, textAlign: 'right' }}>
                <Button 
                  type="link" 
                  icon={<SyncOutlined spin={loading} />} 
                  onClick={handleRefresh}
                >
                  Refresh Data
                </Button>
              </div>
            </Card>
          </Col>
        </Row>

        {/* Main Table */}
        <Card>
          <Table
            columns={columns}
            dataSource={currentData}
            rowKey="key"
            pagination={{
              current: currentPage,
              pageSize: pageSize,
              total: filteredData.length,
              showSizeChanger: true,
              pageSizeOptions: ['10', '20', '50', '100'],
              showTotal: (total, range) => `${range[0]}-${range[1]} of ${total} items`,
            }}
            onChange={handleTableChange}
            loading={loading}
            scroll={{ x: 'max-content' }}
            locale={{
              emptyText: (
                <div style={{ padding: '40px 0' }}>
                  <Empty
                    image={Empty.PRESENTED_IMAGE_SIMPLE}
                    description={
                      <span>No social media findings match your search criteria</span>
                    }
                  />
                </div>
              ),
            }}
          />
        </Card>
      </Spin>
    </div>
  );
};

export default SocialMediaMonitoringDashboard;
