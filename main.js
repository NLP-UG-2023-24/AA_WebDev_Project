const toggle = document.getElementById('darkModeToggle');


if (localStorage.getItem('dark-mode') === 'true') {
    document.body.classList.add('dark-mode');
    if (toggle) toggle.checked = true;
}


if (toggle) {
    toggle.addEventListener('change', () => {
        document.body.classList.toggle('dark-mode', toggle.checked);
        localStorage.setItem('dark-mode', toggle.checked);
    });
}


const apiKey = 'gqsv9riz53v4hn1jhyv41at2xcmyj8n18z5ia6j7d9z87p2sh'; 
const searchButton = document.getElementById('search-button');
const clearButton = document.getElementById('clear-button');
const wordInput = document.getElementById('word-input');

wordInput.addEventListener('keydown', function(event) {
    if (event.key === 'Enter') {
        searchButton.click();
    }
});

function updateDictContent(index, content, isHtml = false) {
    const dict = document.querySelectorAll('.dictionary')[index];
    if (dict) {
        const paragraph = dict.querySelector('p');
        if (isHtml) {
            paragraph.innerHTML = content;
        } else {
            paragraph.textContent = content;
        }
    }
}
searchButton.addEventListener('click', function () {
    const word = wordInput.value.trim();
    if (word === '') {
        alert('Please enter a word!');
        return;
    }

    
    const definitionUrl = `https://api.wordnik.com/v4/word.json/${word}/definitions?limit=1&includeRelated=false&useCanonical=false&includeTags=false&api_key=${apiKey}`;

    fetch(definitionUrl)
        .then(function (response) {
            if (!response.ok) throw new Error('Definition API failed');
            return response.json();
        })
         .then(data => {
        if (data.length > 0) {
            const rawDefinition = data[0].text;

            const cleanDefinition = rawDefinition.replace(/<[^>]*>/g, '');

            updateDictContent(0, cleanDefinition);

        } else {
            updateDictContent(0, 'No definition found.');
        }
    })
    .catch(error => {
        console.error(error);
        updateDictContent(0, 'Error fetching definition.');
    });


    const etymologyUrl = `https://api.wordnik.com/v4/word.json/${word}/etymologies?api_key=${apiKey}`;

   fetch(etymologyUrl)
    .then(function (response) {
        if (!response.ok) throw new Error('Etymology API failed');
        return response.json();
    })
    .then(data => {
        if (data.length > 0) {
            const rawEtymology = data[0];
            const cleanEtymology = rawEtymology.replace(/<[^>]*>/g, '');
            const finalEtymology = cleanEtymology.trim();

            updateDictContent(1, finalEtymology);

        } else {
            updateDictContent(1, 'No etymology found.');
        }
    })
    .catch(error => {
        console.error(error);
        updateDictContent(1, 'Error fetching etymology.');
    });



    const synonymUrl = `https://api.wordnik.com/v4/word.json/${word}/relatedWords?useCanonical=false&relationshipTypes=synonym&limitPerRelationshipType=10&api_key=${apiKey}`;
    fetch(synonymUrl)
        .then(res => res.json())
        .then(data => {
           if (data.length > 0 && data[0].words && data[0].words.length > 0) {
                updateDictContent(2, data[0].words.join(', '));
            } else {
                updateDictContent(2, 'No synonyms found.');
            }
        })
        .catch(err => {
            console.error(err);
            updateDictContent(2, 'Error fetching synonyms.');
        });

    
fetch(`https://api.wordnik.com/v4/word.json/${word}/examples?limit=3&api_key=${apiKey}`)
  .then(res => res.json())
  .then(data => {
    if (data.examples && data.examples.length) {
     
      const cleanExamples = data.examples.map(e => {
        
        return e.text.replace(/_(.*?)_/g, '<em>$1</em>');
      });
      
      updateDictContent(3, cleanExamples.join('<br><br>'), true); 
            } else {
                updateDictContent(3, 'No examples found.');
            }
        })
        .catch(() => updateDictContent(3, 'Error fetching examples.'));
 
  fetch(`https://api.wordnik.com/v4/word.json/${word}/pronunciations?limit=10&useCanonical=false&api_key=${apiKey}`)
  .then(res => res.json())
  .then(data => {
    
    const ipaProns = data.filter(p => p.rawType === "IPA");
    if (ipaProns.length) {
     
      const prons = ipaProns.map(p => p.raw).join(', ');
      updateDictContent(4, prons);
    } else {
      updateDictContent(4, 'No IPA pronunciation found.');
    }
  })
  .catch(() => updateDictContent(4, 'Error fetching pronunciation.'));
  
 
    fetch(`https://api.wordnik.com/v4/word.json/${word}/phrases?limit=8&useCanonical=false&api_key=${apiKey}`)
            .then(function (response) {
                if (!response.ok) {
                    throw new Error('Phrases API failed');
                }
                return response.json();
            })
            .then(data => {
            
            if (data && data.length > 0) {
                const phrasesText = data.map(function(phrase) {
                    return `${phrase.gram1 || ''} ${phrase.gram2 || ''}`.trim();
                }).join('\n');
                updateDictContent(5, phrasesText);
            } else {
                updateDictContent(5, 'No common phrases found.');
            }
        })
        .catch(function (error) {
            console.error(error);
            updateDictContent(5, 'Error fetching phrases.');
        });

    });
   

clearButton.addEventListener('click', function () {
    wordInput.value = '';
    const allDictionaries = document.querySelectorAll('.dictionary');
    allDictionaries.forEach(function (dict) {
        dict.querySelector('p').textContent = '';
    });
});
document.getElementById('book-button').addEventListener('click', () => {
    const book = document.createElement('div');
    book.classList.add('falling-book');

    const emojis = ['📚','📓','📔','📒','📕','📗','📘','📙','📖'];
    const randomEmoji = emojis[Math.floor(Math.random() * emojis.length)];
    book.textContent = randomEmoji;

    book.style.position = 'absolute';
    book.style.left = Math.random() * 100 + 'vw';
    book.style.top = '0';
    book.style.animationDuration = (Math.random() * 2 + 3) + 's';

    document.body.appendChild(book);

    setTimeout(() => {
        book.remove();
    }, 5000);
});

function fetchWordOfTheDay() {
    const wotdUrl = `https://api.wordnik.com/v4/words.json/wordOfTheDay?api_key=${apiKey}`;
    
    fetch(wotdUrl)
        .then(response => response.json())
        .then(data => {
            const word = data.word;
            const definition = data.definitions[0]?.text || "No definition available.";
            
            document.getElementById('wotd-word').textContent = word;
            document.getElementById('wotd-definition').textContent = definition;
            
            document.getElementById('wotd-learn-more').addEventListener('click', () => {
                wordInput.value = word;
                searchButton.click();
            });
        })
        .catch(error => {
            console.error('Error fetching word of the day:', error);
            document.getElementById('wotd-word').textContent = "Error";
            document.getElementById('wotd-definition').textContent = "Failed to load word of the day.";
        });
}
document.addEventListener('DOMContentLoaded', fetchWordOfTheDay);
