import express from 'express'
import routes from '../routes/index'
import swaggerUi from 'swagger-ui-express'
import swaggerOutput from '../swagger_output.json'

const app = express()

app.use(express.json())
app.use('/', routes)
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerOutput))

export default app