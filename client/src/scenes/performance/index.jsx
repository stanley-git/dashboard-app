import { React, useEffect, useState } from 'react';
import { Box, useTheme } from '@mui/material';
import { useGetUserPerformanceQuery } from 'state/api';
import { useSelector } from 'react-redux';
import { DataGrid } from '@mui/x-data-grid';
import Header from 'components/Header';
import CustomColumnMenu from 'components/DataGridCustomColumnMenu';
import { render } from '@testing-library/react';

const Performance = () => {

    const theme = useTheme();
    const userId = useSelector((state) => state.global.userId);
    // console.log("userId", userId);
    const { data, isLoading } = useGetUserPerformanceQuery(userId);

    // console.log("data", data);
    const [salesData, setSalesData] = useState(undefined);

    useEffect(() => {
        if (data) {
            setSalesData(data.sales);
            // console.log(sales);
        }

    }, [data]);


    const columns = [
        {
            field: "_id",
            headerName: "ID",
            flex: 1
        },
        {
            field: "userId",
            headerName: "User ID",
            flex: 1
        },
        {
            field: "createdAt",
            headerName: "Created At",
            flex: 1
        },
        {
            field: "products",
            headerName: "# of Products",
            flex: 0.5,
            sortable: false,
            renderCell: (params) => params.value.length
        },
        {
            field: "cost",
            headerName: "Cost",
            flex: 1,
            renderCell: (params) => `$${Number(params.value).toFixed(2)}`
        },

    ]

    return (
        <Box
            m="1.5rem 2.5rem"
        >
            <Header title="PERFORMANCE" subtitle="Track Your Affiliate Sales Performance Here" />
            <Box
                mt="40px"
                height="105vh"
                sx={{
                    "& .MuiDataGrid-root": {
                        border: "none"
                    },
                    "& .MuiDataGrid-cell": {
                        borderBottom: "none"
                    },
                    "& .MuiDataGrid-columnHeaders": {
                        backgroundColor: theme.palette.background.alt,
                        color: theme.palette.secondary[100],
                        borderBottom: "none"
                    },
                    "& .MuiDataGrid-virtualScroller": {
                        backgroundColor: theme.palette.primary.light,
                    },
                    "& .MuiDataGrid-footerContainer": {
                        backgroundColor: theme.palette.background.alt,
                        color: theme.palette.secondary[100],
                        borderTop: "none"
                    },
                    "& .MuiDataGrid-toolbarContainer": {
                        color: `${theme.palette.secondary[200]} !important`,
                    },

                }}
            >
                <DataGrid
                    loading={isLoading || !salesData}
                    getRowId={(row) => row._id}
                    rows={salesData || []}
                    // rows={data.sales || []}
                    columns={columns}
                    components={{
                        ColumnMenu: CustomColumnMenu
                    }}
                />
            </Box>
            <Box height="10vh" sx={{
                // paddingTop: "100px",
                // paddingBottom: "100px"
            }}></Box>

        </Box>
    )
}

export default Performance