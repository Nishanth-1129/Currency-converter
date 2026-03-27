const select = document.querySelectorAll(".currency");
const input_currency = document.getElementById('input_currency');
const output_currency = document.getElementById('output_currency');

// Map currency codes to country codes for flags
const country_list = {
    "AUD": "AU", "BRL": "BR", "CAD": "CA", "CHF": "CH", "CNY": "CN", 
    "CZK": "CZ", "DKK": "DK", "EUR": "EU", "GBP": "GB", "HKD": "HK", 
    "HUF": "HU", "IDR": "ID", "ILS": "IL", "INR": "IN", "JPY": "JP", 
    "KRW": "KR", "MXN": "MX", "MYR": "MY", "NOK": "NO", "NZD": "NZ", 
    "PHP": "PH", "PLN": "PL", "RON": "RO", "RUB": "RU", "SEK": "SE", 
    "SGD": "SG", "THB": "TH", "TRY": "TR", "USD": "US", "ZAR": "ZA"
};

// Populate dropdowns
fetch(`https://api.frankfurter.app/currencies`)
  .then((res) => res.json())
  .then((data) => {
    const entries = Object.entries(data);
    select.forEach(s => s.innerHTML = ""); // Clear "Select" option
    
    entries.forEach(([code]) => {
      // We only add currencies that we have flags for in our list
      if(country_list[code]) {
          select[0].innerHTML += `<option value="${code}">${code}</option>`;
          select[1].innerHTML += `<option value="${code}">${code}</option>`;
      }
    });

    // Default values
    select[0].value = "USD";
    select[1].value = "INR";
    updateFlag(0);
    updateFlag(1);
  });

function updateFlag(index) {
    const code = select[index].value;
    const country = country_list[code];
    document.getElementById(`flag${index + 1}`).src = `https://flagsapi.com/${country}/flat/64.png`;
}

function convert() {
    const val = input_currency.value;
    const from = select[0].value;
    const to = select[1].value;

    if (val === "" || val <= 0) {
        alert("Please enter a valid amount");
        return;
    }

    if (from === to) {
        output_currency.value = val;
    } else {
        fetch(`https://api.frankfurter.app/latest?amount=${val}&from=${from}&to=${to}`)
            .then(res => res.json())
            .then(data => {
                output_currency.value = data.rates[to].toFixed(2);
            })
            .catch(err => alert("Error fetching rates."));
    }
}
