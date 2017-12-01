# Graphite connector

This module is used to send metrics in graphite

## Warning

To run `npm install` or `yarn install` in your project with this module in it you need to store your key in a ssh-agent or in your MacOs Keychain : https://help.github.com/articles/generating-a-new-ssh-key-and-adding-it-to-the-ssh-agent/

## Install

To install it in your project, think to fix the version using this kind of command :

```
yarn add Ogury/graphite-connector#^1.X.X
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

## Contribute

### Quickstart

```
yarn install
yarn build
```

### Tests

```
yarn test
```