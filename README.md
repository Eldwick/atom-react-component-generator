# React Component Generator

## Overview:

Given an object literal as a config, generate the corresponding directories and files with template code.

### Available IDE packages:

* Atom
* Sublime

## Config structure:

* name [String]   
    * Name of React Component. Will be used for file name and directory name if applicable
* type [String]
    * (default) 'smart'/'s' uses the `class Component extends React.Component {` syntax
    * 'dumb'/'d' uses the `const Component = (props) => {` syntax
* isCollection [bool]
    * not applicable for root level component
    * creates a `render[NameOfComponent]s` method on it's parent
* subcomponents [Array<Config>]
    * imports all subcomponents into parent file
    * if supplied will create a directory for the Parent and export itself using an `index.js `file

## Sample use:

[Image: https://d3vv6lp55qjaqc.cloudfront.net/items/3y2n3t2A0K2j16311y2E/Screen%20Recording%202017-07-16%20at%2005.04%20PM.gif]


## Sample config: (run from store_app/components/example)

```
{
  name: 'GrandParent',
  subcomponents: [{
    name: 'Parent',
    subcomponents: [{
      name: 'Child',
      type: 'd'
    }, {
      name: 'PartOfCollection',
      isCollection: true,
      type: 'd'
    }]
  }]
}
```

## Sample directory output:

```
- GrandParent
  - GrandParent.module.js.jsx
  - index.js
  - Parent
    - Parent.module.js.jsx
    - Child.module.js.jsx
    - PartOfCollection.module.js.jsx
    - index.js
```

## Sample Generated Code

### GrandParent/GrandParent.module.js.jsx

```
import Parent from 'store_app/components/example/GrandParent/Parent'

class GrandParent extends React.PureComponent {
  static propTypes = {

  }

  render() {
    return (
      <div>GrandParent</div>
    )
  }
}

export default GrandParent
```

### GrandParent/index.js

```
import GrandParent from 'store_app/components/example/GrandParent/GrandParent'

export default GrandParent
```

### GrandParent/parent/parent.module.js.jsx

```
import Child from 'store_app/components/example/GrandParent/Parent/Child'
import PartOfCollection from 'store_app/components/example/GrandParent/Parent/PartOfCollection'

class Parent extends React.PureComponent {
  static propTypes = {

  }

  renderPartOfCollections() {
    return COLLECTION.map(ELEMENT => <PartOfCollection />)
  }

  render() {
    return (
      <div>Parent</div>
    )
  }
}

export default Parent
```

### GrandParent/parent/Child.module.js.jsx

```
const Child = (props) => {
  return (
    <div>Child</div>
  )
}

Child.propTypes = {

}

export default Child
```

### GrandParent/parent/PartofCollection.module.js.jsx

```
const PartOfCollection = (props) => {
  return (
    <div>PartOfCollection</div>
  )
}

PartOfCollection.propTypes = {

}

export default PartOfCollection
```

### GrandParent/parent/index.js

```
import Parent from 'store_app/components/example/GrandParent/Parent/Parent'

export default Parent
```

˚
