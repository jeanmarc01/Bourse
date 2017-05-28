/**
 * http://usejsdoc.org/
 */
var express = require('express')
var mysql = require('mysql')
var app = express()
var port = process.env.PORT || 3000;

var connection = mysql.createConnection({
  host     : '192.168.1.51',
  user     : 'root',
  password : '4VGQ7PEsynology',
  database : 'Bourse'
});

connection.connect(function(err){
	if(!err) {
	    console.log("Database is connected ... nn");    
	} else {
	    console.log("Error connecting database ... nn");    
	}
});

app.use(express.json()); // to support JSON-encoded bodies
app.use(express.urlencoded()); // to support URL-encoded bodies


app.get('/investir/display', function (req, res) {
	 var date = req.param('date');
	connection.query("SELECT ISIN, DATE_DOWNLOAD, CONSEIL_INVESTIR, TOP10_INVESTIR  FROM investir WHERE DATE_DOWNLOAD ='" + date + "'", function(err, rows, fields) {
			if (!err)
				res.send(rows);
			else
			    console.log(err);
			  });7
	connection.end();
});

//get all date of download
app.get('/investir/getdatedownload', function(req, res) {
	  var dateRef = req.param('dateref');
	  var dateCible = req.param('datecible');
	  
	  var query = "SELECT DISTINCT DATE_DOWNLOAD FROM investir ORDER BY DATE_DOWNLOAD DESC";
	  connection.query(query, function(err, rows, fields) {
			if (!err)
				 res.send(rows);
			else
			    console.log(err);
		});
});

//Update with previous date
app.post('/investir/updatefromlastdownload', function(req, res) {
	  var dateRef = req.param('dateref');
	  var dateCible = req.param('datecible');
	  
	  var query = "SELECT ISIN, CONSEIL_INVESTIR, TOP10_INVESTIR  FROM investir WHERE DATE_DOWNLOAD ='" + dateRef + "'";
	  console.log(query);
	  connection.query(query, function(err, rows, fields) {
			if (!err)
				 for (var i in rows) {
					 console.log("UPDATE `Bourse`.`investir` SET CONSEIL_INVESTIR=" + rows[i].CONSEIL_INVESTIR + "' ,TOP10_INVESTIR='" + rows[i].TOP10_INVESTIR + "' WHERE ISIN='" + rows[i].ISIN + "' AND DATE_DOWNLOAD ='" + dateCible + "'");
				 }
			else
			    console.log(err);
		});
});

//JSON pour investir
app.post('/investir/insert', function(req, res) {
  var isin = req.param('isin');
  var date = req.param('date');
  var conseil = req.param('conseil');
  var top_10 = req.param('top_10');

  console.log("UPDATE `Bourse`.`investir` SET CONSEIL_INVESTIR='" + conseil + "', TOP10_INVESTIR='" + conseil + "' WHERE ISIN='" + isin + "' AND DATE_DOWNLOAD ='" + date + "'");
  
  res.send(req.body);
});

app.listen(port)