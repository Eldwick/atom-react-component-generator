'use babel';

import fs from 'fs'
import path from 'path'
import generateTemplate from './generateTemplate'

const EXTENTION = '.module.js.jsx'
const DEFAULT_TYPE = 'smart'

const generateFromConfig = (config) => (
  config.subcomponents && config.subcomponents.length > 0
    ? generateComponentWithChildren(config)
    : generateComponentFile(config)
)

const generateComponentWithChildren = (config) => {
  const { directoryPath, name } = config
  const newConfig = {
    ...config,
    directoryPath: `${directoryPath}/${name}`
  }

  generateComponentFile(newConfig)
  generateChildren(newConfig)
}

const generateChildren = (config) => {
  createIndexFile(config)
  const { directoryPath } = config
  config.subcomponents.forEach(subcomponentConfig => (
    generateFromConfig({ ...subcomponentConfig, directoryPath })
  ))
}

const generateComponentFile = (config) => {
  ensureDirectoryExists(config)
  createFile(config)
}

const createFile = (config) => {
  const { directoryPath, name } = config
  const template = generateTemplate(config)
  const fileName = `${directoryPath}/${config.name}${EXTENTION}`
  fs.writeFile(fileName, template)
}

const ensureDirectoryExists = (config) => {
  if (!fs.existsSync(config.directoryPath)) {
    fs.mkdirSync(config.directoryPath)
  }
}

const createIndexFile = ({ directoryPath, name }) => {
  const relativeDir = directoryPath.substring(directoryPath.indexOf("store_app"))
  fs.writeFile(`${directoryPath}/index.js`,`import ${name} from '${relativeDir}/${name}'

export default ${name}\n`)
}

export default generateFromConfig
