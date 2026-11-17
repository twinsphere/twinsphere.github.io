// Linked content tabs: choosing a tab selects the tab with the same label in every tab set of the page
document.addEventListener("change", (event) => {
    const input = event.target;
    if (!input.matches(".tabbed-set > input")) {
        return;
    }

    const label = input.nextElementSibling.textContent;
    for (const other of document.querySelectorAll(".tabbed-set > input")) {
        if (other.nextElementSibling.textContent === label) {
            other.checked = true;
        }
    }
});
