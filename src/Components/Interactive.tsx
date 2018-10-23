import autobind from 'autobind-decorator';
import * as React from 'react';
import { FlexibleXYPlot, Hint } from 'react-vis';
import { formatHint } from '../utils/utils';
import VoronoiComponent from './Voronoi';

interface IProps {    
    updateArea: (newArea: IChartBounds) => void,
    chartBounds: IChartBounds,
    showVoronoi?: boolean,
    voronoiData: IDatapoint[],
}
interface IState {
    crossHairPoint: IDatapoint | undefined,
    height: number,
    width: number
}
@autobind
export default class Interactive extends React.PureComponent<IProps, IState> {
    constructor(props: IProps) {
        super(props);
        this.state = {
            crossHairPoint: undefined,
            height: 0,
            width: 0
        }
    }
    public componentDidMount(): void {
        const container = document.getElementById('graphContainer');
        this.setState({
            height: container ? container.clientHeight : 0,
            width: container ? container.clientWidth : 0,
        });

    }
    public render(): JSX.Element[] {
        const { chartBounds } = this.props;
        const { crossHairPoint } = this.state;
        return [
            <div key={'hintChart'} style={{ width: '100%', height: '100%', position: 'absolute', top: '0' }}>
                <FlexibleXYPlot
                    xType={'time'}
                    yDomain={[chartBounds.bottom, chartBounds.top]}
                    margin={{ left: 40 }}
                    dontCheckIfEmpty={true}
                    xDomain={[chartBounds.left, chartBounds.right]}>
                    {crossHairPoint ? this.renderHint() : null}
                </FlexibleXYPlot>
            </div>,
            <VoronoiComponent {...this.state} onNearestX={this.onNearestX} key={"voronoi"} {...this.props} onMouseLeave={this.onMouseLeave} />
        ];
    }


    private renderHint(): JSX.Element {
        const { crossHairPoint } = this.state;
        return (
            <Hint 
            key='hint'
            value={crossHairPoint}
            format={formatHint}/>
        );
    }
   
    /**
     * Sets the crosshair value to the nearest X value
     * 
     * @param { IDatapoint } datapoint 
     * The closest datapoint
     * 
     */
    private onNearestX(datapoint: IDatapoint): void {
        this.setState({
            crossHairPoint: datapoint
        })
    }

    /**
     * Resets the crosshair after the mouse leaves the graph
     * 
     */
    private onMouseLeave(): void {
        this.setState({
            crossHairPoint: undefined,
        });
    }
}