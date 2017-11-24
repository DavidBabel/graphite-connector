/* @flow */
import now from 'performance-now';
import measured from 'measured';
import onFinished from 'on-finished';
import {
  startMetricInterval,
  createHistogramObject,
  markResponse,
  sanitizePath,
} from '../services/metrics.service';

export function createMetricHandlerFor(...allowedPaths: Array<string>) {
  const errorCount = new measured.Counter();
  const formattedAllowedPaths = allowedPaths.map(sanitizePath);
  const histograms = createHistogramObject(formattedAllowedPaths);

  startMetricInterval(histograms, errorCount);

  return function (req: Object, res: Object, next: NextFunction) {
    if (sanitizePath(req.path) in histograms) {
      markResponse(req, res);

      onFinished(res, (err, res) => {
        histograms[res._metricPath].update(now() - res._requestStartTime);

        if (res.statusCode >= 500) {
          errorCount.inc();
        }
      });
    }

    return next();
  };
}
