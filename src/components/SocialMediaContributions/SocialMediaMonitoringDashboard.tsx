import React, { useState, useMemo } from 'react';
import { 
  Table, Card, Row, Col, Typography, Badge, Select, Input, Button, 
  Space, Avatar, Dropdown, Menu, Spin, Tag, Empty 
} from 'antd';
import { 
  LinkedinOutlined, TwitterOutlined, FacebookOutlined, 
  SearchOutlined, SyncOutlined, ReloadOutlined 
} from '@ant-design/icons';
import Search from 'antd/es/input/Search';
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

  // Handler for search
  const handleSearch = (value: string) => {
    setSearchText(value);
    setCurrentPage(1);
  };

  // Handler for fresh run
  const handleFreshRun = () => {
    setLoading(true);
    // Simulate API call
    setTimeout(() => {
      setLoading(false);
    }, 1000);
  };

  // Handler for category change
  const handleCategoryChange = (value: string) => {
    // Handle category change if needed
    console.log('Selected category:', value);
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
      title: 'Name',
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
      title: 'Findings',
      dataIndex: ['findings', 'triggerPhrase'],
      key: 'triggerPhrase',
      ellipsis: true,
    },
    {
      title: 'Key Words Found',
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
      title: 'Category',
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
    }
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
      <Row gutter={[16, 16]} style={{ marginBottom: 24 }} align="middle">
          <Col xs={24} md={8}>
            <Select
              defaultValue="All"
              style={{ width: '100%' }}
              onChange={handleCategoryChange}
            >
              <Option value="All">Run Date – {dayjs().format('MMM D, YYYY')}</Option>
              <Option value="All">Run Date – {dayjs().subtract(1, 'month').format('MMM D, YYYY')}</Option>
              <Option value="All">Run Date – {dayjs().subtract(2, 'month').format('MMM D, YYYY')}</Option>
            </Select>
          </Col>
          <Col xs={24} md={10}>
            <Search
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

        {/* Dropdown Filters */}
        <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
          <Col xs={24} md={6}>
            <div className="filter-group">
              <label>Monitoring Type</label>
              <Select
                style={{ width: '100%' }}
                defaultValue="all"
                onChange={(value) => console.log('Monitoring Type:', value)}
              >
                <Option value="scheduled">Post Monitoring</Option>
                <Option value="manual">Title Monitoring</Option>
              </Select>
            </div>
          </Col>
          <Col xs={24} md={6}>
            <div className="filter-group">
              <label>Key Words Found</label>
              <Select
                mode="multiple"
                style={{ width: '100%' }}
                placeholder="Select keywords..."
                onChange={(value) => {
                  console.log('Selected Keywords:', value);
                  // Prevent default behavior and stop event propagation
                  if (event) {
                    event.stopPropagation();
                    event.preventDefault();
                  }
                }}
                onClick={(e) => {
                  e.stopPropagation();
                }}
                onDropdownVisibleChange={(open) => {
                  if (open) {
                    // Reset any default selections when dropdown opens
                    const select = document.querySelector('.ant-select-selector');
                    if (select) {
                      select.dispatchEvent(new Event('mousedown', { bubbles: true }));
                    }
                  }
                }}
                maxTagCount="responsive"
                allowClear
                showSearch
                optionFilterProp="children"
              >
                <Option value="Investment">Investment</Option>
                <Option value="Risk">Risk</Option>
                <Option value="Portfolio">Portfolio</Option>
                <Option value="Retirement">Retirement</Option>
                <Option value="Tax">Tax</Option>
                <Option value="Fee">Fee</Option>
                <Option value="Return">Return</Option>
                <Option value="Diversification">Diversification</Option>
                <Option value="Securities">Securities</Option>
                <Option value="Market">Market</Option>
                <Option value="Asset">Asset</Option>
                <Option value="Bonds">Bonds</Option>
                <Option value="Stock">Stock</Option>
                <Option value="Regulation">Regulation</Option>
                <Option value="Compliance">Compliance</Option>
                <Option value="Advice">Advice</Option>
                <Option value="Guarantee">Guarantee</Option>
                <Option value="Performance">Performance</Option>
                <Option value="Financial Planning">Financial Planning</Option>
                <Option value="Fiduciary">Fiduciary</Option>
                <Option value="Elite">Elite</Option>
                <Option value="Perfect">Perfect</Option>
                <Option value="Best">Best</Option>
                <Option value="Free">Free</Option>
                <Option value="No risk">No risk</Option>
                <Option value="Insider information">Insider information</Option>
              </Select>
            </div>
          </Col>
          <Col xs={24} md={6}>
            <div className="filter-group">
              <label>Bias</label>
              <Select
                style={{ width: '100%' }}
                defaultValue="all"
                onChange={(value) => console.log('Bias:', value)}
              >
                <Option value="all">All</Option>
                <Option value="high">Detected</Option>
                <Option value="low">Not Detected</Option>
              </Select>
            </div>
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
