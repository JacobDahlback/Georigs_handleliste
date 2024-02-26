// Definerer array
var handlekurv = [];

// Viser handlekurv
function toggleHandlekurvSegment() {
    var handlekurvSegment = document.getElementById("handlekurv-segment");

    if (parseInt(handlekurvSegment.style.left) === 0) {
        handlekurvSegment.style.left = "-340px";
    } else {
        handlekurvSegment.style.left = "0";
    }
}

// Funksjon som fjerner et element fra handlekurven
function fjernItemFraHandlekurv(index) {
    handlekurv.splice(index, 1); // Fjerner elementet fra handlekurven
    lagreHandlekurv(); // Lagrer den oppdaterte handlekurven i sessionStorage
    oppdaterHandlekurvDisplay(); // Oppdaterer handlekurv-displayet
}

// Funksjon som oppdaterer handlekurv-displayet
function oppdaterHandlekurvDisplay() {
    var handlekurvListe = document.getElementById("handlekurv-liste");
    var prisSumElement = document.getElementById("pris_sum");
    
    handlekurvListe.innerHTML = ""; // Tømmer handlekurv-listen

    var totalPris = 0;

    for (var i = 0; i < handlekurv.length; i++) {
        var item = handlekurv[i];
        var listItem = document.createElement("div");

        // Legger til informasjonen om elementet
        listItem.innerHTML = `
            <p>${item.navn}</p>
            <p>Pris: ${item.pris}</p>
        `;

        // Legger til kantlinje mellom hvert element
        if (i < handlekurv.length - 1) {
            listItem.style.borderBottom = "1px solid black";
        }

        handlekurvListe.appendChild(listItem);

        // Legger til prisen til den totale prisen
        totalPris += parseFloat(item.pris);

        // Oppretter en fjerningsknapp og legger til en onclick-funksjon som fjerner elementet fra handlekurven
        var removeButton = document.createElement("button");
        removeButton.textContent = "Fjern";
        removeButton.onclick = lagFjernItemFunger(i); // Bruker en closure for å fange inn riktig indeks
        listItem.appendChild(removeButton); // Legger til fjern-knappen i elementet
    }

    // Oppdaterer totalprisen
    prisSumElement.textContent = "Total pris: " + totalPris.toFixed(2);
}

// Funksjon som lager en fjerningsfunksjon for et gitt indeks
function lagFjernItemFunger(index) {
    return function() {
        fjernItemFraHandlekurv(index); // Kaller fjernItemFraHandlekurv med riktig indeks
    };
}

// funksjon som legger til i handlekurv
function leggTilHandlekurv(itemIndex) {
    console.log("Adding item to handlekurv");
    var selectedItem = hentValgtItem(itemIndex);

    if (selectedItem) {
        handlekurv.push(selectedItem);

        // Logger handlekurv array
        console.log("handlekurv:", handlekurv);

        // Lagrer det oppdaterte arrayet i sessionStorage
        lagreHandlekurv();

        // Oppdater handlekurv-displayet
        oppdaterHandlekurvDisplay();
    } else {
        console.log("Selected item is null or undefined. Cannot add to handlekurv.");
    }
}

// Funksjon som lagrer i sessionStorage
function lagreHandlekurv() {
    // Lagrer array i sessionStorage
    sessionStorage.setItem("handlekurv", JSON.stringify(handlekurv));
}

// Funksjon som henter fra sessionStorage
function hentHandlekurvFraSession() {
    var lagretHandlekurv = sessionStorage.getItem("handlekurv");

    if (lagretHandlekurv) {
        handlekurv = JSON.parse(lagretHandlekurv);
        oppdaterHandlekurvDisplay();
    }
}

// Funksjon som finner detaljene
function hentValgtItem(itemIndex) {
    var itemDivs = document.getElementsByClassName("item");

    if (itemIndex >= 0 && itemIndex < itemDivs.length) {
        var selectedDiv = itemDivs[itemIndex];

        var itemNameElement = selectedDiv.querySelector(".item_hoved h2");
        var itemName = itemNameElement ? itemNameElement.textContent : "";

        var itemPriceElement = selectedDiv.querySelector(".pris p");
        var itemPrice = itemPriceElement ? itemPriceElement.textContent.trim() : "";

        var selectedItem = {
            navn: itemName,
            pris: itemPrice
        };

        return selectedItem;
    }
    return null; // gir "null" dersom prosessen ikke går (unngår crash)
}

function clearHandlekurv() {
    // fjerner elementer fra handlekurv
    handlekurv = [];

    // Lagrer det oppdaterte arrayet i sessionStorage
    lagreHandlekurv();

    // Oppdater handlekurv-displayet
    oppdaterHandlekurvDisplay();

    console.log("Handlekurv cleared");
}

var utsjekker = [];

function lagretilutsjekk() {
    // Legger til brukerens navn og handlekurv i utsjekkene
    var navn = prompt("Hva heter du?");
    var klasse = prompt("Hvilken klasse går du i?");

    var utsjekkItem = {
        navn: navn,
        klasse: klasse,
        handlekurv: handlekurv.slice()
    };

    // Legger til utsjekkItem i utsjekker-arrayet
    utsjekker.push(utsjekkItem);

    // Lagrer utsjekker-arrayet i sessionStorage
    sessionStorage.setItem("utsjekker", JSON.stringify(utsjekker));
}



function utsjekk() {
    // Spør om bekreftelse fra brukeren
    var bekreftelse = confirm("Er du sikker på at du vil sjekke ut?");

    if (bekreftelse) {
        // Lagrer ordren
        lagretilutsjekk();
        console.log(utsjekk)
        clearHandlekurv();


        alert("Handlekurven er sjekket ut!");

    } else {
        alert("Utsjekking avbrutt.");
    }
}

