const select = document.querySelectorAll(".currency");
const input_currency = document.getElementById('input_currency');
const output_currency = document.getElementById('output_currency');

// 1. MAPPING: Connects Currency Code -> Country Code (for FlagsAPI)
const country_list = {
    "AUD": "AU", "BRL": "BR", "CAD": "CA", "CHF": "CH", "CNY": "CN", 
    "CZK": "CZ", "DKK": "DK", "EUR": "EU", "GBP": "GB", "HKD": "HK", 
    "HUF": "HU", "IDR": "ID", "ILS": "IL", "INR": "IN", "JPY": "JP", 
    "KRW": "KR", "MXN": "MX", "MYR": "MY", "NOK": "NO", "NZD": "NZ", 
    "PHP": "PH", "PLN": "PL", "RON": "RO", "RUB": "RU", "SEK": "SE", 
    "SGD": "SG", "THB": "TH", "TRY": "TR", "USD": "US", "ZAR": "ZA"
};

// 2. Load currencies into the dropdowns
fetch(`https://api.frankfurter.app/currencies`)
  .then((res) => res.json())
  .then((data) => {
    const entries = Object.entries(data);
    select.forEach(s => s.innerHTML = ""); // Clear existing options

    entries.forEach(([code]) => {
      // Only add currencies we have flags for
      if(country_list[code]) {
          select[0].innerHTML += `<option value="${code}">${code}</option>`;
          select[1].innerHTML += `<option value="${code}">${code}</option>`;
      }
    });

    // Set Defaults: USD for input, INR for output
    select[0].value = "USD";
    select[1].value = "INR";
    
    // Initial flag load
    updateFlag(0); 
    updateFlag(1);
  });

// 3. Update Flag function
function updateFlag(index) {
    const currencyCode = select[index].value;
    const countryCode = country_list[currencyCode];
    
    // Selects flag1 for the first dropdown, flag2 for the second
    const flagImage = document.getElementById(`flag${index + 1}`);
    flagImage.src = `https://flagsapi.com/${countryCode}/flat/64.png`;
}

// 4. Conversion Logic
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
            .catch(() => alert("Error fetching rates."));
    }
}
