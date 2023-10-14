// Prerequisite:
//  - Go to the BNC transaction page
// Save time by adding the script as a snippet:
//  - F12 > Sources > Snippets > New Snippet
const getTransactions = () => {
  const $transactions = ".transactions-history__row";
  const $date = ".transactions-table__date";
  const $description = ".transactions-table__description";
  const $amount = ".transactions-table__amount";

  const formatDate = (input) => {
    // Expected incoming formats:
    // - October 12, 2023
    // - Pending
    if (input === "Pending") return "Pending";

    const dateObj = new Date(input + " 00:00:00");

    const year = dateObj.getFullYear();
    const month = String(dateObj.getMonth() + 1).padStart(2, "0"); // Months are 0-indexed
    const day = String(dateObj.getDate()).padStart(2, "0");

    return `${year}-${month}-${day}`;
  };

  const formatAmount = (input) => {
    // Expected incoming format:
    // - $58.43
    return parseFloat(input.replace(/[$,]/g, "")).toString().replace(".", ",");
  };

  let transactions = [];
  document.querySelectorAll($transactions).forEach((element) => {
    transactions.push({
      date: formatDate(element.querySelector($date).textContent),
      description: element.querySelector($description).textContent,
      amount: formatAmount(element.querySelector($amount).textContent),
    });
  });

  return transactions;
};

const convertToCSV = (arr) => {
  const array = [Object.keys(arr[0])].concat(arr);

  return array
    .map((it) => {
      return Object.values(it)
        .map((value) => `"${value}"`)
        .join(",");
    })
    .join("\n");
};

let csvContent = "data:text/csv;charset=utf-8,";
csvContent += convertToCSV(getTransactions());

var encodedUri = encodeURI(csvContent);
var link = document.createElement("a");
link.setAttribute("href", encodedUri);
link.setAttribute("download", "transactions.csv");
document.body.appendChild(link); // Required for Firefox
link.click();
document.body.removeChild(link); // Clean up after downloading
