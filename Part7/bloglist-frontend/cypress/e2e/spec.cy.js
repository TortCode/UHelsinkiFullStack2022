/* eslint-disable func-names */
/* eslint-disable prefer-arrow-callback */
describe("Blog app", function () {
  function createUser({ name, username, password }) {
    cy.request("POST", "http://localhost:3003/api/users", {
      name,
      username,
      password,
    });
  }

  beforeEach(function () {
    cy.request("POST", "http://localhost:3003/api/testing/reset");
    const user = {
      name: "teerth",
      username: "tort",
      password: "123456",
    };
    createUser(user);
    cy.visit("http://localhost:3000");
  });

  it("Login form is shown", function () {
    cy.contains("log in to application");
    cy.contains("username").find("input");
    cy.contains("password").find("input");
  });

  describe("Login", function () {
    it("succeeds with correct credentials", function () {
      cy.get("#username").type("tort");
      cy.get("#password").type("123456");
      cy.get("#login-button").click();

      cy.contains("Welcome teerth").should(
        "have.css",
        "color",
        "rgb(0, 128, 0)",
      );
    });

    it("fails with wrong username", function () {
      cy.get("#username").type("tort1");
      cy.get("#password").type("123456");
      cy.get("#login-button").click();

      cy.contains("invalid username or password").should(
        "have.css",
        "color",
        "rgb(255, 0, 0)",
      );
    });

    it("fails with wrong password", function () {
      cy.get("#username").type("tort");
      cy.get("#password").type("1234567");
      cy.get("#login-button").click();

      cy.contains("invalid username or password").should(
        "have.css",
        "color",
        "rgb(255, 0, 0)",
      );
    });
  });

  describe("When logged in", function () {
    function login({ username, password }) {
      cy.request("POST", "http://localhost:3003/api/login", {
        username,
        password,
      }).then((response) => {
        localStorage.setItem(
          "loggedBlogappUser",
          JSON.stringify(response.body),
        );
        cy.visit("http://localhost:3000");
      });
    }

    function createBlog({ title, author, url }) {
      cy.get("button").contains("new blog").click();
      cy.get("#title").type(title);
      cy.get("#author").type(author);
      cy.get("#url").type(url);
      cy.get("#new-blog").contains("create").click();
    }

    beforeEach(function () {
      login({
        username: "tort",
        password: "123456",
      });
    });

    it("A blog can be created", function () {
      createBlog({
        title: "test blog title",
        author: "test author",
        url: "test url",
      });

      cy.contains("test blog title");
      cy.contains("test author");
      cy.contains("view").click();
      cy.contains("test url");
    });

    function likeBlog(selector, count) {
      cy.get(selector).contains("view").click();
      for (let i = 0; i < count; i += 1) {
        cy.get(selector).find(".like-blog-button").click();
        cy.get(selector).contains(`likes ${i + 1}`);
      }
    }

    describe("After creating a blog", function () {
      beforeEach(function () {
        createBlog({
          title: "test blog title",
          author: "test author",
          url: "test url",
        });
      });

      it("A blog can be liked", function () {
        cy.get(".default-blog").contains("view").click();

        cy.contains("likes 0");
        cy.get(".like-blog-button").click();
        cy.contains("likes 1");
        cy.get(".like-blog-button").click();
        cy.contains("likes 2");
        cy.get(".like-blog-button").click();
        cy.contains("likes 3");
      });

      it("A blog can be deleted", function () {
        cy.get(".default-blog").contains("view").click();
        cy.get(".remove-blog-button").click();
        cy.contains("test blog title").should("not.exist");
      });

      it("Only creator can see delete button", function () {
        createUser({
          name: "willig",
          username: "lazor",
          password: "654321",
        });
        login({
          username: "lazor",
          password: "654321",
        });
        createBlog({
          title: "test other title",
          author: "test other author",
          url: "test other url",
        });
        login({
          username: "tort",
          password: "123456",
        });

        cy.contains("test other title").contains("view").click();
        cy.contains("test other title")
          .parent()
          .get(".remove-blog-button")
          .should("not.exist");
      });
    });
    it.only("Blogs are ordered by likes", function () {
      createBlog({
        title: "title 1",
        author: "author 1",
        url: "url 1",
      });
      createBlog({
        title: "title 2",
        author: "author 2",
        url: "url 2",
      });
      createBlog({
        title: "title 3",
        author: "author 3",
        url: "url 3",
      });
      createBlog({
        title: "title 4",
        author: "author 4",
        url: "url 4",
      });
      cy.contains("title 1").parent().as("SelectedBlog");
      likeBlog("@SelectedBlog", 4);
      cy.contains("title 2").parent().as("SelectedBlog");
      likeBlog("@SelectedBlog", 2);
      cy.contains("title 3").parent().as("SelectedBlog");
      likeBlog("@SelectedBlog", 1);
      cy.contains("title 4").parent().as("SelectedBlog");
      likeBlog("@SelectedBlog", 3);

      cy.get(".blog").eq(0).contains("title 1");
      cy.get(".blog").eq(1).contains("title 4");
      cy.get(".blog").eq(2).contains("title 2");
      cy.get(".blog").eq(3).contains("title 3");
    });
  });
});
