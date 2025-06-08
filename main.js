// ==== I AM A NORMAL WELL-ADJUSTED PERSON THAT CAN BE TRUSTED WITH ACCESS TO A JAVASCRIPT FILE ==== //
(function () {
  const initDarkMode = () => {
    const toggle = document.getElementById('darkModeToggle');
    if (!toggle) return;

    if (localStorage.getItem('dark-mode') === 'true') {
      document.body.classList.add('dark-mode');
      toggle.checked = true;
    }

    toggle.addEventListener('change', () => {
      document.body.classList.toggle('dark-mode', toggle.checked);
      localStorage.setItem('dark-mode', toggle.checked);
    });
  };

  const fetchAbbreviations = (term = "asap") => {
    const tableBody = document.getElementById("table_body");
    if (!tableBody) return;

    const standsUrl = "https://www.stands4.com/services/v2/abbr.php?uid=1001&tokenid=tk324324324&term=${term}&format=json"
    fetch(standsUrl)
      .then(response => response.json())
      .then(data => {
        console.log("Data fetched!", data);  
      })
      .catch(error => {
        console.error("API error!", error);
      });
  };

  document.addEventListener('DOMContentLoaded', () => {
    initDarkMode();
    fetchAbbreviations();
  });
})();