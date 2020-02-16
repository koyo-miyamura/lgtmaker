import React, { useState } from "react";
import "App.css";
import Clipboard from "clipboard";
import Fileupload from "Fileupload";
import { Button, Container, CssBaseline, Paper, ButtonGroup, Grid, Typography } from "@material-ui/core";
import CloudDownloadIcon from "@material-ui/icons/CloudDownloadOutlined";
import FileCopyIcon from "@material-ui/icons/FileCopyOutlined";
import Box from "@material-ui/core/Box";

function App() {
  const [isLoaded, setIsLoaded] = useState(false);

  const settings = {
    lgtmText: "L G T M",
    fontSizePx: 100,
    fontColor: "#FFFFFF",
    strokeColor: "#000000"
  };

  const handleUploadImage = files => {
    const reader = new FileReader();
    reader.readAsDataURL(files[0]);
    reader.onloadend = () => {
      generateImage(reader.result);
    };
  };

  const generateImage = file => {
    const image = new Image();
    image.src = file;
    image.onload = () => {
      drawImage(image);
    };
  };

  const drawImage = image => {
    const view = document.querySelector(".canvas");
    const ctx = view.getContext("2d");

    ctx.clearRect(0, 0, view.width, view.height);

    // imageの大きさに合わせてcanvasのリサイズ
    view.width = image.width;
    view.height = image.height;

    drawBaseImage(ctx, image);
    drawLgtmTextOverImage(ctx, image);
    renderGeneratedImage(view.toDataURL("image/jpeg"));
  };

  const drawBaseImage = (ctx, image) => {
    // jpeg出力だと背景色が黒になるので、あらかじめ白で塗りつぶす
    ctx.save();
    ctx.fillStyle = "#FFFFFF";
    ctx.fillRect(0, 0, image.width, image.height);
    ctx.restore();

    ctx.drawImage(image, 0, 0, image.width, image.height);
  };

  const drawLgtmTextOverImage = (ctx, image) => {
    ctx.save();
    ctx.font = `bolder ${settings.fontSizePx}px 'MS Pゴシック'`;
    ctx.textAlign = "center";
    ctx.fillStyle = settings.fontColor;
    ctx.fillText(settings.lgtmText, image.width / 2, image.height / 2, image.width);
    ctx.lineWidth = 1.5;
    ctx.strokeStyle = settings.strokeColor;
    ctx.strokeText(settings.lgtmText, image.width / 2, image.height / 2, image.width);
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

      listenCopyEvent(data);
    };
  };

  const listenCopyEvent = data => {
    const copyText = `<img src='${data}' />`;
    const clipboard = new Clipboard(".copy", {
      text: () => copyText
    });
    clipboard.on("success", () => {
      alert("コピーしました");
    });
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
      <CssBaseline />
      <Container maxWidth="sm">
        <Box my={4}>
          <Box mb={2}>
            <Paper variant="outlined" elevation={3} square>
              <Fileupload handleUploadFile={handleUploadImage} />
            </Paper>
          </Box>
          <Box mb={2}>
            <Grid container alignItems="center" justify="center">
              {isLoaded && (
                <ButtonGroup color="primary" aria-label="outlined primary button group">
                  <Button className="copy">
                    <FileCopyIcon />
                    <Typography>Copy as html</Typography>
                  </Button>
                  <Button className="download" onClick={handleClickDownload}>
                    <CloudDownloadIcon /> Download
                  </Button>
                </ButtonGroup>
              )}
            </Grid>
          </Box>
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
