function scrollToBottom() {
    window.scrollTo(0, document.body.scrollHeight)
}

function endText(s,beginning) {
    return () => {
	var p = document.createElement("p");
	p.innerText = s;
	var link = document.createElement("a");
	link.href = "#";
	link.onclick = function () {
	    location.reload();
	}
	link.innerText = "Restart?"
	p.appendChild(document.createElement("br"));
	p.appendChild(link)
	document.body.appendChild(p)
	scrollToBottom()
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
	var eventHandler = ({key}) => {
	    if (key === "Enter") {
		p.removeChild(prompt);
		p.className = "read";
		document.removeEventListener("keyup", eventHandler);
		setTimeout(next(),10);
	    }
	}
	setTimeout(() => {document.addEventListener("keyup", eventHandler)},1);
	scrollToBottom()
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
		setTimeout(next(),10);
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
	branches.forEach(function (val, i) {
	    if (!val[2]) {
		var li = document.createElement("li");
		var link = document.createElement("a");
		link.href = "#";
		link.onclick = function () {
		    var e = document.createElement("i");
		    e.innerText = val[0];
		    p.removeChild(c);
		    p.appendChild(document.createElement("br"));
		    p.appendChild(e);
		    p.className = "read";
		    val[2] = true;
		    setTimeout(val[1](),10);
		}
		link.innerText = val[0];
		li.appendChild(link);
		c.appendChild(li)
	    }
	})
	p.appendChild(c);
	document.body.appendChild(p);
	scrollToBottom()
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
		if (i.value) {
		    window[target] = i.value;
		    var e = document.createElement("i");
		    e.innerText = i.value;
		    p.removeChild(i);
		    p.appendChild(e);
		    p.className = "read";
		    setTimeout(next(),10);
		    return;
		}
		if (document.body.lastChild.tagName != "I") {
		    var e = document.createElement("i");
		    e.innerText = "Enter some text"
		    document.body.appendChild(e);
		    setTimeout(() => {
			e.style.opacity = '0';
			setTimeout(() => {
			    document.body.removeChild(e)
			}, 500)
		    }, 1000)
		}
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
	setTimeout(branches[window[target]](),10);
    }
}

function random_branch(branches) {
    return () => {
	setTimeout(branches[Math.floor(Math.random()*branches.length)](),10);
    }
}
var end = () => endText("there is nothing more for now", () => part1);

var part1 = multipleChoiceVar("Who are you?", ["wanderer","thief","priest","elf"], "char_class", () => part2);
var part2 = textEntry(() => `What is your name, ${char_class}?`,"char_name", () => part3);
var part3 = branch("char_class",{
    "elf":() => elf,
    "thief":() => thief,
    "wanderer":() => wanderer,
    "priest":() => priest,
})

var wanderer = printText(() => "You have journeyed long and far but finally you have come to the imperial city, on the eve of the winter solstice. The sight of the great palace looms over the firelit streets of the city but all you can think of is a hot meal and a refuge from the biting cold.", () => wanderer2);

var wanderer2 = multipleChoiceBranch("Where shall you go?",[
    ["The bazaar", end],
    ["The temple", () => temple1]
])

var priest = printText(() => "On this, your last winter solstice as a neophyte in the great temple of the sun, you find yourself in the familiar position of preparing food for the communal meal of the temple. And yet this year you can feel your hands shake and your stomach turn itself in knots with the awareness that you will never see this occasion as a youth again.", end)

var thief = printText(() => "The imperial city is all you've ever known. Born and raised living like a rat in its slums, you've managed to carve out your own little niche. But no matter what you do, you never find a lasting happiness. Tonight, as you endure the bitter cold of the winter solstice, the thought has never been clearer: there must be something more.", end)

var elf = printText(() => "Your restless journey has brought you to the capital of the latest tattered band of humans to call themselves an empire in these lands. In the dim light of the winter moon you gaze upon their royal palace and great temple; they are exquisite buildings to be sure, and yet not so grand nor so fair as those of the elder days.", end)

var temple1 = printText(() => "You walk west along the imperial road and through the gate of the old city. Turning north you head toward the sacred mount, upon which stands the temple of the Sun. The street is full of people: pilgrims and citizens, nobles and commoners. The whole crowd's movements become synchronized and you simply let yourself be swept along, climbing the great hill in a dreamlike haze.", () => temple2)

var temple2 = multipleChoiceBranch("Unable to tell if an eternity has passed or if it has only been an instant, you find yourself at the summit, before the open doors of the eastern entrance of the temple.", [
    ["Examine the temple",() => templeDesc],
    ["Enter",() => temple3]
])

var templeDesc = multipleChoiceBranch("You face the doors of a vestibule on the eastern wall of the temple, which leads directly into the temple's grand sanctuary, whose circular dome looms above you. To the north you can see the central nave, ending in the great gate which is used only for official processions. This connects to the road of sacrifice, which proceeds down the sacred mount, through the northern part of the city and into the wilderness beyond. To the south you can see a large garden; it is empty now but you suspect it would be quite a pleasant place in the spring or summer. The whole building is intricately ornamented, covered in sculpture and relief carvings, their beauty recalling the stories of the divine cities which fell to ruin so long ago.", [
    ["Enter", () => temple3]
])

var temple3 = printText(() => "Stepping into the temple you feel suddenly warm, some magic of the priests no doubt. Looking around, you seem young acolytes swarming around the edges of the sanctuary, carrying food and drink to great serving vessels which the visitors to the temple appear to take from as they please. In the center, many people sit on the floor and eat. You have heard that the priests of this land have a custom of serving communal meals in their temples to any who will come, and as you look out you see people of all social classes seated together on the floor, distinguishable by their clothing and yet not separated. ", () => temple4)

var temple4 = multipleChoiceBranch("Your stomach reminds you that you have been traveling a week now with nothing to eat but tallow, dried meat, and juniper berries. The enticing aromas of spiced lamb, rice and fragrant tea call to you. And yet, maybe it would be better to leave; priests do always seem to have some disguised motive behind their generosity.", [
    ["Grab some food", end],
    ["Leave",() => wanderer2]
])

part1();