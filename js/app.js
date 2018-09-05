// ------------------------------------------
//  Constants
// ------------------------------------------
const gallery = document.getElementById("gallery");


// ------------------------------------------
//  FETCH FUNCTIONS
// ------------------------------------------


fetchData ('https://randomuser.me/api/?fmt=json&results=12&nat=US')
	.then(data => data.results.forEach((person, index) => makeCard(person)));


// ------------------------------------------
//  HELPER FUNCTIONS
// ------------------------------------------
function checkStatus (response){
	if (response.ok){
		return Promise.resolve(response);
	}
	else {
		return Promise.reject(new Error(response.statusText));
	}
}

function fetchData(url){
	return fetch(url)
			.then(checkStatus)
			.then(response => response.json())
			.catch(error => console.log(error));
}

function makeCard(person){

	// make the card div
	let cardDiv = document.createElement('div');
	cardDiv.className = "card";
	gallery.appendChild(cardDiv); // add it to the gallery

	// Add the Imgage and Info divs to the card div
	makeImgDiv(person.picture.thumbnail, cardDiv);
	makeInfoDiv(person.name.first, 
				person.name.last, 
				person.email, 
				person.location.city, 
				person.location.state, 
				cardDiv);

}


function makeImgDiv(url, parentNode){

	let imgDiv  = document.createElement('div');
	imgDiv.className = "card-img-container";
	imgDiv.innerHTML = '<img class="card-img" ' + ' src="' + url + '" alt="profile picture">';
	parentNode.appendChild(imgDiv);
}


function makeInfoDiv(first, last, email, city, state, parentNode){
	let infoDiv = document.createElement('div');
	infoDiv.className = "card-info-container";
	let infoHTML = '<h3 id="name" class="card-name cap">';
		infoHTML += first + " " + last + '</h3>';
		infoHTML += '<p class="card-text">' + email + '</p>';
		infoHTML += '<p class="card-text cap">' + city + ", " + state + '</p>';
	infoDiv.innerHTML = infoHTML;
	parentNode.appendChild(infoDiv);
}

