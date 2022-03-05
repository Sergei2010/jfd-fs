const express = require('express')
const mongoose = require('mongoose')
const config = require('config')
const chalk = require('chalk')
// const { started } = require('npm')
const initDatabase = require('./startUp/initDatabase')
const routes = require('./routes')
const cors = require('cors')
const path = require('path')

const app = express()

// два базовых middleware
app.use(express.json())
app.use(express.urlencoded({ extended: false }))

// разрешение на кроссдоменные запросы
app.use(cors())
app.use('/api', routes)

const PORT = config.get('port') ?? 8080

if (process.env.NODE_ENV === 'production') {
	app.use('/', express.static(path.join(__dirname, 'client')))
	const indexPath = path.join(__dirname, 'client', 'index.html')
	app.get('*', (req, res) =>{
		res.sendFile(indexPath)
	})
}

// for MandoDB Atlas: user -> Sergey, password -> Izekzq_2022

async function start() {
	try {
		// после открытия соединения
		mongoose.connection.once('open', () => {
			initDatabase()
		})
		// подключение к удалённой mongoDB
		await mongoose.connect(config.get('mongoUri'))
		console.log(chalk.green('MongoDB connect ...'))
		app.listen(PORT, () => {
			console.log(chalk.green(`Server has been started on port ${PORT} ...`))
		})
	} catch (e) {
		console.log(chalk.red(e.message))
		process.exit(1)
	}
}

start()
