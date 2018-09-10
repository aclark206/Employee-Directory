// ------------------------------------------
//  Constants
// ------------------------------------------
const gallery = document.getElementById("gallery");
var cardCount = 0; // Keeps track of how many cards have been created
var cardArray= [{}]; // an Array person objects
					//  the person object contains:
					//  first [name], last [name], email, phone, address, birthday, image


// ------------------------------------------
//  FETCH FUNCTIONS
// ------------------------------------------

// fetches fake personell data in order to construct employee directory cards
fetchData ('https://randomuser.me/api/?fmt=json&results=12&nat=US')
	.then(data => data.results.forEach((person, index) => makeCard(person)));


// ------------------------------------------
//  FETCH HELPER FUNCTIONS
// ------------------------------------------

// Checks to see if the fetch call returns successfully
function checkStatus (response){
	if (response.ok){
		return Promise.resolve(response);
	}
	else {
		return Promise.reject(new Error(response.statusText));
	}
}

// fetch call with error catching
function fetchData(url){
	return fetch(url)
			.then(checkStatus)
			.then(response => response.json())
			.catch(error => console.log(error));
}


// ------------------------------------------
//  CARD HELPER FUNCTIONS
// ------------------------------------------


// 	makeCard(person)
// 	creates the employee card html with the data from the passed person object
// 	the person object needs to contain:
//			 a name object with first and last attributes
//			email
//			location with full address
//			birthday
//			phone number
//			image
function makeCard(person){
	// make the card div
	let cardDiv = document.createElement('div');
	cardDiv.className = "card";
	cardDiv.id = cardCount;
	gallery.appendChild(cardDiv); // add it to the gallery

	// Add the Imgage and Info divs to the card div
	makeImgDiv(person.picture.large, cardDiv);
	makeInfoDiv(person.name.first, 
				person.name.last, 
				person.email, 
				person.location.city, 
				cardDiv);

	addCard(person, cardDiv);
	cardCount++;
}



// 	addCard(person, card)
// 	adds the person to the cardArray/virtual card catalog
// 	the id of the card div matches the index of the virtual card in the cardArray
function addCard(person, card){

	//make address string from location object
	let addressStr = person.location.street + "  " + person.location.city + ", " +
					person.location.state + "  " + person.location.postcode;
	
	// make birthday string from Date object
	let bday = new Date(person.dob.date);
	let bdayStr = bday.getMonth() + "/" + 
				bday.getDate() + "/" + bday.getFullYear();
	
	var newPerson = {
		first: person.name.first,
		last: person.name.last,
		email: person.email,
		city: person.location.city,
		phone: person.phone,
		address: addressStr,
		birthday: bdayStr,
		img: person.picture.large,
		cardHandle: card
	}

	cardArray[cardCount] = newPerson;	
}


// 	makeImgDiv(url, parentNode)
// 	creates a <div> tag that holds a <img> tag 
// 	sets the img src to the passed url
// 	appends the div to the passed parentNode
function makeImgDiv(url, parentNode){

	let imgDiv  = document.createElement('div');
	imgDiv.className = "card-img-container";
	imgDiv.innerHTML = '<img class="card-img" ' + ' src="' + url + '" alt="profile picture">';
	parentNode.appendChild(imgDiv);
}


// 	makeInfoDiv(first, last, email, city, parentNode)
// 	creates a <div> tag that holds the info passed as paraments
// 	appends the div to the passed parentNode
function makeInfoDiv(first, last, email, city, parentNode){
	let infoDiv = document.createElement('div');
	infoDiv.className = "card-info-container";
	let infoHTML = '<h3 id="name" class="card-name cap">';
		infoHTML += first + " " + last + '</h3>';
		infoHTML += '<p class="card-text">' + email + '</p>';
		infoHTML += '<p class="card-text cap">' + city + '</p>';
	infoDiv.innerHTML = infoHTML;
	parentNode.appendChild(infoDiv);
}


// ------------------------------------------
//  MODAL HELPER FUNCTIONS
// ------------------------------------------

//  createModal()
//  creates a black Modal that is hidden from the user 
//  to be used later when cards are clicked
function createModal() {
	
	// outer div container
	let modalCont  = document.createElement('div');
	modalCont.className = "modal-container";
	gallery.appendChild(modalCont);
	modalCont.style.display = 'none';
	
	// inner div 
	let modal = document.createElement('div');
	modal.className = "modal";
	modalCont.appendChild(modal);

	
	//close button
	let button = document.createElement('button');
	button.type = "button";
	button.id = "modal-close-btn";
	button.className = "modal-close-btn";
	button.innerHTML = "<strong>X</strong>";
	modal.appendChild(button);
	
	
	// third div which contains the info
	let modalInfo = document.createElement('div');
	modalInfo.className = "modal-info-container";
	modal.appendChild(modalInfo);
	let html = '<img class="modal-img" src="https://placehold.it/125x125" alt="profile picture">';
	html += '<h3 id="name" class="modal-name cap">name</h3>';
	html += '<p class="modal-text" id="email">email</p>';
	html += '<p class="modal-text cap" id="city">city</p>';
	html += '<hr>';
	html += '<p class="modal-text" id="phone">(555) 555-5555</p>';
	html += '<p class="modal-text cap" id="address">123 Portland Ave., Portland, OR 97204</p>';
	html += '<p class="modal-text" id="dob">Birthday: 10/21/2015</p>';
	modalInfo.innerHTML = html;
	
	
	// Modal toggle buttons
	let modelBtnDiv = document.createElement('div');
	modelBtnDiv.className = "modal-btn-container";
	modelBtnDiv.id = "-1";  //  ID holds the ID of the person being displayed on the modal
	modalCont.appendChild(modelBtnDiv);

	
	// Prev Modal button
	let prevModalButton = document.createElement('button');
	prevModalButton.type = "button";
	prevModalButton.id = "modal-prev";
	prevModalButton.className = "modal-prev btn";
	prevModalButton.innerHTML = "Prev";
	modelBtnDiv.appendChild(prevModalButton);
	
	// Next Modal button
	let nextModalButton = document.createElement('button');
	nextModalButton.type = "button";
	nextModalButton.id = "modal-next";
	nextModalButton.className = "modal-next btn";
	nextModalButton.innerHTML = "Next";
	modelBtnDiv.appendChild(nextModalButton);
	
}


