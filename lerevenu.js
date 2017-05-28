/**
 * http://usejsdoc.org/
 */

var express = require('express')
var mysql = require('mysql')
var app = express()
var port = process.env.PORT || 3001;

var connection = mysql.createConnection({
  host     : '192.168.1.51',
  user     : 'root',
  password : '4VGQ7PEsynology',
  database : 'Bourse'
});

connection.connect(function(err){
	if(!err) {
	    console.log("Database is connected ...");    
	} else {
	    console.log("Error connecting database ...");    
	}
});


function database(query, callback){
	connection.query(query, function(err, rows, fields) {
		if (!err)
			return callback(rows);
		else
		    console.log(err);
		  });
}

app.use(express.json()); // to support JSON-encoded bodies
app.use(express.urlencoded()); // to support URL-encoded bodies

//Affiche pour une date de téléchargement donnée toutes les data
app.get('/lerevenu/display', function (req, res) {
	var datecible = req.param('datecible');
	var query = "SELECT ISIN, DATE_DOWNLOAD, PROFIL_LEREVENU, CONSEIL_LEREVENU FROM lerevenu WHERE DATE_DOWNLOAD ='" + datecible + "'";
	console.log(query);
	database(query, function(rows){
		res.jsonp(rows);
	});

});

//get toutes les dates de téléchargement
app.get('/lerevenu/getdatedownload', function(req, res) {
	  var query = "SELECT DISTINCT DATE_DOWNLOAD FROM lerevenu ORDER BY DATE_DOWNLOAD DESC";
	  console.log(query);
	  database(query, function(response){
			res.jsonp(response);  
		  });
});

//Update with previous date
app.post('/lerevenu/updatefromlastdownload', function(req, res) {
	  var dateRef = req.param('dateref');
	  var dateCible = req.param('datecible');
	  
	  var query = "SELECT ISIN, PROFIL_LEREVENU, CONSEIL_LEREVENU FROM lerevenu WHERE DATE_DOWNLOAD ='" + dateRef + "'";
	  console.log(query);
	  database(query, function(rows){
				 for (var i in rows) {
					 query2 = "INSERT INTO `Bourse`.`lerevenu` (ISIN, DATE_DOWNLOAD, PROFIL_LEREVENU, CONSEIL_LEREVENU) VALUES ('" + rows[i].ISIN + "', '" + dateCible + "', '" + rows[i].PROFIL_LEREVENU + "', '" + rows[i].CONSEIL_LEREVENU+ "') ON DUPLICATE KEY UPDATE PROFIL_LEREVENU='" + rows[i].PROFIL_LEREVENU+ "', CONSEIL_LEREVENU='" + rows[i].CONSEIL_LEREVENU + "'";
					 console.log(query2);
					 database(query2, function(response){
						 console.log(response);  
					 });
				 }
	  });
});

//JSON pour le revenu
app.post('/lerevenu/insert', function(req, res) {
  var isin = req.param('isin');
  var date = req.param('date');
  var conseil = req.param('conseil');
  var profile = req.param('profile');
	
  var query = "INSERT INTO `Bourse`.`lerevenu` (ISIN, DATE_DOWNLOAD, PROFIL_LEREVENU, CONSEIL_LEREVENU) VALUES ('" + isin + "', '" + date + "', '" + profile + "', '" + conseil + "') ON DUPLICATE KEY UPDATE PROFIL_LEREVENU='" + rows[i].PROFIL_LEREVENU+ "', CONSEIL_LEREVENU='" + rows[i].CONSEIL_LEREVENU + "'";
  console.log(query);
  database(query, function(response){
	console.log(response);  
  });
});

app.listen(port)