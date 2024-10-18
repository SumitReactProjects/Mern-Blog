import { Button } from "flowbite-react";

export default function CallToAction() {
  return (
    <div
      className="flex flex-col sm:flex-row border border-teal-500 justify-center rounded-tl-3xl
    rounded-br-3xl text-center p-3"
    >
      <div className="flex-1 flex flex-col justify-center">
        <h2 className="text-2xl">Want to learn More About Javascript?</h2>
        <p className="text-gray-500 my-2">
          Checkout these resuorces with 100 JS Projects
        </p>
        <Button gradientDuoTone="purpleToPink">
          <a
            href="https:/www.google.com"
            target="_blank"
            rel="noopener noreferer"
          >
            100 js Preojects
          </a>
        </Button>
      </div>
      <div className="p-7 flex-1">
        <img
          src="https://img.jakwybrachosting.pl/javascript-1584x546.jpg"
          className="w-full"
        />
      </div>
    </div>
  );
}
