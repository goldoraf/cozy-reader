import 'babel-polyfill'

import './styles/main'

import React from 'react'
import { render } from 'react-dom'
import { I18n } from './lib/I18n'

import App from './components/App'

const context = window.context
const lang = document.documentElement.getAttribute('lang') || 'en'

document.addEventListener('DOMContentLoaded', () => {
  const root = document.querySelector('[role=application]')
  const data = root.dataset
  /* global cozy */
  cozy.client.init({
    cozyURL: '//' + data.cozyDomain,
    token: data.cozyToken
  })
  cozy.bar.init({
    appName: data.cozyAppName,
    iconPath: data.cozyIconPath,
    lang: data.cozyLocale,
    replaceTitleOnMobile: true
  })

  cozy.client.data.defineIndex('io.cozy.feeds', ['_id'])
  .then(index => cozy.client.data.query(index, {selector: {_id: {'$gt': ''}}, limit: 1000}))
  .then(list => {
    render((
      <I18n context={context} lang={lang}>
        <App feedlist={list} />
      </I18n>
    ), document.querySelector('[role=application]'))
  })
})
