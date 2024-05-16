const grpc = require('@grpc/grpc-js');
const protoLoader = require('@grpc/proto-loader');
const { MongoClient } = require('mongodb');
const { ObjectId } = require('mongodb');

const uri = 'mongodb://localhost:27017';
const client = new MongoClient(uri);

async function connectToMongo() {
  try {
    await client.connect();
    console.log('Connected to MongoDB');
  } catch (error) {
    console.error('Error connecting to MongoDB:', error);
    process.exit(1);
  }
}
connectToMongo();

const montageProtoPath = 'montage.proto';
const montageProtoDefinition = protoLoader.loadSync(montageProtoPath, {
  keepCase: true,
  longs: String,
  enums: String,
  defaults: true,
  oneofs: true,
});
const montageProto = grpc.loadPackageDefinition(montageProtoDefinition).montage;

const montageService = {

  getMontage: async (call, callback) => {
    try {
      const montageId = new ObjectId(call.request.montage_id);
      console.log('Trying to fetch montage with ID:', montageId);
      const database = client.db('grpc');
      const montagesCollection = database.collection('montages');
      const montage = await montagesCollection.findOne({ _id: montageId });
      if (!montage) {
        throw new Error('Montage not found');
      }
      console.log('Montage found:', montage);
      callback(null, { montage });
    } catch (error) {
      console.error('Error fetching montage:', error);
      callback(error);
    }
  },

  searchMontages: async (call, callback) => {
    try {
      console.log('Fetching all montages');
      const database = client.db('grpc');
      const montagesCollection = database.collection('montages');
      const montages = await montagesCollection.find({}).toArray();
      console.log('Search results:', montages);
      callback(null, { montages });
    } catch (error) {
      console.error('Error fetching all montages:', error);
      callback(error);
    }
  },

  createMontage: async (call, callback) => {
    try {
      const montageData = call.request;
      const database = client.db('grpc');
      const montagesCollection = database.collection('montages');
      const result = await montagesCollection.insertOne(montageData);
      if (result.insertedId) {
        const createdMontage = await montagesCollection.findOne({ _id: result.insertedId });
        if (createdMontage) {
          console.log('Montage created:', createdMontage);
          callback(null, { montage: createdMontage });
        } else {
          throw new Error('Failed to find the created montage.');
        }
      } else {
        throw new Error('No montage created.');
      }
    } catch (error) {
      console.error('Error creating montage:', error);
      callback(error);
    }
  },
};

const server = new grpc.Server();
server.addService(montageProto.MontageService.service, montageService);
const port = 50053;
server.bindAsync(`0.0.0.0:${port}`, grpc.ServerCredentials.createInsecure(), (err, port) => {
  if (err) {
    console.error('Failed to bind server:', err);
    return;
  }
  console.log(`Server running on port ${port}`);
  server.start();
});
