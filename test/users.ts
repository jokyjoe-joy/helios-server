// Import the dependencies for testing
import chai from "chai";
import { expect } from "chai";
import chaiHttp from "chai-http";
import app from "../index";

// Authentication details to be able to perform and test
// restricted actions as well.
const ADMIN_USERNAME = process.env.ADMIN_USERNAME;
const ADMIN_PASS = process.env.ADMIN_PASS;
let ADMIN_ACCESS_TOKEN: string;

const dummy_user = {
  username: "dummyusery",
  password: "StrongPass37",
};
let DUMMY_ACCESS_TOKEN: string;

// Configure chai
chai.use(chaiHttp);
chai.should();

describe("Users", () => {
  describe("Registration", () => {
    it("should be able to get access token when registering", (done) => {
      chai.request(app)
        .post("/register")
        .send({username: dummy_user.username, password: dummy_user.password})
        .end((err, res) => {
          res.should.have.status(200);
          expect(res.body).to.have.keys(["accessToken", "refreshToken"]);
          DUMMY_ACCESS_TOKEN = res.body.accessToken;
          done();
        });
    });
    it("should not be able to register without a password", (done) => {
      chai.request(app)
        .post("/register")
        .send({username: dummy_user.username})
        .end((err, res) => {
          res.should.have.status(400);
          done();
        });
    });
    it("should not be able to register without a username", (done) => {
      chai.request(app)
        .post("/register")
        .send({password: dummy_user.password})
        .end((err, res) => {
          res.should.have.status(400);
          done();
        });
    });
  });
  
  describe("GET methods", () => {
    it("should be able to get own user data without password", (done) => {
      chai.request(app)
        .get(`/users/${dummy_user.username}`)
        .set("Authorization", `Bearer ${DUMMY_ACCESS_TOKEN}`)
        .end((err, res) => {
          res.should.have.status(200);
          expect(res.body).to.contain.keys(["username"]);
          expect(res.body).to.not.contain.keys(["password"]);
          done();
        });
    });
    it("should not be able to get other users' data", (done) => {
      chai.request(app)
        .get(`/users/${ADMIN_USERNAME}`)
        .set("Authorization", `Bearer ${DUMMY_ACCESS_TOKEN}`)
        .end((err, res) => {
          res.should.have.status(403);
          done();
        });
    });
    it("should not be able to get user list as a member", (done) => {
      chai.request(app)
        .get("/users/")
        .set("Authorization", `Bearer ${DUMMY_ACCESS_TOKEN}`)
        .end((err, res) => {
          res.should.have.status(403);
          done();
        });
    });
  });
});

describe("Admins", () => {
  // Login before attempting to do anything related to it.
  before(function (done) {
    chai.request(app)
      .post("/login")
      .send({username: ADMIN_USERNAME, password: ADMIN_PASS})
      .end((err, res) => {
        res.should.have.status(200);
        expect(res.body).to.have.keys(["accessToken", "refreshToken"]);
        ADMIN_ACCESS_TOKEN = res.body["accessToken"];
        done();
      });
  });
  describe("GET methods", () => {
    it("should be able to get user list as admin", (done) => {
      chai.request(app)
        .get("/users/")
        .set("Authorization", `Bearer ${ADMIN_ACCESS_TOKEN}`)
        .end((err, res) => {
          res.should.have.status(200);
          // Check if there is at least one user returned.
          expect(res.body.length).to.be.above(0);
          done();
        });
    });
  });
  describe("Deleting users", () => {
    it("should be able to delete the user dummy", (done) => {
      chai.request(app)
        .delete(`/users/${dummy_user.username}`)
        .set("Authorization", `Bearer ${ADMIN_ACCESS_TOKEN}`)
        .end((err, res) => {
          res.should.have.status(200);
          expect(res.body).to.have.key("userid");
          done();
        });
    });
  });
});