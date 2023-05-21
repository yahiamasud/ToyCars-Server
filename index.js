const express = require('express')
const app = express()
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const cors = require("cors")
require("dotenv").config()
const port = process.env.PORT || 5000

app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.ylfmjda.mongodb.net/?retryWrites=true&w=majority`

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

        const toyCollection = client.db('toyManager').collection('toyCar');
        const PhotoCollection = client.db('toyManager').collection('Gallary');
        const newsCollection = client.db('toyManager').collection('newsAdd');
        const catCollection = client.db('toyManager').collection('catogori');
        const items1Collection = client.db('toyManager').collection('items1');
        const items2Collection = client.db('toyManager').collection('items2');
        const items3Collection = client.db('toyManager').collection('items3');



        app.get("/toySearch/:text", async (req, res) => {
            const nameSearch = req.params.text;
            const result = await toyCollection.find({
                 name: { $regex: nameSearch, $options: 'i' } 
        }).toArray();
        res.send(result);
    });



    // catcogri
    app.get('/catogori', async (req, res) => {
        const items = catCollection.find();
        const result = await items.toArray();
        res.send(result);
    });

    app.get('/items1', async (req, res) => {
        const items = items1Collection.find();
        const result = await items.toArray();
        res.send(result);
    });

    app.get('/items2', async (req, res) => {
        const items = items2Collection.find();
        const result = await items.toArray();
        res.send(result);
    });

    app.get('/items3', async (req, res) => {
        const items = items3Collection.find();
        const result = await items.toArray();
        res.send(result);
    });

    // show data items button show 

    app.get('/items1/:id', async (req, res) => {
        const id = req.params.id;
        const query = { _id: new ObjectId(id) };
        const result = await items1Collection.findOne(query);
        res.send(result);
    });
    app.get('/items2/:id', async (req, res) => {
        const id = req.params.id;
        const query = { _id: new ObjectId(id) };
        const result = await items2Collection.findOne(query);
        res.send(result);
    });
    app.get('/items3/:id', async (req, res) => {
        const id = req.params.id;
        const query = { _id: new ObjectId(id) };
        const result = await items3Collection.findOne(query);
        res.send(result);
    });

    // all get
    app.get('/toyCar', async (req, res) => {
        const items = toyCollection.find();
        const result = await items.toArray();
        res.send(result);
    });

    // garrary photo
    app.get('/Gallary', async (req, res) => {
        const items = PhotoCollection.find();
        const result = await items.toArray();
        res.send(result);
    });


    // newsadd photo
    app.get('/newsAdd', async (req, res) => {
        const items = newsCollection.find();
        const result = await items.toArray();
        res.send(result);
    });

    // get
    app.get('/toyCar/:id', async (req, res) => {
        const id = req.params.id;
        const query = { _id: new ObjectId(id) };
        const result = await toyCollection.findOne(query);
        res.send(result);
    });


    // add
    app.post('/toyCar', async (req, res) => {
        const user = req.body;
        const result = await toyCollection.insertOne(user);
        console.log(result)
        res.send(result);
    })

    // my toys add

    // app.get("/myToy/:email", async (req, res) => {
    //     console.log(req.params.email);
    //     const result = await toyCollection.find({ postedBy : req.params.email})
    //     .toArray();
    //     res.send(result);
    // })

    app.get('/myToy', async (req, res) => {
        let query = {};
        if (req.query?.email) {
            query = { email: req.query.email }
        }
        const result = await toyCollection.find(query).toArray();
        res.send(result);
    })

    // delet 
    app.delete('/toyCar/:id', async (req, res) => {
        const id = req.params.id;
        const query = { _id: new ObjectId(id) };
        const result = await toyCollection.deleteOne(query);
        res.send(result);
    })
    // updata 
    app.put("/toyCar/:id", async (req, res) => {
        const id = req.params.id;
        console.log({ id })
        const body = req.body;
        console.log(body)
        const filter = { _id: new ObjectId(id) };
        const updataDoc = {
            $set: {
                price: body.price,
                description: body.description,
                subcategory: body.subcategory,
            },
        };
        const result = await toyCollection.updateOne(filter, updataDoc, { upsert: true })
        res.send(result);
    });




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
    res.send('Hello World!')
})

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})
