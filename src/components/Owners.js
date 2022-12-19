import React from 'react'
import Card from '@mui/material/Card';
import CardHeader from '@mui/material/CardHeader';
import './Details.css'
import { Grid } from '@mui/material';

function Owners() {
  return (
    <div className="cardHolder">
       <Grid item xs={9} >
      <Card >
        <CardHeader
          title="Owners"
        />
      </Card>
      </Grid>
    </div>
  )
}

export default Owners