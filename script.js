const select = document.querySelectorAll(".currency");
const input_currency = document.getElementById('input_currency');
const output_currency = document.getElementById('output_currency');

// Fetch currency list and populate selects
fetch(`https://api.frankfurter.app/currencies`)
  .then((data) => data.json())
  .then((data) => {
    const entries = Object.entries(data);
    entries.forEach(([code, name]) => {
      // Create options for both dropdowns
      select[0].innerHTML += `<option value="${code}">${code}</option>`;
      select[1].innerHTML += `<option value="${code}">${code}</option>`;
    });

    // Set some defaults so it's not empty
    select[0].value = "USD";
    select[1].value = "EUR";
  });

function convert() {
  const input_val = input_currency.value;
  const from = select[0].value;
  const to = select[1].value;

  // 1. Check if input is empty or not a number
  if (input_val === "" || isNaN(input_val)) {
    alert("Please enter a valid amount");
    return;
  }

  // 2. If currencies are the same, just copy the value
  if (from === to) {
    output_currency.value = input_val;
    return;
  }

  // 3. Fetch conversion
  const host = 'api.frankfurter.app';
  fetch(`https://${host}/latest?amount=${input_val}&from=${from}&to=${to}`)
    .then((val) => val.json())
    .then((val) => {
      // val.rates[to] gets the specific conversion result
      output_currency.value = Object.values(val.rates)[0].toFixed(5);
    })
    .catch((err) => {
      console.error("API Error:", err);
      alert("Conversion failed. Please try again later.");
    });
}

const country_list = {
    "AED": "AE", "AFN": "AF", "AUD": "AU", "BRL": "BR", "CAD": "CA", "CHF": "CH",
    "CLP": "CL", "CNY": "CN", "CZK": "CZ", "DKK": "DK", "EUR": "EU", "GBP": "GB",
    "HKD": "HK", "HUF": "HU", "IDR": "ID", "ILS": "IL", "INR": "IN", "JPY": "JP",
    "KRW": "KR", "MXN": "MX", "MYR": "MY", "NOK": "NO", "NZD": "NZ", "PHP": "PH",
    "PLN": "PL", "RON": "RO", "RUB": "RU", "SEK": "SE", "SGD": "SG", "THB": "TH",
    "TRY": "TR", "TWD": "TW", "USD": "US", "ZAR": "ZA"
};

const select = document.querySelectorAll(".currency");

// Function to update the flag image
function updateFlag(index) {
    const currencyCode = select[index].value;
    const countryCode = country_list[currencyCode] || "US"; // Fallback to US
    const flagTag = document.getElementById(`flag${index + 1}`);
    flagTag.src = `https://flagsapi.com/${countryCode}/flat/64.png`;
}

// Modify your existing fetch to call updateFlag once loaded
fetch(`https://api.frankfurter.app/currencies`)
  .then((data) => data.json())
  .then((data) => {
    const entries = Object.entries(data);
    entries.forEach(([code, name]) => {
      select[0].innerHTML += `<option value="${code}">${code}</option>`;
      select[1].innerHTML += `<option value="${code}">${code}</option>`;
    });
    
    // Set Defaults
    select[0].value = "USD";
    select[1].value = "INR";
    updateFlag(0);
    updateFlag(1);
  });
