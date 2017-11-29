# Graphite connector

This module is used to send metrics in graphite

## Install

To install it in your project, think to fix the version using this kind of command :

```
yarn add Ogury/graphite-connector#v1.X.X
```

## Requirements

if you want to import this npm module in your project, you have to define the following environnement variables :

```
GRAPHITE_URL
GRAPHITE_PREFIX
GRAPHITE_METRIC_INTERVAL
```

## Usage

How to use the Metric Handler. You can enable it for specifics endpoints

```javascript
import createMetricHandlerFor from 'graphite-connector';

const app = express();

app.use(
  createMetricHandlerFor(
    '/endpoint1',
    '/endpoint2'
  )
);

app.use('/', controllers);

app.listen(3000);
```

# Work on it

## Quickstart

```
yarn install
yarn build
```

## Tests

```
yarn test
```