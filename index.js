const express = require('express')
const app = express()
var cors = require('cors')
require('dotenv').config()
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const port = process.env.PORT || 5000;
app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.44ltncg.mongodb.net/?appName=Cluster0`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
  serverSelectionTimeoutMS: 60000,
});

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();
    const carCollection = client.db('carShop').collection('allCars');
    const brand = client.db('carShop').collection('brandNames');
    const cart = client.db('carShop').collection('myCarts');

    app.get('/cars',async(req,res)=>{
           const cursor = carCollection.find();
           const result = await cursor.toArray();
           res.send(result)
    })

    app.get('/brands',async(req,res)=>{
           const cursor = brand.find();
           const result = await cursor.toArray();
           res.send(result)
    })

    app.get('/cars/:brand',async(req,res)=>{
        const brand = req.params.brand
        console.log(brand)
           const cursor = carCollection.find({BrandName:brand});
           const result = await cursor.toArray();
           res.send(result)
    })
    app.get('/carts', async (req, res) => {
      const cursor = cart.find();
      const result = await cursor.toArray();
      res.send(result);
    })
    app.get('/carts/:id',async(req,res)=>{
      const id = req.params.id
      console.log(brand)
         const cursor = {_id: new ObjectId(id)};
         const result = await cart.findOne(cursor);
         res.send(result)
  })
    app.post("/cars",async(req,res)=>{
      const newCar = req.body;
      const result = await carCollection.insertOne(newCar);
       res.send(result);

    })
    app.post("/carts",async(req,res)=>{
      const newCart = req.body;
      const result = await cart.insertOne(newCart);
       res.send(result);

    })
    app.put("/carts/:id",async(req,res)=>{
       const id = req.params.id;
       const updateDoc = req.body;
       const filter = {_id: new ObjectId(id)};
       const options = { upsert: true };
       const editedCar = {
        $set: {
          name: updateDoc.name,
           price: updateDoc.price,
            image: updateDoc.image,
             short_Description: updateDoc.short_Description, 
             rating: updateDoc.rating
        }
      };
      const result = await cart.updateOne(filter,editedCar,options);
      res.send(result)
    })
    app.delete("/carts/:id",async(req,res)=>{
      const id = req.params.id;
      const query = {_id: new ObjectId(id)}
      const result = await cart.deleteOne(query);
       res.send(result);

    })






    console.log("Pinged your deployment. You successfully connected to MongoDB!");
    
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);

app.get('/', (req, res) => {
  res.send('Hello World!')
})



app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})