const sql = require('mssql');
const config = {
	server : '����'
,	port:'��Ʈ'
,	options:{encrypt:false,database:'dataase'}
,	authentication:{
		type:"default"
	,	options:{
			userName:"���̵�"
		,	password:"�н�����"
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