import React from 'react'
import Card from '@mui/material/Card';
import CardHeader from '@mui/material/CardHeader';
import Grid from '@mui/material/Grid';
import './Details.css'

function Actions() {
  return (
    <div className="cardHolder">
      <Grid item xs={9} >
      <Card >
        <CardHeader
          title="Actions"
        />
      </Card>
      </Grid>
    </div>
  )
}

export default Actions