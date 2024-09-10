import { Button } from "flowbite-react";
import { AiFillGoogleCircle } from "react-icons/ai";
import { signInWithPopup, getAuth } from "firebase/auth";
import { app } from "../firebase";
import { GoogleAuthProvider } from "firebase/auth";
const OAuth = () => {
  const handleGoogleClick = async () => {
    const auth = getAuth(app);

    const provider = new GoogleAuthProvider();

    provider.setCustomParameters({ prompt: "select_account" });

    try {
      const resultFromGoogleProvider = await signInWithPopup(auth, provider);
      console.log(resultFromGoogleProvider);
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
