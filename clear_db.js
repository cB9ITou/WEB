const express = require("express");
const http = require("http"); 
const mongoose = require("mongoose");
const Schema = mongoose.Schema;

let app = express();

mongoose.connect('mongodb://0.0.0.0:27017/tvshow', { useNewUrlParser: true, useUnifiedTopology: true })  // Подключаемся к БД
	.then(() => { // Успешное подключение
        	console.log('db connected...');
    	})
    	.catch(() => { // Подключение безуспешно
        	console.log('bad connection...');
    	});

let ToDo = mongoose.model('ToDo', new Schema({ description: String, tags: [ String ] })); // Создаем модель данных

async function clear() {
	await ToDo.deleteMany() // Очищаем все данные
		.then(async () => {
			console.log('successful data cleanup...');
		})
		.catch(async (err) => {
			console.log('ERROR');
		});
	
	await mongoose.disconnect()
			.then(() => { // Успешное отключение
        			console.log('db disconnected...');
    			})
    			.catch(() => { // Отдключение безуспешно
        			console.log('bad disconnection...');
    			});
}

clear();