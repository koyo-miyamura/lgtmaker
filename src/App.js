import React, { useState, useEffect } from "react";
import "./App.css";
import Clipboard from "clipboard";

function App() {
  const [ctx, setCtx] = useState(null);
  const [isShowImage, setIsShowImage] = useState(false);

  const canvasWidth = 800;
  const canvasHeight = (canvasWidth * 9) / 16;
  const fontSizePx = 80;
  const fontColor = "#FFFFFF";

  useEffect(() => {
    const view = document.querySelector(".canvas");
    view.width = canvasWidth;
    view.height = canvasHeight;

    setCtx(view.getContext("2d"));
  }, [canvasHeight]);

  const handleUploadImage = e => {
    const view = document.querySelector(".canvas");
    ctx.clearRect(0, 0, view.width, view.height);
    const reader = new FileReader();
    const file = e.target.files[0];
    reader.onloadend = () => {
      const image = new Image();
      image.src = reader.result;
      image.onload = () => {
        ctx.drawImage(image, 0, 0, canvasWidth, canvasHeight);
        ctx.save();
        ctx.font = `bolder ${fontSizePx}px 'MS Pゴシック'`;
        ctx.textAlign = "center";
        ctx.fillStyle = fontColor;
        ctx.fillText("L G T M", canvasWidth / 2, canvasHeight / 2);
        ctx.restore();

        const data = view.toDataURL("image/jpeg");
        const outputImage = new Image();
        outputImage.src = data;
        outputImage.onload = () => {
          setIsShowImage(true);
          document.querySelector(".result").appendChild(outputImage);
        };
      };
    };
    reader.readAsDataURL(file);
  };

  const handleCopy = () => {
    const view = document.querySelector(".canvas");
    const data = view.toDataURL("image/jpeg");
    const copyText = `<img src='${data}' />`;
    const clipboard = new Clipboard(".copy", {
      text: () => copyText
    });
    clipboard.on("success", () => {
      alert("コピーしました");
    });
  };

  let canvasClassName = "canvas";
  let resultClassName = "result";
  if (isShowImage) {
    canvasClassName += " hide";
  } else {
    resultClassName += " hide";
  }
  return (
    <>
      <div className="file-upload">
        <input onChange={handleUploadImage} type="file" accept=".jpg,.png" />
        <button className="copy" onClick={handleCopy}>
          Copy as html
        </button>
      </div>
      <canvas className={canvasClassName}></canvas>
      <div className={resultClassName} />
    </>
  );
}

export default App;
