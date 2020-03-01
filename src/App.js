import React, { useState, useRef } from "react";
import InputUrl from "InputUrl";
import Fileupload from "Fileupload";
import ControlButtons from "ControlButtons";
import ControlPanel from "ControlPanel";
import { Container, CssBaseline, Paper, Grid, Box } from "@material-ui/core";
import { Alert, AlertTitle } from "@material-ui/lab";

function App() {
  const defaultSetting = {
    fontSizePx: 100,
    fontColor: "#FFFFFF",
    scale: 1.0,
    isStroke: true,
    font: "Helvetica"
  };

  const [isLoaded, setIsLoaded] = useState(false);
  const [isError, setIsError] = useState(false);
  const [baseImage, setBaseImage] = useState(null);
  const [setting, setSetting] = useState(defaultSetting);

  const inputUrlEl = useRef(null);

  const lgtmText = "L G T M";
  const strokeColor = "#000000";

  const handleUploadImage = files => {
    const reader = new FileReader();
    reader.readAsDataURL(files[0]);
    reader.onloadend = () => {
      generateImage(reader.result);
    };
  };

  const generateImage = file => {
    const image = new Image();
    image.crossOrigin = "Anonymous";
    image.src = file;
    image.onload = () => {
      setBaseImage(image);
      drawImage(image, setting);
    };
    image.onerror = () => {
      setIsError(true);
    };
  };

  const drawImage = (image, drawSetting) => {
    const view = document.querySelector(".canvas");
    const ctx = view.getContext("2d");

    ctx.clearRect(0, 0, view.width, view.height);

    // imageの大きさとスケーリングを考慮した大きさでcanvasのリサイズ
    view.width = image.width * drawSetting.scale;
    view.height = image.height * drawSetting.scale;

    drawBaseImage(ctx, image, view);
    drawLgtmTextOverImage(ctx, drawSetting, view);
    renderGeneratedImage(view.toDataURL("image/jpeg"));
  };

  const drawBaseImage = (ctx, image, view) => {
    // jpeg出力だと背景色が黒になるので、あらかじめ白で塗りつぶす
    ctx.save();
    ctx.fillStyle = "#FFFFFF";
    ctx.fillRect(0, 0, view.width, view.height);
    ctx.restore();

    ctx.drawImage(image, 0, 0, image.width, image.height, 0, 0, view.width, view.height);
  };

  const drawLgtmTextOverImage = (ctx, drawSetting, view) => {
    ctx.save();
    ctx.font = `bolder ${drawSetting.fontSizePx}px ${drawSetting.font}`;
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillStyle = drawSetting.fontColor;
    ctx.fillText(lgtmText, view.width / 2, view.height / 2, view.width);
    if (drawSetting.isStroke) {
      ctx.lineWidth = 1.5;
      ctx.strokeStyle = strokeColor;
      ctx.strokeText(lgtmText, view.width / 2, view.height / 2, view.width);
    }
    ctx.restore();
  };

  // canvasのままだとコピーなどができないので、img要素として出力
  const renderGeneratedImage = data => {
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
    };
  };

  const handleClickCopy = () => {
    const view = document.querySelector(".canvas");
    const data = view.toDataURL("image/jpeg");
    const copyText = `<img src='${data}' />`;

    const copyFrom = document.createElement("textarea");
    copyFrom.textContent = copyText;

    const bodyElm = document.getElementsByTagName("body")[0];
    bodyElm.appendChild(copyFrom);

    copyFrom.select();
    if (document.execCommand("copy")) {
      alert("コピーしました");
    }
  };

  const handleClickDownload = () => {
    if (!isLoaded) return;
    const view = document.querySelector(".canvas");
    const a = document.createElement("a");
    a.href = view.toDataURL("image/jpeg");
    a.download = `LGTM.jpg`;
    a.click();
  };

  const handleUploadImageFromURL = () => {
    setIsError(false);
    generateImage(inputUrlEl.current.value);
  };

  const handleChangeSettings = newSetting => {
    setSetting(newSetting);
    drawImage(baseImage, newSetting);
  };

  const AlertError = () => {
    return (
      <Box mb={2}>
        <Alert severity="error" onClose={() => setIsError(false)}>
          <AlertTitle>Error</AlertTitle>
          このURLからは画像を読み込めません。別のURLを試してね＞＜
        </Alert>
      </Box>
    );
  };

  const InputFile = () => {
    return (
      <Box mb={2}>
        <Paper variant="outlined" elevation={3} square>
          <Fileupload handleUploadFile={handleUploadImage} />
        </Paper>
      </Box>
    );
  };

  return (
    <>
      <CssBaseline />
      <Container maxWidth="sm">
        <Box my={4}>
          {isError && <AlertError />}
          <InputUrl inputRef={inputUrlEl} onSubmit={handleUploadImageFromURL} />
          <InputFile />
          {isLoaded && (
            <Box mb={2}>
              <ControlButtons onClickCopy={handleClickCopy} onClickDownload={handleClickDownload} />
              <ControlPanel defaultSetting={setting} onChange={handleChangeSettings} />
            </Box>
          )}
          <Grid container alignItems="center" justify="center">
            <Grid item conponemt="div" className="result" />
          </Grid>
          <canvas className="canvas" hidden></canvas>
        </Box>
      </Container>
    </>
  );
}

export default App;
