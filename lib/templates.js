'use babel';
const smart = name => (
`class ${name} extends React.PureComponent {
  static propTypes = {

  }

  render() {
    return (
      <div>${name}</div>
    )
  }
}

export default ${name}
`)

const dumb = name => (
`const ${name} = (props) => {
  return (
    <div>${name}</div>
  )
}

${name}.propTypes = {

}

export default ${name}
`)


const templates = {
  smart,
  dumb
}

const aliasToTemplate = {
  s: 'smart',
  smart: 'smart',
  d: 'dumb',
  dumb: 'dumb'
}

export default {
  aliasToTemplate,
  templates
}
