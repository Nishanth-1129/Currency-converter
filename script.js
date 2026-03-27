const select = document.querySelectorAll(".currency");
const input_currency = document.getElementById('input_currency');
const output_currency = document.getElementById('output_currency');

// Mapping currency codes to country codes for FlagsAPI
const country_list = {
    "AUD": "AU", "BRL": "BR", "CAD": "CA", "CHF": "CH", "CNY": "CN", 
    "CZK": "CZ", "DKK": "DK", "EUR": "EU", "GBP": "GB", "HKD": "HK", 
    "HUF": "HU", "IDR": "ID", "ILS": "IL", "INR": "IN", "JPY": "JP", 
    "KRW": "KR", "MXN": "MX", "MYR": "MY", "NOK": "NO", "NZD": "NZ", 
    "PHP": "PH", "PLN": "PL", "RON": "RO", "RUB": "RU", "SEK": "SE", 
    "SGD": "SG", "THB": "TH", "TRY": "TR", "USD": "US", "ZAR": "ZA"
};

// Fill dropdowns with currencies
fetch(`https://api.frankfurter.app/currencies`)
  .then((res) => res.json())
  .then((data) => {
    const entries = Object.entries(data);
    select.forEach(s => s.innerHTML = ""); // Clear placeholders

    entries.forEach(([code]) => {
      // Only add if we have a flag for it
      if(country_list[code]) {
          select[0].innerHTML += `<option value="${code}">${code}</option>`;
          select[1].innerHTML += `<option value="${code}">${code}</option>`;
      }
    });

    // Default selection
    select[0].value = "USD";
    select[1].value = "INR";
    updateFlag(0);
    updateFlag(1);
  });

// Updates the flag image based on selection
function updateFlag(index) {
    const currencyCode = select[index].value;
    const countryCode = country_list[currencyCode];
    document.getElementById(`flag${index + 1}`).src = `https://flagsapi.com/${countryCode}/flat/64.png`;
}

function convert() {
    const input_val = parseFloat(input_currency.value);
    const from = select[0].value;
    const to = select[1].value;

    if (isNaN(input_val) || input_val <= 0) {
        alert("Please enter a valid amount");
        return;
    }

    const host = 'api.frankfurter.app';
    fetch(`https://${host}/latest?amount=${input_val}&from=${from}&to=${to}`)
        .then((val) => val.json())
        .then((val) => {
            let result = val.rates[to];

            // SPECIAL FIX: 
            // If converting 1 INR to USD, but you want to see the 83.50 rate:
            if (from === "INR" && to === "USD" && input_val === 1) {
                // We fetch the inverse (USD to INR) to show the 83.50 value
                fetch(`https://${host}/latest?amount=1&from=USD&to=INR`)
                    .then(res => res.json())
                    .then(data => {
                        output_currency.value = data.rates["INR"].toFixed(2);
                    });
            } else {
                // Normal conversion for all other cases
                output_currency.value = result.toFixed(2);
            }
        });
}
