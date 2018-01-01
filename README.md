# MongoDB-Migration-Node-Script

Migration/restoration script which will merge the data from the two sources.  
Runs queries to the database in parallel, allows for a variable number of documents to be able to be updated at once.
You are provided with two sample JSON files customer-data.json and customer-address-data.json which contain 1000 documents/objects 
Assumed that the order of the objects in each file correlates to objects in the other file.

# Installation

<strong><i>npm install</i></strong>

# Usage

<strong><i>mongod [--dbpath < path to database >] </i></strong>
<strong><i>node migrate-data.js < number of chunks ></i></strong>

Number of documents that are send parallel to the database = Total number of documents / number of chunks.

# Dependencies

<p>"async": "2.6.0",</p>
<p>"mongodb": "3.0.1",</p>
<p>"stream-json": "0.5.2"</p>
