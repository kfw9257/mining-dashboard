import { Card, Checkbox, Container, FormControlLabel, FormGroup, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TableSortLabel, Typography } from '@mui/material';
import { useCallback, useEffect, useState } from 'react';

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
  const [miners, setMiners] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const onlineMiners = miners.length ? [...miners].filter(m => m.online) : [];
  const displayedMiners = showOnlineOnly ? 
      [...onlineMiners] : [...miners];
  const rows = displayedMiners.length > 0 ? displayedMiners.sort(getComparator(order, orderBy)) : [];
  const fetchData = useCallback(async (controller) => {
    try {
      const response = await fetch('miners.json', { signal: controller.signal });
      if (response.ok) {
        const miners =  await response.json();
        if (!controller.signal.aborted) {
          setMiners(miners)
        }
      } else if (!response.ok && !controller.signal.aborted) {
        throw new Error(`HTTP Error Status ${response.status}`);
      }
    } catch(error) {
      if (error.name !== 'AbortError' && !controller.signal.aborted){
        setMiners([]);
        setError('Error: ' + error);
      }
    } finally {
      if (!controller.signal.aborted ) {
        setLoading(false);
      }
    }
  }, [])

  const handleSortUpdate = (value) => {
    setOrder(order === 'asc' && value === orderBy ? 'desc' : 'asc');
    setOrderBy(value);
  }

  const handleOnlineOnlyChange = (event) => {
    setShowOnlineOnly(event.target.checked);
  };

  useEffect(() => {
    const controller = new AbortController();
    fetchData(controller)
    return () => {
      controller.abort();
    }
  }, [fetchData])

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
          <Typography variant='h3'>{miners.length ? getTotalHashrate(miners.map(m => m.hashrate)): 0}</Typography>
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
          {!loading && rows.length > 0 ? rows.map((miner) => (
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
          )) : loading && !error ? <TableRow><TableCell colSpan={4} align="center">Loading...</TableCell></TableRow> : error ?
           <TableRow><TableCell colSpan={4} align="center">{ error }</TableCell></TableRow> :
           <TableRow><TableCell colSpan={4} align="center">No Miners Found</TableCell></TableRow> 
          }
        </TableBody>
      </Table>
    </TableContainer>
  </Container>);
}

export default Dashboard;