const express = require("express");
const http = require("http"); 
const mongoose = require("mongoose");
const Schema = mongoose.Schema;

let app = express();

mongoose.connect('mongodb://0.0.0.0:27017/aeroport', { useNewUrlParser: true, useUnifiedTopology: true })  // Подключаемся к БД
  .then(() => { // Успешное подключение
          console.log('db connected...');
      })
      .catch(() => { // Подключение безуспешно
          console.log('bad connection...');
      });

let ToDo = mongoose.model('ToDo', new Schema({ description: String, tags: [ String ] })); // Создаем модель данных

app.use(express.static(__dirname + "/client"));
http.createServer(app).listen(3000); // Начинаем слушать запросы

app.get("/todos.json", async (req, res) => { // Настраиваем маршрутизатор для GET-запроса
    await ToDo.find() // Выбираем все объекты модели данных
        .then((res) => { // Успешная читка
          res.json(res);
        })
        .catch((err) => { // Ошибка читки
          console.log(err);
        });
});

app.use(express.urlencoded({ extended: true }));

app.post("/todos", async (req, res) => { // Настроиваем маршрутизатор для POST-запроса
  console.log(req.body);
  let newToDo = new ToDo({"description":req.body.description, "tags":req.body.tags});
  
  const newToDosDoc = await newToDo.save() // Сохраняем (добавляем) новые данные в модель данных
      .then(async (result) => { // Данные успешно сохранены
        await ToDo.find()
          .then(async (result) => { // Успешная читка
            res.json(JSON.parse(JSON.stringify(result)));
            //console.log(result);
          })
          .catch(async (err) => { // Ошибка читки
            res.send('ERROR');
          });
      })
      .catch(async (err) => { // Ошибка сохранения
        console.log(err);
        res.send('ERROR');
      });
});