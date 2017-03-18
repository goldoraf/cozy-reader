# Server reader implementation

This still needs to be adapted to become a connector.

You can give any OPML file to the ```feeds init``` command

Try : 

```
cd server
npm install
./feeds init path/to/opml/file
./feeds fetch
```

And get the list of items with :

```
./items list
```

All data is save in the server/db directory in a pouchdb database and can be served with
pouchdb-server

## Documents structure

feeds:

```
{
    _id: 'https://www.linxo.com/feed/',
    title: 'Linxo',
    url: 'http://www.linxo.com',
    feedUrl: 'https://www.linxo.com/feed/',
    feedType: 'rss',
    updateDate: '2017-03-17T23:06:55.581Z',
    status: true,
    message: ''
}
```

items:

```
{
    _id: 'http://dev.glicer.com/feed.xml:::http://dev.glicer.com/section/reflexion/chemin-de-croix.html',
    feed_id: 'http://dev.glicer.com/feed.xml',
    title: 'Chemin de croix',
    link: 'http://dev.glicer.com/section/reflexion/chemin-de-croix.html',
    date: '2016-09-27T22:00:00.000Z',
}
```

the id for items is : <feed_url>:::<item_url>

TODO:

 - A lot!
 - Make the konnector which do the update of n first udpated feeds
 - A special konnector should be done to import an opml file
 - The handling of the list of items should be on the client application
 - The number of feeds updated in one time should be configurable
 - More precise error handling
 - Some feeds do not work and may need some special headers or should follow redirections

