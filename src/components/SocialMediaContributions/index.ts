// import React, { useState, useMemo } from 'react';
// import { 
//   Row, 
//   Col, 
//   Typography, 
//   Badge, 
//   Card, 
//   Select, 
//   Input, 
//   Button, 
//   Table, 
//   Spin,
// } from 'antd';
// import { SearchOutlined, ReloadOutlined } from '@ant-design/icons';
// import dayjs from 'dayjs';

// const { Title, Text } = Typography;
// const { Option } = Select;
// const { Search } = Input;

// // Mock data for the table
// const mockData = [
//   {
//     key: '1',
//     name: 'John Doe',
//     latestContribution: 1500,
//     latestContributionDate: '2025-07-15',
//     ytdContribution: 4500,
//     category: 'Federal'
//   },
//   {
//     key: '2',
//     name: 'Jane Smith',
//     latestContribution: 1000,
//     latestContributionDate: '2025-07-20',
//     ytdContribution: 3500,
//     category: 'State'
//   },
//   // Add more mock data as needed
// ];

// const PoliticalContributionsDashboard: React.FC = () => {
//   const [loading, setLoading] = useState(false);
//   const [searchText, setSearchText] = useState('');
//   const [categoryFilter, setCategoryFilter] = useState('All');

//   const filteredData = useMemo(() => {
//     return mockData.filter(item => {
//       const matchesSearch = item.name.toLowerCase().includes(searchText.toLowerCase());
//       const matchesCategory = categoryFilter === 'All' || item.category === categoryFilter;
//       return matchesSearch && matchesCategory;
//     });
//   }, [searchText, categoryFilter]);

//   const columns = [
//     {
//       title: 'Name',
//       dataIndex: 'name',
//       key: 'name',
//       sorter: (a: any, b: any) => a.name.localeCompare(b.name),
//     },
//     {
//       title: 'Latest Contribution ($)',
//       dataIndex: 'latestContribution',
//       key: 'latestContribution',
//       sorter: (a: any, b: any) => a.latestContribution - b.latestContribution,
//       render: (amount: number) => amount?.toLocaleString('en-US', { style: 'currency', currency: 'USD', minimumFractionDigits: 0, maximumFractionDigits: 0 }) || 'N/A',
//     },
//     {
//       title: 'Latest Contribution Date',
//       dataIndex: 'latestContributionDate',
//       key: 'latestContributionDate',
//       sorter: (a: any, b: any) => new Date(a.latestContributionDate).getTime() - new Date(b.latestContributionDate).getTime(),
//       render: (date: string) => date ? dayjs(date).format('MMM D, YYYY') : 'N/A',
//     },
//     {
//       title: 'YTD Contribution ($)',
//       dataIndex: 'ytdContribution',
//       key: 'ytdContribution',
//       sorter: (a: any, b: any) => a.ytdContribution - b.ytdContribution,
//       render: (amount: number) => amount?.toLocaleString('en-US', { style: 'currency', currency: 'USD', minimumFractionDigits: 0, maximumFractionDigits: 0 }) || 'N/A',
//     },
//   ];

//   const handleSearch = (value: string) => {
//     setSearchText(value);
//   };

//   const handleCategoryChange = (value: string) => {
//     setCategoryFilter(value);
//   };

//   const handleFreshRun = () => {
//     setLoading(true);
//     // Simulate API call
//     setTimeout(() => {
//       setLoading(false);
//     }, 1500);
//   };

//   return (
//     <div className="political-contributions-dashboard">
//       <Spin spinning={loading}>
//         {/* Header Section */}

