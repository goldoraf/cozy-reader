const PouchDB = require("pouchdb");
const parseOpml = require("node-opml-parser");
const bb = require("bluebird");
const parseFeed = require("node-feedparser");
const request = require("request-promise");
//require('request-debug')(request)

class Feeds {
    constructor() {
        this.db = new PouchDB(__dirname + "/../db/Feeds");
    }

    clear() {
        return this.db.destroy();
    }

    parseOpml(opmlstring) {
        return new Promise((resolve, reject) => {
            parseOpml(opmlstring, (err, items) => {
                if (err) return reject(err);

                resolve(items);
            });
        });
    }

    fetch(url) {
        return request(url)
        .then(content => {
            return new Promise((resolve, reject) => {
                parseFeed(content, function(err, result){
                    if (err) reject(err);
                    else resolve(result.items.map(item => {
                        return {
                            title: item.title,
                            link: item.link,
                            date: item.date,
                            image: item.image,
                            enclosures: item.enclosures,
                            meta: item.meta
                        }
                    }));
                });
            });
        });
    }

    // expected : array of {title, url, feedUrl}
    add(items) {
        let updated_count = 0;
        return bb.each(items.map(item => {
            item._id = item.feedUrl;
            return item;
        }), item => {
            return new Promise(resolve => {
                this.db.put(item)
                .then(() => {
                    updated_count++;
                    resolve();
                })
                .catch(() => resolve())
            });
        })
        .then(() => updated_count);
    }

    update(id, attrs) {
        return this.db.get(id)
        .then(doc => {
            for (let i in attrs) {
                doc[i] = attrs[i]
            }
            return this.db.put(doc)
        })
    }

    list() {
        return this.db.allDocs({include_docs: true})
        .then(result => result.rows.map(item => item.doc));
    }

    getNbDocs() {
        return this.db.info().then(info => info.doc_count);
    }
}

const feeds = new Feeds();
module.exports = feeds;
