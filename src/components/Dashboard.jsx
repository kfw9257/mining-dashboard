import { Container, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TableSortLabel } from '@mui/material';
import { miners } from '../data/miners';
import React, { useState } from 'react';

function descendingComparator(a, b, orderBy) {
  if (b[orderBy] < a[orderBy]) {
    return -1;
  }
  if (b[orderBy] > a[orderBy]) {
    return 1;
  }
  return 0;
}

const getComparator = (order, orderBy) => {
  return order === 'desc'
    ? (a, b) => descendingComparator(a, b, orderBy)
    : (a, b) => -descendingComparator(a, b, orderBy);
}

function Dashboard() {
  const [order, setOrder] = useState('asc');
  const [orderBy, setOrderBy] = useState('name');
   const rows = React.useMemo(
    () => [...miners].sort(getComparator(order, orderBy)),
    [order, orderBy]
  );

  const handleSortUpdate = (value) => {
    setOrder(order === 'asc' ? 'desc' : 'asc');
    setOrderBy(value);
  }

  return (<Container>
    <div><p>Miner Stats</p></div>
    <TableContainer component={Paper}>
      <Table sx={{ minWidth: 650 }}>
        <TableHead>
          <TableRow>
            <TableCell>
              <TableSortLabel 
                active={orderBy === 'name'}
                direction={orderBy === 'name' ? order : 'asc'}
                onClick={() => handleSortUpdate('name')}
              >
                Miner Name
              </TableSortLabel>
            </TableCell>
            <TableCell align="right">
              <TableSortLabel 
                active={orderBy === 'hashrate'}
                direction={orderBy === 'hashrate' ? order : 'asc'}
                onClick={() => handleSortUpdate('hashrate')}
              >
                Hashrate
              </TableSortLabel>
            </TableCell>
            <TableCell align="right">
              <TableSortLabel 
                active={orderBy === 'workers'}
                direction={orderBy === 'workers' ? order : 'asc'}
                onClick={() => handleSortUpdate('workers')}
              >
                Workers
              </TableSortLabel>
            </TableCell>
            <TableCell align="right">
              <TableSortLabel 
                active={orderBy === 'online'}
                direction={orderBy === 'online' ? order : 'asc'}
                onClick={() => handleSortUpdate('online')}
              >
                Status
              </TableSortLabel>
            </TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {rows.sort(getComparator(order, orderBy)).map((miner) => (
            <TableRow
              key={miner.id}
            >
              <TableCell>
                {miner.name}
              </TableCell>
              <TableCell align="right">{miner.hashrate}</TableCell>
              <TableCell align="right">{miner.workers}</TableCell>
              <TableCell align="right">
                {miner.online ? 'Online' : 'Offline'}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  </Container>);
}

export default Dashboard;