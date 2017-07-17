'use babel';

import TEMPLATES from './templates'

const generateTemplate = (config) => {
  const { type, name, subcomponents, directoryPath } = config
  const fullType = TEMPLATES.aliasToTemplate[type] || DEFAULT_TYPE
  let template = TEMPLATES.templates[fullType](name)

  if (subcomponents && subcomponents.length > 0) {
    template = insertRenderCollections(config, template)
  }

  return template
}

const insertRenderCollections = (config, template) => {
  const templateWithImports = insertImports(config, template)
  return insertCollectionRenderer(config, templateWithImports)
}

const insertImports = ({ subcomponents, directoryPath, name }, template) => {
  const relativeDir = directoryPath.substring(directoryPath.indexOf("store_app"))
  const imports = subcomponents.reduce((memo, { name }) => (
    `${memo}import ${name} from '${relativeDir}/${name}'\n`
  ), '')

  return `${imports}\n${template}`
}

const insertCollectionRenderer = ({ subcomponents, type }, originalTemplate) => {
  return subcomponents.reduce((template, { name, isCollection }) => {
    if (!isCollection) return template

    return TEMPLATES.aliasToTemplate[type] === 'dumb'
      ? insertIntoFuncTemplate({ template, name })
      : insertIntoClassTemplate({ template, name })
  }, originalTemplate)
}

const insertIntoFuncTemplate = ({ template, name }) => {
  const indexOfRender = template.indexOf("const")
  const rendererTemplate = `const render${name}s = () => {\n  return COLLECTION.map(ELEMENT => <${name} key={} />)\n}\n\n`
  return insertIntoTemplate({ template, indexOfRender, rendererTemplate })
}

const insertIntoClassTemplate = ({ template, name }) => {
  const indexOfRender = template.indexOf("render() {")
  const rendererTemplate = `render${name}s() {\n    return COLLECTION.map(ELEMENT => <${name} key={} />)\n  }\n\n  `
  return insertIntoTemplate({ template, indexOfRender, rendererTemplate })
}

const insertIntoTemplate = ({ template, indexOfRender, rendererTemplate }) => (
  template.slice(0, indexOfRender) + rendererTemplate + template.slice(indexOfRender)
)

export default generateTemplate
