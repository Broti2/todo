const express = require('express');
const cors = require('cors');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const uri =
  'mongodb+srv://broti:Broti143@cluster0.bjvjbsy.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0';

const app = express();
app.use(express.json());
app.use(cors());

// MongoDB connection
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

app.get('/api/list', async (req, res) => {
  try {
    const collection = client.db('sampledata').collection('Todo');
    const list = await collection.find({}).toArray();
    res.json(list);
  } catch (error) {
    console.error('Error fetching todo list:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

// Route to add a new todo
app.post('/api/todo', async (req, res) => {
  const todo = req.body;
  console.log(todo);
  var dbo = client.db('sampledata');
  var myobj = { text: todo.todo, complete: false };
  dbo.collection('Todo').insertOne(myobj, function (err, res) {
    if (err) throw err;
    console.log('1 document inserted');
    db.close();
  });
});

app.delete('/api/delete/:id', async (req, res) => {
  try {
    const id = req.params.id; // Extract id from req.params
    console.log(id);
    var dbo = client.db('sampledata');
    const result = await dbo
      .collection('Todo')
      .deleteOne({ _id: new ObjectId(id) });
    console.log('Deleted:', result);
    res.json({ message: 'Deleted Successfully' });
  } catch (error) {
    console.error('Error deleting todo:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

app.patch('/api/patch/:id', async (req, res) => {
  try {
    const id = req.params.id; // Extract id from req.params
    console.log(id);
    var dbo = client.db('sampledata');
    const result = await dbo
      .collection('Todo')
      .updateOne({ _id: new ObjectId(id) }, { $set: { complete: true } });
    console.log('Updated:', result);
    res.json({ message: 'Updated Successfully' });
  } catch (error) {
    console.error('Error updating todo:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

app.put('/api/update/:id', async (req, res) => {
  try {
    const id  = req.params.id;
    const  todo  = req.body.todo;
    console.log(id);
    console.log(todo);
    const dbo = client.db('sampledata');
    const result = await dbo.collection('Todo').updateOne(
      { _id: new ObjectId(id) },
      { $set: { text: todo } }
    );
    console.log('Updated:', result);
    res.json({ message: 'Updated Successfully' });
  } catch (error) {
    console.error('Error updating todo:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
