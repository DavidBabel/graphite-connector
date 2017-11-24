/* @flow */

import {
  markResponse,
  createErrorObject,
  createMetricObject,
  createHistogramObject,
  sanitizePath
} from '../lib/services/metrics.service';
import {Histogram} from 'measured';
import {assert} from 'chai';

describe('metrics', () => {

  describe('histograms object', () => {

    it('should create a histogram object from array', () => {
      const obj: any = createHistogramObject(['foo', 'bar']);

      assert.isOk(obj.foo);
      assert.isOk(obj.bar);

      assert.instanceOf(obj.foo, Histogram);
      assert.instanceOf(obj.bar, Histogram);
    });

    it('should support slashes', () => {
      const obj: any = createHistogramObject(['/foo']);

      assert.isOk(obj['/foo']);
      assert.instanceOf(obj['/foo'], Histogram);
    });
  });

  describe('sanitize path', () => {

    it('should remove slashes', () => {
      assert.equal(sanitizePath('/imp///'), 'imp');
    });

    it('should keep only first path part', () => {
      assert.equal(sanitizePath('/imp'), 'imp');
    });

    it('should keep only first and second path part', () => {
      assert.equal(sanitizePath('/vast/generate/123/ak/456'), 'vastgenerate');
    });

    it('should handle the dot and keep only pv', () => {
      assert.equal(sanitizePath('/pv/img.gif'), 'pv');
    });
  });

  describe('create metric object', () => {

    it('should return a metric object', () => {
      const histogram = {
        toJSON() {
          return {
            min: 1,
            max: 2,
            mean: 3,
            stddev: 4,
            p75: 5,
            p95: 6,
            p99: 7,
            sum: 8,
          };
        }
      };

      const obj = createMetricObject(histogram, 'foo', 'bar');

      assert.deepEqual(obj, {
        'bar.req.foo.min': '1.00000',
        'bar.req.foo.max': '2.00000',
        'bar.req.foo.mean': '3.00000',
        'bar.req.foo.stddev': '4.00000',
        'bar.req.foo.p75': '5.00000',
        'bar.req.foo.p95': '6.00000',
        'bar.req.foo.p99': '7.00000',
        'bar.req.foo.sum': 8
      });
    });
  });

  describe('create an error object', () => {

    it('should return an error object', () => {
      const errorCount = {
        toJSON() {
          return 1;
        }
      };

      const obj = createErrorObject(errorCount, 'bar');

      assert.deepEqual(obj, {
        'bar.req.error': 1
      });
    });
  });

  describe('mark response', () => {

    it('should add metric infos', () => {
      const req: any = {path: '/test'};
      const res: any = {};

      markResponse(req, res);

      assert.equal(res._metricPath, 'test');
      assert.isNumber(res._requestStartTime);
    });
  });
});
