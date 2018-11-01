
import { CardContent, CardHeader } from '@material-ui/core';
import { Card } from 'material-ui';
import React from 'react';

interface IProps {
  data: any;
}

export default function InteractionSeperation({ }: IProps) {
  return <Card style={{ height: '620px', width: '100%' }}>
    <CardHeader
      title={"Separation of interaction and rendering"} />
    <CardContent style={{textAlign: 'center'}}>
      <img src='./separation.jpg' alt='separation' height={420}/>
    </CardContent>
  </Card>
}