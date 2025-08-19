import React from 'react';
import { Layout, Avatar, Badge, Button, Dropdown, Space, Typography } from 'antd';
import { BellOutlined, UserOutlined, LogoutOutlined, SettingOutlined, CloseOutlined } from '@ant-design/icons';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import './Header.css';
import XponanceLogo from '../../assets/images/Xponance-Logo.png';
import SophiaUser from '../../assets/images/sophia_user.png';

const { Header: AntHeader } = Layout;
// Removed: const { Text } = Typography;

const Header: React.FC = () => {
  const { logout } = useAuth(); // Removed 'user'
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const handleLogoClick = () => {
    navigate('/dashboard');
  };

  const handleMenuClick = (e: { key: string }) => {
    if (e.key === 'logout') {
      handleLogout();
    }
    // Add more actions for other keys if needed
  };

  const menuItems = [
    {
      key: 'profile',
      icon: <UserOutlined />,
      label: 'Profile',
    },
    {
      key: 'settings',
      icon: <SettingOutlined />,
      label: 'Settings',
    },
    {
      type: 'divider',
    },
    {
      key: 'logout',
      icon: <LogoutOutlined />,
      label: 'Logout',
    },
  ];

  return (
    <AntHeader className="header">
      <div className="header-content">
        <div className="logo" onClick={handleLogoClick}>
          <img src={XponanceLogo} alt="Xponance Logo" style={{ height: 32, width: 'auto', marginRight: 8 }} />
          <div className="logo-text-container">
            <span className="logo-text">Sophia - Xponance's AI Compliance Agent</span>
            {/* <span className="logo-subtitle">Compliance Management</span> */}
          </div>
        </div>
        
        <div className="header-actions">
          <Space size="middle">            
            <h1 onClick={handleLogoClick} style={{cursor:'pointer',fontSize:'16px',fontWeight:'600',marginRight:'20px'}}>Tasks</h1>
            <Dropdown menu={{ items: menuItems, onClick: handleMenuClick }} placement="bottomRight">
              <div className="user-profile">
                <Avatar src={SophiaUser} className="user-avatar" size={44} />
              </div>
            </Dropdown>
            <Button onClick={handleLogout} icon={<LogoutOutlined />} />
          </Space>
        </div>
      </div>
    </AntHeader>
  );
};

export default Header;