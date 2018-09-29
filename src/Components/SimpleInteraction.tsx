import { Card, CardContent, createStyles, Theme, withStyles, WithStyles } from '@material-ui/core';
import autobind from 'autobind-decorator';
import React, { PureComponent } from 'react';
import { FlexibleWidthXYPlot, Hint, HorizontalGridLines, LineSeries, VerticalGridLines, XAxis, YAxis } from 'react-vis';

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

interface IState {
    hoveringDatapoint: IDatapoint | null;
}

@autobind
class SimpleInteraction extends PureComponent<IProps, IState> {

    constructor(props: IProps) {
        super(props);
        this.state = {
            hoveringDatapoint: null
        }
    }
    public render() {
        const { classes, dataPoints } = this.props;
        const { hoveringDatapoint } = this.state;
        return (
            <Card className={classes.paper}>
                <CardContent>
                    <FlexibleWidthXYPlot
                        height={500}
                        className={classes.graph}>
                        <XAxis title="X Axis" position="end" />
                        <YAxis title="Y Axis" />

                        <HorizontalGridLines />
                        <VerticalGridLines />
                        {
                            dataPoints.map((series: IDatapoint[], index: number) =>
                                <LineSeries
                                    key={index}
                                    data={series}
                                    onNearestX={this.onNearestX}
                                    // onNearestX={index === 0 ?  this.onNearestX | undefined}
                                />
                            )
                        }
                        {
                            hoveringDatapoint ? <Hint value={hoveringDatapoint}/> : null
                        }
                    </FlexibleWidthXYPlot>
                </CardContent>
            </Card>
        );
    }
    private onNearestX(datapoint: IDatapoint): void {
        this.setState({
            hoveringDatapoint: datapoint
        });
    }
}
export default withStyles(styles)(SimpleInteraction);