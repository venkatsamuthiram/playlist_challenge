const graphqlHTTP = require('express-graphql');
const { buildSchema } = require('graphql');

// Construct a schema, using GraphQL schema language
const schema = buildSchema(`
  type Query {
    song(id: Int!): Song
    songs: [Song],
  }
  type Mutation {
      createSong(album: String!, department: String!): Song,
      deleteSong(id: Int!): DeleteSongResponse
  }
  input SongInput {
      name: String!,
      department: String!
  }
  type DeleteSongResponse {
    id: Int!
  }

  type Song {
    album: String!,
    duration: Int!,
    title: String!,
    id: Int!,
    artist: String!
  }

  type PlayList {
    id: Int!,
    name: String!
    songs: []!
  }
`);

const rootResolver = {
  song: graphqlInput => songsService.getById(graphqlInput && graphqlInput.id),
  songs: songsService.getAll(),
  createSong: graphqlInput => songsService.save(graphqlInput),
  deleteSong: graphqlInput => songsService.deleteById(graphqlInput.id),
};

const graphql = graphqlHTTP({
  schema,
  rootValue: rootResolver,
  graphiql: true, // this creates the interactive GraphQL API explorer with documentation.
});

module.exports = graphql;