function removeOrder(button) {
    var index = parseInt(button.dataset.index);
    utsjekker.splice(index, 1);
    sessionStorage.setItem("utsjekker", JSON.stringify(utsjekker));
    
    // Finn den riktige containeren for den valgte ordren
    var containerToRemove = button.parentNode;
    
    // Fjern containeren fra DOM
    containerToRemove.parentNode.removeChild(containerToRemove);
}



function oppdaterAdministrasjon() {
    var administrasjonListe = document.getElementById("administrasjon-liste");

    administrasjonListe.innerHTML = "";

    var lagretUtsjekker = sessionStorage.getItem("utsjekker");
    var utsjekker = lagretUtsjekker ? JSON.parse(lagretUtsjekker) : [];

    var searchInput = document.getElementById("searchInput").value.toLowerCase();

    for (var i = 0; i < utsjekker.length; i++) {
        var utsjekkData = utsjekker[i];

        if (utsjekkData.navn.toLowerCase().includes(searchInput)) {
            var utsjekkContainer = document.createElement("div");
            utsjekkContainer.className = "utsjekk-container";

            utsjekkContainer.innerHTML += `<h3>Navn: ${utsjekkData.navn}</h3>`;
            utsjekkContainer.innerHTML += `<h4>Klasse: ${utsjekkData.klasse}</h4>`;

            var handlekurvListe = document.createElement("div");
            handlekurvListe.id = `handlekurv-liste-${i}`;
            handlekurvListe.className = "handlekurv-liste";

            for (var j = 0; j < utsjekkData.handlekurv.length; j++) {
                var item = utsjekkData.handlekurv[j];
                var listItem = document.createElement("div");

                listItem.innerHTML = `
                    <p>${item.navn}</p>
                    <p>Pris: ${item.pris}</p>
                `;

                if (j < utsjekkData.handlekurv.length - 1) {
                    listItem.style.borderBottom = "1px solid black";
                }

                handlekurvListe.appendChild(listItem);
            }

            var totalPrisElement = document.createElement("p");
            var totalPris = 0;
            for (var k = 0; k < utsjekkData.handlekurv.length; k++) {
                totalPris += parseFloat(utsjekkData.handlekurv[k].pris);
            }
            totalPrisElement.textContent = "Total pris: " + totalPris.toFixed(2);

            utsjekkContainer.appendChild(totalPrisElement);
            utsjekkContainer.appendChild(handlekurvListe);
            administrasjonListe.appendChild(utsjekkContainer);

            var removeButton = document.createElement("button");
            removeButton.textContent = "Fjern ordre";
            removeButton.dataset.index = i;
            removeButton.onclick = function() {
                removeOrder(this);
            };
            utsjekkContainer.appendChild(removeButton); // Legg til knappen i containeren

            // Legg til styling på containeren
            utsjekkContainer.style.borderBottom = "2px solid #000";
            utsjekkContainer.style.borderRight = "2px solid #000";
            utsjekkContainer.style.borderTop = "2px solid #000";
            utsjekkContainer.style.borderLeft = "2px solid #000";
            utsjekkContainer.style.marginTop = "50px";
            utsjekkContainer.style.marginBottom = "0px";
            utsjekkContainer.style.marginLeft = "10px";
            utsjekkContainer.style.paddingLeft = "20px";
            utsjekkContainer.style.width = "200px";
        }
    }
}



function searchUtsjekker() {
    oppdaterAdministrasjon();
}









function administrer() {
    var lagretHandlekurv = sessionStorage.getItem("handlekurv");

    if (lagretHandlekurv) {
        handlekurv = JSON.parse(lagretHandlekurv);
        oppdaterAdministrasjon()
        console.log("funka")
    }

    oppdaterAdministrasjon(); // Ensure the administration is updated
}


function sjekkSideOgUtførHandling() {
    var gjeldendeSide = window.location.pathname;

    // Sjekker om gjeldende side er index.html
    if (gjeldendeSide.includes("index.html")) {
        hentHandlekurvFraSession();

        console.log("JA")
    } else{
        console.log("Nei")
        administrer()
    }
}

function showPrompt() {
    var modal = document.getElementById("modal");
    modal.style.display = "block";
}

function closeModal() {
    var modal = document.getElementById("modal");
    modal.style.display = "none";
}


function closeModal() {
    var modal = document.getElementById("modal");
    modal.style.display = "none";
}

function submitPassword() {
    var passwordInput = document.getElementById("password");
    var password = passwordInput.value;
    // Replace password with asterisks (*) for demonstration
    var hiddenPassword = "*".repeat(password.length);
    console.log("Hidden password:", hiddenPassword);
    closeModal();
    const riktigpin = 170506;
    if (parseInt(password) === riktigpin) {
        window.location.href = "./sider/administrasjon.html";
    } else {
        console.log("Feil passord");
        // Clear the input field
        passwordInput.value = "";
    }
}

function leggTilCustomItem() {
    var navn = prompt("Hva er navnet på ditt custom item?");
    var pris = parseFloat(prompt("Hva er prisen på ditt custom item?"));

    if (navn && pris) {
        var customItem = {
            navn: navn,
            pris: pris + " kr"
        };

        handlekurv.push(customItem);
        lagreHandlekurv();
        oppdaterHandlekurvDisplay();
    } else {
        alert("Vennligst fyll ut både navn og pris for det tilpassede elementet.");
    }
}



sjekkSideOgUtførHandling()