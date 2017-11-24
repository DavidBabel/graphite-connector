import * as service from './services/metrics.service';
import {createMetricHandlerFor} from './middlewares/metrics.middleware';

export default {
  ...service,
  createMetricHandlerFor
};
