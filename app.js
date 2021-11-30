function endText(s) {
    return () => {
	var p = document.createElement("p");
	p.innerText = s;
	document.body.appendChild(p)
    };
}

function printText(s, next) {
    return () => {
	var p = document.createElement("p");
	p.innerText = s();
	var prompt = document.createElement("i");
	prompt.innerText = "press enter to continue...";
	p.appendChild(document.createElement("br"));
	p.appendChild(prompt);
	document.body.appendChild(p)
	setTimeout(() => {document.addEventListener("keyup", ({key}) => {
	    if (key === "Enter") {
		p.removeChild(prompt);
		p.className = "read";
		document.removeEventListener("keyup", this);
		next()();
	    }
	})},1);
    };
}

function multipleChoiceVar(prompt, choices, target, next) {
    return () => {
	var p = document.createElement("p");
	p.innerText = prompt;
	var c = document.createElement("ul");
	for (const choice of choices) {
	    var li = document.createElement("li");
	    var link = document.createElement("a");
	    link.href = "#";
	    link.onclick = function () {
		window[target] = choice;
		var e = document.createElement("i");
		e.innerText = choice;
		p.removeChild(c);
		p.appendChild(document.createElement("br"));
		p.appendChild(e);
		p.className = "read";
		next()();
	    }
	    link.innerText = choice;
	    li.appendChild(link);
	    c.appendChild(li);
	}
	p.appendChild(c);
	document.body.appendChild(p);
    }
}

function multipleChoiceBranch(prompt, branches) {
    return () => {
	var p = document.createElement("p");
	p.innerText = prompt;
	var c = document.createElement("ul");
	for (const branch in branches) {
	    var li = document.createElement("li");
	    var link = document.createElement("a");
	    link.href = "#";
	    link.onclick = function () {
		var e = document.createElement("i");
		e.innerText = branch;
		p.removeChild(c);
		p.appendChild(document.createElement("br"));
		p.appendChild(e);
		p.className = "read";
		branches[branch]()();
	    }
	    link.innerText = branch;
	    li.appendChild(link);
	    c.appendChild(li);
	}
	p.appendChild(c);
	document.body.appendChild(p);
    }
}

function textEntry(prompt, target, next) {
    return () => {
	var p = document.createElement("p");
	p.innerText = prompt();
	var i = document.createElement("input");
	i.type = "text"
	i.addEventListener("keyup", ({key}) => {
	    if (key === "Enter") {
		window[target] = i.value;
		var e = document.createElement("i");
		e.innerText = i.value;
		p.removeChild(i);
		p.appendChild(e);
		p.className = "read";
		next()();
	    }
	})
	p.appendChild(document.createElement("br"));
	p.appendChild(i);
	document.body.appendChild(p);
	i.focus();
    }
}

function branch(target, branches) {
    return () => {
	branches[window[target]]()()
    }
}

function random_branch(branches) {
    return () => {
	branches[Math.floor(Math.random()*branches.length)]()();
    }
}
var end = () => endText("there is nothing more for now");

var part1 = multipleChoiceVar("Who are you?", ["wanderer","thief","priest","elf"], "char_class", () => part2);
var part2 = textEntry(() => `What is your name, ${char_class}?`,"char_name", () => part3);
var part3 = branch("char_class",{
    "elf":() => elf,
    "thief":() => thief,
    "wanderer":() => wanderer,
    "priest":() => priest,
})

var wanderer = printText(() => "You have journeyed long and far but finally you have come to the imperial city, on the eve of the winter solstice. The sight of the great palace looms over the firelit streets of the city but all you can think of is a hot meal and a refuge from the biting cold.", () => wanderer2);

var wanderer2 = multipleChoiceBranch("Where shall you go?",{
    "The Bazaar":end,
    "The Temple":end
})

var priest = printText(() => "On this, your last winter solstice as a neophyte in the great temple of the sun, you find yourself in the familiar position of preparing food for the communal meal of the temple. And yet this year you can feel your hands shake and your stomach turn itself in knots with the awareness that you will never see this occasion as a youth again.", end)

var thief = printText(() => "The imperial city is all you've ever known. Born and raised living like a rat in its slums, you've managed to carve out your own little niche. But no matter what you do, you never find a lasting happiness. Tonight, as you endure the bitter cold of the winter solstice, the thought has never been clearer: there must be something more.", end)

var elf = printText(() => "Your restless journey has brought you to the capital of the latest tattered band of humans to call themselves an empire in these lands. In the dim light of the winter moon you gaze upon their royal palace and great temple; they are exquisite buildings to be sure, and yet not so grand nor so fair as those of the elder days.", end)

part1();