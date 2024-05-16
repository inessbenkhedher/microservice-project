#Aperçu
Ce projet est une architecture basée sur des microservices pour la gestion des pièces et des montages. Il utilise gRPC pour la communication inter-services et fournit une passerelle API REST pour les interactions avec les clients.

#Technologies Utilisées
Node.js
Express.js
gRPC
MongoDB
Apollo Server (pour GraphQL)
#Documentation de l'API
##Endpoints
###Pièces
GET /pieces : Récupérer une liste de pièces.
GET /pieces/:id : Récupérer une pièce par son ID.
POST /pieces : Créer une nouvelle pièce.
###Montages
GET /montages : Récupérer une liste de montages.
GET /montages/:id : Récupérer un montage par son ID.
POST /montages : Créer un nouveau montage.
##Exemples de Requêtes et Réponses
GET /pieces/:id
###Requête :GET /pieces/60d5f483fbd3d70017ef8871
###Réponse :{
    "_id": "60d5f483fbd3d70017ef8871",
    "nom": "Nom de la Pièce",
    "description": "Description de la Pièce",
    "fonctionnalite": "Fonctionnalité"
}
##POST /pieces
###Requête :{
    "nom": "Nouvelle Pièce",
    "description": "Description de la nouvelle pièce",
    "fonctionnalite": "Fonctionnalité de la nouvelle pièce"
}
###Réponse :{
    "piece": {
        "_id": "60d5f483fbd3d70017ef8872",
        "nom": "Nouvelle Pièce",
        "description": "Description de la nouvelle pièce",
        "fonctionnalite": "Fonctionnalité de la nouvelle pièce"
    }
}
#Services gRPC
##PieceService
###getPiece : 
Récupérer une pièce par son ID.
###createPiece : 
Créer une nouvelle pièce.
###searchPieces :
Rechercher des pièces en fonction d'une requête.
##MontageService
###getMontage :
Récupérer un montage par son ID.
###createMontage : 
Créer un nouveau montage.
###searchMontages :
Rechercher des montages en fonction d'une requête.
##Modèles de Base de Données
###Modèle Pièce
{
    "_id": "ObjectId",
    "nom": "String",
    "description": "String",
    "fonctionnalite": "String"
}
###Modèle Montage
{
    "_id": "ObjectId",
    "titre": "String",
    "nombre_pieces": "Number"
}

#Contribuer
##Comment Contribuer
Forker le dépôt
Créer une nouvelle branche (git checkout -b feature/your-feature)
Commiter vos modifications (git commit -am 'Ajouter une nouvelle fonctionnalité')
Pousser sur la branche (git push origin feature/your-feature)
Créer une nouvelle Pull Request
