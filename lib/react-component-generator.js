'use babel';

import Templates from './react-templates'
import { CompositeDisposable } from 'atom'
import { allowUnsafeEval } from 'loophole'
import fs from 'fs'
import path from 'path'

const EXTENTION = '.module.js.jsx'
const DEFAULT_TYPE = 'smart'

const shortHandToTemplate = {
  s: 'smart',
  smart: 'smart',
  d: 'dumb',
  dumb: 'dumb'
}

const generateFromConfig = (config, baseDirPath) => {
  const { subcomponents, name } = config
  if (subcomponents) {
    const newBasePath = `${baseDirPath}/${name}`
    generateReactFile(newBasePath, config).then(() => {
      createIndexFile(newBasePath, name)
      subcomponents.forEach(subcomponentConfig => (
        generateFromConfig(subcomponentConfig, newBasePath)
      ))
    })
  } else {
    generateReactFile(baseDirPath, config)
  }
}

const createIndexFile = (dirPath, name) => {
  const relativeDir = dirPath.substring(dirPath.indexOf("store_app"))
  fs.writeFile(`${dirPath}/index.js`,`import ${name} from '${relativeDir}/${name}'

export default ${name}\n`)
}

const getTemplate = (baseDirPath, config) => {
  const { type, name, subcomponents } = config
  const fullType = shortHandToTemplate[type] || DEFAULT_TYPE
  let template = Templates[fullType](name)

  if (subcomponents) {
    const relativeDir = baseDirPath.substring(baseDirPath.indexOf("store_app"))
    const imports = subcomponents.reduce((memo, { name }) => (
      `${memo}import ${name} from '${relativeDir}/${name}'\n`
    ), '')

    template = `${imports}\n${template}`

    template = insertRenderCollections(subcomponents, template)
  }

  return template
}

const insertRenderCollections = (subcomponents, template) => {
  return subcomponents.reduce((memo, { name, isCollection }) => {
    if (!isCollection) return memo
    const renderMethod = `render${name}s() {\n    return COLLECTION.map(ELEMENT => <${name} />)\n  }\n\n  `
    const indexOfRender = memo.indexOf("render() {")
    return memo.slice(0, indexOfRender) + renderMethod + memo.slice(indexOfRender);
  }, template)
}
const createFile = (baseDirPath, config) => () => {
  return new Promise((resolve, reject) => {
    const template = getTemplate(baseDirPath, config)
    fs.writeFile(`${baseDirPath}/${config.name}${EXTENTION}`, template, (err) => {
      if (err) reject(err)
      else resolve()
    })
  })
}

const generateReactFile = (baseDirPath, config) => {
  return checkDirectory(baseDirPath).then(createFile(baseDirPath, config))
}

// https://blog.raananweber.com/2015/12/15/check-if-a-directory-exists-in-node-js/
const checkDirectory = (directory) => {
  return new Promise(
    (resolve, reject) => {
      try {
        fs.stat(directory, (err, stats) => {
          //Check if error defined and the error code is "not exists"
          if (err && err.errno === -2) {
            //Create the directory, call the callback.
            fs.mkdir(directory, () => resolve());
          } else if (err){
            //just in case there was a different error:
            reject('checkDirectory', err)
          } else {
            console.log(`Not creating ${directory}`)
            resolve()
          }
        })
      } catch(e) {
        fs.mkdir(directory, (err) => {
          if (err) reject('checkDirectory catch', err)
          else resolve()
        })
      }
    }
  )
}

export default {

  subscriptions: null,

  activate(state) {
    // Events subscribed to in atom's system can be easily cleaned up with a CompositeDisposable
    this.subscriptions = new CompositeDisposable();

    // Register command that toggles this view
    this.subscriptions.add(atom.commands.add('atom-workspace', {
      'react-component-generator:generate': () => this.generate()
    }));
  },

  deactivate() {
    this.subscriptions.dispose();
  },

  getConfig(editor) {
    const rawConfig = editor.getSelectedText()
    return allowUnsafeEval(() => eval(`(${rawConfig})`));
  },

  getDirectoryName(editor) {
    const filePath = editor.buffer.file.path
    return path.dirname(filePath);
  },

  generate() {
    let editor
    if (editor = atom.workspace.getActiveTextEditor()) {
      const config = this.getConfig(editor)
      const currentDirectory = this.getDirectoryName(editor)
      const relativeDir = currentDirectory.substring(currentDirectory.indexOf("store_app"))
      editor.insertText(`import ${config.name} from '${relativeDir}/${config.name}'`)
      generateFromConfig(config, currentDirectory)
    }
  }

};
