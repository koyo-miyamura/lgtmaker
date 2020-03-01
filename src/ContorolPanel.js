import ColorPicker from "material-ui-color-picker";
import { Typography, Slider, Checkbox, Grid, Box } from "@material-ui/core";
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

  const handleChangeScale = (_, value) => {
    const newSetting = { ...setting, scale: value };
    changeSetting(newSetting);
  };

  const handleChangeStroke = e => {
    const newSetting = { ...setting, isStroke: e.target.checked };
    changeSetting(newSetting);
  };

  return (
    <Box mt={2}>
      <Grid container>
        <Grid item xs={6}>
          <Typography gutterBottom>Color</Typography>
          <ColorPicker
            value={setting.fontColor}
            defaultValue={setting.fontColor}
            name="color"
            placeholder="color"
            onChange={handleChangeColor}
          />
        </Grid>
        <Grid item xs={6}>
          <Typography gutterBottom>Outline</Typography>
          <Checkbox checked={setting.isStroke} value="secondary" color="primary" onChange={handleChangeStroke} />
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
    </Box>
  );
}

export default ControlPanel;
