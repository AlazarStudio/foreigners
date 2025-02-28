import React from "react";
import { Outlet } from "react-router-dom";

import { Box } from '@mui/material';
import Sidebar from "../Sidebar"


function Empty({ children, ...props }) {
    return (
        <Box sx={{ p: 2 }}>
            {/* <Sidebar/> */}
            <Outlet />
        </Box>
    );
}

export default Empty;