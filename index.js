const express = require('express');
const cors = require('cors');
require('dotenv').config()



const app = express();
const port = process.env.PORT || 5000;


// middleware 

app.use(cors());
app.use(express.json());


const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.2rm9pnz.mongodb.net/?retryWrites=true&w=majority`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
    serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
    }
});

async function run() {
    try {
        // Connect the client to the server	(optional starting in v4.7)
        // await client.connect();

        const productCollection = client.db("productDB").collection("product");
        const cartCollection = client.db("productDB").collection("carts")




        app.get('/products', async (req, res) => {
            const cursor = productCollection.find();
            const result = await cursor.toArray();
            res.send(result)
        })


        app.get('/products/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: new ObjectId(id) };
            const result = await productCollection.findOne(query);
            res.send(result)
        })



        app.post('/products', async (req, res) => {
            const newProduct = req.body;
            console.log(newProduct);

            const result = await productCollection.insertOne(newProduct);
            res.send(result)
        })


        app.put('/products/:id', async(req, res) => {
            const id = req.params.id;
            const filter = { _id: new ObjectId(id) };
            const options = { upsert: true };
            const updateProduct = req.body;
            const product = {
                $set: {
                    productName: updateProduct.productName,
                    productImg: updateProduct.productImg,
                    details: updateProduct.details,
                    brandName: updateProduct.brandName,
                    productType: updateProduct.productType,
                    price: updateProduct.price,
                    rating: updateProduct.rating
                }
            }
            const result= await productCollection.updateOne(filter,product,options)
            res.send(result)
        })






        app.get('/carts', async (req, res) => {
            const cursor = cartCollection.find();
            const result = await cursor.toArray();
            res.send(result);
        })

        app.post('/carts', async (req, res) => {
            const newCartProduct = req.body;
            console.log(newCartProduct);

            const result = await cartCollection.insertOne(newCartProduct);
            res.send(result)
        })




        app.delete('/carts/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: new ObjectId(id) };
            const result = await cartCollection.deleteOne(query);
            res.send(result)

        })







        // Send a ping to confirm a successful connection
        await client.db("admin").command({ ping: 1 });
        console.log("Pinged your deployment. You successfully connected to MongoDB!");
    } finally {
        // Ensures that the client will close when you finish/error
        // await client.close();
    }
}
run().catch(console.dir);



app.get('/', (req, res) => {
    res.send('TrendSway server is running now')
})

app.listen(port, () => {
    console.log(`TrendSway server is running on port: ${port}`);
})







