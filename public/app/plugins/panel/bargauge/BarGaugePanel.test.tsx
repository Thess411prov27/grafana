import { render, screen } from '@testing-library/react';
import { uniqueId } from 'lodash';
import React from 'react';

import { dateMath, dateTime, EventBus, LoadingState, TimeRange, toDataFrame, VizOrientation } from '@grafana/data';
import { selectors } from '@grafana/e2e-selectors';
import { BarGaugeDisplayMode } from '@grafana/ui';

import { BarGaugePanel, BarGaugePanelProps } from './BarGaugePanel';

const valueSelector = selectors.components.Panels.Visualization.BarGauge.valueV2;

function buildPanelData(overrideValues?: Partial<BarGaugePanelProps>): BarGaugePanelProps {
  const timeRange = createTimeRange();
  const defaultValues = {
    id: Number(uniqueId()),
    data: {
      series: [],
      state: LoadingState.Done,
      timeRange,
    },
    options: {
      displayMode: BarGaugeDisplayMode.Lcd,
      reduceOptions: {
        calcs: ['mean'],
        values: false,
      },
      orientation: VizOrientation.Horizontal,
      showUnfilled: true,
      minVizHeight: 10,
      minVizWidth: 0,
    },
    transparent: false,
    timeRange,
    timeZone: 'utc',
    title: 'hello',
    fieldConfig: {
      defaults: {},
      overrides: [],
    },
    onFieldConfigChange: jest.fn(),
    onOptionsChange: jest.fn(),
    onChangeTimeRange: jest.fn(),
    replaceVariables: jest.fn(),
    renderCounter: 0,
    width: 552,
    height: 250,
    eventBus: {} as EventBus,
  };

  return {
    ...defaultValues,
    ...overrideValues,
  };
}
describe('BarGaugePanel', () => {
  describe('when there is no data', () => {
    it('show a "No Data" message', () => {
      const panelData = buildPanelData();
      render(<BarGaugePanel {...panelData} />);

      expect(screen.getByText(/no data/i)).toHaveTextContent('No data');
    });
  });

  describe('when there is data', () => {
    const panelData = buildPanelData({
      data: {
        series: [
          toDataFrame({
            target: 'test',
            datapoints: [
              [100, 1000],
              [100, 200],
            ],
          }),
        ],
        timeRange: createTimeRange(),
        state: LoadingState.Done,
      },
    });

    render(<BarGaugePanel {...panelData} />);

    expect(screen.getByTestId(valueSelector)).not.toBeInTheDocument();
  });
});

function createTimeRange(): TimeRange {
  return {
    from: dateMath.parse('now-6h') || dateTime(),
    to: dateMath.parse('now') || dateTime(),
    raw: { from: 'now-6h', to: 'now' },
  };
}
