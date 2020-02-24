import React, { useState, useRef } from "react";
import "App.css";
import Clipboard from "clipboard";
import Fileupload from "Fileupload";
import {
  Button,
  Container,
  CssBaseline,
  Paper,
  ButtonGroup,
  Grid,
  Typography,
  TextField,
  Slider
} from "@material-ui/core";
import CloudDownloadIcon from "@material-ui/icons/CloudDownloadOutlined";
import FileCopyIcon from "@material-ui/icons/FileCopyOutlined";
import Box from "@material-ui/core/Box";
import { Alert, AlertTitle } from "@material-ui/lab";
import ColorPicker from "material-ui-color-picker";

function App() {
  const defaultSetting = {
    fontSizePx: 100,
    fontColor: "#FFFFFF"
  };

  const [isLoaded, setIsLoaded] = useState(false);
  const [isError, setIsError] = useState(false);
  const [fontSizePx, setFontSizePx] = useState(defaultSetting.fontSizePx);
  const [fontColor, setFontColor] = useState(defaultSetting.fontColor);
  const [baseImage, setBaseImage] = useState(null);

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
      setFontSizePx(defaultSetting.fontSizePx);
      setFontColor(defaultSetting.fontColor);
      drawImage(image, defaultSetting.fontSizePx, defaultSetting.fontColor);
    };
    image.onerror = () => {
      setIsError(true);
    };
  };

  const drawImage = (image, fontSizePx, fontColor) => {
    const view = document.querySelector(".canvas");
    const ctx = view.getContext("2d");

    ctx.clearRect(0, 0, view.width, view.height);

    // imageの大きさに合わせてcanvasのリサイズ
    view.width = image.width;
    view.height = image.height;

    drawBaseImage(ctx, image);
    drawLgtmTextOverImage(ctx, image, fontSizePx, fontColor);
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

  const drawLgtmTextOverImage = (ctx, image, fontSizePx, fontColor) => {
    ctx.save();
    ctx.font = `bolder ${fontSizePx}px 'MS Pゴシック'`;
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillStyle = fontColor;
    ctx.fillText(lgtmText, image.width / 2, image.height / 2, image.width);
    ctx.lineWidth = 1.5;
    ctx.strokeStyle = strokeColor;
    ctx.strokeText(lgtmText, image.width / 2, image.height / 2, image.width);
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
    setIsError(false);
    generateImage(inputUrlEl.current.value);
  };

  const handleChangeColor = color => {
    setFontColor(color);
    drawImage(baseImage, fontSizePx, color);
  };

  const handleChangeFontSizePx = (_, value) => {
    setFontSizePx(value);
    drawImage(baseImage, value, fontColor);
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

  const InputURL = () => {
    return (
      <Box mb={2}>
        {isError && <AlertError />}
        <Paper variant="outlined" elevation={3} square>
          <Grid container>
            <Grid item sm={10} xs={9}>
              <TextField inputRef={inputUrlEl} label="URL" placeholder="URL" variant="outlined" fullWidth />
            </Grid>
            <Grid item sm={2} xs={3}>
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
      </Grid>
    );
  };

  const ControlPanel = () => {
    return (
      <>
        <Box mb={2}>
          <Typography gutterBottom>Color</Typography>
          <ColorPicker name="color" placeholder="color" defaultValue={fontColor} onChange={handleChangeColor} />
        </Box>
        <Box>
          <Typography gutterBottom>FontSize</Typography>
          <Slider value={fontSizePx} max={500} onChangeCommitted={handleChangeFontSizePx} valueLabelDisplay="auto" />
        </Box>
      </>
    );
  };

  return (
    <>
      <CssBaseline />
      <Container maxWidth="sm">
        <Box my={4}>
          <InputURL />
          <InputFile />
          {isLoaded && (
            <Box mb={2}>
              <Buttons />
              <ControlPanel />
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
