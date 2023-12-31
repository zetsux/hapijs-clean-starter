const UserRegister = require("../UserRegister");

describe("a UserRegister entities", () => {
  it("should throw error when payload did not contain needed property", () => {
    // Arrange
    const payload = {
      username: "abc",
      password: "abc",
    };

    // Action and Assert
    expect(() => new UserRegister(payload)).toThrowError(
      "REGISTER_USER.NOT_CONTAIN_NEEDED_PROPERTY"
    );
  });

  it("should throw error when payload did not meet data type specification", () => {
    // Arrange
    const payload = {
      username: 123,
      fullname: true,
      password: "abc",
    };

    // Action and Assert
    expect(() => new UserRegister(payload)).toThrowError(
      "REGISTER_USER.NOT_MEET_DATA_TYPE_SPECIFICATION"
    );
  });

  it("should throw error when username contains more than 50 character", () => {
    // Arrange
    const payload = {
      username: "unameindonesiaunameindonesiaunameindonesiaunameindonesiaunameindonesiauname",
      fullname: "Full Name",
      password: "abc",
    };

    // Action and Assert
    expect(() => new UserRegister(payload)).toThrowError("REGISTER_USER.USERNAME_LIMIT_CHAR");
  });

  it("should throw error when username contains restricted character", () => {
    // Arrange
    const payload = {
      username: "dico ding",
      fullname: "uname",
      password: "abc",
    };

    // Action and Assert
    expect(() => new UserRegister(payload)).toThrowError(
      "REGISTER_USER.USERNAME_CONTAIN_RESTRICTED_CHARACTER"
    );
  });

  it("should create registerUser object correctly", () => {
    // Arrange
    const payload = {
      username: "uname",
      fullname: "Full Name",
      password: "abc",
    };

    // Action
    const { username, fullname, password } = new UserRegister(payload);

    // Assert
    expect(username).toEqual(payload.username);
    expect(fullname).toEqual(payload.fullname);
    expect(password).toEqual(payload.password);
  });
});
