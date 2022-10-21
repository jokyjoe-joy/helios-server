// Import the dependencies for testing
import chai from "chai";
import chaiHttp from "chai-http";
import app from "../index";

// Authentication details to be able to perform and test
// restricted actions as well.
const ADMIN_USERNAME = process.env.ADMIN_USERNAME;
const ADMIN_PASS = process.env.ADMIN_PASS;

// Configure chai
chai.use(chaiHttp);
chai.should();

describe("Users", () => {
  describe("GET /", () => {
    // Test to get all users while unauthenticated.
    it("should not be able to get all users unauthenticated", (done) => {
      chai.request(app)
        .get("/users/")
        .end((err, res) => {
          res.should.have.status(403);
          done();
        });
    });
  });
});