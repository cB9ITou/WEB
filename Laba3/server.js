const express = require("express");
const http = require("http"); 
const mongoose = require("mongoose");
const ToDosController = require("./controller/ToDosController.js");
const UsersController = require("./controller/UserController.js");

let app = express();

http.createServer(app).listen(3000); // Начинаем слушать запросы

app.use('/', express.static(__dirname + '/client'));
app.use('/user/:username', express.static(__dirname + '/client'));

// командуем Express принять поступающие объекты JSON
app.use(express.urlencoded({ extended: true }));

mongoose.connect('mongodb://0.0.0.0:27017/aeroport', { useNewUrlParser: true, useUnifiedTopology: true })  // Подключаемся к БД
	.then(() => { // Успешное подключение
        	console.log('db connected...');
    	})
    	.catch(() => { // Подключение безуспешно
        	console.log('bad connection...');
    	});

// Маршрутизация (раньше гет и пост были прямо на сервере, теперь эти функции в контролёре)
app.get("/todos.json", ToDosController.index);
app.get("/todos/:id", ToDosController.show); 
app.post("/todos", ToDosController.create);
app.put("/todos/:id", ToDosController.update);
app.delete("/todos/:id", ToDosController.destroy);

app.get("/users/:username/todos.json", ToDosController.index);
app.post("/users/:username/todos", ToDosController.create);
app.put("/users/:username/todos/:id", ToDosController.update);
app.delete("/users/:username/todos/:id", ToDosController.destroy);

app.get("/users.json", UsersController.index); 
app.post("/users", UsersController.create); 
app.get("/users/:username", UsersController.show);
app.put("/users/:username", UsersController.update);
app.delete("/users/:username", UsersController.destroy);

/* --------------------------------------------------------------------------------------------------

let ToDo = mongoose.model('ToDo', new Schema({ description: String, tags: [ String ] })); // Создаем модель данных

app.get("/todos.json", async (req, res) => { // Настраиваем маршрутизатор для GET-запроса
		await ToDo.find() // Выбираем все объекты модели данных
				.then((toDos) => { // Успешная читка
					res.json(toDos);
				})
				.catch((err) => { // Ошибка читки
					console.log(err);
				});
});

app.post("/todos", async (req, res) => { // Настроиваем маршрутизатор для POST-запроса
	console.log(req.body);
	let newToDo = new ToDo({"description":req.body.description, "tags":req.body.tags});
	
	const newToDosDoc = await newToDo.save() // Сохраняем (добавляем) новые данные в модель данных
			.then(async (err, result) => { // Данные успешно сохранены
				await ToDo.find()
					.then(async (err, result) => { // Успешная читка
						res.json(result);
					})
					.catch(async (err, result) => { // Ошибка читки
						res.send('ERROR');
					});
			})
			.catch(async (err, result) => { // Ошибка сохранения
				console.log(err);
				res.send('ERROR');
			});
});

-------------------------------------------------------------------------------------------------- */