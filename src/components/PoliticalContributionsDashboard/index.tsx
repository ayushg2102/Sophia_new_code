import React, { useState, useMemo, useEffect } from 'react';
import { 
  Row, 
  Col, 
  Typography,
  Card, 
  Select, 
  Input, 
  Button, 
  Table, 
  Spin,
  message,
} from 'antd';
import { SearchOutlined, ReloadOutlined } from '@ant-design/icons';
import dayjs from 'dayjs';
import politicalContributions from '../../data/politicalContribution.json';

const { Text } = Typography;
const { Option } = Select;
const { Search } = Input;

interface Contribution {
  key: string;
  employeeName: string;
  employeeId: string;
  latestContribution: number;
  latestContributionDate: string;
  ytdContribution: number;
  status: 'Red' | 'Amber' | 'Green';
  runDate: string;
}

// Helper function to transform API data to table format
const transformContributions = (data: any[]): Contribution[] => {
  if (!Array.isArray(data)) return [];
  
  const contributionsByEmployee: Record<string, Contribution> = {};
  
  data.forEach(doc => {
    if (!doc || !Array.isArray(doc.output)) return;
    
    doc.output.forEach((contribution: any) => {
      if (!contribution?.employee_id) return;
      
      const amount = Number(contribution.contribution_receipt_amount) || 0;
      const date = contribution.contribution_receipt_date || '';
      const employeeId = String(contribution.employee_id);
      const employeeName = String(contribution.employee_name || 'Unknown');
      
      // Determine status based on amount (example thresholds)
      let status: 'Red' | 'Amber' | 'Green' = 'Green';
      if (amount > 2000) status = 'Red';
      else if (amount > 1000) status = 'Amber';
      
      const employeeHasNoRecord = !contributionsByEmployee[employeeId];
      const hasNewerDate = date && (
        !contributionsByEmployee[employeeId]?.latestContributionDate || 
        dayjs(date).isAfter(contributionsByEmployee[employeeId].latestContributionDate)
      );
      
      if (employeeHasNoRecord || hasNewerDate) {
        contributionsByEmployee[employeeId] = {
          key: employeeId,
          employeeName,
          employeeId,
          latestContribution: amount,
          latestContributionDate: date,
          ytdContribution: (contributionsByEmployee[employeeId]?.ytdContribution || 0) + amount,
          status,
          runDate: doc.period || 'Unknown'
        };
      } else if (contributionsByEmployee[employeeId]) {
        // Update YTD if this is not the latest contribution
        contributionsByEmployee[employeeId].ytdContribution = 
          (contributionsByEmployee[employeeId].ytdContribution || 0) + amount;
      }
    });
  });
  
  return Object.values(contributionsByEmployee);
};

