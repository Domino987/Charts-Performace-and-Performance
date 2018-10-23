import { Card, CardActions, CardContent,CardHeader, createStyles, Theme, withStyles, WithStyles } from '@material-ui/core';
import autobind from 'autobind-decorator';
import React, { PureComponent } from 'react';
import { FlexibleWidthXYPlot, HorizontalGridLines, LineSeries, VerticalGridLines, XAxis, YAxis } from 'react-vis';

const styles = (theme: Theme) => createStyles({
});

interface IProps extends WithStyles<typeof styles> {
    dataPoints: IDatapoint[][];
}

@autobind
class PlainXYPlot extends PureComponent<IProps> {

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
                        height={500}
                        xType={'time'}>                        
                        <XAxis title="X Axis" position="end" />
                        <YAxis title="Y Axis" />

                        <HorizontalGridLines />
                        <VerticalGridLines />
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
export default withStyles(styles)(PlainXYPlot);