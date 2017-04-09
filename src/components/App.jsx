import styles from '../styles/app'

import React, { Component } from 'react'
import { translate } from '../lib/I18n'
import classNames from 'classnames'

class App extends Component {
  constructor (props) {
    super(props)
    console.log(props.feedlist, 'feedlist')
    this.state = {
      feedList: props.feedlist
    }
  }

  render ({ t }) {
    return <div>
      <h1 className={classNames(styles['title'])}>{ t('App.welcome') }</h1>
      <ul>
        { this.state.feedList.map(item => (
          <li>{ item.title }</li>
        ))}
      </ul>
    </div>
  }
}

export default translate()(App)
