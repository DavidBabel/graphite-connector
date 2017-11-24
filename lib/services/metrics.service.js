/* @flow */

import {Histogram, Counter} from 'measured';
import now from 'performance-now';
import {graphiteClient} from '../connectors/graphite';
import config from '../config';

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
export function createHistogramObject(paths: Array<string>) {
  return paths.reduce((acc, path) => {
    return {
      [path]: new Histogram(),
      ...acc,
    };
  }, {});
}

/**
 * Sanitize a path
 *
 * @param {string} path
 * @returns {string}
 */
export function sanitizePath(path: string) {
  const parts = path.split('/');
  return parts.length > 2 && parts[2].indexOf('.') === -1 ? parts[1] + parts[2] : parts[1];
}

/**
 * Format a number
 *
 * @param {number} n
 * @returns {number}
 */
export function formatNumber(n: number) {
  return n.toFixed(5);
}

/**
 * Create a metric object thant can be send to Graphite
 *
 * @param {Histogram} histogram
 * @param {string} path
 * @param {string} prefix
 * @returns {Object}
 */
export function createMetricObject(histogram: Histogram, path: string, prefix: string = '') {
  const {min, max, mean, stddev, p75, p95, p99, sum} = histogram.toJSON();
  const k = path;

  return {
    [`${prefix}.req.${k}.min`]: formatNumber(min),
    [`${prefix}.req.${k}.max`]: formatNumber(max),
    [`${prefix}.req.${k}.mean`]: formatNumber(mean),
    [`${prefix}.req.${k}.stddev`]: formatNumber(stddev),
    [`${prefix}.req.${k}.p75`]: formatNumber(p75),
    [`${prefix}.req.${k}.p95`]: formatNumber(p95),
    [`${prefix}.req.${k}.p99`]: formatNumber(p99),
    [`${prefix}.req.${k}.sum`]: sum,
  };
}

/**
 * Create an error object that can be send to Graphite
 *
 * @param {Counter} errorCount
 * @param {string} prefix
 * @returns {Object}
 */
export function createErrorObject(errorCount: Counter, prefix: string = '') {
  const count = errorCount.toJSON();

  return {
    [`${prefix}.req.error`]: count,
  };
}

/**
 * Mark a Request/Response object
 *
 * @param {$Request} req
 * @param {$Response} res
 */
export function markResponse(req: Object, res: Object) {
  (res: any)._requestStartTime = now();
  (res: any)._metricPath = sanitizePath(req.path);
}

/**
 * Start metric sending loop
 *
 * @param {Object} histograms
 * @param {Counter} errorCount
 */
export function startMetricInterval(histograms: Object, errorCount: Counter) {
  setInterval(() => {
    if (errorCount.toJSON() > 0) {
      graphiteClient.addMetric(createErrorObject(errorCount, config.graphitePrefix));

      errorCount.reset();
    }

    Object.keys(histograms).forEach((k) => {
      const histogram = histograms[k];

      if (histogram.hasValues()) {
        graphiteClient.addMetric(createMetricObject(histogram, k, config.graphitePrefix));

        histogram.reset();
      }
    });
  }, config.graphiteMetricInterval);
}
