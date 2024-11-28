const getBaseURL = () => {
    return window.location.hostname === 'localhost'
      ? 'http://localhost:8001'
      : 'https://baby-stop-7sfsf.ondigitalocean.app';
  };
  
  export default getBaseURL;
  