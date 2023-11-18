process.env.NODE_ENV = "test";

const request = require("supertest");
const app = require("./app");
const db = require("./db");
const { beforeEach, afterEach, afterAll } = require("node:test");

let book_isbn;

beforeEach(async function () {
  let result = await db.query(
    `INSERT INTO books (isbn,amazon_url,author,language,pages,publisher,title,year) VALUES ($1,$2,$3,$4,$5,$6,$7,$8) RETURNING isbn`,
    [
      "0691161518",
      "http://a.co/eobPtX2",
      "Matthew Lane",
      "english",
      264,
      "Princeton University Press",
      "Power-Up: Unlocking the Hidden Mathematics in Video Games",
      2017,
    ]
  );
  book_isbn = result.rows[0];
});

describe("POST/books", function () {
  test("adds a new book to db", async function () {
    const response = await request(app).post(`/books`).send({
      isbn: "0235678920",
      amazon_url: "http://re.35/ppsldlkTTT",
      author: "Jon Gainza",
      language: "euskera",
      pages: 1500,
      publisher: "basq diasphora",
      title: "Breaking into txiki buho",
      year: 2023,
    });
    expect(response.statusCode).toBe(201);
    expect(response.body).toEqual({
      book: {
        isbn: "0235678920",
        amazon_url: "http://re.35/ppsldlkTTT",
        author: "Jon Gainza",
        language: "euskera",
        pages: 1500,
        publisher: "basq diasphora",
        title: "Breaking into txiki buho",
        year: 2023,
      },
    });
  });
});

afterEach(async function () {
  await db.query(`DELETE FROM books`);
});

afterAll(async function () {
  await db.end();
});