const PoliticalContributionsDashboard: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [searchText, setSearchText] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('All');
  const [runDateFilter, setRunDateFilter] = useState<string>('All');
  const [contributions, setContributions] = useState<Contribution[]>([]);
  const [runDates, setRunDates] = useState<{label: string, value: string}[]>([]);
  
  // Load and transform data on component mount
  useEffect(() => {
    try {
      setLoading(true);
      const data = politicalContributions?.data?.documents || [];
      const transformed = transformContributions(data);
      setContributions(transformed);
      
      // Extract unique run dates
      const dates = Array.from(new Set(transformed.map(c => c.runDate)))
        .filter(Boolean)
        .map(date => ({
          label: date as string,
          value: date as string
        }));
      
      setRunDates([{ label: 'All Runs', value: 'All' }, ...dates]);
    } catch (error) {
      console.error('Error loading political contributions:', error);
      message.error('Failed to load political contributions data');
    } finally {
      setLoading(false);
    }
  }, []);

  const filteredData = useMemo(() => {
    return contributions.filter(item => {
      const matchesSearch = item.employeeName.toLowerCase().includes(searchText.toLowerCase());
      const matchesStatus = statusFilter === 'All' || item.status === statusFilter;
      const matchesRunDate = runDateFilter === 'All' || item.runDate === runDateFilter;
      
      return matchesSearch && matchesStatus && matchesRunDate;
    });
  }, [contributions, searchText, statusFilter, runDateFilter]);

  const columns = [
    {
      title: 'Name',
      dataIndex: 'employeeName',
      key: 'employeeName',
      sorter: (a: Contribution, b: Contribution) => a.employeeName.localeCompare(b.employeeName),
      width: '35%',
      ellipsis: true
    },
    {
      title: 'Latest Contribution',
      dataIndex: 'latestContribution',
      key: 'latestContribution',
      sorter: (a: Contribution, b: Contribution) => a.latestContribution - b.latestContribution,
      width: '20%',
      align: 'right' as const,
      render: (amount: number) => amount.toLocaleString('en-US', { 
        style: 'currency', 
        currency: 'USD',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0 
      }),
    },
    {
      title: 'Contribution Date',
      dataIndex: 'latestContributionDate',
      key: 'latestContributionDate',
      sorter: (a: Contribution, b: Contribution) => 
        new Date(a.latestContributionDate).getTime() - new Date(b.latestContributionDate).getTime(),
      width: '20%',
      render: (date: string) => date ? dayjs(date).format('MMM D, YYYY') : 'N/A',
    },
    {
      title: 'YTD Contribution',
      dataIndex: 'ytdContribution',
      key: 'ytdContribution',
      sorter: (a: Contribution, b: Contribution) => a.ytdContribution - b.ytdContribution,
      width: '20%',
      align: 'right' as const,
      render: (amount: number) => amount.toLocaleString('en-US', { 
        style: 'currency', 
        currency: 'USD',
        minimumFractionDigits: 0, 
        maximumFractionDigits: 0 
      }),
    },
  ];

    const handleSearch = (value: string) => {
    setSearchText(value);
  };

  const handleStatusChange = (value: string) => {
    setStatusFilter(value);
  };

  const handleRunDateChange = (value: string) => {
    setRunDateFilter(value);
  };

  const handleFreshRun = () => {
    setLoading(true);
    // In a real app, this would trigger an API call to refresh the data
    setTimeout(() => {
      message.success('Political contributions data refreshed successfully');
      setLoading(false);
    }, 1500);
  };

  // Calculate summary statistics
  const summaryStats = useMemo(() => {
    const totalEmployees = contributions.length;
    const totalContributions = contributions.reduce((sum, curr) => sum + curr.ytdContribution, 0);
    const redAlerts = contributions.filter(c => c.status === 'Red').length;
    const amberAlerts = contributions.filter(c => c.status === 'Amber').length;
    const greenAlerts = contributions.filter(c => c.status === 'Green').length;
    
    // Find most recent run date and period
    let latestRun = 'No data';
    let periodConsidered = 'N/A';
    
    if (contributions.length > 0) {
      // Get the latest run date
      const latestRunData = contributions.reduce((latest, curr) => {
        const currDate = curr.runDate ? new Date(curr.runDate.split(' to ')[0]).getTime() : 0;
        const latestDate = latest?.runDate ? new Date(latest.runDate.split(' to ')[0]).getTime() : 0;
        return currDate > latestDate ? curr : latest;
      }, null as Contribution | null);
      
      if (latestRunData) {
        latestRun = latestRunData.runDate || 'N/A';
        // Set period considered (assuming 1 month period ending on the run date)
        const runDate = latestRunData.runDate ? new Date(latestRunData.runDate.split(' to ')[0]) : new Date();
        const periodEnd = new Date(runDate);
        const periodStart = new Date(runDate);
        periodStart.setMonth(periodStart.getMonth() - 1);
        periodConsidered = `${periodStart.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })} - ${periodEnd.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}`;
      }
    }
    
    // Calculate duration (assuming 20 minutes for the run)
    const startedAt = new Date();
    const completedAt = new Date(startedAt.getTime() + 20 * 60 * 1000); // 20 minutes later
    
    return {
      totalEmployees,
      totalContributions,
      redAlerts,
      amberAlerts,
      greenAlerts,
      latestRun,
      periodConsidered,
      startedAt: startedAt.toLocaleString('en-US', { month: '2-digit', day: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' }),
      completedAt: completedAt.toLocaleString('en-US', { month: '2-digit', day: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' }),
      duration: '19 min 58 sec',
      contributionCategory: ['Green', 'Amber', 'Red'] // Default category
    };
  }, [contributions]);

  return (
    <div style={{ 
      width: '100%', 
      maxWidth: '100%',
      padding: '0 24px',
      margin: 0,
      boxSizing: 'border-box'
    }}>
      <Spin spinning={loading}>
        {/* Header Section */}
        <Row gutter={[16, 16]} style={{ 
          marginBottom: 24, 
          width: '100%',
          maxWidth: '100%',
          marginLeft: 0,
          marginRight: 0
        }}>
          <Col xs={24} md={6}>
            <Select
              value={runDateFilter}
              style={{ width: '100%' }}
              onChange={handleRunDateChange}
              loading={loading}
              placeholder="Filter by run date"
            >
              {runDates.map(date => (
                <Option key={date.value} value={date.value}>
                  {date.label === 'All Runs' ? 'All Runs' : `Run Date: ${date.label}`}
                </Option>
              ))}
            </Select>
          </Col>
          <Col xs={24} md={12}>
            <Search
              placeholder="Search by employee name..."
              allowClear
              enterButton={<SearchOutlined />}
              onSearch={handleSearch}
              style={{ width: '100%' }}
              loading={loading}
            />
          </Col>
          <Col xs={24} md={6} style={{ textAlign: 'right' }}>
            <Button 
              type="primary" 
              icon={<ReloadOutlined />}
              onClick={handleFreshRun}
              loading={loading}
            >
              Refresh Data
            </Button>
          </Col>
        </Row>

        {/* Summary Cards */}
        <Row gutter={[16, 16]} style={{ 
          marginBottom: 24, 
          width: '100%',
          maxWidth: '100%',
          marginLeft: 0,
          marginRight: 0
        }}>
          <Col xs={24} sm={12} md={4}>
            <Card size="small" style={{ height: '100%' }}>
              <div style={{ display: 'flex', flexDirection: 'column' }}>
                <Text type="secondary">Started At</Text>
                <Text strong style={{ marginTop: 4, fontSize: '0.9rem' }}>
                  {summaryStats.startedAt}
                </Text>
              </div>
            </Card>
          </Col>
          <Col xs={24} sm={12} md={4}>
            <Card size="small" style={{ height: '100%' }}>
              <div style={{ display: 'flex', flexDirection: 'column' }}>
                <Text type="secondary">Completed At</Text>
                <Text strong style={{ marginTop: 4, fontSize: '0.9rem' }}>
                  {summaryStats.completedAt}
                </Text>
              </div>
            </Card>
          </Col>
          <Col xs={24} sm={12} md={4}>
            <Card size="small" style={{ height: '100%' }}>
              <div style={{ display: 'flex', flexDirection: 'column' }}>
                <Text type="secondary">Duration</Text>
                <Text strong style={{ marginTop: 4, fontSize: '0.9rem' }}>
                  {summaryStats.duration}
                </Text>
              </div>
            </Card>
          </Col>
          <Col xs={24} sm={12} md={4}>
            <Card size="small" style={{ height: '100%' }}>
              <div style={{ display: 'flex', flexDirection: 'column' }}>
                <Text type="secondary">Period Considered</Text>
                <Text strong style={{ marginTop: 4, fontSize: '0.9rem' }}>
                  {summaryStats.periodConsidered}
                </Text>
              </div>
            </Card>
          </Col>
          <Col xs={24} sm={12} md={4}>
            <Card size="small" style={{ height: '100%' }}>
              <div style={{ display: 'flex', flexDirection: 'column' }}>
                <Text type="secondary">Employees Analyzed</Text>
                <Text strong style={{ marginTop: 4, fontSize: '1.1rem' }}>
                  {summaryStats.totalEmployees}
                </Text>
              </div>
            </Card>
          </Col>
          <Col xs={24} sm={12} md={4}>
            <Card size="small" style={{ height: '100%' }}>
              <div style={{ display: 'flex', flexDirection: 'column' }}>
                <Text type="secondary">Contribution Category</Text>
                <Select 
                  defaultValue="Green" 
                  style={{ width: '100%', marginTop: 4 }}
                  onChange={handleStatusChange}
                >
                  <Option value="All">All</Option>
                  <Option value="Green">Green</Option>
                  <Option value="Amber">Amber</Option>
                  <Option value="Red">Red</Option>
                </Select>
              </div>
            </Card>
          </Col>
        </Row>

        {/* Table Section */}
        <div style={{ 
          width: '100%', 
          maxWidth: '100%',
          overflowX: 'auto',
          margin: 0,
          padding: 0
        }}>
          <Table 
            columns={columns} 
            dataSource={filteredData} 
            loading={loading}
            pagination={{ 
              pageSize: 10, 
              position: ['bottomCenter'],
              showSizeChanger: true,
              showTotal: (total) => `Total ${total} employees`
            }}
            scroll={{ x: 'max-content' }}
            style={{ width: '100%' }}
            bordered
            locale={{
              emptyText:
                searchText || statusFilter !== 'All' || runDateFilter !== 'All'
                  ? 'No matching records found'
                  : 'No data available',
            }}
            className="contributions-table"
          />
        </div>
      </Spin>
    </div>
  );
};

export default PoliticalContributionsDashboard;
