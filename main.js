const toggle = document.getElementById('darkModeToggle');

// Restore theme from localStorage
if (localStorage.getItem('dark-mode') === 'true') {
    document.body.classList.add('dark-mode');
    if (toggle) toggle.checked = true;
}

// Toggle dark mode and save preference
if (toggle) {
    toggle.addEventListener('change', () => {
        document.body.classList.toggle('dark-mode', toggle.checked);
        localStorage.setItem('dark-mode', toggle.checked);
    });
}

function updateDict(index, text) {
    var dict = document.querySelectorAll('.dictionary')[index];
    if (dict) {
        dict.querySelector('p').textContent = text;
    }
}

var apiKey = 'gqsv9riz53v4hn1jhyv41at2xcmyj8n18z5ia6j7d9z87p2sh'; // <<< tutaj wstaw swój klucz API

var searchButton = document.getElementById('search-button');
var clearButton = document.getElementById('clear-button');
var wordInput = document.getElementById('word-input');

searchButton.addEventListener('click', function () {
    var word = wordInput.value.trim();
    if (word === '') {
        alert('Please enter a word!');
        return;
    }
wordInput.addEventListener('keydown', function(event) {
  if (event.key === 'Enter') {
    searchButton.click();
  }
});

    // === 1. Fetch Definition ===
    var definitionUrl = `https://api.wordnik.com/v4/word.json/${word}/definitions?limit=1&includeRelated=false&useCanonical=false&includeTags=false&api_key=${apiKey}`;

    fetch(definitionUrl)
        .then(function (response) {
            if (!response.ok) throw new Error('Definition API failed');
            return response.json();
        })
        .then(function (data) {
            var dict1 = document.querySelectorAll('.dictionary')[0];
            var paragraph = dict1.querySelector('p');

            if (data.length > 0) {
                paragraph.textContent = data[0].text;
            } else {
                paragraph.textContent = 'No definition found.';
            }
        })
        .catch(function (error) {
            console.error(error);
            var dict1 = document.querySelectorAll('.dictionary')[0];
            dict1.querySelector('p').textContent = 'Error fetching definition.';
        });

    // === 2. Fetch Etymology ===
    var etymologyUrl = `https://api.wordnik.com/v4/word.json/${word}/etymologies?api_key=${apiKey}`;

    fetch(etymologyUrl)
        .then(function (response) {
            if (!response.ok) throw new Error('Etymology API failed');
            return response.json();
        })
        .then(function (data) {
            var dict2 = document.querySelectorAll('.dictionary')[1];
            var paragraph = dict2.querySelector('p');

            if (data.length > 0) {
                paragraph.innerHTML = data[0]; // etymology may contain HTML
            } else {
                paragraph.textContent = 'No etymology found.';
            }
        })
        .catch(function (error) {
            console.error(error);
            var dict2 = document.querySelectorAll('.dictionary')[1];
            dict2.querySelector('p').textContent = 'Error fetching etymology.';
        });

        // === 3. Synonyms ===
    var synonymUrl = `https://api.wordnik.com/v4/word.json/${word}/relatedWords?useCanonical=false&relationshipTypes=synonym&limitPerRelationshipType=10&api_key=${apiKey}`;
    fetch(synonymUrl)
        .then(res => res.json())
        .then(data => {
            var dict3 = document.querySelectorAll('.dictionary')[2];
            var paragraph = dict3.querySelector('p');

            if (data.length > 0 && data[0].words && data[0].words.length > 0) {
                paragraph.textContent = data[0].words.join(', ');
            } else {
                paragraph.textContent = 'No synonyms found.';
            }
        })
        .catch(err => {
            console.error(err);
            var dict3 = document.querySelectorAll('.dictionary')[2];
            dict3.querySelector('p').textContent = 'Error fetching synonyms.';
        });
          // 3: Examples
 // 4. Examples
fetch(`https://api.wordnik.com/v4/word.json/${word}/examples?limit=3&api_key=${apiKey}`)
  .then(res => res.json())
  .then(data => {
    if (data.examples && data.examples.length) {
      // Clean each example by replacing underscores with <em> or removing them
      const cleanExamples = data.examples.map(e => {
        // Replace _text_ with <em>text</em>
        return '• ' + e.text.replace(/_(.*?)_/g, '<em>$1</em>');
      });
      // Join with <br><br> for spacing and insert as HTML
      updateDictHTML(3, cleanExamples.join('<br><br>'));
    } else {
      updateDict(3, 'No examples found.');
    }
  })
  .catch(() => updateDict(3, 'Error fetching examples.'));

// Helper function to update innerHTML instead of textContent for examples
function updateDictHTML(index, html) {
  var dict = document.querySelectorAll('.dictionary')[index];
  if (dict) {
    dict.querySelector('p').innerHTML = html;
  }
}

  // 4: Pronunciation
  fetch(`https://api.wordnik.com/v4/word.json/${word}/pronunciations?limit=10&useCanonical=false&api_key=${apiKey}`)
  .then(res => res.json())
  .then(data => {
    // Filter only IPA pronunciations
    const ipaProns = data.filter(p => p.rawType === "IPA");
    if (ipaProns.length) {
      // Join all IPA pronunciation strings with commas
      const prons = ipaProns.map(p => p.raw).join(', ');
      updateDict(4, prons);
    } else {
      updateDict(4, 'No IPA pronunciation found.');
    }
  })
  .catch(() => updateDict(4, 'Error fetching pronunciation.'));
  // 5: Word Frequency
  fetch(`https://api.wordnik.com/v4/word.json/${word}/frequency?useCanonical=false&startYear=1800&endYear=2020&api_key=${apiKey}`)
    .then(res => res.json())
    .then(data => {
      if (data.totalCount) {
        // Show total count and maybe first year data point
        updateDict(5, `Total occurrences: ${data.totalCount}`);
      } else {
        updateDict(5, 'No frequency data found.');
      }
    })
    .catch(() => updateDict(5, 'Error fetching frequency.'));
});

clearButton.addEventListener('click', function () {
    wordInput.value = '';
    var allDictionaries = document.querySelectorAll('.dictionary');
    allDictionaries.forEach(function (dict) {
        dict.querySelector('p').textContent = '';
    });
});