var questions = [
	{"text":"A serial killer murders an innocent person",
		"ethic_vir_bad":1, "ethic_deo_bad":1, "ethic_con_bad":1,
		"ethic_vir_good":0, "ethic_deo_good":0, "ethic_con_good":0},
	{"text":"A vigilante kills someone they believe is a criminal, but they accidentally killed an innocent person",
		"ethic_vir_bad":0, "ethic_deo_bad":1, "ethic_con_bad":1,
		"ethic_vir_good":1, "ethic_deo_good":0, "ethic_con_good":0},
	{"text":"A store owner lowers the wages of its employees so that they themselves can earn more cash",
		"ethic_vir_bad":1, "ethic_deo_bad":0, "ethic_con_bad":1,
		"ethic_vir_good":0, "ethic_deo_good":1, "ethic_con_good":0},
	{"text":"110",
		"ethic_vir_bad":0, "ethic_deo_bad":0, "ethic_con_bad":1,
		"ethic_vir_good":1, "ethic_deo_good":1, "ethic_con_good":0},
	{"text":"001",
		"ethic_vir_bad":1, "ethic_deo_bad":1, "ethic_con_bad":0,
		"ethic_vir_good":0, "ethic_deo_good":0, "ethic_con_good":1},
	{"text":"101",
		"ethic_vir_bad":0, "ethic_deo_bad":1, "ethic_con_bad":0,
		"ethic_vir_good":1, "ethic_deo_good":0, "ethic_con_good":1},
	{"text":"011",
		"ethic_vir_bad":1, "ethic_deo_bad":0, "ethic_con_bad":0,
		"ethic_vir_good":0, "ethic_deo_good":1, "ethic_con_good":1},
	{"text":"111",
		"ethic_vir_bad":0, "ethic_deo_bad":0, "ethic_con_bad":0,
		"ethic_vir_good":1, "ethic_deo_good":1, "ethic_con_good":1},
]
var curQ = 0;
var ethic_vir_total = 0;
var ethic_deo_total = 0;
var ethic_con_total = 0;

function init() {
	renderQuestion();
}

function submitAnswer(val) {
	if(val == 0) {
		ethic_vir_total += questions[curQ].ethic_vir_bad;
		ethic_deo_total += questions[curQ].ethic_deo_bad;
		ethic_con_total += questions[curQ].ethic_con_bad;
	} else if(val == 1) {
		ethic_vir_total += questions[curQ].ethic_vir_good;
		ethic_deo_total += questions[curQ].ethic_deo_good;
		ethic_con_total += questions[curQ].ethic_con_good;
	}
	curQ++;
	if(curQ < questions.length) renderQuestion();
	else showQuizResults();
}
function renderQuestion() {
	document.getElementById("curQ").innerHTML = questions[curQ].text;
	document.getElementById("ethic_vir_total").innerHTML = ethic_vir_total;
	document.getElementById("ethic_deo_total").innerHTML = ethic_deo_total;
	document.getElementById("ethic_con_total").innerHTML = ethic_con_total;
}
function showQuizResults() {
	var out_title = "Complex";
	var out_desc = "You don't follow any system of ethics significantly more than another."
	var total_max = ethic_vir_total + ethic_deo_total + ethic_con_total;
	var temp_vir = ethic_vir_total / total_max;
	var temp_deo = ethic_deo_total / total_max;
	var temp_con = ethic_con_total / total_max;
	if(true) {
		
	}
	document.getElementById("quizResults").innerHTML = "Reults";
}