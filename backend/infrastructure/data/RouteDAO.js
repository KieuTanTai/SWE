import { default as BaseDAO } from "./baseDAO";
import dbSchema from "./dbSchema";
import mySql from "mysql2/promise"

class RouteDAO extends BaseDAO {
    
    /**
     * Creates an instance of RouteDAO.
     * @param {mySql.PoolConnection} connection
     * @memberof RouteDAO
     */
    constructor(connection) {
        super(connection, "Route", dbSchema.ROUTE_COLUMNS.ROUTE_ID);
    }

    async test() {
        await this._protectedCreate({ name: "Test Route" });
    }
}