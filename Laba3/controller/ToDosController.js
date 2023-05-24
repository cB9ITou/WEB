let ToDo = require("../models/todo.js");
let User = require("../models/user.js");
let ToDosController = {};

ToDosController.index = async function (req, res) {
	console.log("Вызван ToDosController.index");
	
	let username = req.params.username || null;
	let respondWithToDos;
	
	respondWithToDos = async function (query) { 
		await ToDo.find()
			.then(async (toDos) => {
				res.status(200).json(toDos);
			})
			.catch(async (err) => {
				res.json(500, err);
			});
	};

	if (username !== null) {
		console.log("Поиск пользователя: " + username);

		await User.find({"username": username})
			.then(async (err, result) => {
				if (result.length === 0) {
					res.status(404).json({"result_length": 0});
				} else {
					respondWithToDos({"owner": result[0]._id});
				}
			})
			.catch(async (err, result) => {
				res.json(500, err);
			});
	} else {
		respondWithToDos({});
	}
};

ToDosController.create = async function (req, res) {
	var username = req.params.username || null;
	var newToDo = new ToDo({
		"description": req.body.description,
		"tags": req.body.tags
	});

	console.log("username: " + username);

	await User.find({"username": username})
		.then(async (result) => {
			if (result.length === 0) {
				newToDo.owner = null;
			} else {
				newToDo.owner = result[0]._id;
			}
			await newToDo.save()
				.then(async (result) => {
					res.status(200).json(result);
				})
				.catch(async (err) => {
					console.log(err);
					res.json(500, err);
				});
		})
		.catch(async (err, result) => {
			res.send(500);
		});
};

ToDosController.show = async function (req, res) {
	// это ID, который мы отправляем через URL
	var id = req.params.id;

	let userResultId;
	
	await User.find({"username":id})
		.then(async (result) => {
			userResultId = JSON.parse(JSON.stringify(result))[0]._id;
		})
		.catch(async (err) => {
			res.status(500).json(err);
		});

	// находим элемент списка задач с соответствующим ID 
	await ToDo.find({"owner":userResultId})
		.then(async (todo) => {
			res.status(200).json(todo);

		})
		.catch(async (err) => {
			res.status(500).json(err);
		});
};

ToDosController.destroy = async function (req, res) {
	var id = req.params.id;

	await ToDo.deleteOne({"_id": id})
		.then(async (todo) => {
			res.status(200).json(todo);
		})
		.catch(async (err) => {
			res.status(500).json(err);
		});
}

ToDosController.update = async function (req, res) {
	var id = req.params.id;
	var newDescription = {$set: {description: req.body.description}};

	await ToDo.updateOne({"_id": id}, newDescription)
		.then(async (todo) => {
			res.status(200).json(todo);
		})
		.catch(async (err) => {
			res.status(500).json(err);
		});
}

module.exports = ToDosController;