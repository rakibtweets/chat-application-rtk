import { useSelector } from 'react-redux';



// user authentication hook: return true or false
const useAuth = () => {
  const auth = useSelector((state) => state.auth);

  if (auth?.accessToken && auth?.user) {
    return true;
  } else {
    return false;
  }
};

export default useAuth;