//         <Row gutter={[16, 16]} style={{ marginBottom: 24 }} align="middle">
//           <Col xs={24} md={8}>
//             <Select
//               defaultValue="All"
//               style={{ width: '100%' }}
//               onChange={handleCategoryChange}
//             >
//               <Option value="All">Run Date – {dayjs().format('MMM D, YYYY')}</Option>
//               <Option value="All">Run Date – {dayjs().subtract(1, 'month').format('MMM D, YYYY')}</Option>
//               <Option value="All">Run Date – {dayjs().subtract(2, 'month').format('MMM D, YYYY')}</Option>
//             </Select>
//           </Col>
//           <Col xs={24} md={10}>
//             <Search
//               placeholder="Search employees..."
//               allowClear
//               enterButton={<SearchOutlined />}
//               onSearch={handleSearch}
//               style={{ width: '100%' }}
//             />
//           </Col>
//           <Col xs={24} md={6} style={{ textAlign: 'right' }}>
//             <Button 
//               type="primary" 
//               icon={<ReloadOutlined />}
//               onClick={handleFreshRun}
//             >
//               Execute Fresh Run
//             </Button>
//           </Col>
//         </Row>
//         {/* Title Section */}
//         <Row justify="space-between" align="middle" style={{ marginBottom: 24 }}>
//           <Col>
//             <Title level={3} style={{ margin: 0 }}>Political Contributions - Alerts & Monitoring Analysis Run</Title>
//           </Col>
//           <Col>
//             <Badge status="success" text="Completed" />
//           </Col>
//         </Row>

//         {/* Summary Cards */}
//         <Row gutter={[16, 16]} style={{ marginBottom: 24 }} justify="space-between">
//           <Col flex="1" style={{ minWidth: '160px', padding: '0 8px' }}>
//             <Card title="Started At" size="small" style={{ height: '100%', margin: 0 }}>
//               <div style={{ fontSize: '0.9rem' }}>{dayjs().format('MM/DD/YYYY HH:mm')}</div>
//             </Card>
//           </Col>
//           <Col flex="1" style={{ minWidth: '160px', padding: '0 8px' }}>
//             <Card title="Completed At" size="small" style={{ height: '100%', margin: 0 }}>
//               <div style={{ fontSize: '0.9rem' }}>{dayjs().add(20, 'minute').format('MM/DD/YYYY HH:mm')}</div>
//             </Card>
//           </Col>
//           <Col flex="1" style={{ minWidth: '140px', padding: '0 8px' }}>
//             <Card title="Duration" size="small" style={{ height: '100%', margin: 0 }}>
//               <div style={{ fontSize: '0.9rem' }}>19 min 58 sec</div>
//             </Card>
//           </Col>
//           <Col flex="1" style={{ minWidth: '140px', padding: '0 8px' }}>
//             <Card title="Employees Analyzed" size="small" style={{ height: '100%', margin: 0 }}>
//               <div style={{ fontSize: '1.1rem', fontWeight: 500 }}>43</div>
//             </Card>
//           </Col>
//           <Col flex="1 1 250px" style={{ padding: '0 8px' }}>
//             <Card title="Contribution Category" size="small" style={{ height: '100%', margin: 0 }}>
//               <Select 
//                 defaultValue="All" 
//                 style={{ width: '100%' }}
//                 size="small"
//                 onChange={handleCategoryChange}
//               >
//                 <Option value="All">All Categories</Option>
//                 <Option value="Federal">Green</Option>
//                 <Option value="State">Amber</Option>
//                 <Option value="Local">Red</Option>
//               </Select>
//             </Card>
//           </Col>
//         </Row>

//         {/* Action Controls */}
        

//         {/* Table Section */}
//         <div className="table-container">
//           <Table
//             columns={columns}
//             dataSource={filteredData}
//             pagination={{
//               pageSize: 10,
//               showSizeChanger: true,
//               pageSizeOptions: ['10', '25', '50'],
//               showTotal: (total, range) => `${range[0]}-${range[1]} of ${total} employees`,
//             }}
//             rowKey="key"
//             scroll={{ x: 'max-content' }}
//             size="middle"
//             bordered
//           />
//         </div>
//       </Spin>
//     </div>
//   );
// };

// export default PoliticalContributionsDashboard;
