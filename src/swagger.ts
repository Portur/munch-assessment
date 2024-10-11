import swaggerAutogen from 'swagger-autogen'
import { EnumSizeDb } from '@prisma/client'

const doc = {
  info: {
    version: 'v1.0.0',
    title: 'munch assessment',
    description: 'Implementation of Swagger with TypeScript',
  },
  servers: [
    {
      url: 'http://localhost:4000',
      description: '',
    },
  ],
  components: {
    securitySchemes: {
      bearerAuth: {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
      },
    },
    schemas: {
      orderSize: {
        '@enum': Object.values(EnumSizeDb),
      },
    },
  },
}

const outputFile = './swagger_output.json'
const endpointsFiles = ['./src/routes/index.ts']

swaggerAutogen({ openapi: '3.0.0' })(outputFile, endpointsFiles, doc)