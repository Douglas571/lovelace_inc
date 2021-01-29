class UserNotFoundError extends Error {
  constructor(msg){
    super('UserNotFoundError: The user doesn\'t exists');
  }
} exports.UserNotFoundError = UserNotFoundError;

class PasswordError extends Error {
  constructor(msg){
    super('PasswordError: Incorrect password');
  }
} exports.PasswordError = PasswordError;

class UserSystem {
  constructor(){
    this.user = {
      username: 'admin',
      password: '12345',
      role: 'admin'
    }
  }

  authenticate({ username, password }){
    
    if (username === this.user.username) {
      
      if (password === this.user.password) {
        return JSON.parse(JSON.stringify(this.user));
      } else {
        throw new PasswordError();
      }

    }
    
    throw new UserNotFoundError();
  }

  test() {
    return 'Hello tester!!';
  }
} module.exports = UserSystem;