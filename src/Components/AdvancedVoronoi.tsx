import autobind from 'autobind-decorator';
import memoizeOne from 'memoize-one';
import * as React from 'react';
import { Borders, FlexibleXYPlot, LineMarkSeries, LineSeries, XAxis, YAxis } from 'react-vis';
import { tickFormatter } from 'src/utils/utils';
import VoronoiComponent from './Voronoi';

interface IProps {
    chartBounds: IArea,
    showVoronoi?: boolean,
    simplyfiyData?: boolean,
    data: IDatapoint[][],
    updateChartBounds: (newArea: IArea) => void,
    increaseRenderCount: () => void,
    setHovering: (datapoint?: IDatapoint) => void,
}
@autobind
export default class AdvancedVoronio extends React.PureComponent<IProps> {

    private nodes = memoizeOne(
        (data: IDatapoint[][] ): IDatapoint[] => {
            if(data.length === 1){
                return data[0];
            }
            return [].concat.apply([], data);
        });

    constructor(props: IProps) {
        super(props);
    }

    public componentDidUpdate(): void {
        this.props.increaseRenderCount();
    }
    public render(): JSX.Element {
        const { data, chartBounds, updateChartBounds, setHovering, showVoronoi, simplyfiyData } = this.props;
        let Series: any;
        if (simplyfiyData) {
            Series = LineMarkSeries;
        } else {
            Series = LineSeries;
        }
        return (
            <div style={{ width: '1260px', height: '500px', position: 'absolute', top: '16px' }}>
                <FlexibleXYPlot
                    yDomain={[chartBounds.bottom, chartBounds.top]}
                    margin={{ left: 40 }}
                    dontCheckIfEmpty={true}
                    xDomain={[chartBounds.left, chartBounds.right]}>
                    {
                        data.map((series: IDatapoint[], index: number) =>
                            <Series
                                key={index}
                                data={series}
                            />
                        )
                    }
                    <Borders style={{ all: { fill: '#fff' } }} />
                    <XAxis title="X Axis" position="end" />
                    <YAxis title="Y Axis" tickFormat={tickFormatter} />
                </FlexibleXYPlot>
                <VoronoiComponent
                    chartBounds={chartBounds}
                    voronoiData={this.nodes(data)}
                    updateArea={updateChartBounds}
                    onNearestX={setHovering}
                    showVoronoi={showVoronoi}
                    key={"voronoi"} />
            </div>
        );
    }
}