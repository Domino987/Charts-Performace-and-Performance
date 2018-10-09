import { Card, CardContent, createStyles, Theme, withStyles, WithStyles } from '@material-ui/core';
import autobind from 'autobind-decorator';
import React, { PureComponent } from 'react';
import { FlexibleWidthXYPlot, HorizontalGridLines, LineSeries, VerticalGridLines, XAxis, YAxis } from 'react-vis';

const styles = (theme: Theme) => createStyles({

    graph: {
        margin: theme.spacing.unit
    },
    paper: {
        height: '520px',
        margin: theme.spacing.unit * 2
    },
});

interface IProps extends WithStyles<typeof styles> {
    dataPoints: IDatapoint[][];
}



@autobind
class PlainXYPlot extends PureComponent<IProps> {
    constructor(props: IProps) {
        super(props);
    }
    public render() {
        const { classes, dataPoints } = this.props;
        return (
            <Card className={classes.paper}>
                <CardContent>
                    <FlexibleWidthXYPlot
                        height={500}
                        className={classes.graph}>
                        <XAxis title="X Axis" position="end" />
                        <YAxis title="Y Axis" tickFormat={this.tickFormatter} />

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
            </Card>
        );
    }

    @autobind
    private tickFormatter(n: number): number|string {
        if (n >= 1000) {
            return n/1000 + "K";
        }
        return n
    } 
}
export default withStyles(styles)(PlainXYPlot);