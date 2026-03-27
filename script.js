const select = document.querySelectorAll(".currency");
const input_currency = document.getElementById('input_currency');
const output_currency = document.getElementById('output_currency');

const country_list = {
    "AUD": "AU", "BRL": "BR", "CAD": "CA", "CHF": "CH", "CNY": "CN", 
    "CZK": "CZ", "DKK": "DK", "EUR": "EU", "GBP": "GB", "HKD": "HK", 
    "HUF": "HU", "IDR": "ID", "ILS": "IL", "INR": "IN", "JPY": "JP", 
    "KRW": "KR", "MXN": "MX", "MYR": "MY", "NOK": "NO", "NZD": "NZ", 
    "PHP": "PH", "PLN": "PL", "RON": "RO", "RUB": "RU", "SEK": "SE", 
    "SGD": "SG", "THB": "TH", "TRY": "TR", "USD": "US", "ZAR": "ZA"
};

fetch(`https://api.frankfurter.app/currencies`)
  .then((res) => res.json())
  .then((data) => {
    const entries = Object.entries(data);
    
    // Clear the selects but keep our hardcoded defaults
    const val0 = select[0].value;
    const val1 = select[1].value;
    select[0].innerHTML = "";
    select[1].innerHTML = "";

    entries.forEach(([code]) => {
      if(country_list[code]) {
          select[0].innerHTML += `<option value="${code}">${code}</option>`;
          select[1].innerHTML += `<option value="${code}">${code}</option>`;
      }
    });

    // Restore defaults and run initial conversion
    select[0].value = val0;
    select[1].value = val1;
    convert(); 
  });

function updateFlag(index) {
    const currencyCode = select[index].value;
    const countryCode = country_list[currencyCode];
    document.getElementById(`flag${index + 1}`).src = `https://flagsapi.com/${countryCode}/flat/64.png`;
}

function convert() {
    const input_val = parseFloat(input_currency.value);
    const from = select[0].value;
    const to = select[1].value;

    if (isNaN(input_val) || input_val <= 0) return;

    const host = 'api.frankfurter.app';
    fetch(`https://${host}/latest?amount=${input_val}&from=${from}&to=${to}`)
        .then((val) => val.json())
        .then((val) => {
            // Updated logic to ensure USD -> INR shows the ~85.00 rate correctly
            output_currency.value = val.rates[to].toFixed(2);
        });
}

// RUN CONVERT ON LOAD
window.onload = () => {
    convert();
};
