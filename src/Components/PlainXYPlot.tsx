import { Card, CardActions, CardContent,CardHeader } from '@material-ui/core';
import autobind from 'autobind-decorator';
import React, { PureComponent } from 'react';
import { FlexibleWidthXYPlot, LineSeries, XAxis, YAxis } from 'react-vis';
import { tickFormatter } from 'src/utils/utils';

interface IProps {
    dataPoints: IDatapoint[][];
}

@autobind
export default class PlainXYPlot extends PureComponent<IProps> {

    private rendered = 0;

    constructor(props: IProps) {
        super(props);
    }
    public render() {
        const { dataPoints } = this.props;
        return (
            <Card>
                <CardHeader
                    title={"Simple Chart"} />
                <CardContent>
                    <FlexibleWidthXYPlot
                        height={500}>
                        <XAxis title="X Axis" position="end" tickFormat={tickFormatter} />
                        <YAxis title="Y Axis" tickFormat={tickFormatter} />
                        {
                            dataPoints.map((series: IDatapoint[], index: number) =>
                                <LineSeries
                                    key={index}
                                    data={series}
                                />
                            )
                        }
                    </FlexibleWidthXYPlot>
                </CardContent>
                <CardActions>
                    <div>
                        {"Rendered: " + (++this.rendered)}
                    </div>
                </CardActions>
            </Card>
        );
    }

}
