
import { CardContent, CardHeader } from '@material-ui/core';
import { Card } from 'material-ui';
import React from 'react';

interface IProps {
  data: any;
}

export default function ReactVisInteraction({ }: IProps) {
  return <Card style={{ height: '620px', width: '100%' }}>
    <CardHeader
      title={"Interaction Types"} />
    <CardContent style={{textAlign: 'center'}}>
      <img src='./react-vis_interaction.png' height={520} alt='interactions' />
    </CardContent>
  </Card>
}