const { expect, assert } = require('chai')

describe('User Authentication System', function(){

  const trulyUser = {
    username: 'douglas',
    password: '6997472'
  }

  const wrongUser = {
    username: 'foo',
    password: '6997472'
  }

  const wrongPassword = {
    username: 'douglas',
    password: 'enithing'
  }

  const { 
    UserNotFoundError, 
    PasswordError } = require('./../core/user-system.js');
  const UserSystem = require('./../core/user-system.js');
  const us = new UserSystem();

  it('Should throw a UseNotFoundError if pass a wrong username', function(){
    expect(() => us.authenticate(wrongUser)).to.throw(UserNotFoundError);
  })

  it('Should return an PasswordError if pass a wrong password', function(){
    expect(() => us.authenticate(wrongPassword)).to.throw(PasswordError);
  })

  it('Should return a truely user if pass correct authentication data', function(){
    expect(us.authenticate(trulyUser)).to.deep.equal(trulyUser);
  })

})