const isLogin = () => !!localStorage.getItem('UserInfo');
export default isLogin;