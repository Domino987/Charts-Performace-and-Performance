interface IDatapoint {
    x: Date,
    y: number
}

interface IArea {
    bottom: number,
    top: number,
    right: number,
    left: number,
}
interface IChartBounds {    
    bottom: number,
    top: number,
    right: Date,
    left: Date,
}