/* istanbul ignore file */

const { createContainer } = require("instances-container");

// external agency
const { nanoid } = require("nanoid");
const bcrypt = require("bcrypt");
const Jwt = require("@hapi/jwt");
const pool = require("./database/postgres/pool");

// service (repository, helper, manager, etc)
const UserRepository = require("../Domains/users/UserRepository");
const PasswordHash = require("../Applications/security/PasswordHash");
const UserRepositoryPostgres = require("./repository/UserRepositoryPostgres");
const BcryptPasswordHash = require("./security/BcryptPasswordHash");

// use case
const AddUserUseCase = require("../Applications/use_case/AddUserUseCase");
const AuthTokenManager = require("../Applications/security/AuthTokenManager");
const JwtTokenManager = require("./security/JwtTokenManager");
const LoginUserUseCase = require("../Applications/use_case/LoginUserUseCase");
const AuthenticationRepository = require("../Domains/authentications/AuthenticationRepository");
const AuthenticationRepositoryPostgres = require("./repository/AuthenticationRepositoryPostgres");
const LogoutUserUseCase = require("../Applications/use_case/LogoutUserUseCase");
const RefreshAuthUseCase = require("../Applications/use_case/RefreshAuthUseCase");

// creating container
const container = createContainer();

// registering services and repository
container.register([
  {
    key: UserRepository.name,
    Class: UserRepositoryPostgres,
    parameter: {
      dependencies: [
        {
          concrete: pool,
        },
        {
          concrete: nanoid,
        },
      ],
    },
  },
  {
    key: AuthenticationRepository.name,
    Class: AuthenticationRepositoryPostgres,
    parameter: {
      dependencies: [
        {
          concrete: pool,
        },
      ],
    },
  },
  {
    key: PasswordHash.name,
    Class: BcryptPasswordHash,
    parameter: {
      dependencies: [
        {
          concrete: bcrypt,
        },
      ],
    },
  },
  {
    key: AuthTokenManager.name,
    Class: JwtTokenManager,
    parameter: {
      dependencies: [
        {
          concrete: Jwt.token,
        },
      ],
    },
  },
]);

// registering use cases
container.register([
  {
    key: AddUserUseCase.name,
    Class: AddUserUseCase,
    parameter: {
      injectType: "destructuring",
      dependencies: [
        {
          name: "userRepository",
          internal: UserRepository.name,
        },
        {
          name: "passwordHash",
          internal: PasswordHash.name,
        },
      ],
    },
  },
  {
    key: LoginUserUseCase.name,
    Class: LoginUserUseCase,
    parameter: {
      injectType: "destructuring",
      dependencies: [
        {
          name: "userRepository",
          internal: UserRepository.name,
        },
        {
          name: "authenticationRepository",
          internal: AuthenticationRepository.name,
        },
        {
          name: "authenticationTokenManager",
          internal: AuthTokenManager.name,
        },
        {
          name: "passwordHash",
          internal: PasswordHash.name,
        },
      ],
    },
  },
  {
    key: LogoutUserUseCase.name,
    Class: LogoutUserUseCase,
    parameter: {
      injectType: "destructuring",
      dependencies: [
        {
          name: "authenticationRepository",
          internal: AuthenticationRepository.name,
        },
      ],
    },
  },
  {
    key: RefreshAuthUseCase.name,
    Class: RefreshAuthUseCase,
    parameter: {
      injectType: "destructuring",
      dependencies: [
        {
          name: "authenticationRepository",
          internal: AuthenticationRepository.name,
        },
        {
          name: "authenticationTokenManager",
          internal: AuthTokenManager.name,
        },
      ],
    },
  },
]);

module.exports = container;
