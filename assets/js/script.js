var nome;
var cognome;
var addBtn;
var elencoHTML;
var errore;
var erroreElenco;
var elenco = [];
var flag; //per il tasto modifica/edit
var editId; // value id da modificare
var popUp; // popup conferma eliminazione

window.addEventListener("DOMContentLoaded", init);

function init() {
	nome = document.getElementById("nome");
	cognome = document.getElementById("cognome");
	addBtn = document.getElementById("scrivi");
	elencoHTML = document.getElementById("elenco");
	errore = document.getElementById("errore");
	erroreElenco = document.getElementById("erroreElenco");
	flag = false; //|| False = stampa |--| True = Modifica ||
	editId = 0;// value id da modificare
	popUp = document.getElementById('popUp');// popup conferma eliminazione

	printData();
	eventHandler();
}

function eventHandler() {
	addBtn.addEventListener("click", function () {
		if (flag == false) { 	//|| False = stampa |--| True = Modifica ||
			controlla();
		} else {
			modificaValue();
		}
	});
}
//print user + btns
function printData() {
	fetch("http://localhost:3000/elenco")
		.then((response) => {
			return response.json();
		})
		.then((data) => {
			elenco = data;
			if (elenco.length > 0) {
				errore.innerHTML = "";
				elencoHTML.innerHTML = "";
				elenco.map(function (element) {
					elencoHTML.innerHTML += `<li class="my-2"><button type="button" class="btn text-danger border border-danger me-1" onClick="elimina(${element.id})">&#10060;</button><button type="button" class="btn btn-warning text-success me-1" onClick="edit(${element.id})">&#9997;</button> ${element.nome} ${element.cognome}</li>`;
				});
			} else {
				erroreElenco.innerHTML = "Nessun elemento presente in elenco";
			}
		});
}
//controllo compilazione
function controlla() {
	if (nome.value != "" && cognome.value != "") {
		var data = {
			nome: nome.value,
			cognome: cognome.value,
		};
		addData(data);
	} else {
		errore.innerHTML = "Compilare tutto :C";
		return;
	}
}
//json-server add info
async function addData(data) {
	let response = await fetch("http://localhost:3000/elenco", {
		method: "POST",
		headers: {
			"Content-Type": "application/json;charset=utf-8",
		},
		body: JSON.stringify(data),
	});

	clearForm();
}
//Clear form
function clearForm() {
	nome.value = "";
	cognome.value = "";
}
//-------------------------------------------------------------------//
//elimina oggetto
function elimina(elementId) {
	popUp.classList.add("active");
	editId = elementId;
	return editId;
}

confermaNo = () => {
	popUp.classList.remove("active");
}

confermaSi = () => {
	fetch("http://localhost:3000/elenco/" + editId, {
		method: "DELETE",
	});
	popUp.classList.remove("active");
}

//modifica oggetto
function edit(elementId) {
	nome.value = elenco[elementId - 1].nome;
	cognome.value = elenco[elementId - 1].cognome;
	editId = elementId;
	flag = true;
	return flag, editId;
}
function modificaValue() {
	let data = { nome: nome.value, cognome: cognome.value };

	fetch("http://localhost:3000/elenco/" + editId, {
		method: "PUT",
		headers: {
			"Content-Type": "application/json",
		},
		body: JSON.stringify(data),
	});
	flag = false; //|| False = stampa |--| True = Modifica ||
	return flag;
}