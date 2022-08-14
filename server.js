const express = require('express')
const app = express()
const MongoClient = require('mongodb').MongoClient
const PORT = 3000
require('dotenv').config() 

let db, 
  dbConnectionStr = process.env.DB_STRING,
  dbName = 'queer-media-recommendations'


MongoClient.connect(dbConnectionStr, {useUnifiedTopology: true}) 
  .then(client => {
    console.log(`Connected to ${dbName} database`)
    db = client.db(dbName)
  })  

// Middleware
// Set template engine to use ejs as a template file    
app.set('view engine', 'ejs')
// Gives express access to the public folder
app.use(express.static('public'))
// Parse incoming requests with urlencoded payloads
app.use(express.urlencoded({ extended: true }))
// Parse incoming JSON requests
app.use(express.json())

// GET code from todo list
app.get('/', async (req, res) => {
  const mediaRecommendations = await db.collection('recommendations').find().toArray()
  res.render('index.ejs', {recommendations: mediaRecommendations})
})

// GET code from rap api
// app.get('/', (req, res) => {
//   db.collection('recommendations').find().toArray()
//     .then(results => {
//       res.render('index.ejs', {recommendations: results})
//     })
//     .catch(error => console.error(error))
// })

app.post('/addRecommendation', (req, res) => {
  
  db.collection('recommendations').insertOne({mediaType: req.body.mediaType, mediaName: req.body.mediaName, mediaLikes: 0})
    .then(result => {
      console.log('Recommendation added.')
      res.redirect('/')
    })
    .catch(error => console.error(error))
})

// This is not working. The console.log is showing as expected, but nothing is happening in the database/DOM.
app.put('/addOneLike', (req, res) => {
  db.collection('recommendations').updateOne({mediaType: req.body.mediaTypeJS, mediaName: req.body.mediaNameJS, mediaLikes: req.body.mediaLikesJS},{
    $set: {
      mediaLikes: req.body.mediaLikesJS + 1
    }
  },{
    sort:{_id: -1},
    upsert: false
  })
  .then(result => {
    console.log('Added one like.')
    res.json('Like added.')
  })
  .catch(error => console.error(error))
})

// This is not working. The console.log is logging as expected, but the item isn't being deleted from the database or removed from the DOM.
app.delete('/deleteRecommendation', (req, res) => {
  db.collection('recommendations').deleteOne({mediaType: req.body.mediaTypeJS, mediaName: req.body.mediaNameJS, mediaLikes: req.body.mediaLikesJS})
  .then(result => {
      console.log({mediaType: req.body.mediaTypeJS, mediaName: req.body.mediaNameJS, mediaLikes: req.body.mediaLikesJS})
      res.json('Recommendation deleted.')
  })
  .catch(error => console.error(error))
})

app.listen(process.env.PORT || PORT, () => {
  console.log(`Server running on port ${process.env.PORT}`)
})

