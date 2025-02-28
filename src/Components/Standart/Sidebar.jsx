// src/Components/Standart/Sidebar.jsx
import React, { useState, useEffect } from 'react';
import { Drawer, List, ListItem, ListItemIcon, ListItemText, IconButton, Divider } from '@mui/material';
import { Menu, Home, TableChart, BarChart, People, Settings } from '@mui/icons-material';
import { Link } from 'react-router-dom';

const Sidebar = () => {
  const [open, setOpen] = useState(true);

  useEffect(() => {
    const savedState = localStorage.getItem('sidebarOpen');
    if (savedState !== null) {
      setOpen(JSON.parse(savedState));
    }
  }, []);

  const toggleSidebar = () => {
    const newState = !open;
    setOpen(newState);
    localStorage.setItem('sidebarOpen', JSON.stringify(newState));
  };

  const menuItems = [
    { text: 'Попытки экзаменов', icon: <Home />, path: '/' },
  ];

  return (
    <Drawer variant="permanent" open={open} sx={{ width: open ? 240 : 80, flexShrink: 0, '& .MuiDrawer-paper': { width: open ? 240 : 80, transition: 'width 0.3s' } }}>
      <List>
        <ListItem button onClick={toggleSidebar} sx={{cursor: 'pointer'}}>
          <ListItemIcon><Menu /></ListItemIcon>
          {open && <ListItemText primary="Меню" />}
        </ListItem>
      </List>
      <Divider />
      <List>
        {menuItems.map((item) => (
          <ListItem button component={Link} to={item.path} key={item.text}>
            <ListItemIcon>{item.icon}</ListItemIcon>
            {open && <ListItemText primary={item.text} sx={{color: '#000'}} />}
          </ListItem>
        ))}
      </List>
    </Drawer>
  );
};

export default Sidebar;