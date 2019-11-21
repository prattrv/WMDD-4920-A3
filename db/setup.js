const {cp} = require('./connection.js');

const {query} = require('./promise-mysql.js');

query(cp, 'USE pratt_4920a3; DROP PROCEDURE IF EXISTS insert_song;') 
.then(result=>query(cp, `CREATE PROCEDURE insert_song ( IN p_song_name VARCHAR(255), IN p_minutes INT,
IN p_seconds INT,
IN p_album_name VARCHAR(255)
) BEGIN
INSERT INTO song (name, minutes, seconds, album_id) VALUES (p_song_name, p_minutes, p_seconds, (SELECT album_id FROM album WHERE name=p_album_name));
END;`)) // Create stored procedure here
.then(results=>{console.log('setup successful'); process.exit()})
.catch(error=>{console.log(error); process.exit();});

