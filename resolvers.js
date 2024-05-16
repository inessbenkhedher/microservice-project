const grpc = require('@grpc/grpc-js');
const protoLoader = require('@grpc/proto-loader');

// Charger les fichiers proto pour les pièces et les montages
const pieceProtoPath = 'piece.proto'; // Changement du chemin vers le fichier piece.proto
const montageProtoPath = 'montage.proto'; // Changement du chemin vers le fichier montage.proto

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

const pieceProto = grpc.loadPackageDefinition(pieceProtoDefinition).piece; // Changement du nom du package
const montageProto = grpc.loadPackageDefinition(montageProtoDefinition).montage; // Changement du nom du package

// Définir les résolveurs pour les requêtes GraphQL
const resolvers = {
  Query: {
    piece: (_, { id }) => {
      // Effectuer un appel gRPC au microservice de pièces
      const client = new pieceProto.PieceService('localhost:50051', grpc.credentials.createInsecure()); // Changement du nom du service
      return new Promise((resolve, reject) => {
        client.getPiece({ pieceId: id }, (err, response) => { // Changement du nom du champ
          if (err) {
            reject(err);
          } else {
            resolve(response.piece);
          }
        });
      });
    },
    pieces: () => {
      // Effectuer un appel gRPC au microservice de pièces
      const client = new pieceProto.PieceService('localhost:50051', grpc.credentials.createInsecure()); // Changement du nom du service
      return new Promise((resolve, reject) => {
        client.searchPieces({}, (err, response) => {
          if (err) {
            reject(err);
          } else {
            resolve(response.pieces);
          }
        });
      });
    },
    montage: (_, { id }) => {
      const client = new montageProto.MontageService('localhost:50053', grpc.credentials.createInsecure());
      return new Promise((resolve, reject) => {
        client.getMontage({ montage_id: id }, (err, response) => {
          if (err) {
            reject(err);
          } else {
            resolve(response.montage);
          }
        });
      });
    },
    montages: () => {
      const client = new montageProto.MontageService('localhost:50053', grpc.credentials.createInsecure());
      return new Promise((resolve, reject) => {
        client.searchMontages({}, (err, response) => {
          if (err) {
            reject(err);
          } else {
            resolve(response.montages);
          }
        });
      });
    },
  },
  Mutation: {
    createPiece: (_, { input }) => {
     const { fonctionnalite, description,nom } = input;
      const client = new pieceProto.PieceService('localhost:50051', grpc.credentials.createInsecure());
      return new Promise((resolve, reject) => {
        client.createPiece({ fonctionnalite, description,nom }, (err, response) => {
          if (err) {
            reject(err);
          } else {
            resolve(response.createdPiece);
          }
        });
      });
    },
    createMontage: (_, { input }) => {
      const { titre, nombre_pieces } = input;
      const client = new montageProto.MontageService('localhost:50053', grpc.credentials.createInsecure());
      return new Promise((resolve, reject) => {
        client.createMontage({ titre, nombre_pieces }, (err, response) => {
          if (err) {
            reject(err);
          } else {
            resolve(response.createdMontage);
          }
        });
      });
    },
  },
};


module.exports = resolvers;
