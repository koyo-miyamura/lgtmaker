import React from "react";
import { Grid, Button, ButtonGroup, Typography } from "@material-ui/core";
import CloudDownloadIcon from "@material-ui/icons/CloudDownloadOutlined";
import FileCopyIcon from "@material-ui/icons/FileCopyOutlined";

function ControlButtons(props) {
  return (
    <Grid container alignItems="center" justify="center">
      <ButtonGroup color="primary" aria-label="outlined primary button group">
        <Button className="copy" onClick={props.onClickCopy}>
          <FileCopyIcon />
          <Typography variant="button" style={{ textTransform: "none" }}>
            Copy as html
          </Typography>
        </Button>
        <Button className="download" onClick={props.onClickDownload}>
          <CloudDownloadIcon />
          <Typography variant="button" style={{ textTransform: "none" }}>
            Download
          </Typography>
        </Button>
      </ButtonGroup>
    </Grid>
  );
}

export default ControlButtons;
