export const categories = ["other", "pizza", "chicken", "pork", "beef", "hamburger", "deserts", "snacks", "hot", "mild"];
    
export const firstUpper = (s) => {
    if (typeof s !== 'string') return ''
    return s.charAt(0).toUpperCase() + s.slice(1)
  };