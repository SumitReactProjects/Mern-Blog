import { Button } from "flowbite-react";
import { AiFillGoogleCircle } from "react-icons/ai";
import { signInWithPopup, getAuth } from "firebase/auth";
import { app } from "../firebase";
import { GoogleAuthProvider } from "firebase/auth";
import { useDispatch } from "react-redux";
import { signInSuccess } from "../redux/user/userslice";
import { useNavigate } from "react-router-dom";
const OAuth = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const handleGoogleClick = async () => {
    // it is a firebase config app
    const auth = getAuth(app);
    // Create a New Google user
    const provider = new GoogleAuthProvider();
    // it will open in model

    provider.setCustomParameters({ prompt: "select_account" });

    try {
      const resultFromGoogleProvider = await signInWithPopup(auth, provider);
      //   console.log(resultFromGoogleProvider);
      //sending user to backend
      const res = await fetch("/api/auth/google", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: resultFromGoogleProvider.user.displayName,
          email: resultFromGoogleProvider.user.email,
          googlePhotoUrl: resultFromGoogleProvider.user.googlePhotoUrl,
        }),
      });

      const data = await res.json();
      if (res.ok) {
        dispatch(signInSuccess(data));
        navigate("/");
      }
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <Button
      type="button"
      gradientDuoTone="pinkToOrange"
      className="flex items-center"
      outline
      onClick={handleGoogleClick}
    >
      <AiFillGoogleCircle className="w-6 h-6 mr-2" />
      Sign In With Google
    </Button>
  );
};

export default OAuth;
