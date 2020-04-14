const mongoose = require("mongoose");
const http = require('http');
const url = require('url');

//Database url with format - mongodb://localhost:portNo/databaseName
let Url = "mongodb://localhost:27017/mydb";
//connecting the database using above url
mongoose.connect(Url,{ useNewUrlParser: true, useUnifiedTopology: true  }, (err,db)=>{

    if(err){        
        console.log("Error connecting to database");
    }

    else{  
        console.log("database is connected!");       
    }

});
//reference to our database
const db = mongoose.connection;

//defining our database schema
const Schema = mongoose.Schema;

const contactSchema = new Schema({
    firstName : {
        type : String,
        required : true
    },

    lastName : {
        type : String,
        required : false
    },

    phone : {
        type : Number,
        min : 10,
        //max : 11,
        required : true
    },

    email : {
        type : String,
        required : false
    }
}); 
//compiling the schema into model
const contact = mongoose.model('contact', contactSchema, 'Contacts');

//defining the port onto which our server will listen
const port = 3000;
//creating a server which will listen to requests on above specified port and respond according to the requests
const app=http.createServer((req,res) => {
    const parsedURL = url.parse(req.url, true);
    const query = parsedURL.query;

    //for POST requests coming from http://localhost:3000/create
    //this block will create a new contact object according to the query and save it to the database
    if(req.method === 'POST' && parsedURL.pathname === '/create'){
        
        
        const new_contact= new contact({
            'firstName' : query.firstName,
            'lastName' : query.lastName,
            'phone' : query.phone,
            'email' : query.email
        });

        new_contact.save((err, book) => {
            if(err) res.end('error '+ err);
            console.log(`new contact saved!`);
        });
        
        res.end('Added successfully!!');

   }
      
   //for GET requests coming from http://localhost:3000/read
   //this block will find an existing contact object according to the query and save it to the database
   else if(req.method === 'GET' && parsedURL.pathname === '/read'){

        contact.find({firstName : query.firstName},(err,foundContact) => {

            if(err)res.end('error '+ err);

            else{
                console.log(foundContact.toString());
                res.end(foundContact.toString());
            }

        });
   }

   //for PUT requests coming from http://localhost:3000/update
   //this block will find an existing contact object according to the query,update it and then save it to the database
   else if (req.method === 'PUT' && parsedURL.pathname === '/update'){

        contact.findOneAndUpdate({firstName : query.oldFirstName},{$set: {
            firstName : query.firstName,
            lastName : query.lastName,
            phone : query.phone,
            email : query.email 
        }},(err,updatedContact) => {

            if(err)res.end('error '+ err);

            else{

                console.log(updatedContact);
                res.end('updated contact successfully!');
            
            }

            
        });

   }

   //for DELETE requests coming from http://localhost:3000/delete
   //this block will find an existing contact object according to the query and delete it from the database if found
   else if(req.method === 'DELETE' && parsedURL.pathname === '/delete'){

        contact.deleteOne({firstName : query.firstName},(err,foundContact) => {

            if(err)res.end('error '+ err);

            else{

                res.end('Contact deleted successfully !');
                console.log(foundContact);

            }

        });    

   }



});

//starting our server and listening to above specified port number
app.listen(port, () => {
    console.log('Server is running');
});

