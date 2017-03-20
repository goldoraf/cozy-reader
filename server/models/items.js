const PouchDB = require("pouchdb");
const bb = require("bluebird");

class Items {
    constructor() {
        this.db = new PouchDB(__dirname + "/../db/Items");
    }

    clear() {
        return this.db.destroy();
    }

    // expected :
    // feedid as String
    // list as array of {title, link, date, image, enclosures, meta}
    // TODO add an update count as return value
    add(feedid, list) {
        return bb.each(list.map(item => {
            item.feed_id = feedid
            item._id = `${feedid}:::${item.link}`;
            return item;
        }), item => {
            return new Promise((resolve, reject) => {
                this.db.put(item)
                .then(() => resolve())
                .catch(err => {
                    if (err.status === 409) resolve(); // the item already exists
                    else reject(err);
                })
            });
        });
    }

    list() {
        return this.db.allDocs({include_docs: true})
        .then(result => result.rows.map(item => item.doc));
    }

    getNbDocs() {
        return this.db.info().then(info => info.doc_count);
    }
}

const items = new Items();
module.exports = items;
