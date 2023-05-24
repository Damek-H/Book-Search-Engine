import decodeToken from 'jwt-decode';

class UserAuth {
  getProfileData() {
    return decodeToken(this.getUserToken());
  }

  isLoggedIn() {
    const token = this.getUserToken();
    return !!token && !this.isTokenExpired(token);
  }

  isTokenExpired(token) {
    try {
      const decoded = decodeToken(token);
      if (decoded.exp < Date.now() / 1000) {
        return true;
      } else {
        return false;
      }
    } catch (err) {
      return false;
    }
  }

  getUserToken() {
    return localStorage.getItem('user_token');
  }

  login(userToken) {
    localStorage.setItem('user_token', userToken);
    window.location.assign('/');
  }

  logout() {
    localStorage.removeItem('user_token');
    window.location.assign('/');
  }
}

export default new UserAuth();
