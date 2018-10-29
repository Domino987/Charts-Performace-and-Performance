import autobind from 'autobind-decorator';
import React from 'react';
import { AbstractSeries, ScaleUtils } from 'react-vis';


export interface IArea {
  bottom: number,
  left: number,
  right: number,
  top: number
}
export interface IProps {
  drawArea: IArea,
  innerHeight: number,
  innerWidth: number,
  isOverViewHighlight: boolean,
  marginBottom: number
  marginLeft: number,
  marginTop: number,
  onBrushEnd: (area: IArea) => void,
}


@autobind
export default class Highlight extends AbstractSeries {

  public static defaultProps = {
    allow: 'x',
    color: 'rgb(77, 182, 172)',
    opacity: 0.3,
  };

  public state: {
    dragging: false,
    drawArea: IArea,
    drawing: false,
    startLocX: number,
    startLocY: number,
  }

  public displayName = 'HighlightOverlay';

  public constructor(props: IProps) {
    super(props);
    let area = { top: 0, right: 0, bottom: 0, left: 0 };
    if (props.isOverViewHighlight) {
      const xScale = ScaleUtils.getAttributeScale(this.props, 'x');
      const yScale = ScaleUtils.getAttributeScale(this.props, 'y');
      area = {
        bottom: yScale(props.drawArea.bottom) + props.marginTop,
        left: xScale(props.drawArea.left) + props.marginLeft,
        right: xScale(props.drawArea.right) + props.marginLeft,
        top: yScale(props.drawArea.top) + props.marginTop
      }
    }
    this.state = {
      dragging: false,
      drawArea: area,
      drawing: false,
      startLocX: 0,
      startLocY: 0,
    }

  }
  public componentWillReceiveProps(nextProps: IProps): void {
    if (nextProps.drawArea && nextProps.drawArea !== this.props.drawArea && !this.state.drawing) {
      const xScale = ScaleUtils.getAttributeScale(nextProps, 'x');
      const yScale = ScaleUtils.getAttributeScale(nextProps, 'y');
      this.setState({
        drawArea: {
          bottom: yScale(nextProps.drawArea.bottom) + nextProps.marginTop,
          left: xScale(nextProps.drawArea.left) + nextProps.marginLeft,
          right: xScale(nextProps.drawArea.right) + nextProps.marginLeft,
          top: yScale(nextProps.drawArea.top) + nextProps.marginTop
        }
      });
    }
  }

  public _getDrawArea(xLoc: number, yLoc: number): IArea {
    const { marginLeft, marginTop, innerWidth, innerHeight, isOverViewHighlight } = this.props;
    const { startLocX, startLocY } = this.state;

    const leftBorder = xLoc < startLocX ? Math.max(xLoc, marginLeft) : startLocX;
    const rightBorder = xLoc < startLocX ? startLocX : Math.min(xLoc, innerWidth);

    let bottomBorder;
    let topBorder;
    if (isOverViewHighlight) {
      topBorder = marginTop;
      bottomBorder = innerHeight - marginTop;
    } else {
      topBorder = yLoc < startLocY ? Math.max(yLoc, marginTop) : startLocY;
      bottomBorder = yLoc < startLocY ? startLocY : Math.min(yLoc, innerHeight - marginTop);
    }
    return {
      bottom: bottomBorder,
      left: leftBorder,
      right: rightBorder,
      top: topBorder,
    };

  }
  public _getDragArea(xLoc: number, yLoc: number): IArea {
    const { marginLeft, marginTop, innerWidth, innerHeight, isOverViewHighlight } = this.props;
    const { startLocX, startLocY } = this.state;

    const leftBorder = startLocX;
    const rightBorder = Math.max(marginLeft, Math.min(xLoc, innerWidth));

    let topBorder;
    let bottomBorder;
    if (isOverViewHighlight) {
      topBorder = 0;
      bottomBorder = 0;
    } else {
      topBorder = startLocY;
      bottomBorder = Math.max(marginTop, Math.min(yLoc, innerHeight - marginTop));
    }

    return {
      bottom: bottomBorder,
      left: leftBorder,
      right: rightBorder,
      top: topBorder,
    };

  }
  public onParentMouseDown(e: React.MouseEvent): void {
    const { onBrushStart, onDragStart, isOverViewHighlight } = this.props;
    let Xlocation = this.isFireFox() ? e.nativeEvent.layerX : e.nativeEvent.offsetX;
    let Ylocation = this.isFireFox() ? e.nativeEvent.layerY : e.nativeEvent.offsetY;
    if (e.nativeEvent.type === 'touchstart') {
      Xlocation = e.nativeEvent.pageX;
      Ylocation = e.nativeEvent.pageY;
    }
    if (e.nativeEvent.button === 0) {
      this.setState({
        dragging: false,
        drawArea: {
          bottom: isOverViewHighlight ? this.state.drawArea.bottom : Ylocation,
          left: Xlocation,
          right: Xlocation,
          top: isOverViewHighlight ? this.state.drawArea.top : Ylocation,
        },
        drawing: true,
        startLocX: Xlocation,
        startLocY: Ylocation,
      });

      if (onBrushStart) {
        onBrushStart(e);
      }
    } else if (e.nativeEvent.button === 2) { // Right Click capture
      e.preventDefault();
      this.setState({
        dragging: true,
        drawArea: {
          bottom: Ylocation,
          left: Xlocation,
          right: Xlocation,
          top: Ylocation,
        },
        drawing: false,
        startLocX: Xlocation,
        startLocY: Ylocation,
      });
      if (onDragStart) {
        onDragStart();
      }
    }

  }
  public onParentMouseUp(e: React.MouseEvent): void {
    e.preventDefault();
    this.stopDrawing();
  }
  public onParentTouchStart(e: React.MouseEvent): void {
    e.preventDefault();
    this.onParentMouseDown(e);
  }

