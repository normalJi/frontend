class LocalStorage {
  constructor() {}

  static setItem(key, value) {
    if (typeof window !== 'undefined') {
      localStorage.setItem(key, value);
    }
  }
  
  // getItem 은 return 을 넣어줘야함! setItem, removeItem이랑 다르게 값을 보여주는녀석!
  static getItem(key) {
    if (typeof window !== 'undefined') {
      return localStorage.getItem(key);
    }
    // window객체 localStorage, sessionStorage는 값이 없을때 null
    return null; 
  }

  static removeItem(key) {
    if (typeof window !== 'undefined') {
      localStorage.removeItem(key);
    }
  }
}

export default LocalStorage;