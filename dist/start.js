'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.start = undefined;

var _mongodb = require('mongodb');

var _express = require('express');

var _express2 = _interopRequireDefault(_express);

var _bodyParser = require('body-parser');

var _bodyParser2 = _interopRequireDefault(_bodyParser);

var _graphqlServerExpress = require('graphql-server-express');

var _graphqlTools = require('graphql-tools');

var _cors = require('cors');

var _cors2 = _interopRequireDefault(_cors);

var _index = require('../util/index');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var app = (0, _express2.default)();

app.use((0, _cors2.default)());

var homePath = '/graphiql';
var URL = 'http://localhost';
var PORT = 3001;
var MONGO_URL = 'mongodb://localhost:27017/minerals';

var start = exports.start = function _callee() {
  var db, Minerals, typeDefs, resolvers, schema;
  return regeneratorRuntime.async(function _callee$(_context3) {
    while (1) {
      switch (_context3.prev = _context3.next) {
        case 0:
          _context3.prev = 0;
          _context3.next = 3;
          return regeneratorRuntime.awrap(_mongodb.MongoClient.connect(MONGO_URL));

        case 3:
          db = _context3.sent;
          Minerals = db.collection('minerals');
          typeDefs = ['\n      type Query {\n        minerals(limit: Int, offset: Int): [Mineral]\n      }\n\n      type Mineral {\n        _id: String\n        name: String\n        content: String\n      }\n\n      type Mutation {\n        createMineral(name: String, content: String): Mineral\n      }\n\n      schema {\n        query: Query\n        mutation: Mutation\n      }\n    '];
          resolvers = {
            Query: {
              minerals: function minerals(root, _ref) {
                var limit = _ref.limit,
                    offset = _ref.offset;
                return regeneratorRuntime.async(function minerals$(_context) {
                  while (1) {
                    switch (_context.prev = _context.next) {
                      case 0:
                        _context.next = 2;
                        return regeneratorRuntime.awrap(Minerals.find({}).limit(parseInt(limit)).skip(parseInt(offset)).toArray());

                      case 2:
                        _context.t0 = _index.prepare;
                        return _context.abrupt('return', _context.sent.map(_context.t0));

                      case 4:
                      case 'end':
                        return _context.stop();
                    }
                  }
                }, null, undefined);
              }
            },
            Mutation: {
              createMineral: function createMineral(root, args, context, info) {
                var res;
                return regeneratorRuntime.async(function createMineral$(_context2) {
                  while (1) {
                    switch (_context2.prev = _context2.next) {
                      case 0:
                        _context2.next = 2;
                        return regeneratorRuntime.awrap(Minerals.insertOne(args));

                      case 2:
                        res = _context2.sent;
                        return _context2.abrupt('return', (0, _index.prepare)(res.ops[0]));

                      case 4:
                      case 'end':
                        return _context2.stop();
                    }
                  }
                }, null, undefined);
              }
            }
          };
          schema = (0, _graphqlTools.makeExecutableSchema)({
            typeDefs: typeDefs,
            resolvers: resolvers
          });


          app.use('/graphql', _bodyParser2.default.json(), (0, _graphqlServerExpress.graphqlExpress)({ schema: schema }));

          app.use(homePath, (0, _graphqlServerExpress.graphiqlExpress)({
            endpointURL: '/graphql'
          }));

          app.listen(PORT, function () {
            console.log('Visit ' + URL + ':' + PORT + homePath + ' to make minerals and explore them.');
          });

          _context3.next = 16;
          break;

        case 13:
          _context3.prev = 13;
          _context3.t0 = _context3['catch'](0);

          console.log(_context3.t0);

        case 16:
        case 'end':
          return _context3.stop();
      }
    }
  }, null, undefined, [[0, 13]]);
};