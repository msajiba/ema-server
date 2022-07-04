const express = require('express');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
require('dotenv').config();
const cors = require('cors');
const bodyParser = require('body-parser');
const app = express();


//Middleware
app.use(cors());
app.use(bodyParser.json());

const port = process.env.PORT || 5000;



const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.ne9qiaq.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });


async function run(){

    try{
        await client.connect();
        const productCollection = client.db('emaJohn').collection('product');

        //GET Method
       app.get('/product', async(req, res)=> {
        const page = parseInt(req.query.page);
        const size = parseInt(req.query.size);

        const query = {};
        const cursor = productCollection.find(query);
    
        let products;
        if(page || size){
            products= await cursor.skip(page*10).limit(size).toArray();
        }
        else{
            products = await cursor.toArray();
        }
        res.send(products);
       }); 

       //Product Count
       app.get('/productCount', async (req, res) => {
            const count = await productCollection.estimatedDocumentCount();
            res.send({count});
       });

       //use post to get product by ids
       app.post('/productByKeys', async (req, res) => {
        const keys = req.body;
        const ids = keys.map(id=> ObjectId(id));
        const query = {_id: {$in: ids}}
        const cursor = productCollection.find(query);
        const products = await cursor.toArray();
        res.send(products);
       });

    }
    finally{}
};
run().catch(console.dir);



app.listen(port, ()=> {
    console.log('john is running ',port);
});