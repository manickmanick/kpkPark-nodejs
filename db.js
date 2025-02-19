const mysql = require("mysql");

var connection = mysql.createPool({
    host     : 'localhost',
    user     : process.env.MYSQL_USER,
    password : process.env.MYSQL_PASSWORD,
    database : process.env.MYSQL_DB
});
   

module.exports.query = (query,data,cb)=>{

    try {
        connection.getConnection(async (err,connection)=>{
            if(err) throw err;
            connection.query(query,data,function(error,results){
                connection.release();
                if (error) {
                    console.log(error);
                    
                    return cb({ status: 0, message: error.message });
                }
                cb({status:1,message:"",result:results})
            })
        })
    } catch (error) {
         cb({status:0,message:error.message,result:[]})
    }

}

module.exports.promiseQuery = (query, data = []) => {
    return new Promise((resolve, reject) => {
        connection.getConnection((err, connection) => {
            if (err) {
                reject(err);
                return;
            }
            connection.query(query, data, (error, results) => {
                connection.release();
                if (error) {
                    reject(error);
                    return;
                }
                resolve(results);
            });
        });
    });
};
