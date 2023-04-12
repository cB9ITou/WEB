const ArraySections = document.querySelectorAll(".mainSectionPannel");
const ContentPannel = document.getElementById("contentPannel");

var $content;

function loadBody() 
{
	main();
}

ArraySections.forEach((element) => {
	element.addEventListener("click", function() {
		ContentPannel.classList.add("content-active");
		
		ArraySections.forEach((element) => {
			element.classList.remove("active");
		});
		
		this.classList.add("active");
	})
	
	element.addEventListener("mouseover", function() {
		
		ArraySections.forEach((element) => {
			element.classList.remove("hover");
		});
		
		this.classList.add("hover");
	})
	
	element.addEventListener("mouseout", function() {
		
		ArraySections.forEach((element) => {
			element.classList.remove("hover");
		});
	})
});

var main = function () {
	"use strict";
	
	var toDos = 
	[
		"Рейс 1",
		"Рейс 2",
		"Рейс 3",
	];
	
	$(".tabs a span").toArray().forEach(function (element) {
		$(element).on("click", function () {
		var $element = $(element);
		$("main .content").empty();
		if ($element.parent().is(":nth-child(1)")) {
			$content = $("<ul>");
			for (var i = toDos.length - 1; i > -1; i--) {
				$content.append($("<li>").text(toDos[i]));
			}
			$("main .content").append($content);
		} else if ($element.parent().is(":nth-child(2)")) {
			$content = $("<ul>");
			toDos.forEach(function (todo) {
				$content.append($("<li>").text(todo));
			});
			$("main .content").append($content);
		} else if ($element.parent().is(":nth-child(3)")) {
			$(".content").append("<input>");
			$(".content").append("<br />");
			$(".content").append("<button>Добавить</button>");
			$(".content input").addClass("inputStyle");
			$(".content br").addClass("clear");
			$(".content button").addClass("buttonStyle");
		}
		
		return false;
		});
	});
	
	
	$(".content").on("click", ".buttonStyle", function() {
		if ($(".inputStyle").val() != "") {
			toDos.push($(".inputStyle").val());
			alert("Предложение успешно добавлено в список!");
		}
		else {
			alert("ERROR: Длина добавляемого предложения должна быть > 0");
		}
	});
}