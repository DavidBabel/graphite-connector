import graphite from 'graphite';
import config from '../config';
import {warn, debug} from 'logger-helper';

export default class Graphite {
  constructor(url) {
    if (!url) {
      warn('No graphite configuration found');
      this._active = false;
    } else {
      this._client = graphite.createClient(url);
      this._active = true;
    }
  }

  /**
   * Get status of the current connection
   *
   * Current Graphite client doesn't support connection health check
   *
   * @returns {Promise}
   */
  getStatus() {
    if (this._active) {
      return Promise.resolve({graphite: true});
    } else {
      return Promise.reject({graphite: false});
    }
  }

  addMetric(metric) {
    if (!this._active) {
      return Promise.resolve();
    }

    if (Object.keys(metric).length > 1) {
      const keys = Object.keys(metric);

      keys.forEach((k) => {
        this.addMetric({[k]: metric[k]});
      });

      return;
    }

    return new Promise((resolve, reject) => {
      this._client.write(metric, (err) => {
        if (err) {
          return reject(err);
        }

        debug('[GRAPHITE] ' + JSON.stringify(metric));

        return resolve();
      });
    });
  }

  end() {
    if (!this._active) {
      return;
    }
    this._client.end();
  }
}

export const graphiteClient = new Graphite(config.graphiteUrl);
