import { resolve } from "path";
import { readJson } from 'fs-extra';
import { ENV_URL } from './environment.type';

const getConfigurationByFile =  (file: ENV_URL) => {
  const pathToConfigFile = resolve('config', `${file}.env.json`);

  return readJson(pathToConfigFile)
}

const plugins = (on: Cypress.PluginEvents, config: Partial<Cypress.ConfigOptions>) => {
  const file: ENV_URL = config.env?.configFile || 'local';

  return getConfigurationByFile(file)
};

export default plugins;
