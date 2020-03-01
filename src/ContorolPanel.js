import ColorPicker from "material-ui-color-picker";
import { Typography, Slider } from "@material-ui/core";
import Box from "@material-ui/core/Box";
import React, { useState } from "react";

function ControlPanel(props) {
  const [setting, setSetting] = useState(props.defaultSetting);

  const handleChangeColor = color => {
    const newSetting = { ...setting, fontColor: color };
    setSetting(newSetting);
    props.onChange(newSetting);
  };

  const handleChangeFontSizePx = (_, value) => {
    const newSetting = { ...setting, fontSizePx: value };
    setSetting(newSetting);
    props.onChange(newSetting);
  };

  const handleChangeScale = (_, value) => {
    const newSetting = { ...setting, scale: value };
    setSetting(newSetting);
    props.onChange(newSetting);
  };

  return (
    <>
      <Box mb={2}>
        <Typography gutterBottom>Color</Typography>
        <ColorPicker
          value={setting.fontColor}
          defaultValue={setting.fontColor}
          name="color"
          placeholder="color"
          onChange={handleChangeColor}
        />
      </Box>
      <Box>
        <Typography gutterBottom>FontSize</Typography>
        <Slider value={setting.fontSizePx} max={500} onChange={handleChangeFontSizePx} valueLabelDisplay="auto" />
      </Box>
      <Box>
        <Typography gutterBottom>Scale</Typography>
        <Slider value={setting.scale} max={3.0} step={0.1} onChange={handleChangeScale} valueLabelDisplay="auto" />
      </Box>
    </>
  );
}

export default ControlPanel;
