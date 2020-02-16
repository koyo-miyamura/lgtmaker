import React, { useCallback } from "react";
import { useDropzone } from "react-dropzone";
import CloudUploadOutLinedIcon from "@material-ui/icons/CloudUploadOutlined";
import { Typography } from "@material-ui/core";

function FileUpload(props) {
  const onDrop = useCallback(props.handleUploadFile, []);
  const { getRootProps, getInputProps } = useDropzone({ onDrop, accept: ".jpeg,.png" });

  return (
    <div {...getRootProps()}>
      <input {...getInputProps({ className: "dropzone" })} />
      <div style={{ textAlign: "center" }}>
        <CloudUploadOutLinedIcon style={{ fontSize: 60 }} />
        <Typography>upload your image!</Typography>
      </div>
    </div>
  );
}

export default FileUpload;
