const cozy = require('../lib/cozyclient')
const parseOpml = require('node-opml-parser')
const bb = require('bluebird')
const parseFeed = require('node-feedparser')
let request = require('request-promise')
request = request.defaults({
  headers: {
    'User-Agent': 'cozy-reader'
  },
  followAllRedirects: true
})
// require('request-debug')(request)

class Feeds {
  parseOpml (opmlstring) {
    return new Promise((resolve, reject) => {
      parseOpml(opmlstring, (err, items) => {
        if (err) return reject(err)

        resolve(items)
      })
    })
  }

  fetch (url) {
    return request(url)
      .then(content => {
        return new Promise((resolve, reject) => {
          parseFeed(content, function (err, result) {
            if (err) reject(err)
            else {
              resolve(result.items.map(item => {
                return {
                  title: item.title,
                  link: item.link,
                  date: item.date,
                  image: item.image,
                  enclosures: item.enclosures,
                  meta: item.meta
                }
              }))
            }
          })
        })
      })
  }

  // expected : array of {title, url, feedUrl}
  add (items) {
    let updatedCount = 0

    return this.list()
    // create an object indexed by feedUrl
    .then(list => {
      return list.reduce((memo, doc) => {
        memo[doc.feedUrl] = doc
        return memo
      }, {})
    })
    // filter out already indexed items
    .then(indexedList => {
      return items.filter(doc => indexedList[doc.feedUrl] === undefined)
    })
    // only add new items in database
    .then(filteredList => {
      return bb.each(filteredList, item => {
        return cozy.data.create('io.cozy.feeds', item)
          .then(() => updatedCount++)
      })
    })
    .then(() => updatedCount)
  }

  update (id, attrs) {
    return cozy.data.updateAttributes('io.cozy.feeds', id, attrs)
  }

  list () {
    return cozy.data.defineIndex('io.cozy.feeds', ['_id'])
    .then(index => cozy.data.query(index, {selector: {_id: {'$gt': ''}}, limit: 1000}))
  }

  getNbDocs () {
    return cozy.data.defineIndex('io.cozy.feeds', ['_id'])
    .then(index => cozy.data.query(index, {selector: {_id: {'$gt': ''}}, limit: 1000}))
    .then(list => list.length)
  }

  clear () {
    // get all the items and delete them 1 by one
    return this.list()
      .then(list => {
        bb.each(list, doc => cozy.data.delete('io.cozy.feeds', doc))
      })
  }
}

const feeds = new Feeds()
module.exports = feeds
