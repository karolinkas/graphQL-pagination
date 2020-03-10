# A small Tutorial for GraphQL Pagination with MongoDB

### Why is GraphQL so great?
Developers that are regularily writing API endpoints are pretty excited about GraphQL since it came out in 2015. But what's so special about it? Basically it gives you more freedom as a developer to request only exactly as much data you really need, it's aiding type safety and allows your API to evolve without versioning. GraphQL is actually it's own language for querying databases that is very much worth it to look into because it might make API development more smooth like this guy, almost like this guy:

![Alt Text](images/smooth.gif)

### Is this for me?
If you have never tried out GraphQL with MongoDB, but you are super curious about it, don't despair, but try this tutorial before, that explains you how to bring together GraphQL with MongoDB: [https://medium.com/the-ideal-system/graphql-and-mongodb-a-quick-example-34643e637e49](https://medium.com/the-ideal-system/graphql-and-mongodb-a-quick-example-34643e637e49)

### What pagination means here
First of all let's confirm we agree on what pagination means for us. Pagination according to our understanding could for example give the user of a web application the chance to customize how much of the search results of list he wants to see. If there's a lot of details he would prefer to see 10 results in a list rather than 100.

Now let's jump into the actual tutorial:

### Tutorial

:point_right: **Tip**:
This assumes you have mongoDB installed locally, if you realise you don't, this is a good guide: [https://treehouse.github.io/installation-guides/mac/mongo-mac.html](https://treehouse.github.io/installation-guides/mac/mongo-mac.html)

Clone my repository with the example project

```console
git clone git@github.com:karolinkas/graphQL-pagination.git
```
Make sure you local mongo instance is running, if not start it with the mongo daemon

    mongod

To illustrate you how and where we might be needing pagination I created a graphql server that connects to a local mongo db instance.

### The mineral collection as an example
Imagine you are really obsessed with minerals and would like to have digital representation of your collection. Using graphQL queries you will be creating minerals that have a `name` and a `content`
( with important containing chemical elements ) property each time you add a new one to your collection.

To see the project in action get things ready by running

    yarn start
   which builds and starts an express server.

Open http://localhost:3001/graphiql
GraphiQL is an online IDE (editor) that allows you to run queries and mutations against your database.

### Making minerals
To create a mineral ( a database entry ) in our mineral collection run this in GraphiQL. :

    mutation {
      createMineral(name: "Quartz", content: "Silicon"){
        _id
    		name
    		content
    	}
    }

Create a bunch of them with different mineral names to have a good list of example minerals.

### Exploring minerals
To see and explore what minerals we already created run in GraphiQL:

    query {
      minerals {
        _id
        name
        content
      }
    }

You'll see that this query returns the list of all the minerals that you ever created, but what if you have a huge collection of 250 minerals and you don't want to show the all in a giant list.
That's where pagination comes into play.


An example for this would be to limit the query's return value to 4 minerals instead of showing all 12 at once. If we are showing only the minerals in the second row there is an offset of 4 minerals.


![](images/limit.png?raw=true)

### Adjusting Query
Let's try to implement this with a graphql query.
In src/start.js you will be able to find the definition of query and it's types.

    type Query {
    	minerals: [Mineral]
    }

If we want to give the user new functionality we could just add new parameters to the query.

    type Query {
    	minerals(limit: Int, offset: Int): [Mineral]
    }

Then in the resolver, which is what brings together the mongodDB Query and the GraphQL query,
this resolver:

    Query: {
        minerals: async () => {
            return (await Minerals.find({})
                .toArray()).map(prepare)
        },
    },

turns into

    Query: {
        minerals: async (root, {limit, offset}) => {
            return (await Minerals.find({})
                .limit(parseInt(limit))
                .skip(parseInt(offset))
                .toArray()).map(prepare)
        },
    },

Here we are using the parameters that we defined in the Query type to limit/offset the results the query will return.

Now when trying out the new pagination functionality we set the new parameters in GraphiQL, to implement the same pagination like in the infographic we would do:

    query {
	    minerals(limit: 4, offset: 4) {
		    _id
		    name
		    content
	    }
    }



