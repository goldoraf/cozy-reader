# Server reader implementation

Now the command line part directly talks to the gozy with the condition that some environment
variables are initialized.

First run a gozy.

Then get the credentials from it using the gettoken command :

```
cd server
./gettoken
Please visit the following url to authorize the application:
http://cozy.local:8080/auth/authorize?client_id=d471d98ae7773eca4289104b24386e00&redirect_uri=http%3A%2F%2Flocalhost%3A3333%2Fdo_access&state=cG5B3qtjOTtTDu9rtEB0Nw&response_type=code&scope=io.cozy.feeds%20io.cozy.feeditems
File saved in /home/doubleface/Workspace/cozy-reader/server/token.json

export COZY_CREDENTIALS=$(<./token.json)
export COZY_URL=http://cozy.local:8080
```

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

All data is saved in the cozy!

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
 - A special konnector should be done to import an opml file
 - The handling of the list of items should be on the client application
 - More precise error handling

