# Module Graphite

This module is used to send metrics in graphite

## Install

To install it in your project, think to fix the version using this kind of command :

```
yarn add Ogury/module-graphite#v1.X.X
```

## Requirements

if you want to import this npm module in your project, you have to define the following environnement variables :

```
GRAPHITE_URL
GRAPHITE_PREFIX
GRAPHITE_METRIC_INTERVAL
```

## API

Here is the API

```
/**
 * Create an histogram object
 *
 * Would be like:
 *  - /v => Histogram
 *  - /c => Histogram
 *
 * @param {Array<string>} paths
 * @returns {Object}
 */
createHistogramObject(paths: Array<string>)

/**
 * Sanitize a path
 *
 * @param {string} path
 * @returns {string}
 */
sanitizePath(path: string)

/**
 * Format a number
 *
 * @param {number} n
 * @returns {number}
 */
formatNumber(n: number)

/**
 * Create a metric object thant can be send to Graphite
 *
 * @param {Histogram} histogram
 * @param {string} path
 * @param {string} prefix
 * @returns {Object}
 */
createMetricObject(histogram: Histogram, path: string, prefix: string = '')

/**
 * Create an error object that can be send to Graphite
 *
 * @param {Counter} errorCount
 * @param {string} prefix
 * @returns {Object}
 */
createErrorObject(errorCount: Counter, prefix: string = '')

/**
 * Mark a Request/Response object
 *
 * @param {$Request} req
 * @param {$Response} res
 */
markResponse(req: Object, res: Object)

/**
 * Start metric sending loop
 *
 * @param {Object} histograms
 * @param {Counter} errorCount
 */
startMetricInterval(histograms: Object, errorCount: Counter)
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