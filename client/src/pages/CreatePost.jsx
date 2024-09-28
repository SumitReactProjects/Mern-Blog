import { Alert, Button, FileInput, Select, TextInput } from "flowbite-react";
import { useState } from "react";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import {
  getDownloadURL,
  getStorage,
  ref,
  uploadBytesResumable,
} from "firebase/storage";
import { app } from "../firebase.js";
import { CircularProgressbar } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";
import { useNavigate } from "react-router-dom";

const CreatePost = () => {
  const navigate = useNavigate();
  const [file, setFile] = useState(null);
  const [imageUploadProgress, setImageUploadProgress] = useState(0);
  const [imageUploadError, setImageUploadError] = useState(null);
  const [formData, setFormData] = useState({});
  const [publishError, setPublishError] = useState(null);

  const handleUploadImage = async () => {
    try {
      if (!file) {
        setImageUploadError("Please Select Image File to Upload");
        return;
      }
      setImageUploadError(null);
      const storage = getStorage(app);
      const filename = new Date().getTime() + "-" + file.name;

      const storageRef = ref(storage, filename);

      const uploadTask = uploadBytesResumable(storageRef, file);

      uploadTask.on(
        "state_changed",
        (snapshot) => {
          const progress =
            (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          setImageUploadProgress(progress.toFixed(0));
        },
        (error) => {
          setImageUploadError("Image Upload Fail");
          setImageUploadProgress(null);
          console.log(error);
        },
        () => {
          getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
            setImageUploadProgress(null);
            setImageUploadError(null);
            setFormData({ ...formData, image: downloadURL });
          });
        }
      );
    } catch (error) {
      setImageUploadError("Image Upload Fails");
      setImageUploadProgress(null);
      console.log(error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch("/api/post/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (!res.ok) {
        setPublishError(data.message);
        return;
      }
      if (res.ok) {
        setPublishError(null);
        navigate(`/post/${data.slug}`);
      }
    } catch (error) {
      setPublishError("Something wenr Wrong");
      console.log(error);
    }
  };
  console.log(formData);

  return (
    <div className="p-3 max-w-3xl mx-auto min-h-screen">
      <h1 className="text-center text-3xl my-7 font-semibold">Create a Post</h1>

      <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
        <div className="flex flex-row sm:col gap-4 justify-between">
          <TextInput
            placeholder="Title"
            required
            id="title"
            className="flex-1"
            onChange={(e) =>
              setFormData({ ...formData, title: e.target.value })
            }
          />
          <Select
            onChange={(e) =>
              setFormData({ ...formData, category: e.target.value })
            }
          >
            <option value="uncategorised">Select a Category</option>
            <option value="javascript">Javascript</option>
            <option value="reactjs">React Js</option>
            <option value="nextjs">Next Js </option>
          </Select>
        </div>
        <div className="flex gap-4 items-center justify-between border-2 border-teal-500 border-dotted p-3">
          <FileInput
            type="file"
            accept="image/*"
            onChange={(e) => setFile(e.target.files[0])}
          />
          <Button
            type="button"
            gradientDuoTone={"purpleToBlue"}
            size={"sm"}
            outline
            onClick={handleUploadImage}
            disabled={imageUploadProgress}
          >
            {imageUploadProgress ? (
              <div className="w-16 h-16">
                <CircularProgressbar
                  value={imageUploadProgress}
                  text={`${imageUploadProgress || 0} %`}
                />
              </div>
            ) : (
              "Upload Image"
            )}
          </Button>
        </div>
        {imageUploadError && (
          <Alert color={"failure"}>{imageUploadError}</Alert>
        )}
        {formData.image && (
          <img
            src={formData.image}
            alt="uploaded image"
            className="w-full h-72 object-cover"
          />
        )}
        <ReactQuill
          theme="snow"
          placeholder="Write Something..."
          className="h-80 mb-12"
          required
          onChange={(value) => {
            setFormData({ ...formData, content: value });
          }}
        />
        <Button type="submit" gradientDuoTone="purpleToPink">
          Publish
        </Button>
        {publishError && <Alert color="failure">{publishError}</Alert>}
      </form>
    </div>
  );
};

export default CreatePost;
