import { Card, CardActions, CardContent, CardHeader, Checkbox, createStyles, FormControlLabel, Theme, withStyles, WithStyles } from '@material-ui/core';
import autobind from 'autobind-decorator';
import memoizeOne from 'memoize-one';
import React, { PureComponent } from 'react';
import { FlexibleWidthXYPlot, Hint, HorizontalGridLines, LineSeries, VerticalGridLines, Voronoi, XAxis, YAxis } from 'react-vis';
import { formatHint } from '../utils/utils';

const styles = (theme: Theme) => createStyles({

});

interface IProps extends WithStyles<typeof styles> {
    dataPoints: IDatapoint[][];
}

interface IState {
    showVoronoi: boolean,
    hoveringDatapoint: IDatapoint | null
}

@autobind
class SimpleVoronoiChart extends PureComponent<IProps, IState> {

    private rendered = 0;


    private nodes = memoizeOne(
        (data: IDatapoint[][]) => {
            return [].concat.apply([], data);
        });
    constructor(props: IProps) {
        super(props);
        this.state = {
            hoveringDatapoint: null,
            showVoronoi: true,
        }
    }
    public render() {
        const { dataPoints } = this.props;
        const { hoveringDatapoint, showVoronoi } = this.state;
        return (
            <Card>
                <CardHeader
                    title={"Simple Voronio"}
                    action={
                        <FormControlLabel
                            control={
                                <Checkbox
                                    checked={showVoronoi}
                                    onChange={this.toggleVoronoi}
                                    value="Show Voronoi"
                                    color="primary"
                                />
                            }
                            label="Show Voronoi"
                        />
                    } />
                <CardContent>
                    <FlexibleWidthXYPlot
                        height={500}
                        xType={'time'}
                        onMouseLeave={this.onLeave}
                        margin={{ left: 0 }}>
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
                        {
                            hoveringDatapoint ? <Hint 
                            value={hoveringDatapoint} 
                            format={formatHint}
                            /> : null
                        }
                        <Voronoi
                            nodes={this.nodes(dataPoints)}
                            onHover={this.onHover}
                            polygonStyle={showVoronoi ? { stroke: 'red' } : {}} />
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
    private onHover(dataPoint: IDatapoint): void {
        this.setState({
            hoveringDatapoint: dataPoint
        });
    }
    private onLeave(): void {
        this.setState({
            hoveringDatapoint: null
        });
    }

    private toggleVoronoi(): void {
        this.setState({
            showVoronoi: !this.state.showVoronoi
        });
    }
}
export default withStyles(styles)(SimpleVoronoiChart);