function getUrlName() {
	const paramsString = new URLSearchParams(document.location.href);
		var searchParams = new URLSearchParams(paramsString);
		
		for(var pair of searchParams.entries()) {
		   urlName = pair[0].replace("http://localhost:3000/users/", "");
		   urlName = urlName.replace("/", "");
		   console.log(urlName);
		   break;
		}
}

var organizeByTags = function (toDoObjects) { 
	// создание пустого массива для тегов
	var tags = [];
	// перебираем все задачи toDos 
	toDoObjects.forEach(function (toDo) {
		// перебираем все теги для каждой задачи 
		toDo.tags.forEach(function (tag) {
			// убеждаемся, что этого тега еще нет в массиве
			if (tags.indexOf(tag) === -1) { 
				tags.push(tag);
			}
		});
	}); 
	var tagObjects = tags.map(function (tag) {
		// здесь мы находим все задачи,
		// содержащие этот тег
		var toDosWithTag = []; 
		toDoObjects.forEach(function (toDo) {
			// проверка, что результат
			// indexOf is *не* равен -1
			if (toDo.tags.indexOf(tag) !== -1) { 
				toDosWithTag.push(toDo.description);
			}
		});
		// мы связываем каждый тег с объектом, который содержит название тега и массив
		return { "name": tag, "toDos": toDosWithTag };
	});
	return tagObjects;
};

var liaWithEditOrDeleteOnClick = function (todo, callback) {
	var $todoListItem = $("<li>").text(todo.tags),
		$todoEditLink = $("<a>").attr("href", "todos/" + todo._id),
		$todoRemoveLink = $("<a>").attr("href", "todos/" + todo._id);

	//$todoEditLink.addClass("linkEdit");
	//$todoRemoveLink.addClass("linkRemove");

	$todoRemoveLink.text("   Удалить | ");
	$todoRemoveLink.on("click", function () {
		$.ajax({
			url: "/todos/" + todo._id,
			type: "DELETE"
		}).done(function (responde) {
			callback();
		}).fail(function (err) {
			console.log("error on delete 'todo'!");
		});
		return false;
	});
	$todoListItem.append($todoRemoveLink);

	$todoEditLink.text("Редактировать");
	$todoEditLink.on("click", function() {
		var newDescription = prompt("Введите новое наименование для задачи", todo.description);
		if (newDescription !== null && newDescription.trim() !== "") {
			$.ajax({
				"url": "/todos/" + todo._id,
				"type": "PUT",
				"data": { "description": newDescription },
			}).done(function (responde) {
				callback();
			}).fail(function (err) {
				console.log("Произошла ошибка: " + err);
			});
		}
		return false;
	});
	$todoListItem.append($todoEditLink);

	return $todoListItem;
}

var main = function (toDoObjects) {
	"use strict";
	// создание пустого массива с вкладками
	var tabs = [];
	// добавляем вкладку Прилёт
	tabs.push({
		"name": "Прилёт",
		// создаем функцию content
		// так, что она принимает обратный вызов
		"content": function(callback) {
			$.getJSON("http://localhost:3000/todos/" + urlName, function (toDoObjects) {
				var $content = $("<ul>");
				for (var i = toDoObjects.length-1; i>=0; i--) {
					var $todoListItem = liaWithEditOrDeleteOnClick(toDoObjects[i], function() {
						$(".tabs a:first-child span").trigger("click");
					});
					$content.append($todoListItem);
				}
				callback(null, $content);
			}).fail(function (jqXHR, textStatus, error) {
				callback(error, null);
			});
		}
	});

	// добавляем вкладку Вылет
	tabs.push({
		"name": "Вылет",
		"content": function(callback) {
			$.getJSON("http://localhost:3000/todos/" + urlName, function (toDoObjects) {
				var $content,
					i;
				$content = $("<ul>");
				for (i = 0; i < toDoObjects.length; i++) {
					var $todoListItem = liaWithEditOrDeleteOnClick(toDoObjects[i], function() {
						$(".tabs a:nth-child(2) span").trigger("click");
					});
					$content.append($todoListItem);
				}
				callback(null, $content);
			}).fail(function(jqXHR, textStatus, error) {
				callback(error, null);
			});
		}
	});

	// добавляем вкладку Теги
	tabs.push({
		"name": "Теги",
		"content":function (callback) {
			$.get("http://localhost:3000/todos/" + urlName, function (toDoObjects) {	
				// создание $content для Теги 
				var organizedByTag = organizeByTags(toDoObjects),
					$content;
				organizedByTag.forEach(function (tag) {
					var $tagName = $("<h3>").text(tag.name);
						$content = $("<ul>");
					tag.toDos.forEach(function (description) {
						var $li = $("<li>").text(description);
						$content.append($li);
					});
					$("main .content").append($tagName);
					$("main .content").append($content);
				});
				callback(null,$content);
			}).fail(function (jqXHR, textStatus, error) {
				// в этом случае мы отправляем ошибку вместе с null для $content
				callback(error, null);
			});
		}
	});

	// создаем вкладку Добавить
	tabs.push({
		"name": "Добавить",
		"content":function () {
			$.get("http://localhost:3000/todos/" + urlName, function (toDoObjects) {	
				// создание $content для Добавить 
				var $textInput = $("<h3>").text("Данные о рейсе: "),
					$input = $("<input>"),//.addClass("description"), 
					$textTag = $("<h3>").text("Рейс: "),
					$tagInput = $("<input>"),//.addClass("tags"),
					$button = $("<button>").text("Добавить"),
					$content1 = $("<ul>"), $content2 = $("<ul>");

				$content1.append($input);
				$content2.append($tagInput);

				$("main .content").append($textInput);
				$("main .content").append($content1);
				$("main .content").append($textTag);
				$("main .content").append($content2);
				$("main .content").append($button); 
				
				function btnfunc() {
					var description = $input.val(),
						tags = $tagInput.val().split(","),
						// создаем новый элемент списка задач
						newToDo = {"description":description, "tags":tags};
					$.post("todos", newToDo, function(result) {
						$input.val("");
						$tagInput.val("");
						$(".tabs a:first-child span").trigger("click");
					});
				}
				$button.on("click", function() {
					btnfunc();
				});
				$('.tags').on('keydown',function(e){
					if (e.which === 13) {
						btnfunc();
					}
				});
			});
		}
	});

	tabs.forEach(function (tab) {
		var $aElement = $("<a>").attr("href",""),
			$spanElement = $("<span>").text(tab.name);
		$aElement.append($spanElement);
		$("main .tabs").append($aElement);

		$spanElement.on("click", function () {
			var $content;
			$(".tabs a span").removeClass("active");
			//$spanElement.addClass("active");
			$("main .content").empty();
			tab.content(function (err, $content) {
				if (err !== null) {
					alert ("Возникла проблема при обработке запроса: " + err);
				} else {
					$("main .content").append($content);
				}
			});
			return false;
		});
	});

	$(".tabs a:first-child span").trigger("click");
}

let urlName = "";

getUrlName();

$(document).ready(function() {
	$.getJSON("http://localhost:3000/todos/" + urlName, function (toDoObjects) {
		main(toDoObjects);
	});
});