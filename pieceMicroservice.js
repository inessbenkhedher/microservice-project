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

const pieceProtoPath = 'piece.proto';
const pieceProtoDefinition = protoLoader.loadSync(pieceProtoPath, {
  keepCase: true,
  longs: String,
  enums: String,
  defaults: true,
  oneofs: true,
});
const pieceProto = grpc.loadPackageDefinition(pieceProtoDefinition).piece;

const pieceService = {

  getPiece: async (call, callback) => {
    try {
      const pieceId = new ObjectId(call.request.piece_id); // Use new keyword to create an instance of ObjectId
      console.log('Trying to fetch piece with ID:', pieceId);
      const database = client.db('grpc');
      const piecesCollection = database.collection('pieces');
      const piece = await piecesCollection.findOne({ _id: pieceId });
      if (!piece) {
        throw new Error('Piece not found');
      }
      console.log('Piece found:', piece);
      callback(null, { piece });
    } catch (error) {
      console.error('Error fetching piece:', error);
      callback(error);
    }
  },


  searchPieces: async (call, callback) => {
    try {
      console.log('Fetching all pieces');
      const database = client.db('grpc');
      const piecesCollection = database.collection('pieces');
      const pieces = await piecesCollection.find({}).toArray();
      console.log('Search results:', pieces);
      callback(null, { pieces });
    } catch (error) {
      console.error('Error fetching all pieces:', error);
      callback(error);
    }
  },




  createPiece: async (call, callback) => {
    try {
      const pieceData = call.request;
      const database = client.db('grpc');
      const piecesCollection = database.collection('pieces');
      const result = await piecesCollection.insertOne(pieceData);
      if (result.insertedId) {
        const createdPiece = await piecesCollection.findOne({ _id: result.insertedId });
        if (createdPiece) {
          console.log('Piece created:', createdPiece);
          callback(null, { piece: createdPiece });
        } else {
          throw new Error('Failed to find the created piece.');
        }
      } else {
        throw new Error('No piece created.');
      }
    } catch (error) {
      console.error('Error creating piece:', error);
      callback(error);
    }
  },
};

const server = new grpc.Server();
server.addService(pieceProto.PieceService.service, pieceService);
const port = 50051;
server.bindAsync(`0.0.0.0:${port}`, grpc.ServerCredentials.createInsecure(), (err, port) => {
  if (err) {
    console.error('Failed to bind server:', err);
    return;
  }
  console.log(`Server running on port ${port}`);
  server.start();
});
