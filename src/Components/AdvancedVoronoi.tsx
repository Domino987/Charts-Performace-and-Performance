import autobind from 'autobind-decorator';
import * as React from 'react';
import { FlexibleXYPlot, Hint } from 'react-vis';
import Interactive from './Interactive';

interface IProps {
    onWheelXY: (e: React.WheelEvent<Element>) => void,
    onBrushEnd: (area: IArea) => void,
    onDrag: (area: IArea) => void,
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
export default class AdvancedVoronio extends React.PureComponent<IProps, IState> {
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
    public render(): JSX.Element {
        const { voronoiData, chartBounds } = this.props;
        const { crossHairPoint } = this.state;
        return (
            <div style={{ width: '100%', height: '100%', position: 'absolute', top: '0' }}>
                <FlexibleXYPlot
                    yDomain={[chartBounds.bottom, chartBounds.top]}
                    margin={{ left: 40 }}
                    dontCheckIfEmpty={true}
                    xDomain={[chartBounds.left, chartBounds.right]}>
                    {crossHairPoint ? this.renderHint() : null}
                </FlexibleXYPlot>
                <Interactive
                    voronoiData={ voronoiData}
                    updateArea={this.updateArea}
                    {...this.props} />
            </div>
        );
    }

    private updateArea(): void {
        // tslint:disable-next-line:no-console
        console.log('Not in this component');
    }
    private renderHint(): JSX.Element {
        const { crossHairPoint } = this.state;
        return (
            <Hint key='hint' value={crossHairPoint} />
        );
    }
}