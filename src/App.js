import React, { useState, useEffect } from "react";
import "./App.css";
import Clipboard from "clipboard";

function App() {
  const [ctx, setCtx] = useState(null);
  const [isLoaded, setIsLoaded] = useState(false);

  const fontSizePx = 100;
  const fontColor = "#FFFFFF";
  const strokeColor = "#000000";
  const lgtmText = "L G T M";

  useEffect(() => {
    const view = document.querySelector(".canvas");
    setCtx(view.getContext("2d"));
  }, []);

  const handleUploadImage = e => {
    const view = document.querySelector(".canvas");
    ctx.clearRect(0, 0, view.width, view.height);

    const reader = new FileReader();
    const file = e.target.files[0];
    reader.onloadend = () => {
      const image = new Image();
      image.src = reader.result;
      image.onload = () => {
        // imageの大きさに合わせてcanvasのリサイズ
        view.width = image.width;
        view.height = image.height;

        // jpeg出力だと背景色が黒になるので、あらかじめ白で塗りつぶす
        ctx.save();
        ctx.fillStyle = "#FFFFFF";
        ctx.fillRect(0, 0, image.width, image.height);
        ctx.restore();
        ctx.drawImage(image, 0, 0, image.width, image.height);

        // LGTM 重ねる
        ctx.save();
        ctx.font = `bolder ${fontSizePx}px 'MS Pゴシック'`;
        ctx.textAlign = "center";
        ctx.fillStyle = fontColor;
        ctx.fillText(lgtmText, image.width / 2, image.height / 2, image.width);
        ctx.lineWidth = 1.5;
        ctx.strokeStyle = strokeColor;
        ctx.strokeText(lgtmText, image.width / 2, image.height / 2, image.width);
        ctx.restore();

        // canvasのままだとコピーなどができないので、img要素として出力
        const data = view.toDataURL("image/jpeg");
        const outputImage = new Image();
        outputImage.src = data;
        outputImage.onload = () => {
          setIsLoaded(true);
          const node = document.querySelector(".result");
          if (!node.firstChild) {
            node.appendChild(outputImage);
          } else {
            node.replaceChild(outputImage, node.firstChild);
          }

          const copyText = `<img src='${data}' />`;
          const clipboard = new Clipboard(".copy", {
            text: () => copyText
          });
          clipboard.on("success", () => {
            alert("コピーしました");
          });
        };
      };
    };
    reader.readAsDataURL(file);
  };

  const handleClickDownload = () => {
    if (!isLoaded) return;
    const view = document.querySelector(".canvas");
    const a = document.createElement("a");
    a.href = view.toDataURL("image/jpeg");
    a.download = `LGTM.jpg`;
    a.click();
  };

  return (
    <>
      <div className="file-upload">
        <input onChange={handleUploadImage} type="file" accept=".jpg,.png" />
        <button className="copy">Copy as html</button>
        <button className="download" onClick={handleClickDownload}>
          Download
        </button>
      </div>
      <canvas className="canvas" hidden></canvas>
      <div className="result" />
    </>
  );
}

export default App;
