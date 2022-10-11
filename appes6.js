// UI elements
const title = document.querySelector("#title"),
  author = document.querySelector("#author"),
  isbn = document.querySelector("#isbn"),
  bookList = document.querySelector("#book-list"),
  message = document.querySelector("#message");

class Book {
  constructor(title, author, isbn) {
    this.title = title.value;
    this.author = author.value;
    this.isbn = isbn.value;
  }
}

class UI {
  constructor() {}

  addBook(book) {
    book.title == "" || book.author == "" || book.isbn == ""
      ? this.showError("Please fill in the information below", "error")
      : this.createListRow(book);
    this.emptyFields();

    // e.preventDefault();
  }

  createListRow(book) {
    const row = document.createElement("tr");
    row.innerHTML = `
      <td>${book.title}</td>
      <td>${book.author}</td>
      <td>${book.isbn}</td>
      <td><a href="#" class="delete">x</a></td>
    `;
    bookList.appendChild(row);
    this.showError("Book added to the list.", "success");
  }

  emptyFields() {
    title.value = "";
    author.value = "";
    isbn.value = "";
  }

  showError(msg, cls) {
    message.textContent = msg;
    message.classList = cls;

    setTimeout(function () {
      message.textContent = "";
      message.classList = "";
    }, 3000);
  }

  deleteBookRow(e) {
    if (e.target.classList.value === "delete") {
      e.target.parentElement.parentElement.remove();
      this.showError("Book removed from the list.", "success");
    }
  }
}

class Store {
  static getBooks() {
    let books;
    localStorage.length === 0
      ? (books = [])
      : (books = JSON.parse(localStorage.getItem("books")));
    return books;
  }

  static displayBooks() {
    const books = Store.getBooks();
    books.forEach(function (book) {
      const ui = new UI();
      ui.createListRow(book);
    });
  }

  static addBookToLocalStorage(book) {
    const books = this.getBooks();
    books.push(book);
    localStorage.setItem("books", JSON.stringify(books));
  }

  static removeBookFromLocalStorage(isbnText) {
    console.log();
    const books = this.getBooks();
    books.forEach(function (book, index) {
      if (book.isbn === isbnText) {
        books.splice(index, 1);
      }
    });
    localStorage.setItem("books", JSON.stringify(books));
  }
}

// Event listeners
document.querySelector("#book-form").addEventListener("submit", function (e) {
  const book = new Book(title, author, isbn);
  const ui = new UI();
  ui.addBook(book);
  Store.addBookToLocalStorage(book);
});

bookList.addEventListener("click", function (e) {
  const ui = new UI();
  ui.deleteBookRow(e);
  Store.removeBookFromLocalStorage(
    e.target.parentElement.previousElementSibling.textContent
  );
});

document.addEventListener("DOMContentLoaded", Store.displayBooks);
