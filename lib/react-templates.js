'use babel';

const templates = {
  smart: (name) => (
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
`
  ),
  dumb: (name) => (
`const ${name} = (props) => {
  return (
    <div>${name}</div>
  )
}

${name}.propTypes = {

}

export default ${name}
`
  )
}

export default templates
