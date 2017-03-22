const cozy = require('../lib/cozyclient')
const bb = require('bluebird')

class Items {
  clear () {
    // get all the items and delete them 1 by one
    return this.list()
      .then(list => {
        bb.each(list, doc => cozy.data.delete('io.cozy.feeditems', doc))
      })
  }

  // expected :
  // feedid as String
  // list as array of {title, link, date, image, enclosures, meta}
  add (feedId, list) {
    let updatedCount = 0

    return this.list(feedId)
    // create an object indexed by link
    .then(list => {
      return list.reduce((memo, doc) => {
        memo[doc.link] = doc
        return memo
      }, {})
    })
    // filter out already indexed items
    .then(indexedList => {
      return list.filter(doc => indexedList[doc.link] === undefined)
    })
    // only add new items in database
    .then(filteredList => {
      return bb.each(filteredList, item => {
        item.feed_id = feedId
        return cozy.data.create('io.cozy.feeditems', item)
          .then(() => updatedCount++)
      })
    })
    .then(() => updatedCount)
  }

  list (feedId) {
    return cozy.data.defineIndex('io.cozy.feeditems', ['feed_id'])
    .then(index => {
      let selector
      if (feedId) selector = {feed_id: feedId} // items from a specific feed
      else selector = {feed_id: {'$gt': ''}} // all items

      return cozy.data.query(index, {selector, limit: 10000})
    })
  }

  getNbDocs () {
    return cozy.data.defineIndex('io.cozy.feeditems', ['_id'])
    .then(index => cozy.data.query(index, {selector: {_id: {'$gt': ''}}, limit: 10000}))
    .then(list => list.length)
  }
}

const items = new Items()
module.exports = items
