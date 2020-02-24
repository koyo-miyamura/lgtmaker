import React, { useState, useRef, useMemo } from "react";
import "App.css";
import Clipboard from "clipboard";
import Fileupload from "Fileupload";
import { Button, Container, CssBaseline, Paper, ButtonGroup, Grid, Typography, TextField } from "@material-ui/core";
import CloudDownloadIcon from "@material-ui/icons/CloudDownloadOutlined";
import FileCopyIcon from "@material-ui/icons/FileCopyOutlined";
import Box from "@material-ui/core/Box";
import useFetchData from "useFetchData";

function App() {
  const [isLoaded, setIsLoaded] = useState(false);
  const [url, setUrl] = useState(null);

  const { base64Image } = useFetchApp(url);

  const inputUrlEl = useRef(null);

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
    image.crossOrigin = "Anonymous";
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

  const handleUploadImageFromURL = () => {
    setUrl(inputUrlEl.current.value);
  };

  const InputURL = () => {
    return (
      <Box mb={2}>
        <Paper variant="outlined" elevation={3} square>
          <Grid container spacing={2}>
            <Grid item xs={10}>
              <TextField inputRef={inputUrlEl} label="URL" placeholder="URL" variant="outlined" fullWidth />
            </Grid>
            <Grid item xs={2}>
              <Button color="primary" style={{ height: "100%" }} onClick={handleUploadImageFromURL} fullWidth>
                <Typography variant="button" style={{ textTransform: "none" }}>
                  Submit
                </Typography>
              </Button>
            </Grid>
          </Grid>
        </Paper>
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

  const Buttons = () => {
    return (
      <Grid container alignItems="center" justify="center">
        {isLoaded && (
          <ButtonGroup color="primary" aria-label="outlined primary button group">
            <Button className="copy">
              <FileCopyIcon />
              <Typography variant="button" style={{ textTransform: "none" }}>
                Copy as html
              </Typography>
            </Button>
            <Button className="download" onClick={handleClickDownload}>
              <CloudDownloadIcon />
              <Typography variant="button" style={{ textTransform: "none" }}>
                Download
              </Typography>
            </Button>
          </ButtonGroup>
        )}
      </Grid>
    );
  };

  return (
    <>
      <CssBaseline />
      <Container maxWidth="sm">
        <Box my={4}>
          <InputURL />
          <InputFile />
          <Box mb={2}>
            <Buttons />
          </Box>
          <Grid container alignItems="center" justify="center">
            <Grid item conponemt="div" className="result" />
            <img src={`data:image/png;base64,${base64Image}`} alt="result" />
          </Grid>
          <canvas className="canvas" hidden></canvas>
        </Box>
      </Container>
    </>
  );
}

const useFetchApp = url => {
  let host = "http://localhost:12345";

  const opts = useMemo(() => {
    return {
      method: "POST",
      headers: new Headers({
        "Content-Type": "application/x-www-form-urlencoded"
      }),
      body: `url=${url}&key=hoge`
    };
  }, [url]);

  // url が定義されていなければuseFetchDataを何もさせないためにhostもnullにする
  if (!url) {
    host = null;
  }
  const { data, error, loading } = useFetchData(host, opts);
  if (data) {
    return { base64Image: data.base64, error, loading };
  }
  return { base64Image: null, error, loading };
};

export default App;
