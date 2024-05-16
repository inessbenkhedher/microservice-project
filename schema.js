const { gql } = require('@apollo/server');

// Définir le schéma GraphQL
const typeDefs = `
  type Piece {
    id: String!
    nom: String!
    description: String!
    fonctionnalite: String!
  }
  
  type Montage {
    id: String!
    titre: String!
    nombre_pieces: Int!
  }

  type Query {
    piece(id: String!): Piece
    pieces: [Piece]
    montage(id: String!): Montage
    montages: [Montage]
  }

  type Mutation {
    createPiece(input: CreatePieceInput!): Piece
    createMontage(input: CreateMontageInput!): Montage
  }

  input CreatePieceInput {
    nom: String!
    description: String!
    fonctionnalite: String!
  }

  input CreateMontageInput {
    titre: String!
    nombre_pieces: Int!
  }
`;

module.exports = typeDefs;
