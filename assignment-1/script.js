document.addEventListener("DOMContentLoaded", function () {
  const bookList = document.getElementById("book-list");
  const addBookButton = document.getElementById("add-book-button");
  const addBookForm = document.getElementById("add-book-form");
  const confirmationModal = document.getElementById("confirmation-modal");
  const confirmationText = document.getElementById("confirmation-text");
  const deleteConfirmButton = document.getElementById("delete-confirm-button");
  const cancelConfirmButton = document.getElementById("cancel-confirm-button");
  const bookForm = document.getElementById("book-form");
  const searchInput = document.getElementById("search");
  const closeAddBookFormButton = document.getElementById("close-form-button");
  const closeDeleteBookFormButton = document.getElementById(
    "close-del-form-button"
  );
  // Retrieve data from localStorage
  let books = JSON.parse(localStorage.getItem("books")) || [];
  let selectedIndexToDelete; // Track the selected index to delete

  // Function to render the book list
  function renderBookList(booksToRender) {
    bookList.innerHTML = "";
    booksToRender.forEach((book, index) => {
      const row = document.createElement("tr");
      row.innerHTML = `
                <td>${book.name}</td>
                <td>${book.author}</td>
                <td>${book.topic}</td>
                <td><button data-index="${index}"  class="delete-button">Delete</button></td>
            `;
      bookList.appendChild(row);
    });

    // Add event listeners to delete buttons
    const deleteButtons = document.querySelectorAll(".delete-button");
    deleteButtons.forEach((button) => {
      button.addEventListener("click", function () {
        const index = this.getAttribute("data-index");
        showConfirmationForm(index);
      });
    });
  }

  // Function to show/hide the add book form
  function toggleAddBookForm() {
    addBookForm.style.display =
      addBookForm.style.display === "block" ? "none" : "block";
  }

  function showCustomConfirmation(index) {
    const bookName = books[index].name;
    confirmationText.textContent = `Do you want to delete "${bookName}" book?`;
    confirmationModal.style.display = "block";
    selectedIndexToDelete = index;
  }

  // Event listener for clicking the "Delete" button
  bookList.addEventListener("click", function (e) {
    if (e.target.classList.contains("delete-button")) {
      const index = e.target.getAttribute("data-index");
      showCustomConfirmation(index);
    }
  });

  // Event listener for clicking the custom confirmation modal's "Delete" button
  deleteConfirmButton.addEventListener("click", function () {
    if (selectedIndexToDelete !== undefined) {
      books.splice(selectedIndexToDelete, 1);
      saveData();
      renderBookList(books);
      confirmationModal.style.display = "none";
      selectedIndexToDelete = undefined;
    }
  });

  // Event listener for clicking the custom confirmation modal's "Cancel" button
  cancelConfirmButton.addEventListener("click", function () {
    confirmationModal.style.display = "none";
    selectedIndexToDelete = undefined;
  });

  // Function to save data to localStorage
  function saveData() {
    localStorage.setItem("books", JSON.stringify(books));
  }

  // Event listener for adding a new book
  addBookButton.addEventListener("click", toggleAddBookForm);

  // Event listener for submitting the book form
  bookForm.addEventListener("submit", function (e) {
    e.preventDefault();
    const name = document.getElementById("name").value;
    const author = document.getElementById("author").value;
    const topic = document.getElementById("topic").value;
    const newBook = { name, author, topic };
    books.push(newBook);
    saveData();
    renderBookList(books);
    toggleAddBookForm();
    bookForm.reset();
  });

  // Event listener for searching books by name
  searchInput.addEventListener("input", function () {
    const searchTerm = this.value.toLowerCase();
    const filteredBooks = books.filter((book) =>
      book.name.toLowerCase().includes(searchTerm)
    );
    renderBookList(filteredBooks);
  });
  // Event listener for closing the form
  closeAddBookFormButton.addEventListener("click", function () {
    toggleAddBookForm();
    bookForm.reset();
  });
  closeDeleteBookFormButton.addEventListener("click", function () {
    confirmationModal.style.display = "none";
    selectedIndexToDelete = undefined;
  });
  // Initial rendering of the book list
  renderBookList(books);
});
