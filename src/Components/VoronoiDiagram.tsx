
import { CardContent, CardHeader } from '@material-ui/core';
import { Card } from 'material-ui';
import React from 'react';

interface IProps {
  data: any;
}

export default function VoronoiDiagram({ }: IProps) {
  return <Card style={{ height: '620px', width: '100%' }}>
    <CardHeader
      title={"Voronoi Diagram"} />
    <CardContent style={{textAlign: 'center'}}>
      <img src='./voronoi_diagram.svg' height={520} alt='voronoi' />
    </CardContent>
  </Card>
}