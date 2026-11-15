import { Card, Checkbox, Container, FormControlLabel, FormGroup, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TableSortLabel, Typography } from '@mui/material';
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

const onlineMiners = [...miners].filter(m => m.online);
const getTotalHashrate = (miners) => {
   return miners.reduce(
    (accumulator, currentValue) => accumulator + currentValue,
    0,
  ).toFixed(2);
}

function Dashboard() {
  const [order, setOrder] = useState('asc');
  const [orderBy, setOrderBy] = useState('name');
  const [showOnlineOnly, setShowOnlineOnly] = useState(false);
  const rows = React.useMemo(
    () => {
      const displayedMiners = showOnlineOnly ? 
      [...onlineMiners] : [...miners];
      return displayedMiners.sort(getComparator(order, orderBy));
    },
    [order, orderBy, showOnlineOnly]
  );

  const handleSortUpdate = (value) => {
    setOrder(order === 'asc' && value === orderBy ? 'desc' : 'asc');
    setOrderBy(value);
  }

  const handleOnlineOnlyChange = (event) => {
    setShowOnlineOnly(event.target.checked);
  };

  return (<Container>
    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
      <Card 
        variant="outlined" 
        sx={{ padding: '10px', display: 'flex', flexDirection: 'column'}}
      >
          <Typography variant='subtitle1'>Total Miners</Typography>
          <Typography variant='h3'>{miners.length}</Typography>
      </Card>
      <Card 
        variant="outlined" 
        sx={{ padding: '10px', display: 'flex', flexDirection: 'column'}}
      >
          <Typography variant='subtitle1'>Online Miners</Typography>
          <Typography variant='h3'>{onlineMiners.length}</Typography>
      </Card>
      <Card 
        variant="outlined" 
        sx={{ padding: '10px', display: 'flex', flexDirection: 'column'}}
      >
          <Typography variant='subtitle1'>Total Hashrate</Typography>
          <Typography variant='h3'>{getTotalHashrate(miners.map(m => m.hashrate))}</Typography>
          <Typography variant='subtitle1'>TH/s</Typography>
      </Card>
    </div>
    <div style={{ padding: '16px 0px'}}>
      <FormGroup>
        <FormControlLabel control={<Checkbox checked={showOnlineOnly} 
        onChange={handleOnlineOnlyChange} />} label="Show Online Only" />
      </FormGroup>
    </div>
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
                Status
            </TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {rows.map((miner) => (
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