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

// Configure chai
chai.use(chaiHttp);
chai.should();

describe("Users", () => {
  describe("GET /", () => {
    // Test to get all users while unauthenticated.
    it("should not be able to get all users while unauthenticated", (done) => {
      chai.request(app)
        .get("/users/")
        .end((err, res) => {
          res.should.have.status(401);
          done();
        });
    });
  });
});

describe("Admins", () => {
  describe("POST /login", () => {
    it("should be able to obtain an access and a refresh token", (done) => {
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
  });
});