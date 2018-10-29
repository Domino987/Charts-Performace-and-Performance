import { AppBar, Button, createStyles, Grid, MobileStepper, Toolbar, Typography, withStyles, WithStyles } from '@material-ui/core';
import KeyboardArrowLeft from '@material-ui/icons/KeyboardArrowLeft';
import KeyboardArrowRight from '@material-ui/icons/KeyboardArrowRight';
import Slider from '@material-ui/lab/Slider';
import autobind from 'autobind-decorator';
import { MuiThemeProvider } from 'material-ui/styles';
import memoize from "memoize-one";
import React, { PureComponent } from 'react';
import 'react-vis/dist/style.css';
import AdvancedVoronioChart from './AdvancedVoronoiChart';
import DouglasPeucker from './DouglasPeucker';
import InteractionSeperation from './InteractionSeperation';
import PlainXYPlot from './PlainXYPlot';
import ReactVisInteraction from './ReactVisInteraction';
import SimpleInteraction from './SimpleInteraction';
import SimpleVoronoiChart from './SimpleVoronoiChart';
import VoronoiDiagram from './VoronoiDiagram';


const styles = () => createStyles({
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
    height: '100%',
    position: 'absolute',
    width: '100%',
  },
  stepper: {
    marginTop: '10px'
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
  step: number,
  datapoints: number
}

@autobind
class App extends PureComponent<IProps, IState> {

  private componentArray = [
    PlainXYPlot,
    ReactVisInteraction,
    SimpleInteraction,
    VoronoiDiagram,
    SimpleVoronoiChart,
    InteractionSeperation,
    AdvancedVoronioChart,
    DouglasPeucker
  ];

  private data: IDatapoint[][] = [];

  private functions = [
    (num: number, index: number) => Math.pow(num, 2) + (num * index * 10),
  ]

  private seriesDataPoints = memoize(
    (seriesNumber: number, datapoints: number) => this.getDataPoints(seriesNumber, datapoints)
  );

  constructor(props: IProps) {
    super(props);
    this.state = {
      datapoints: 100,
      seriesNumber: 1,
      step: 0,
    };

    for (let i = 0; i < 5; i++) {
      const series = [];
      for (let k = 0; k < 10000; k++) {
        series.push({
          x: (k + 1),
          y: this.functions[0](k + 1, i)
        });
      }
      this.data.push(series);
    }
  }
  public render() {
    const { classes } = this.props;
    const { seriesNumber, step, datapoints } = this.state;
    const Graph = this.componentArray[step];
    return (
      <MuiThemeProvider>
      <div className={classes.root}>
          <AppBar className={classes.appbar}>
            <Toolbar>
              <img className={classes.logo} src='./favicon.png' alt='logo' />
              <Typography className={classes.title}>
                Charts: Interaction and Performace
          </Typography>
            </Toolbar>
          </AppBar>
          <Grid spacing={16} container={true} className={classes.content} justify={'space-around'} alignItems={'center'}>
            <Grid item={true} xs={5}>
              <Typography id="label">Series: <span>{seriesNumber}</span></Typography>
              <Slider value={seriesNumber} min={1} max={5} step={1} aria-labelledby="label" style={{margin: 8}} onChange={this.setSeries} />
            </Grid>
            <Grid item={true} xs={5}>
              <Typography id="label">Datapoints: <span>{datapoints}</span></Typography>
              <Slider value={datapoints} min={100} max={1000} step={100} aria-labelledby="label" style={{margin: 8}} onChange={this.setDataPoints} />
            </Grid>
            <Grid item={true} xs={11}>
              <Graph
                dataPoints={this.seriesDataPoints(seriesNumber, datapoints)}
              />
            </Grid>
            <MobileStepper
              steps={this.componentArray.length}
              position="static"
              className={classes.stepper}
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
        </MuiThemeProvider>
    );
  }

  private setSeries(event: React.ChangeEvent, value: number): void {
    this.setState({
      seriesNumber: value
    });
  }
  private setDataPoints(event: React.ChangeEvent, value: number): void {
    this.setState({
      datapoints: value
    });
  }
  private handleNext(): void {
    this.setState({
      step: (this.state.step + 1)
    });
  }

  private handleBack(): void {
    this.setState({
      step: (this.state.step - 1)
    });
  }
  private getDataPoints(seriesNumber: number, datapoints: number): IDatapoint[][] {
    const array = [];
    for (let i = 0; i < seriesNumber; i++) {
      array.push(this.data[i].slice(0, datapoints));
    }
    return array;
  }
}

export default withStyles(styles)(App);
