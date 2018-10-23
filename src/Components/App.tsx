import { AppBar, Button, createStyles, Grid, MobileStepper, Theme, Toolbar, Typography, withStyles, WithStyles } from '@material-ui/core';
import KeyboardArrowLeft from '@material-ui/icons/KeyboardArrowLeft';
import KeyboardArrowRight from '@material-ui/icons/KeyboardArrowRight';
import Slider from '@material-ui/lab/Slider';
import autobind from 'autobind-decorator';
import memoize from "memoize-one";
import React, { PureComponent } from 'react';
import 'react-vis/dist/style.css';
import AdvancedVoronioChart from './AdvancedVoronoiChart';
import PlainXYPlot from './PlainXYPlot';
import SimpleInteraction from './SimpleInteraction';
import SimpleVoronoiChart from './SimpleVoronoiChart';

const styles = (theme: Theme) => createStyles({
  appbar: {
    background: '#808688',
    flexGrow: 1,
  },
  content: {
    marginTop: '70px'
  },
  logo: {
    height: '30px',
    marginLeft: '15px',
    marginRight: '15px',
    width: '30px',
  },
  root: {
    background: '#eee',
    height: '99%',
    position: 'absolute',
    width: '99%',
  },
  stepper: {
    marginTop: '50px'
  },
  title: {
    color: "inherit",
    variant: "title"
  },
});

interface IProps extends WithStyles<typeof styles> {
  test?: string
}

interface IState {
  seriesNumber: number,
  dataPoints: number,
  step: number
}

@autobind
class App extends PureComponent<IProps, IState> {

  private componentArray = [
    PlainXYPlot,
    SimpleInteraction,
    SimpleVoronoiChart,
    AdvancedVoronioChart
  ];

  private data: IDatapoint[][] = []

  private seriesDataPoints = memoize(
    (seriesNumber: number, points: number) => this.getDataPoints(seriesNumber, points)
  );

  constructor(props: IProps) {
    super(props);
    this.state = {
      dataPoints: 100,
      seriesNumber: 1,
      step: 2,
    };
    for (let i = 0; i < 5; i = i + 1) {
      const series = [];
      for (let k = 0; k < 10000; k = k + 1) {
        series.push({
          x: new Date((k + 1) * 86400000),
          y: k + 1 + i * 1000
        });
      }
      this.data.push(series);
    }
  }
  public render() {
    const { classes } = this.props;
    const { dataPoints, seriesNumber, step } = this.state;
    const Graph = this.componentArray[step];
    return (
      <div className={classes.root}>
        <AppBar className={classes.appbar}>
          <Toolbar>
            <img className={classes.logo} src='./favicon.png' alt='logo' />
            <Typography className={classes.title}>
              Charts: Interaction and Performace
          </Typography>
          </Toolbar>
        </AppBar>
        <Grid container={true} className={classes.content} justify={'space-around'} alignItems={'center'}>
          <Grid item={true} xs={5}>
            <Typography id="label">Datapoints</Typography>
            <Slider value={dataPoints} min={100} max={10000} step={100} aria-labelledby="label" onChange={this.setDatapoints} />
          </Grid>
          <Grid item={true} xs={5}>
            <Typography id="label">Series</Typography>
            <Slider value={seriesNumber} min={1} max={5} step={1} aria-labelledby="label" onChange={this.setSeries} />
          </Grid>
          <Grid item={true} xs={11}>
            <Graph
              dataPoints={this.seriesDataPoints(seriesNumber, dataPoints)}
            />
          </Grid>
          <MobileStepper
            steps={this.componentArray.length}
            position="static" className={classes.stepper}
            activeStep={step}
            nextButton={
              <Button size="small" onClick={this.handleNext} disabled={step === this.componentArray.length - 1}>
                Next
              <KeyboardArrowRight />
              </Button>
            }
            backButton={
              <Button size="small" onClick={this.handleBack} disabled={step === 0}>
                <KeyboardArrowLeft />
                Back
            </Button>
            }
          />
        </Grid>
      </div>
    );
  }
  private setDatapoints(e: React.ChangeEvent<{}>, value: number): void {
    this.setState({
      dataPoints: value
    });
  }
  private setSeries(e: React.ChangeEvent<{}>, value: number): void {
    this.setState({
      seriesNumber: value
    });
  }
  private handleNext(event: React.MouseEvent<HTMLElement>): void {
    this.setState({
      step: (this.state.step + 1)
    });
  }

  private handleBack(event: React.MouseEvent<HTMLElement>): void {
    this.setState({
      step: (this.state.step - 1)
    });
  }
  private getDataPoints(seriesNumber: number, points: number): IDatapoint[][] {
    const array = [];
    for (let i = 0; i < seriesNumber; i = i + 1) {
      array.push(this.data[i].slice(0, points));
    }
    return array;
  }
}

export default withStyles(styles)(App);
