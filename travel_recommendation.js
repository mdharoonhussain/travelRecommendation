document.addEventListener('DOMContentLoaded', function () {
  const resultsContainer = document.getElementById('resultsContainer');
  const searchInput = document.getElementById('conditionInput');
  const searchButton = document.getElementById('btnSearch');
  const clearButton = document.getElementById('btnClear');

  // Fetching data from JSON file
  async function fetchData() {
    try {
      const response = await fetch('./travel_recommendation_api.json');
      if (!response.ok) {
        throw new Error('Failed to fetch data');
      }
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  }

  // Display search results
  function displayResults(results) {
    resultsContainer.innerHTML = '';

    results.forEach(item => {
      const resultItem = document.createElement('div');
      resultItem.classList.add('result-item');
      resultItem.innerHTML = `
        <h3>${item.name}</h3>
        <p>${item.description}</p>
        <img src="${item.imageUrl}" alt="${item.name}">
      `;
      resultsContainer.appendChild(resultItem);
    });
  }

  // Filter data based on user input
  function filterData(data, keyword) {
    const filteredResults = {
      countries: data.countries.filter(country =>
        country.cities.some(city =>
          city.name.toLowerCase().includes(keyword.toLowerCase())
        )
      ),
      temples: data.temples.filter(temple =>
        temple.name.toLowerCase().includes(keyword.toLowerCase())
      ),
      beaches: data.beaches.filter(beach =>
        beach.name.toLowerCase().includes(keyword.toLowerCase())
      )
    };
    return filteredResults;
  }

  // Event listener for Search button
  searchButton.addEventListener('click', async function () {
    const keyword = searchInput.value.trim();
    if (keyword === '') {
      alert('Please enter a keyword to search');
      return;
    }

    const data = await fetchData();
    if (!data) {
      console.error('No data available');
      return;
    }

    const filteredResults = filterData(data, keyword);
    displayResults([...filteredResults.countries, ...filteredResults.temples, ...filteredResults.beaches]);
  });

  // Event listener for Clear button
  clearButton.addEventListener('click', function () {
    resultsContainer.innerHTML = '';
    searchInput.value = '';
  });
});
