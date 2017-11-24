/* @flow */

const defaultConfig = {
  ENV_NAME: 'local',
  GRAPHITE_URL: '',
  GRAPHITE_PREFIX: '',
  GRAPHITE_METRIC_INTERVAL: ''
};

function getConfig(env: Object) {
  const config: Object = !env.ENV_NAME || env.ENV_NAME === 'local' ? defaultConfig : env;

  return {
    envName: config.ENV_NAME,
    graphiteUrl: config.GRAPHITE_URL,
    graphitePrefix: config.GRAPHITE_PREFIX,
    graphiteMetricInterval: config.GRAPHITE_METRIC_INTERVAL,
  };
}

export default getConfig(process.env);
