const createAutoComplete = ({ root, renderOption, onOptionSelect, inputValue, fetchData }) => {
    root.innerHTML = `
<label><b>Search</b></label><br>
<div class="dropdown">
<input type="input" class="item-input" id="item-input">
<div class="dropdown-menu">
    <div class="dropdown-content results">
    </div>
</div>
</div>
`;
    let onInput = async(event) => {
        let items = await fetchData(event.target.value);

        if (!items.length) {
            dropDown.classList.remove("is-active");
            return;
        }

        results.innerHTML = "";

        dropDown.classList.add("is-active");

        for (let item of items) {
            const option = document.createElement("a");
            option.classList.add("dropdown-item");
            option.innerHTML = renderOption(item);
            option.addEventListener("click", () => {
                dropDown.classList.remove("is-active");
                input.value = inputValue(item);
                onOptionSelect(item);
            });
            results.appendChild(option);
        }
    };

    let input = root.querySelector(".item-input");
    let dropDown = root.querySelector(".dropdown");
    let results = root.querySelector(".results");

    input.addEventListener("input", debounce(onInput, 1000));

    document.addEventListener("click", (event) => {
        if (!root.contains(event.target)) {
            dropDown.classList.remove("is-active");
        }
    });
};