import { Card, CardActions, CardContent, CardHeader, Checkbox, createStyles, FormControlLabel, Theme, withStyles, WithStyles } from '@material-ui/core';
import { ZoomOut } from '@material-ui/icons';
import autobind from 'autobind-decorator';
import React, { PureComponent } from 'react';
import { FlexibleWidthXYPlot, Hint, HorizontalGridLines, LineSeries, VerticalGridLines, XAxis, YAxis } from 'react-vis';
import { formatHint } from '../utils/utils';

const styles = (theme: Theme) => createStyles({

});

interface IProps extends WithStyles<typeof styles> {
    dataPoints: IDatapoint[][];
}

interface IState {
    showVoronoi: boolean,
    chartBounds: IChartBounds,
    hoveringDatapoint: IDatapoint | null,
    isZooming: boolean,
}

@autobind
class AdvancedVoronoiChart extends PureComponent<IProps, IState> {

    private rendered = 0;


    constructor(props: IProps) {
        super(props);
        this.state = {
            chartBounds: this.getFullChartBounds(),
            hoveringDatapoint: null,
            isZooming: false,
            showVoronoi: true,
        }
    }
    public render() {
        const { dataPoints } = this.props;
        const { hoveringDatapoint, showVoronoi, isZooming } = this.state;
        return (
            <Card>
                <CardHeader
                    title={"Advanced Voronio"}
                    action={
                        <div>
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
                            {
                                isZooming ? <ZoomOut onClick={this.zoomOut}/> : null
                            }
                        </div>
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
    private zoomOut(): void {
        this.setState({
            chartBounds: this.getFullChartBounds(),
            isZooming: false,
        })
    }
    private getFullChartBounds(): IChartBounds {
        const { dataPoints} = this.props;        
        const lastDataPointArray = dataPoints[dataPoints.length - 1];
        const lastDataPoint = lastDataPointArray[lastDataPointArray.length - 1];
        return {
            bottom: 0,
            left: new Date(86400000),
            right: lastDataPoint.x,
            top: lastDataPoint.y,
        };
    }
}
export default withStyles(styles)(AdvancedVoronoiChart);