// 	changeModal(id)
// 	updates the info on the Modal to pertain to the card that the user indicated 
// 	they wanted to see.
// 	called when a card is clicked and when a side scroller button on the modal is clicked
// 	id should be an integer between 0 and 11
function changeModal(id){

	document.querySelector(".modal-container").style.display = 'block';
	
	document.querySelector(".modal-container").id = id;
	document.getElementById("name").innerHTML = 
		cardArray[id].first + " " + cardArray[id].last;
	document.querySelector(".modal-img").src = cardArray[id].img;
	document.getElementById("email").innerHTML = cardArray[id].email;
	document.getElementById("city").innerHTML = cardArray[id].city;
	document.getElementById("phone").innerHTML = cardArray[id].phone;
	document.getElementById("address").innerHTML = cardArray[id].address;
	document.getElementById("dob").innerHTML = "Birthday: " + cardArray[id].birthday;

}


//	hideModal()
// 	closes Modal box
function hideModal(){
	document.querySelector(".modal-container").style.display = 'none';
}


// 	scrollModal(ID, direction)
// 	called by the prev and next scrolling buttons on the modal
// 	finds the next or prev non-hidden card to display
// 	direction should either be 'prev' or 'next'
// 	ID should be an integer 
function scrollModal(ID, direction){

	if (cardArray[ID].cardHandle.style.display != 'none') {
		changeModal(ID);
	}
	// if the ID called is hidden, look for the next or prev card that isn't hidden
	else if (direction == 'prev' && ID-- > 0){
		scrollModal(ID--, 'prev');
	}
	else if (direction == 'next' && ID++ < 11){
		scrollModal(ID++, 'next');
	}
}



// ------------------------------------------
//  SEARCH HELPER FUNCTIONS
// ------------------------------------------

// 	createSearch()
// 	makes the search form adds it the document
function createSearch(){
	let searchForm = document.createElement('form');
	searchForm.action = "#";
	searchForm.method = "GET";
	let html = 	'<input type="search" id="search-input" class="search-input" placeholder="Search...">';
	    html += '<input type="submit" value="&#x1F50D;" id="search-submit" class="search-submit">';
	searchForm.innerHTML = html;
	
	document.querySelector(".search-container").appendChild(searchForm);
	
}



// 	search()
// 	called when the search submit button is pressed
// 	if the search box is empty, all results are displayed
// 	all employees whose names contain the string entered by the user will be displayed
// 	all others will be hidden
function search(){
	
	// get user Search criteria
	userInput = document.getElementById("search-input").value;
	userInput = userInput.trim();
	
	if (userInput.length !== 'undefined' && userInput.length !== 0 ){ // if the search value is empty
		userInput = userInput.toLowerCase();
		
		//compare the search criteria to the Employee Names
		// If the Employee Name does not match the search, hide the card.
		cardArray.forEach((person) => {
			
			if( !person.first.includes(userInput) && !person.last.includes(userInput))
				person.cardHandle.style.display = 'none';
			else
				person.cardHandle.style.display = 'flex';
		});
	}
	else {
	// if the search box is empty, make all cards visible
		cardArray.forEach((person) => {
			person.cardHandle.style.display = 'flex';
		});
	}
}



// ------------------------------------------
//  EVENT LISTENERS
// ------------------------------------------

// listens for all clicks within the gallery, including the cards and the modal box
gallery.addEventListener('click', event => eventRouter(event.target));


// ------------------------------------------
//  EVENT HELPER FUNCTIONS
// ------------------------------------------

// eventRouter(t)
// when a click happens, figure out what action needs to take placehold
function eventRouter(t){

	//user clicked a card, create a modal box
	if (t.className == "card")
		changeModal(t.id);
	else if (t.className == "card-info-container" || t.className == "card-img-container")
		changeModal(t.parentNode.id);
	else if (t.className == "card-name cap" || t.className == "card-text" 
				|| t.className == "card-text cap" || t.className == "card-img" )
		changeModal(t.parentNode.parentNode.id);
		
	// user clicked close modal button
	else if (t.className == "modal-close-btn" || t.parentNode.className == "modal-close-btn")
		hideModal();
	
	// user clicked a modal box prev or next buttons
	else if (t.className == "modal-prev btn"){
		let ID = parseInt(t.parentNode.parentNode.id) - 1;
		if (ID >= 0) 
			scrollModal(ID, 'prev');
	}
	else if (t.className == "modal-next btn"){	
		let ID = parseInt(t.parentNode.parentNode.id) +1;
		if (ID <= 11) 
			scrollModal(ID, 'next');		
	}

	//else ignore all other clicks
}




// ------------------------------------------
//  Main
// ------------------------------------------
createModal();
createSearch();
formSubmit = document.querySelector("form");
formSubmit.addEventListener('submit', search);
