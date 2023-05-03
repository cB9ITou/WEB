var express = require("express"),
http = require("http"),
app = express(),
toDos =
[
  {
    "description": "Казань - Москва",
    "tags": [ "Рейс FV123", "Рейс WZ8381" ]
  },

  {
    "description": "Казань - Стамбул",
    "tags": [ "Рейс S781" ]
  },

  {
    "description": "Санкт-Петербург - Казань",
    "tags": [ "Рейс A1" ]
  },

  {
    "description": "Стоимость: 6000",
    "tags": [ "Рейс S781", "Рейс A1" ]
  },

  {
    "description": "Стоимость: 4000",
    "tags": [ "Рейс FV123"]
  },

  {
    "description": "Стоимость: 5000",
    "tags": [ "Рейс WZ8381" ]
  }
];

app.use(express.static(__dirname + "/client"));
http.createServer(app).listen(3000);

app.get("/todos.json", function (req, res) {
	res.json(toDos);
});

app.use(express.static(__dirname + "/client"));

app.use(express.urlencoded({ extended: true }));
app.post("/todos", function (req, res) { // сейчас объект сохраняется в req.body
	var newToDo = req.body;
	console.log(newToDo);
	toDos.push(newToDo);

	res.json({"message":"Вы размещаетесь на сервере!"}); // отправляем простой объект
});

