# MongoDB-Migration-Node-Script

Migration/restoration script which will merge the data from the two sources.  
Runs queries to the database in parallel, allows for a variable number of documents to be able to be updated at once.
You are provided with two sample JSON files: <strong><i>customer-data.json</i></strong> and <strong><i>customer-address-data.json</i></strong> which contain 1000 documents/objects. 
Assumed that the order of the objects in each file correlates to objects in the other file.

# Installation

<strong><i>npm install</i></strong>

# Usage

<p><strong><i>mongod [--dbpath < path to database >] </i></strong></p>
<p><strong><i>node migrate-data.js [< number of chunks >]</i></strong></p>

Default number of chunks is <i>50</i>.

Number of documents that are send parallel to the database = Total number of documents / number of chunks.

# Dependencies

<p>"async": "2.6.0",</p>
<p>"mongodb": "3.0.1",</p>
<p>"stream-json": "0.5.2"</p>
