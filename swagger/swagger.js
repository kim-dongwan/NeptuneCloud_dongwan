const swaggerUi = require("swagger-ui-express")
const swaggereJsdoc = require("swagger-jsdoc")

const options = {
  swaggerDefinition: {
    info: {
      version: "1.0.0",
      title: "경매장 시스템 REST API",
      description:
        "경매장에 상품등록,참여등 진행가능하도록 생성된 API에대한 문서",
    },
    servers: [
      {
        url: "http://58.225.57.157:3000", // 요청 URL
      },
    ],
  },
  apis: ["./router/*.js"], //Swagger 파일 연동
}
const specs = swaggereJsdoc(options)

module.exports = { swaggerUi, specs }