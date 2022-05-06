const sql = require('mssql');
const config = {
	server : '서버'
,	port:'포트'
,	options:{encrypt:false,database:'dataase'}
,	authentication:{
		type:"default"
	,	options:{
			userName:"아이디"
		,	password:"패스워드"
		}
	}
}


const Pool = new sql.ConnectionPool(config)
	.connect()
	.then(Pool =>{
		return Pool
	})
	.catch(err=>console.log('Database error :',err))

module.exports = {
	sql, Pool
}