import ColorPicker from "material-ui-color-picker";
import { Typography, Slider, Checkbox, Grid, Box, Select, MenuItem } from "@material-ui/core";
import React, { useState } from "react";

function ControlPanel(props) {
  const [setting, setSetting] = useState(props.defaultSetting);

  const changeSetting = newSetting => {
    setSetting(newSetting);
    props.onChange(newSetting);
  };

  const handleChangeColor = color => {
    const newSetting = { ...setting, fontColor: color };
    changeSetting(newSetting);
  };

  const handleChangeFontSizePx = (_, value) => {
    const newSetting = { ...setting, fontSizePx: value };
    changeSetting(newSetting);
  };

  const handleChangeOffsetYPx = (_, value) => {
    const newSetting = { ...setting, offsetYPx: value };
    changeSetting(newSetting);
  };

  const handleChangeScale = (_, value) => {
    const newSetting = { ...setting, scale: value };
    changeSetting(newSetting);
  };

  const handleChangeStroke = e => {
    const newSetting = { ...setting, isStroke: e.target.checked };
    changeSetting(newSetting);
  };

  const colorText = "Color";

  const fontItems = [
    "Helvetica",
    "Impact",
    "arial black",
    "MS Pゴシック",
    "Times New Roman",
    "Hiragino Kaku Gothic StdN",
    "cursive",
    "fantasy",
    "Courier New",
    "BatangChe"
  ];

  const handleChangeFont = e => {
    const newSetting = { ...setting, font: e.target.value };
    changeSetting(newSetting);
  };

  return (
    <Box mt={2}>
      <Grid container>
        <Grid container item xs={10}>
          <Grid item xs={4}>
            <Typography gutterBottom>Color</Typography>
            <ColorPicker
              value={setting.fontColor}
              defaultValue={colorText}
              name="color"
              placeholder="color"
              onChange={handleChangeColor}
            />
          </Grid>
          <Grid item xs={3}>
            <Typography gutterBottom>Outline</Typography>
            <Checkbox checked={setting.isStroke} value="secondary" color="primary" onChange={handleChangeStroke} />
          </Grid>
          <Grid item xs={4}>
            <Typography gutterBottom>Font</Typography>
            <Select value={setting.font} onChange={handleChangeFont}>
              {fontItems.map(item => (
                <MenuItem key={item} value={item}>
                  {item}
                </MenuItem>
              ))}
            </Select>
          </Grid>
          <Grid item xs={12}>
            <Typography gutterBottom>FontSize</Typography>
            <Slider value={setting.fontSizePx} max={500} onChange={handleChangeFontSizePx} valueLabelDisplay="auto" />
          </Grid>
          <Grid item xs={12}>
            <Typography gutterBottom>Scale</Typography>
            <Slider value={setting.scale} max={3.0} step={0.1} onChange={handleChangeScale} valueLabelDisplay="auto" />
          </Grid>
        </Grid>

        <Grid container item alignItems="center" direction="column" xs={2}>
          <Grid item xs={10}>
            <Typography gutterBottom>OffsetY</Typography>
            <Slider
              orientation="vertical"
              value={setting.offsetYPx}
              min={-300}
              max={300}
              onChange={handleChangeOffsetYPx}
              valueLabelDisplay="auto"
            />
          </Grid>
        </Grid>
      </Grid>
    </Box>
  );
}

export default ControlPanel;
