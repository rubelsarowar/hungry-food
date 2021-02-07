//get id
const getId = (id) => document.getElementById(id);

//key press event
getId("search-input").addEventListener("keyup", function (event) {
    event.preventDefault();
    if (event.key === 'Enter') {
        getId("search-button").click();
    }
});

//click event on search button 
getId('search-button').addEventListener('click', () => {
    const searchName = getId('search-input').value;

    getId('meal-container').innerHTML = '';

    const regexp = /[a-zA-z]/;
    if (searchName.match(regexp)) {
        getMealsList(searchName);
    } else {
        getId('message').innerText = 'Search  foods by name.';
    }
    getId('search-input').value = '';
});

//meals data list from theMealDB.com with api
const getMealsList = async searchName => {
    const response = await fetch(`https://www.themealdb.com/api/json/v1/1/search.php?f=${searchName}`);
    const data = await response.json();
    if (data.meals) {
        displayMealsData(data);
        getId('message').innerText = '';
    } else {
        getId('message').innerText = `The "${searchName}" Foods not found! Try another foods like chicken, beef, pasta.`;
    }
};

//display meals data 
const displayMealsData = (data) => {
    const mealsArray = data.meals;

    mealsArray.forEach(meal => {
        const mealName = meal.strMeal;
        const mealId = meal.idMeal;
        const mealImg = meal.strMealThumb;
        let child = document.createElement('div'); 
        const classList = ['col-md-6', 'col-lg-4', 'col-xl-3', 'p-3'];
        child.classList.add(...classList);
        
        child.innerHTML = `
        <div class = ''> 
        <div data-id='${mealId}' class="card card-click" data-bs-toggle="modal" data-bs-target="#exampleModal">
            <img src="${mealImg}" class="card-img-top" alt="...">
            <h5 class="card-title p-2">${mealName}</h5>
         </div>
        </div>
        
        `;
        getId('meal-container').appendChild(child); 
    });

    //card htmlCollection 
    const classList = document.getElementsByClassName('card-click');

    //looping for catch every class
    for (element of classList) {
        
        element.addEventListener('click', (event) => {
            event.stopPropagation();
            let mealId = event.target.getAttribute('data-id');
            if (!mealId) {
                
                mealId = event.target.parentNode.getAttribute('data-id');
            };
            getDetailsMealItem(mealId);
        });
    }

};

//details meal item
const getDetailsMealItem = async mealId => {
    const response = await fetch(`https://www.themealdb.com/api/json/v1/1/lookup.php?i=${mealId}`);
    const data = await response.json();

    if (data.meals[0].strMeal) {
      
        displayMealDetails(data);

        getId('spinner').style.display = 'none';
        getId('modal-body').style.display = 'block';
    } else {

    }
}

//display details meal item
const displayMealDetails = data => {
    const meal = data.meals[0];
    const mealName = meal.strMeal;
    const mealImg = meal.strMealThumb;

    getId('meal-img').src = mealImg;
    getId('meal-name').innerText = mealName;

    const mealKey = Object.keys(meal);

    const ingredients = mealKey.filter(elements => elements.includes('strIngredient'));

    ingredients.forEach(ingredient => {
        if (meal[ingredient]) {
            displayIngredient(meal[ingredient]);
        }
    });
};

// display ingredient item
const displayIngredient = ingredient => {
    const li = document.createElement('li'); 
    li.classList.add('p-2'); 
    li.innerHTML = `
        <span class='me-2'>✅ </span>
        <span>${ingredient}</span>
    `
    getId('parent-ingredient').appendChild(li);
};

