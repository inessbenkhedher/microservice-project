const express = require('express');
const { ApolloServer } = require('@apollo/server');
const { expressMiddleware } = require('@apollo/server/express4');
const bodyParser = require('body-parser'); // Require body-parser
const cors = require('cors');
const grpc = require('@grpc/grpc-js');
const protoLoader = require('@grpc/proto-loader');
const { ObjectId } = require('mongodb');
const Montage = require('./MontageModel'); // Assuming you have a Montage model defined
const resolvers = require('./resolvers');
const typeDefs = require('./schema');

// Créer une nouvelle application Express
const app = express();

// Add body-parser middleware to parse JSON bodies
app.use(bodyParser.json());

const pieceProtoPath = 'piece.proto';
const montageProtoPath = 'montage.proto';

const pieceProtoDefinition = protoLoader.loadSync(pieceProtoPath, {
  keepCase: true,
  longs: String,
  enums: String,
  defaults: true,
  oneofs: true,
});

const montageProtoDefinition = protoLoader.loadSync(montageProtoPath, {
  keepCase: true,
  longs: String,
  enums: String,
  defaults: true,
  oneofs: true,
});

const pieceProto = grpc.loadPackageDefinition(pieceProtoDefinition).piece;
const montageProto = grpc.loadPackageDefinition(montageProtoDefinition).montage;

const server = new ApolloServer({ typeDefs, resolvers });
server.start().then(() => {
  app.use(cors(), bodyParser.json(), expressMiddleware(server));
});

app.get('/pieces', (req, res) => {
  const query = req.query.query;
  const client = new pieceProto.PieceService('localhost:50051', grpc.credentials.createInsecure());
  client.searchPieces({ query: query }, (err, response) => {
    if (err) {
      res.status(500).send(err);
    } else {
      res.json(response.pieces);
    }
  });
});

app.get('/montages', (req, res) => {
  const query = req.query.query;
  const client = new montageProto.MontageService('localhost:50053', grpc.credentials.createInsecure());
  client.searchMontages({ query: query }, (err, response) => {
    if (err) {
      res.status(500).send(err);
    } else {
      res.json(response.montages);
    }
  });
});

app.get('/pieces/:id', (req, res) => {
  const id = req.params.id;
  const client = new pieceProto.PieceService('localhost:50051', grpc.credentials.createInsecure());
  client.getPiece({ pieceId: id }, (err, response) => {
    if (err) {
      console.error('Error retrieving piece:', err);
      res.status(500).send(err);
    } else {
      console.log('Piece retrieved successfully:', response.piece);
      res.json(response.piece);
    }
  });
});

app.post('/pieces', (req, res) => {
  const client = new pieceProto.PieceService('localhost:50051', grpc.credentials.createInsecure());
  const pieceData = req.body;
  client.createPiece(pieceData, (err, response) => {
    if (err) {
      res.status(500).send(err);
    } else {
      res.json(response.piece);
    }
  });
});

app.post('/montages', (req, res) => {
  const client = new montageProto.MontageService('localhost:50053', grpc.credentials.createInsecure());
  const montageeData = req.body;
  client.createMontage(montageeData, (err, response) => {
    if (err) {
      res.status(500).send(err);
    } else {
      res.json(response.piece);
    }
  });
});

// Démarrer l'application Express
const port = 3000;
app.listen(port, () => {
  console.log(`API Gateway en cours d'exécution sur le port ${port}`);
});
