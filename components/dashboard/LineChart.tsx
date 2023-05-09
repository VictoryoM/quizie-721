import { ApexOptions } from 'apexcharts';
import dynamic from 'next/dynamic';
import React from 'react';
import Chart from 'react-apexcharts';

export type LineChartProps = {
  data: {
    name: string,
    data: number[] | null[],
  }[],
  options: ApexOptions & { chart: { type: "line" | undefined } };
};

type LineChartState = {
  chartData: {
    name: string,
    data: number[] | null[],
  }[],
  chartOptions: ApexOptions;
};

class LineChart extends React.Component<LineChartProps, LineChartState> {
  state: LineChartState = {
    chartData: [],
    chartOptions: {},
  };

  componentDidMount() {
    const { data, options } = this.props;
    const chartData = data.map(({ name, data }) => ({ name, data }));
    this.setState({
      chartData,
      chartOptions: options,
    });
  }

  render() {
    return (
      <Chart
        options={this.state.chartOptions}
        series={this.state.chartData}
        type="line"
        width="100%"
        height="300"
      />
    );
  }
}

export default LineChart;
