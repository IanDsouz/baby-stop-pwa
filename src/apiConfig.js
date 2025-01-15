const getBaseURL = () => {
    return window.location.hostname === 'localhost'
      ? 'http://127.0.0.1:8080'
      : 'https://baby-stop-7sfsf.ondigitalocean.app';
  };
  
  export default getBaseURL;
  