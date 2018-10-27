import { Card, CardActions, CardContent, CardHeader, Checkbox, createStyles, FormControlLabel, Theme, withStyles, WithStyles } from '@material-ui/core';
import { ZoomOut } from '@material-ui/icons';
import autobind from 'autobind-decorator';
import memoizeOne from 'memoize-one';
import React, { PureComponent } from 'react';
import { Hint, MarkSeries, XYPlot } from 'react-vis';
import { ramerDouglasPeuckerSimplyfication } from 'src/utils/utils';
import { formatHint } from '../utils/utils';
import AdvancedVoronio from './AdvancedVoronoi';

const styles = (theme: Theme) => createStyles({

});

interface IProps extends WithStyles<typeof styles> {
    dataPoints: IDatapoint[][];
}

interface IState {
    showVoronoi: boolean,
    hoveringDatapoint: IDatapoint | null,
    isZooming: boolean,
    rendered: number,
    zoomedChartBounds: IArea | null
}

@autobind
class AdvancedVoronoiChart extends PureComponent<IProps, IState> {

    private propsChartBounds = memoizeOne((datapoints: IDatapoint[][]) => this.getPropsChartBounds(datapoints));

    private reducedData = memoizeOne((dataPoints: IDatapoint[][]) => {
        const newData = [] as IDatapoint[][];
        dataPoints.forEach((series: IDatapoint[]) => {
            newData.push(ramerDouglasPeuckerSimplyfication(series, 1, true));
        });
        return newData;
    });

    constructor(props: IProps) {
        super(props);
        this.state = {
            hoveringDatapoint: null,
            isZooming: false,
            rendered: 1,
            showVoronoi: false,
            zoomedChartBounds: null,
        }
    }
    public render() {
        const { dataPoints } = this.props;
        const { hoveringDatapoint, showVoronoi, isZooming, rendered } = this.state;
        const chartBounds = this.getChartBounds();
        return (
            <Card
                onMouseLeave={this.mouseLeave}>
                <CardHeader
                    title={"Douglas Peucker Algorithm"}
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
                                isZooming ? <ZoomOut onClick={this.zoomOut} /> : null
                            }
                        </div>
                    } />
                <CardContent style={{ position: 'relative' }}>
                    <XYPlot
                        height={500}
                        width={1260}
                        yDomain={[chartBounds.bottom, chartBounds.top]}
                        xDomain={[chartBounds.left, chartBounds.right]}
                        margin={{ left: 40 }}>
                        {
                            hoveringDatapoint ? <Hint
                                value={hoveringDatapoint}
                                format={formatHint}
                            /> : null
                        }{
                            hoveringDatapoint ?
                                <MarkSeries
                                    data={[hoveringDatapoint]}
                                    color={'red'} />
                                : null
                        }
                    </XYPlot>
                    <AdvancedVoronio
                        showVoronoi={showVoronoi}
                        simplyfiyData={true}
                        updateChartBounds={this.updateChartBounds}
                        chartBounds={chartBounds}
                        increaseRenderCount={this.increaseRenderCount}
                        setHovering={this.setHovering}
                        data={this.reducedData(dataPoints)} />
                </CardContent>
                <CardActions>
                    <div>
                        {"Rendered: " + (rendered)}
                    </div>
                </CardActions>
            </Card>
        );
    }
    private mouseLeave(): void {
        this.setHovering();
    }

    private increaseRenderCount(): void {
        this.setState({
            rendered: this.state.rendered + 1
        })
    }

    private setHovering(datapoint?: IDatapoint): void {
        this.setState({
            hoveringDatapoint: datapoint ? datapoint : null
        });
    }

    private toggleVoronoi(): void {
        this.setState({
            showVoronoi: !this.state.showVoronoi
        });
    }
    private zoomOut(): void {
        this.setState({
            isZooming: false,
        })
    }
    private getChartBounds(): IArea {
        const {isZooming, zoomedChartBounds} = this.state;
        if(isZooming && zoomedChartBounds){
            return zoomedChartBounds;
        }
        return this.propsChartBounds(this.props.dataPoints);
        
    }
    private getPropsChartBounds(dataPoints: IDatapoint[][]): IArea{
        const lastDataPointArray = dataPoints[dataPoints.length - 1];
        const lastDataPoint = lastDataPointArray[lastDataPointArray.length - 1];
        return {
            bottom: 0,
            left: 0,
            right: lastDataPoint.x,
            top: lastDataPoint.y,
        };
    }
    private updateChartBounds(newArea: IArea): void {
        this.setState({
            isZooming: true,
            zoomedChartBounds: newArea
        });
    }
}
export default withStyles(styles)(AdvancedVoronoiChart);