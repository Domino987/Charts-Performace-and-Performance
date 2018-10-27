import { Card, CardActions, CardContent, CardHeader, createStyles, Theme, withStyles, WithStyles } from '@material-ui/core';
import autobind from 'autobind-decorator';
import React, { PureComponent } from 'react';
import { FlexibleWidthXYPlot, Hint, LineSeries,MarkSeries, XAxis, YAxis } from 'react-vis';
import { formatHint, tickFormatter } from 'src/utils/utils';

const styles = (theme: Theme) => createStyles({
    
});

interface IProps extends WithStyles<typeof styles> {
    dataPoints: IDatapoint[][];
}

interface IState {
    hoveringDatapoint: IDatapoint | null;
}

@autobind
class SimpleInteraction extends PureComponent<IProps, IState> {

    private rendered = 0;

    constructor(props: IProps) {
        super(props);
        this.state = {
            hoveringDatapoint: null
        }
    }
    public render() {
        const { dataPoints } = this.props;
        const { hoveringDatapoint } = this.state;
        return (
            <Card>
                <CardHeader
                    title={"Simple Interaction"} />
                <CardContent>
                    <FlexibleWidthXYPlot
                        height={500}
                        onMouseLeave={this.onLeave}>
                        <XAxis title="X Axis" position="end" />
                        <YAxis title="Y Axis" tickFormat={tickFormatter}/>
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
                            hoveringDatapoint ?
                                <Hint
                                    format={formatHint}
                                    value={hoveringDatapoint} />
                                : null
                        }
                        {
                            hoveringDatapoint ?
                                <MarkSeries
                                    data={[hoveringDatapoint]}
                                    color={'red'} />
                                : null
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
    private onNearestX(datapoint: IDatapoint): void {
        this.setState({
            hoveringDatapoint: datapoint
        });
    }
    private onLeave(): void {
        this.setState({
            hoveringDatapoint: null
        });
    }


}
export default withStyles(styles)(SimpleInteraction);