import autobind from 'autobind-decorator';
import { scaleLinear} from 'd3-scale';
import * as React from 'react';
import { FlexibleXYPlot, Voronoi } from 'react-vis';
import Highlight from './Highlight';

interface IProps {
    onMouseLeave: () => void,    
    updateArea: (newArea: IChartBounds) => void,
    onNearestX: (datapoint: IDatapoint, event?: object | undefined) => void,
    chartBounds: IChartBounds,
    showVoronoi?: boolean,
    voronoiData: IDatapoint[],
    height: number,
    width: number
}
@autobind
export default class VoronoiComponent extends React.PureComponent<IProps> {

    constructor(props: IProps) {
        super(props);
    }

    public render() {
        const { onMouseLeave, onNearestX, chartBounds, voronoiData, height, width, showVoronoi } = this.props;
        return (
            <div 
                style={{ width: '100%', height: '100%', position: 'absolute', top: '0' }}
                onContextMenu={this.onContextClick}>
                <FlexibleXYPlot
                    xType={'time'}
                    onMouseLeave={onMouseLeave}
                    yDomain={[chartBounds.bottom, chartBounds.top]}
                    onWheel={this.onWheelXY}
                    dontCheckIfEmpty={true}
                    xDomain={[chartBounds.left, chartBounds.right]}>
                    <Voronoi
                        nodes={voronoiData}
                        onHover={onNearestX}
                        polygonStyle={showVoronoi ? { stroke: 'red' } : {}}
                    />
                    <Highlight
                        marginBottom={60}
                        marginTop={10}
                        marginLeft={50}
                        innerWidth={width}
                        innerHeight={height - 40}
                        onBrushEnd={this.onBrushEnd}
                        onDrag={this.onDrag}
                    />
                </FlexibleXYPlot>
            </div>
        );
    }
    /**
     * Drags the graph by the selected area
     * 
     * @param { IChartBounds } area The area to drag  
     * 
     */
    private onDrag(area: IChartBounds): void {
        if (area) {
            const { chartBounds, updateArea } = this.props;
            const newArea = {
                bottom: chartBounds.bottom + (area.top - area.bottom),
                left: new Date(chartBounds.left.getTime() - (area.right.getTime() - area.left.getTime())),
                right: new Date(chartBounds.right.getTime() - (area.right.getTime() - area.left.getTime())),
                top: chartBounds.top + (area.top - area.bottom),
            }
            updateArea(newArea);            
        }
    }
    /**
     * Zooms the graph to the selceted area by drawing 
     * 
     * @param { IChartBounds } area
     * The drawn area  
     * 
     */
    private onBrushEnd(area: IChartBounds): void {
        if (area) {
            this.props.updateArea(area);
        }
    }
    /**
     * Handles the zooming by scolling X and Y
     * 
     * @param {React.WheelEvent} e
     * 
     */
    private onWheelXY(e: React.WheelEvent): void {
        e.preventDefault();
        const { width, height ,chartBounds } = this.props;

        let xLoc = e.nativeEvent.offsetX;
        let yLoc = e.nativeEvent.offsetY;
        if (e.nativeEvent.type === 'touchmove') {
            xLoc = e.nativeEvent.pageX;
            yLoc = e.nativeEvent.pageY;
        }
        const xValue = scaleLinear().domain([chartBounds.left, chartBounds.right]).range([0, width]).invert(xLoc);
        const yValue = scaleLinear().domain([chartBounds.bottom, chartBounds.top]).range([height, 0]).invert(yLoc);
        const maxDate = chartBounds.right.getTime();
        const minDate = chartBounds.left.getTime();
        const maxY = chartBounds.top;
        const minY = chartBounds.bottom;
        let multiplicator = 1;
        if (e.nativeEvent.deltaY > 0) {
            multiplicator = -1;
        }
        const newArea = {
            bottom: minY + ((yValue - minY) / 10 * multiplicator),
            left: new Date(minDate + ((xValue - minDate) / 10 * multiplicator)),
            right: new Date(maxDate - ((maxDate - xValue) / 10 * multiplicator)),
            top: maxY - ((maxY - yValue) / 10 * multiplicator),
        }
        this.props.updateArea(newArea);
    }
    /**
     * Prevents Context Menu for right clicks
     *
     * @private
     * @param {React.MouseEvent} e The Mouse Event
     * @returns {boolean} Wether the Context menu should be displayed
     * @memberof VoronoiComponent
     */
    private onContextClick(e: React.MouseEvent): boolean {
        e.preventDefault();
        return false;
    }
}