const express = require('express');
const app = express();

app.use(express.static('public'));
app.use(express.urlencoded({extended:true}));

const {cp} = require('./db/connection.js');
const {query} = require('./db/promise-mysql.js');
const mysql = require('mysql');

app.post('/songs', (req,res)=>{
   return query(cp, `CALL insert_song(${mysql.escape(req.body.name)}, ${mysql.escape(req.body.minutes)}, ${mysql.escape(req.body.seconds)}, ${mysql.escape(req.body.album_name)});`)
        .then(result => res.send(result))
        .catch(error => {console.log(error)})
});

app.get('/song-stats/:id', (req,res)=>{
  return query(cp, `SELECT name, minutes + (seconds/60) AS length FROM song WHERE song_id=${mysql.escape(req.params.id)};`)
        .then(result => res.send(result))
        .catch(error => {console.log(error)})
});

app.get('/songs', (req,res)=>{
  return query(cp, `SELECT * FROM song ORDER BY minutes + (seconds/60) DESC;`)
        .then(result => res.send(result))
        .catch(error => {console.log(error)})
});

app.get('/album-stats/:id', (req,res)=>{
  return query(cp, 
  `SELECT 
    A.name, 
    SUM(S.minutes + (S.seconds/60)) AS runtime,
    MAX(S.minutes + (S.seconds/60)) AS longestSong,
    COUNT(*) AS numberOfSongs
  FROM 
    album A 
    INNER JOIN song S 
        on A.album_id = S.album_id 
  WHERE
    A.album_id = ${mysql.escape(req.params.id)}
  GROUP BY 
    A.name;`)
        .then(result => res.send(result))
        .catch(error => {console.log(error)})
});

app.get('/band-stats', (req,res)=> {
  return query(cp, 
  `SELECT
    B.name AS band_name,
    COUNT(*) AS numberOfAlbums
  FROM
    band B
    INNER JOIN album A
        on A.band_id = B.band_id
  GROUP BY
    B.name;`)
        .then(result => res.send(result))
        .catch(error => {console.log(error)})
});

const server = app.listen(8080, ()=>{
    console.log('listening');
});