  public stopDrawing(): void {
    // Quickly short-circuit if the user isn't drawing in our component
    if (!this.state.drawing && !this.state.dragging) {
      return;
    }
    const { onBrushEnd, onDragEnd, marginLeft, marginTop, isOverViewHighlight } = this.props;
    const { drawArea } = this.state;
    const xScale = ScaleUtils.getAttributeScale(this.props, 'x');
    const yScale = ScaleUtils.getAttributeScale(this.props, 'y');

    // Clear the draw area
    this.setState({
      dragging: false,
      drawArea: !this.props.isOverViewHighlight ? { top: 0, right: 0, bottom: 0, left: 0 } : this.state.drawArea,
      drawing: false,
      startLocX: 0,
      startLocY: 0,
    });
    if (this.state.drawing) {
      // Invoke the callback with null if the selected area was < 5px
      if (onBrushEnd && Math.abs(drawArea.right - drawArea.left) < 5 && (isOverViewHighlight || Math.abs(drawArea.top - drawArea.bottom) < 5)) {
        onBrushEnd(null);
        return;
      }
      // Compute the corresponding domain drawn
      const domainArea = {
        bottom: yScale.invert(drawArea.bottom),
        left: xScale.invert(drawArea.left - marginLeft),
        right: xScale.invert(drawArea.right - marginLeft),
        top: yScale.invert(drawArea.top - marginTop),
      };

      if (onBrushEnd) {
        onBrushEnd(domainArea);
      }
    } else if (this.state.dragging && onDragEnd) {
      onDragEnd();
    }
  }

  public onParentMouseMove(e: React.MouseEvent): void {
    const { onBrush, onDrag } = this.props;
    const { drawing, dragging } = this.state;

    let xLoc = this.isFireFox() ? e.nativeEvent.layerX : e.nativeEvent.offsetX;
    let yLoc = this.isFireFox() ? e.nativeEvent.layerY : e.nativeEvent.offsetY;
    if (e.nativeEvent.type === 'touchmove') {
      xLoc = e.nativeEvent.pageX;
      yLoc = e.nativeEvent.pageY;
    }
    if (drawing) {
      const newDrawArea = this._getDrawArea(xLoc, yLoc);
      this.setState({ drawArea: newDrawArea });

      if (onBrush) {
        onBrush(e);
      }
    } else if (dragging) {
      const newDrawArea = this._getDragArea(xLoc, yLoc);
      if (onDrag) {
        const xScale = ScaleUtils.getAttributeScale(this.props, 'x');
        const yScale = ScaleUtils.getAttributeScale(this.props, 'y');
        const domainArea = {
          bottom: yScale.invert(newDrawArea.bottom),
          left: xScale.invert(newDrawArea.left),
          right: xScale.invert(newDrawArea.right),
          top: yScale.invert(newDrawArea.top),
        };
        this.setState({
          startLocX: xLoc,
          startLocY: yLoc,
        });
        if (onDrag) {
          onDrag(domainArea);
        }
      }
    }
  }

  public onParentTouchMove(e: React.MouseEvent): void {
    e.preventDefault();
    this.onParentMouseMove(e);
  }

  public render(): React.ReactNode {
    const { innerWidth, marginTop, marginLeft, innerHeight, color, opacity } = this.props;
    const { drawArea: { left, right, top, bottom } } = this.state;
    return (
      <g transform={`translate(${0}, ${0})`}
        className="highlight-container"
        onMouseUp={this.stopDrawing}
        onMouseLeave={this.stopDrawing}
        onContextMenu={this.onContextClick}
        onContextMenuCapture={this.onContextClick}
        // preventDefault() so that mouse event emulation does not happen
        onTouchEnd={this.stopDrawing}
        onTouchCancel={this.handleTouch}
      >
        <rect
          className="mouse-target"
          fill="black"
          opacity="0"
          pointerEvents="none"
          x={Math.max(0, marginLeft)}
          y={Math.max(0, marginTop)}
          width={innerWidth}
          height={Math.max(0, innerHeight)}
        />
        <rect
          className="highlight"
          pointerEvents="none"
          opacity={opacity}
          fill={color}
          x={left}
          y={top}
          width={Math.max(0, right - left)}
          height={Math.max(0, bottom - top)}
        />
      </g>
    );
  }
  public handleTouch(e: React.TouchEvent<SVGGElement>): void {
    e.preventDefault();
    this.stopDrawing();
  }
  public stopRightCLick(e: React.TouchEvent<SVGGElement>): boolean {
    e.preventDefault();
    return false;
  }
  private onContextClick(e: React.MouseEvent): boolean {
    e.preventDefault();
    return false;
  }  
  /** 
   * Checks if the browser is firefox
   *
   * @export
   * @returns {boolean} if the browser is firefox
   */
  private isFireFox(): boolean {
    return navigator.userAgent.toLowerCase().indexOf('firefox') > -1;
  }
}