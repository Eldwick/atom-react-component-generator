'use babel';

import { CompositeDisposable } from 'atom'
import { allowUnsafeEval } from 'loophole'

import generateFromConfig from './generateFromConfig'
export default {

  subscriptions: null,

  activate(state) {
    // Events subscribed to in atom's system can be easily cleaned up with a CompositeDisposable
    this.subscriptions = new CompositeDisposable();

    // Register command that react component generation
    this.subscriptions.add(atom.commands.add('atom-workspace', {
      'react-component-generator:generate': () => this.generate()
    }));
  },

  deactivate() {
    this.subscriptions.dispose();
  },

  parseSelectedConfig(editor) {
    const rawConfig = editor.getSelectedText()
    try {
      return allowUnsafeEval(() => eval(`(${rawConfig})`));
    } catch(e) {
      throw new Error('Selected Text is not a valid config')
    }
  },

  getDirectoryName(editor) {
    const filePath = editor.buffer.file.path
    return path.dirname(filePath);
  },

  insertImportInCurrentFile({ directoryPath, name }, editor) {
    const relativeDir = directoryPath.substring(directoryPath.indexOf("store_app"))
    editor.insertText(`import ${name} from '${relativeDir}/${name}'\n`)
  },

  generate() {
    let editor
    if (editor = atom.workspace.getActiveTextEditor()) {
      const selectedConfig = this.parseSelectedConfig(editor)
      const directoryPath = this.getDirectoryName(editor)

      const config = {
        ...selectedConfig,
        directoryPath
      }

      this.insertImportInCurrentFile(config, editor)
      generateFromConfig(config)
    }
  }
};
