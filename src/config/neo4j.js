const neo4j = require("neo4j-driver");

class Neo4jDatabase {
  constructor() {
    if (Neo4jDatabase.instance) return Neo4jDatabase.instance;
    this.driver = neo4j.driver(
      process.env.NEO4J_URI,
      neo4j.auth.basic(process.env.NEO4J_USERNAME, process.env.NEO4J_PASSWORD)
    );
    this.database = process.env.NEO4J_DATABASE;
    this.driver.verifyConnectivity().then(() =>
      console.log("Neo4j connected.")
    ).catch(console.error);
    Neo4jDatabase.instance = this;
  }

  getSession() {
    return this.driver.session({ database: this.database });
  }
}

module.exports = new Neo4jDatabase();
