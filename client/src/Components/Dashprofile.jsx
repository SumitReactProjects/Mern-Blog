import { Alert, Button, TextInput } from "flowbite-react";
import { useState, useRef, useEffect } from "react";
import { useSelector } from "react-redux";
import { app } from "../firebase.js";
import {
  getDownloadURL,
  getStorage,
  ref,
  uploadBytesResumable,
} from "firebase/storage";

const Dashprofile = () => {
  const { currentUser } = useSelector((state) => state.user);
  // use Ref
  const filePickerRef = useRef();
  // setting image file and URL
  const [imageFile, setImageFile] = useState(null);
  const [imageFileURL, setImageFileURL] = useState(null);
  const [imageFileUploadingProgress, setImageFileUploadingProgress] =
    useState(null);
  const [imageFileUploadingError, setImageFileUploadError] = useState(null);

  console.log(imageFileUploadingProgress, imageFileUploadingError);
  const handleImageChange = async (e) => {
    // Selecting file from input Feilds
    const file = e.target.files[0];
    // Check the file exist or not if exist
    if (file) {
      // set image
      setImageFile(file);
      // and create its URL
      setImageFileURL(URL.createObjectURL(file));
    }
  };
  // console.log(imageFile, imageFileURL);
  useEffect(() => {
    if (imageFile) {
      uploadImage();
    }
  }, [imageFile]);

  const uploadImage = async () => {
    // console.log("image Uploading...");
    const storage = getStorage(app);

    const fileName = new Date().getTime() + imageFile.name;

    const storageRef = ref(storage, fileName);

    const uploadTask = uploadBytesResumable(storageRef, imageFile);

    uploadTask.on(
      "state_changed",
      (snapshot) => {
        const progress =
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        setImageFileUploadingProgress(progress.toFixed(0));
      },
      (error) => {
        setImageFileUploadError(
          "Could not Upload Image (File Must be less than 2MB) "
        );
      },
      () => {
        getDownloadURL(uploadTask.snapshot.ref).then((getDownloadURL) => {
          setImageFileURL(getDownloadURL);
        });
      }
    );
  };
  return (
    <div className="mx-auto max-w-lg w-full p-3">
      <h1 className="text-center text-3xl font-semibold my-7">Profile</h1>
      <form className="flex flex-col gap-6">
        <input
          type="file"
          accept="image/*"
          ref={filePickerRef}
          onChange={handleImageChange}
          hidden
        />
        <div
          className="w-32 h-32 self-center mx-auto cursor-pointer shadow-md overflow-hidden rounded-full"
          onClick={() => filePickerRef.current.click()}
        >
          <img
            src={imageFileURL || currentUser.profilePhoto}
            alt="User"
            className="w-full h-full rounded-full object-cover border-8 border-[lightgray]"
          />
        </div>
        {imageFileUploadingError && (
          <Alert color="failure">{imageFileUploadingError}</Alert>
        )}
        <TextInput
          type="text"
          id="username"
          defaultValue={currentUser.username}
        />
        <TextInput type="text" id="email" defaultValue={currentUser.email} />
        <TextInput type="password" id="password" placeholder="********" />
        <Button type="submit" gradientDuoTone={"purpleToBlue"} outline>
          Update Profile
        </Button>
      </form>
      <div className="flex items-center justify-between text-red-500 my-4">
        <span className="cursor-pointer">Delete Account</span>
        <span className="cursor-pointer">SignOut</span>
      </div>
    </div>
  );
};

export default Dashprofile;
