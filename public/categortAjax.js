let filterCategories = (str) => {
    let xhttp = new XMLHttpRequest();

    xhttp.onreadystatechange = function () {
        if (this.readyState == 4 && this.status == 200) {
            let categories = JSON.parse(this.responseText);
            let tableBody = document.getElementById("tblbody");
            tableBody.innerHTML = "";

            if (categories.length === 0) {
                let row = document.createElement("tr");
                let col = document.createElement("td");
                col.colSpan = 4;
                col.classList.add("text-center", "text-danger");
                col.innerText = "No categories found.";
                row.appendChild(col);
                tableBody.appendChild(row);
            } else {
                categories.forEach((element, index) => {
                    let row = document.createElement("tr");

                    let col1 = document.createElement("td");
                    col1.innerText = index + 1;
                    row.appendChild(col1);

                    let col2 = document.createElement("td");
                    col2.innerText = element.category_name;
                    row.appendChild(col2);

                    let col3 = document.createElement("td");
                    col3.innerHTML = `
                        <a href="/updateCategory/${element.id}" class="btn btn-custom btn-update">
                            <i class="bi bi-pencil-square"></i> Update
                        </a>
                        <a href="/deleteCategory/${element.id}" class="btn btn-custom btn-delete" ">
                              <i class="bi bi-trash3-fill"></i> Delete
                         </a>
                        <a href="/viewCategoryDetails/${element.id}" class="btn btn-custom btn-view-cat">
                            <i class="bi bi-eye"></i> View Category
                        </a>
                        <a href="/productsByCategory/${element.category_id}" class="btn btn-custom btn-view-prod">
                            <i class="bi bi-box"></i> Sub-Categories
                        </a>
                    `;
                    row.appendChild(col3);

                    tableBody.appendChild(row);
                });
            }
        }
    };

    xhttp.open("GET", "/searchProductByCategory?Cn=" + encodeURIComponent(str), false);
    xhttp.send();
};
